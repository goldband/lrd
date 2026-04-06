// League Scheduler Backend - Node.js/Express
// Run with: node server.js

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Email Configuration
const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
    }
};

let transporter = null;
if (emailConfig.auth.user && emailConfig.auth.pass) {
    transporter = nodemailer.createTransport(emailConfig);
}

// Check email configuration on startup
if (transporter) {
    transporter.verify((error, success) => {
        if (error) {
            console.warn('⚠️ Email not configured properly. Notifications disabled.', error.message);
            transporter = null;
        } else {
            console.log('✓ Email service ready for notifications');
        }
    });
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and WebP allowed'));
        }
    }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Database Setup
const db = new sqlite3.Database('./league.db', (err) => {
    if (err) console.error('Database error:', err);
    else console.log('Connected to SQLite database');
});

// Initialize database tables
const initDatabase = () => {
    db.serialize(() => {
        // Users table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'player',
                photo_url TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Games table
        db.run(`
            CREATE TABLE IF NOT EXISTS games (
                id TEXT PRIMARY KEY,
                date TEXT NOT NULL,
                time TEXT NOT NULL,
                venue TEXT,
                max_players INTEGER DEFAULT 20,
                created_by TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id)
            )
        `);

        // Availability table
        db.run(`
            CREATE TABLE IF NOT EXISTS availability (
                id TEXT PRIMARY KEY,
                game_id TEXT NOT NULL,
                player_id TEXT NOT NULL,
                status TEXT DEFAULT 'unknown',
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(game_id, player_id),
                FOREIGN KEY (game_id) REFERENCES games(id),
                FOREIGN KEY (player_id) REFERENCES users(id)
            )
        `);

        // Player Active Status table
        db.run(`
            CREATE TABLE IF NOT EXISTS player_status (
                id TEXT PRIMARY KEY,
                user_id TEXT UNIQUE NOT NULL,
                is_active INTEGER DEFAULT 0,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        // Notifications table
        db.run(`
            CREATE TABLE IF NOT EXISTS notifications (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                type TEXT NOT NULL,
                title TEXT NOT NULL,
                message TEXT,
                related_game_id TEXT,
                related_player_id TEXT,
                read INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (related_game_id) REFERENCES games(id),
                FOREIGN KEY (related_player_id) REFERENCES users(id)
            )
        `);

initDatabase();

// Helper function to run database queries
const dbRun = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

const dbGet = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const dbAll = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
};

// ===== NOTIFICATION HELPER FUNCTIONS =====

async function createNotification(userId, type, title, message, gameId = null, playerId = null) {
    try {
        const notificationId = 'notif_' + Date.now();
        await dbRun(
            `INSERT INTO notifications (id, user_id, type, title, message, related_game_id, related_player_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [notificationId, userId, type, title, message, gameId, playerId]
        );
        return notificationId;
    } catch (error) {
        console.error('Error creating notification:', error);
    }
}

async function sendEmail(to, subject, htmlContent) {
    if (!transporter) {
        console.log('Email service not configured. Skipping email to:', to);
        return false;
    }

    try {
        await transporter.sendMail({
            from: `"League Scheduler" <${emailConfig.auth.user}>`,
            to: to,
            subject: subject,
            html: htmlContent
        });
        console.log('✓ Email sent to:', to);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

async function notifyAdminAvailabilityChange(playerId, gameId, status) {
    try {
        const player = await dbGet('SELECT name, email FROM users WHERE id = ?', [playerId]);
        const game = await dbGet('SELECT date, time FROM games WHERE id = ?', [gameId]);
        
        if (!player || !game) return;

        const admins = await dbAll('SELECT id, email, name FROM users WHERE role = ?', ['admin']);
        const statusText = status === 'yes' ? 'Playing' : status === 'no' ? 'Not Playing' : 'Maybe';
        
        for (const admin of admins) {
            // Create in-app notification
            await createNotification(
                admin.id,
                'availability_change',
                `${player.name} marked as ${statusText}`,
                `${player.name} has marked themselves as "${statusText}" for the game on ${game.date} at ${game.time}`,
                gameId,
                playerId
            );

            // Send email if configured
            const emailHtml = `
                <h2>Availability Update</h2>
                <p><strong>${player.name}</strong> has updated their availability:</p>
                <p style="font-size: 16px; color: ${status === 'yes' ? '#10b981' : status === 'no' ? '#ef4444' : '#8b5cf6'}">
                    <strong>${statusText}</strong>
                </p>
                <p>Game: ${game.date} at ${game.time}</p>
                <p><a href="${process.env.APP_URL || 'http://localhost:3001'}" style="color: #0ea5e9; text-decoration: none;">View Game Details</a></p>
            `;
            await sendEmail(admin.email, `Availability Update: ${player.name}`, emailHtml);
        }
    } catch (error) {
        console.error('Error notifying admins:', error);
    }
}

async function notifyConfirmedPlayers(playerId, gameId, status) {
    try {
        // Only notify if player marked as "yes"
        if (status !== 'yes') return;

        const player = await dbGet('SELECT name, email FROM users WHERE id = ?', [playerId]);
        const game = await dbGet('SELECT date, time, venue FROM games WHERE id = ?', [gameId]);
        
        if (!player || !game) return;

        // Get all players who marked "yes" for this game, ordered by signup timestamp
        const confirmedPlayers = await dbAll(
            `SELECT u.id, u.name, u.email, a.updated_at 
             FROM availability a 
             JOIN users u ON a.player_id = u.id 
             WHERE a.game_id = ? AND a.status = ? AND a.player_id != ?
             ORDER BY a.updated_at ASC`,
            [gameId, 'yes', playerId]
        );

        // Get all players (for both weekend games)
        const allPlayers = await dbAll('SELECT id, email, name FROM users WHERE role = ?', ['player']);

        for (const confirmedPlayer of confirmedPlayers) {
            if (confirmedPlayer.email) {
                // Create in-app notification
                await createNotification(
                    confirmedPlayer.id,
                    'player_confirmed',
                    `${player.name} confirmed for ${game.date}`,
                    `${player.name} has confirmed they are playing for the game on ${game.date} at ${game.time}`,
                    gameId,
                    playerId
                );

                // Build the confirmed players list with timestamps
                const playersHTML = confirmedPlayers
                    .map((p, index) => {
                        const signupTime = new Date(p.updated_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        });
                        return `
                            <tr style="background-color: ${index % 2 === 0 ? '#f9fafb' : '#ffffff'};">
                                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;"><strong>${index + 1}. ${p.name}</strong></td>
                                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: left; font-size: 0.9em; color: #666;">${signupTime}</td>
                            </tr>
                        `;
                    })
                    .join('');

                // Send email if configured
                const emailHtml = `
                    <h2>⚽ Player Confirmed for Weekend Game</h2>
                    <p><strong>${player.name}</strong> has confirmed they are <strong style="color: #10b981;">PLAYING</strong></p>
                    
                    <h3>Game Details:</h3>
                    <p><strong>Date:</strong> ${game.date}</p>
                    <p><strong>Time:</strong> ${game.time}</p>
                    ${game.venue ? `<p><strong>Venue:</strong> ${game.venue}</p>` : ''}
                    
                    <h3>Confirmed Players (in signup order):</h3>
                    <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                        <thead>
                            <tr style="background-color: #f3f4f6; border-bottom: 2px solid #d1d5db;">
                                <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Player</th>
                                <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Confirmed At</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${playersHTML}
                        </tbody>
                    </table>
                    
                    <p style="color: #666; font-size: 0.9em;">Total confirmed: ${confirmedPlayers.length} players</p>
                    
                    <p style="margin-top: 20px;">
                        <a href="${process.env.APP_URL || 'http://localhost:3001'}" 
                           style="background-color: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            View Game Details
                        </a>
                    </p>
                `;

                await sendEmail(confirmedPlayer.email, `⚽ ${player.name} Confirmed - ${confirmedPlayers.length + 1} Players Ready!`, emailHtml);
            }
        }
    } catch (error) {
        console.error('Error notifying confirmed players:', error);
    }
}

async function sendThursdayReminders() {
    try {
        console.log('🔔 Sending Thursday reminders...');
        
        // Get all players
        const allPlayers = await dbAll('SELECT id, email, name FROM users WHERE role = ?', ['player']);

        for (const player of allPlayers) {
            // Get player's active status
            const status = await dbGet(
                'SELECT is_active FROM player_status WHERE user_id = ?',
                [player.id]
            );

            const isActive = status ? status.is_active : 0;

            if (isActive === 0) {
                // Player is INACTIVE - send activation reminder
                const subject = '⚽ We Need You This Weekend!';
                const htmlContent = `
                    <h2>Hey ${player.name}! 👋</h2>
                    <p>You haven't marked yourself as available to play yet.</p>
                    
                    <p style="font-size: 16px; margin: 20px 0;">
                        <strong>Mark yourself as AVAILABLE so we can include you in this weekend's games!</strong>
                    </p>
                    
                    <p>Once you mark yourself as available:</p>
                    <ul>
                        <li>Admins can see you're ready to play</li>
                        <li>You'll get specific game invitations</li>
                        <li>You can confirm your attendance for each game</li>
                    </ul>
                    
                    <p style="margin-top: 20px;">
                        <a href="${process.env.APP_URL || 'http://localhost:3001'}" 
                           style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                            Mark Yourself Available Now
                        </a>
                    </p>
                    
                    <p style="margin-top: 20px; color: #999; font-size: 12px;">
                        This helps admins know who's available to play this weekend.
                    </p>
                `;

                // Create in-app notification
                await createNotification(
                    player.id,
                    'activation_reminder',
                    'Mark Yourself Available!',
                    'Show admins you\'re ready to play by marking yourself as available'
                );

                // Send email
                await sendEmail(player.email, subject, htmlContent);

            } else {
                // Player IS ACTIVE - send weekend summary
                const upcomingGames = await dbAll(
                    `SELECT g.id, g.date, g.time, g.venue,
                            COUNT(CASE WHEN a.status = 'yes' THEN 1 END) as confirmed,
                            COUNT(CASE WHEN a.status = 'maybe' THEN 1 END) as maybe
                     FROM games g
                     LEFT JOIN availability a ON g.id = a.game_id
                     WHERE g.date >= date('now')
                     GROUP BY g.id
                     ORDER BY g.date ASC, g.time ASC
                     LIMIT 10`
                );

                const subject = '⚽ Weekend Games - You\'re Active!';
                const htmlContent = `
                    <h2>Games This Weekend</h2>
                    <p>Hi ${player.name},</p>
                    
                    <p>You're marked as <strong style="color: #10b981;">AVAILABLE</strong> to play.</p>
                    
                    ${upcomingGames.length > 0 ? `
                        <h3>Upcoming Games:</h3>
                        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                            <tr style="background-color: #f0f0f0;">
                                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Date & Time</th>
                                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Location</th>
                                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Confirmed Players</th>
                            </tr>
                            ${upcomingGames.map(game => `
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>${game.date}</strong><br>${game.time}</td>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${game.venue || 'TBD'}</td>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${game.confirmed} confirmed${game.maybe > 0 ? ', ' + game.maybe + ' maybe' : ''}</td>
                                </tr>
                            `).join('')}
                        </table>
                    ` : '<p>No games scheduled yet for this weekend.</p>'}
                    
                    <p>Check your availability for each game when they're posted!</p>
                    
                    <p style="margin-top: 20px;">
                        <a href="${process.env.APP_URL || 'http://localhost:3001'}" 
                           style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                            View All Games & Mark Your Availability
                        </a>
                    </p>
                `;

                // Create in-app notification
                await createNotification(
                    player.id,
                    'weekend_summary',
                    'Weekend Games Summary',
                    'See which games are coming up this weekend'
                );

                // Send email
                await sendEmail(player.email, subject, htmlContent);
            }
        }

        console.log('✓ Thursday reminders sent successfully');
    } catch (error) {
        console.error('Error in sendThursdayReminders:', error);
    }
}

async function sendFridayConfirmedPlayersSummary() {
    try {
        console.log('📊 Sending Friday confirmed players summary...');
        
        // Get NEXT weekend games (upcoming Saturday & Sunday)
        // When this runs on Friday at 8 PM, it gets the games for the NEXT day (Saturday) and day after (Sunday)
        const today = new Date();
        
        // Calculate next Saturday (tomorrow if today is Friday, or in 1-7 days)
        let nextSaturday = new Date(today);
        nextSaturday.setDate(nextSaturday.getDate() + 1); // Start with tomorrow
        
        // Find the next Saturday
        while (nextSaturday.getDay() !== 6) { // 6 = Saturday
            nextSaturday.setDate(nextSaturday.getDate() + 1);
        }
        
        const nextSunday = new Date(nextSaturday);
        nextSunday.setDate(nextSunday.getDate() + 1); // Next day is Sunday

        const saturdayStr = nextSaturday.toISOString().split('T')[0];
        const sundayStr = nextSunday.toISOString().split('T')[0];

        console.log(`📊 Looking for games on ${saturdayStr} and ${sundayStr}`);

        // Get games for upcoming weekend
        const weekendGames = await dbAll(
            `SELECT * FROM games WHERE date IN (?, ?) ORDER BY date ASC, time ASC`,
            [saturdayStr, sundayStr]
        );

        if (weekendGames.length === 0) {
            console.log('No games scheduled for upcoming weekend');
            return;
        }

        console.log(`📊 Found ${weekendGames.length} games for upcoming weekend`);

        // Get all players
        const allPlayers = await dbAll('SELECT id, email, name FROM users WHERE role = ?', ['player']);

        for (const player of allPlayers) {
            // Get confirmed players (status = 'yes') for each weekend game
            const gamesWithConfirmed = [];

            for (const game of weekendGames) {
                // Get confirmed players ordered by confirmation time
                const confirmedPlayers = await dbAll(
                    `SELECT u.id, u.name, a.updated_at FROM availability a
                     JOIN users u ON a.player_id = u.id
                     WHERE a.game_id = ? AND a.status = 'yes'
                     ORDER BY a.updated_at ASC`,
                    [game.id]
                );

                if (confirmedPlayers.length > 0) {
                    gamesWithConfirmed.push({
                        ...game,
                        confirmed: confirmedPlayers
                    });
                }
            }

            if (weekendGames.length === 0) {
                continue; // Skip if no games
            }

            // Build HTML for all games with confirmed players
            const gamesHTML = gamesWithConfirmed.map(game => {
                const gameDate = new Date(game.date);
                const gameDateStr = gameDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                });

                const confirmedPlayersHTML = game.confirmed
                    .map((p, index) => {
                        const confirmTime = new Date(p.updated_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        });
                        return `
                            <tr style="background-color: ${index % 2 === 0 ? '#f9fafb' : '#ffffff'};">
                                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center; font-weight: 700; color: #0ea5e9;">${index + 1}</td>
                                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;"><strong>${p.name}</strong></td>
                                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: left; font-size: 0.9em; color: #666;">${confirmTime}</td>
                            </tr>
                        `;
                    })
                    .join('');

                return `
                    <div style="margin-bottom: 20px; background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                        <h3 style="margin: 0 0 10px 0; color: #0f172a;">${gameDateStr} at ${game.time}${game.venue ? ' - ' + game.venue : ''}</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background-color: #e0f2fe; border-bottom: 2px solid #0ea5e9;">
                                    <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: center; width: 40px;">#</th>
                                    <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Player Name</th>
                                    <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left; width: 200px;">Confirmed At</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${confirmedPlayersHTML}
                            </tbody>
                        </table>
                        <p style="margin: 10px 0 0 0; font-size: 0.9em; color: #666;"><strong>${game.confirmed.length}</strong> player(s) confirmed</p>
                    </div>
                `;
            }).join('');

            // Check if this player is confirmed for any games
            const playerConfirmedGames = gamesWithConfirmed.filter(g => 
                g.confirmed.some(p => p.id === player.id)
            );

            let subject, htmlContent;

            if (playerConfirmedGames.length > 0) {
                // Player is confirmed - show full summary with team
                subject = '⚽ Your Weekend Team Summary - See Who\'s Playing!';
                htmlContent = `
                    <h2>⚽ Your Weekend Team Summary</h2>
                    <p>Hi ${player.name},</p>
                    <p>Here's a complete list of who's confirmed for the games you're playing in this weekend:</p>
                    
                    ${gamesHTML}
                    
                    <p style="margin-top: 20px; color: #666; font-size: 0.9em;">
                        <strong>Need to change your availability?</strong> You can update your status anytime until game time.
                    </p>
                    
                    <p style="margin-top: 20px;">
                        <a href="${process.env.APP_URL || 'http://localhost:3001'}" 
                           style="background-color: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            View Full Schedule
                        </a>
                    </p>
                `;
            } else {
                // Player hasn't confirmed for any game - show available options with confirmed counts
                subject = '⚽ This Weekend\'s Games - Current Confirmations';
                const gamesHTML_unconfirmed = weekendGames.map(game => {
                    const confirmedCount = gamesWithConfirmed.find(g => g.id === game.id)?.confirmed.length || 0;
                    const gameDate = new Date(game.date);
                    const gameDateStr = gameDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                    });

                    if (confirmedCount === 0) {
                        return `
                            <div style="margin-bottom: 15px; background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #999;">
                                <h3 style="margin: 0 0 10px 0; color: #0f172a;">${gameDateStr} at ${game.time}${game.venue ? ' - ' + game.venue : ''}</h3>
                                <p style="margin: 0; color: #666; font-size: 0.9em;">No confirmations yet - be the first to sign up!</p>
                            </div>
                        `;
                    }

                    return `
                        <div style="margin-bottom: 15px; background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                            <h3 style="margin: 0 0 10px 0; color: #0f172a;">${gameDateStr} at ${game.time}${game.venue ? ' - ' + game.venue : ''}</h3>
                            <p style="margin: 0; color: #666; font-size: 0.9em;"><strong>${confirmedCount}</strong> player(s) already confirmed - join them!</p>
                        </div>
                    `;
                }).join('');

                htmlContent = `
                    <h2>⚽ This Weekend's Games</h2>
                    <p>Hi ${player.name},</p>
                    <p>Here are this weekend's games and how many players have confirmed so far:</p>
                    
                    ${gamesHTML_unconfirmed}
                    
                    <p style="margin-top: 20px; color: #666; font-size: 0.9em;">
                        <strong>Interested in playing?</strong> Mark your availability below and see who else is coming!
                    </p>
                    
                    <p style="margin-top: 20px;">
                        <a href="${process.env.APP_URL || 'http://localhost:3001'}" 
                           style="background-color: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            View Games & Sign Up
                        </a>
                    </p>
                `;
            }

            // Create in-app notification
            await createNotification(
                player.id,
                'weekend_summary',
                'This Weekend\'s Team Summary',
                playerConfirmedGames.length > 0 
                    ? `See who's confirmed for ${playerConfirmedGames.length} game(s) you're playing in`
                    : 'View confirmed players and game details'
            );

            // Send email
            await sendEmail(player.email, subject, htmlContent);
        }

        console.log('✓ Friday confirmed players summary sent successfully');
    } catch (error) {
        console.error('Error in sendFridayConfirmedPlayersSummary:', error);
    }
}

// ===== SCHEDULED TASKS =====

// Schedule Thursday reminders at 6 PM (18:00)
// Runs every Thursday at 6 PM
cron.schedule('0 18 * * 4', () => {
    console.log('🔔 Running scheduled Thursday reminder task');
    sendThursdayReminders();
});

// Schedule Friday evening confirmed players summary at 8 PM (20:00)
// Runs every Friday at 8 PM
cron.schedule('0 20 * * 5', () => {
    console.log('📊 Running scheduled Friday confirmed players summary task');
    sendFridayConfirmedPlayersSummary();
});

// Optional: Run reminders daily at 6 PM for testing
// Uncomment the line below to test daily instead of weekly
// cron.schedule('0 18 * * *', sendThursdayReminders);

// Optional: Run Friday summary daily at 8 PM for testing
// Uncomment the line below to test daily instead of weekly
// cron.schedule('0 20 * * *', sendFridayConfirmedPlayersSummary);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// ===== AUTHENTICATION ROUTES =====

// Signup
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields required' });
        }

        const existingUser = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = 'user_' + Date.now();

        await dbRun(
            'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [userId, name, email, hashedPassword, 'player']
        );

        const token = jwt.sign({ id: userId, name, email, role: 'player' }, JWT_SECRET, {
            expiresIn: '30d'
        });

        res.json({ token, user: { id: userId, name, email, role: 'player' } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== GAMES ROUTES =====

// Get all games
app.get('/api/games', async (req, res) => {
    try {
        const games = await dbAll('SELECT * FROM games ORDER BY date ASC, time ASC');
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get game with availability details
app.get('/api/games/:id', async (req, res) => {
    try {
        const game = await dbGet('SELECT * FROM games WHERE id = ?', [req.params.id]);
        if (!game) return res.status(404).json({ error: 'Game not found' });

        const availabilities = await dbAll(
            `SELECT a.*, u.name FROM availability a 
             JOIN users u ON a.player_id = u.id 
             WHERE a.game_id = ?`,
            [req.params.id]
        );

        res.json({ ...game, availabilities });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create game (admin only)
app.post('/api/games', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { date, time, venue, max_players } = req.body;

        if (!date || !time) {
            return res.status(400).json({ error: 'Date and time required' });
        }

        const gameId = 'game_' + Date.now();

        await dbRun(
            'INSERT INTO games (id, date, time, venue, max_players, created_by) VALUES (?, ?, ?, ?, ?, ?)',
            [gameId, date, time, venue || null, max_players || 20, req.user.id]
        );

        res.status(201).json({ id: gameId, date, time, venue, max_players });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update game (admin only)
app.put('/api/games/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { date, time, venue, max_players } = req.body;

        await dbRun(
            'UPDATE games SET date = ?, time = ?, venue = ?, max_players = ? WHERE id = ?',
            [date, time, venue, max_players, req.params.id]
        );

        res.json({ id: req.params.id, date, time, venue, max_players });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete game (admin only)
app.delete('/api/games/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        await dbRun('DELETE FROM availability WHERE game_id = ?', [req.params.id]);
        await dbRun('DELETE FROM games WHERE id = ?', [req.params.id]);

        res.json({ message: 'Game deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== AVAILABILITY ROUTES =====

// Update player availability for a game
app.post('/api/availability', authenticateToken, async (req, res) => {
    try {
        const { game_id, status } = req.body;

        if (!game_id || !status) {
            return res.status(400).json({ error: 'Game ID and status required' });
        }

        const availId = 'avail_' + Date.now();
        const playerId = req.user.id;

        // Try to update first
        const existing = await dbGet(
            'SELECT id FROM availability WHERE game_id = ? AND player_id = ?',
            [game_id, playerId]
        );

        if (existing) {
            await dbRun(
                'UPDATE availability SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE game_id = ? AND player_id = ?',
                [status, game_id, playerId]
            );
        } else {
            await dbRun(
                'INSERT INTO availability (id, game_id, player_id, status) VALUES (?, ?, ?, ?)',
                [availId, game_id, playerId, status]
            );
        }

        // Notify admins of the availability change
        notifyAdminAvailabilityChange(playerId, game_id, status);

        // Notify all confirmed players (if status is "yes")
        notifyConfirmedPlayers(playerId, game_id, status);

        res.json({ game_id, player_id: playerId, status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get player's availability for a game
app.get('/api/availability/:gameId', authenticateToken, async (req, res) => {
    try {
        const avail = await dbGet(
            'SELECT status FROM availability WHERE game_id = ? AND player_id = ?',
            [req.params.gameId, req.user.id]
        );

        res.json({ status: avail?.status || null });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== USER ROUTES =====

// Get all users (admin only)
app.get('/api/users', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const users = await dbAll('SELECT id, name, email, role, photo_url, created_at FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user profile with photo
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await dbGet('SELECT id, name, email, role, photo_url FROM users WHERE id = ?', [req.params.id]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload player photo
app.post('/api/users/photo/upload', authenticateToken, upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const userId = req.user.id;
        const filename = `${userId}-${Date.now()}.webp`;
        const filepath = path.join(uploadsDir, filename);

        // Resize and convert to WebP for optimization
        await sharp(req.file.buffer)
            .resize(400, 400, { fit: 'cover' })
            .webp({ quality: 80 })
            .toFile(filepath);

        // Also create thumbnail
        const thumbnailFilename = `${userId}-${Date.now()}-thumb.webp`;
        const thumbnailPath = path.join(uploadsDir, thumbnailFilename);
        await sharp(req.file.buffer)
            .resize(100, 100, { fit: 'cover' })
            .webp({ quality: 80 })
            .toFile(thumbnailPath);

        // Delete old photos for this user
        const user = await dbGet('SELECT photo_url FROM users WHERE id = ?', [userId]);
        if (user && user.photo_url) {
            const oldPath = path.join(__dirname, user.photo_url);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        // Update user with new photo URL
        const photoUrl = `/uploads/${filename}`;
        await dbRun('UPDATE users SET photo_url = ? WHERE id = ?', [photoUrl, userId]);

        res.json({ 
            photo_url: photoUrl,
            thumbnail_url: `/uploads/${thumbnailFilename}`,
            message: 'Photo uploaded successfully' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user photo
app.delete('/api/users/photo', authenticateToken, async (req, res) => {
    try {
        const user = await dbGet('SELECT photo_url FROM users WHERE id = ?', [req.user.id]);
        if (user && user.photo_url) {
            const photoPath = path.join(__dirname, user.photo_url);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }

        await dbRun('UPDATE users SET photo_url = NULL WHERE id = ?', [req.user.id]);
        res.json({ message: 'Photo deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Promote user to admin (admin only)
app.put('/api/users/:id/promote', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        await dbRun('UPDATE users SET role = ? WHERE id = ?', ['admin', req.params.id]);
        res.json({ message: 'User promoted to admin' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user (admin only)
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        await dbRun('DELETE FROM availability WHERE player_id = ?', [req.params.id]);
        await dbRun('DELETE FROM users WHERE id = ?', [req.params.id]);

        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== PLAYER STATUS ROUTES (Admin Only) =====

// Get all active available players (admin only)
app.get('/api/players/available', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const activePlayers = await dbAll(
            `SELECT u.id, u.name, u.email, u.photo_url, ps.is_active, ps.updated_at 
             FROM users u 
             LEFT JOIN player_status ps ON u.id = ps.user_id 
             WHERE u.role = 'player' AND (ps.is_active = 1 OR ps.is_active IS NULL)
             ORDER BY ps.updated_at DESC`,
            []
        );

        res.json(activePlayers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get inactive players who need reminders (admin only)
app.get('/api/players/inactive', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const inactivePlayers = await dbAll(
            `SELECT u.id, u.name, u.email, u.photo_url, ps.updated_at 
             FROM users u 
             LEFT JOIN player_status ps ON u.id = ps.user_id 
             WHERE u.role = 'player' AND ps.is_active = 0
             ORDER BY ps.updated_at DESC`,
            []
        );

        res.json(inactivePlayers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Player marks themselves as available (can play)
app.post('/api/player/status/available', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Check if status exists
        const existing = await dbGet(
            'SELECT id FROM player_status WHERE user_id = ?',
            [userId]
        );

        if (existing) {
            await dbRun(
                'UPDATE player_status SET is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
                [userId]
            );
        } else {
            const statusId = 'status_' + Date.now();
            await dbRun(
                'INSERT INTO player_status (id, user_id, is_active) VALUES (?, ?, 1)',
                [statusId, userId]
            );
        }

        // Create notification for admins
        const player = await dbGet('SELECT name FROM users WHERE id = ?', [userId]);
        const admins = await dbAll('SELECT id FROM users WHERE role = ?', ['admin']);

        for (const admin of admins) {
            await createNotification(
                admin.id,
                'player_available',
                `${player.name} is now available`,
                `${player.name} has marked themselves as available to play`,
                null,
                userId
            );
        }

        res.json({ message: 'Status updated to available', is_active: 1 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Player marks themselves as unavailable (cannot play)
app.post('/api/player/status/unavailable', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Check if status exists
        const existing = await dbGet(
            'SELECT id FROM player_status WHERE user_id = ?',
            [userId]
        );

        if (existing) {
            await dbRun(
                'UPDATE player_status SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
                [userId]
            );
        } else {
            const statusId = 'status_' + Date.now();
            await dbRun(
                'INSERT INTO player_status (id, user_id, is_active) VALUES (?, ?, 0)',
                [statusId, userId]
            );
        }

        res.json({ message: 'Status updated to unavailable', is_active: 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get player's current status
app.get('/api/player/status', authenticateToken, async (req, res) => {
    try {
        const status = await dbGet(
            'SELECT is_active FROM player_status WHERE user_id = ?',
            [req.user.id]
        );

        res.json({ is_active: status ? status.is_active : 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== NOTIFICATION ROUTES =====

// Get user's notifications
app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const notifications = await dbAll(
            `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
            [req.user.id]
        );
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get unread notification count
app.get('/api/notifications/unread/count', authenticateToken, async (req, res) => {
    try {
        const result = await dbGet(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0',
            [req.user.id]
        );
        res.json({ unread_count: result.count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark notification as read
app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
    try {
        await dbRun(
            'UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark all notifications as read
app.put('/api/notifications/read/all', authenticateToken, async (req, res) => {
    try {
        await dbRun(
            'UPDATE notifications SET read = 1 WHERE user_id = ? AND read = 0',
            [req.user.id]
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete notification
app.delete('/api/notifications/:id', authenticateToken, async (req, res) => {
    try {
        await dbRun(
            'DELETE FROM notifications WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== STATS ROUTES =====

// Get game statistics
app.get('/api/stats/game/:id', async (req, res) => {
    try {
        const availabilities = await dbAll(
            'SELECT status FROM availability WHERE game_id = ?',
            [req.params.id]
        );

        const stats = {
            yes: availabilities.filter(a => a.status === 'yes').length,
            no: availabilities.filter(a => a.status === 'no').length,
            maybe: availabilities.filter(a => a.status === 'maybe').length,
            total: availabilities.length
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`League Scheduler Server running on http://localhost:${PORT}`);
    console.log('API available at http://localhost:' + PORT + '/api');
});

module.exports = app;