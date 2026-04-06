# 🎯 Player Availability Status & Notification System

## Overview

The League Scheduler now includes an intelligent notification and activation system that helps manage player engagement for weekend games.

---

## 📋 How It Works

### Three Key Components:

#### 1. **Player General Availability Status** 
Players can mark themselves as **Available** or **Unavailable** in their profile. This is SEPARATE from specific game RSVPs.

#### 2. **Automatic Weekly Reminders (Thursday at 6 PM)**
- **Inactive Players**: Get urged to mark themselves as "Available" 
- **Active Players**: Receive a summary of upcoming weekend games

#### 3. **Real-Time Admin Notifications**
Administrators receive notifications when:
- A player marks themselves as **Available** or **Unavailable**
- A player updates their RSVP for a specific game (Yes/Maybe/No)

---

## 👥 Player Experience

### For Regular Players

1. **Update Your Availability Status**
   - Go to "Your Profile" section
   - Click **"✓ Available"** to show admins you're ready to play
   - Click **"✗ Unavailable"** if you can't play

2. **Thursday Reminder Email**
   - If you're marked as **Unavailable**: Get an invitation to mark yourself available
   - If you're marked as **Available**: Get a summary of weekend games
   - Emails arrive at 6 PM every Thursday

3. **Game-Specific RSVPs**
   - Once available, you can RSVP for specific games
   - Mark yourself as Playing/Maybe/Not Playing for each game
   - Admins will see your game-specific responses

---

## 👨‍💼 Admin Experience

### For Administrators

1. **View Available Players** (NEW TAB)
   - Go to "Admin Control" → "Available Players" tab
   - See all players marked as **Available** with:
     - Player photos (thumbnails)
     - Names and emails
     - Availability status
     - Last updated date

2. **Notifications**
   - **🔔 Bell Icon**: Shows unread notification count
   - See real-time updates when players:
     - Mark themselves available/unavailable
     - Update game RSVPs
   - Click to mark as read or delete

3. **Manage Games**
   - Create games knowing who's available
   - Use the Available Players list to contact players
   - See game-specific RSVPs when assigning players

---

## 📧 Email Notifications

### Thursday Reminder Emails (6 PM)

**For Inactive Players:**
```
Subject: ⚽ We Need You This Weekend!

Message:
"You haven't marked yourself as available to play yet.

Mark yourself as AVAILABLE so we can include you in this 
weekend's games!

Once you mark yourself as available:
- Admins can see you're ready to play
- You'll get specific game invitations
- You can confirm your attendance for each game"
```

**For Active Players:**
```
Subject: ⚽ Weekend Games - You're Active!

Message:
"You're marked as AVAILABLE to play.

[Table of upcoming games with dates, times, and confirmed players]

Check your availability for each game when they're posted!"
```

### Real-Time Notifications (Email + In-App)

**When Player Marks Available:**
Admins receive:
```
Title: "[Player Name] is now available"
Message: "[Player Name] has marked themselves as available to play"
```

**When Player Updates RSVP:**
Admins receive:
```
Title: "[Player Name] marked as Playing/Maybe/Not Playing"
Message: "[Player Name] has marked themselves as 'Playing' for the 
game on [date] at [time]"
```

---

## 🔧 Configuration

### Email Setup Required

To use notifications, configure your email in `.env`:

```env
# Gmail Example
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Replace with SendGrid
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=SG.your-sendgrid-key

# Or Mailgun
SMTP_HOST=smtp.mailgun.org
SMTP_USER=postmaster@yourdomain.mailgun.org
SMTP_PASS=your-mailgun-password
```

**For Gmail**: Use an [App Password](https://support.google.com/accounts/answer/185833), not your regular password.

### APP_URL Configuration

Add this to `.env` so links in emails work correctly:

```env
APP_URL=https://your-domain.com
# or for local testing
APP_URL=http://localhost:3001
```

---

## 📊 Database Schema

### player_status Table
```sql
id TEXT PRIMARY KEY
user_id TEXT (unique)
is_active INTEGER (0 = unavailable, 1 = available)
updated_at DATETIME
```

### notifications Table
```sql
id TEXT PRIMARY KEY
user_id TEXT
type TEXT (availability_change, activation_reminder, weekend_summary, etc.)
title TEXT
message TEXT
related_game_id TEXT (optional)
related_player_id TEXT (optional)
read INTEGER (0 = unread, 1 = read)
created_at DATETIME
```

---

## 🔔 Notification Bell

The notification bell in the header shows:
- **🔔 Number Badge**: Unread notification count
- **Click to Expand**: View all recent notifications
- **Mark as Read**: Clear from unread list
- **Delete**: Remove notification

---

## 📅 Scheduled Tasks

### Thursday 6 PM Reminders
Runs automatically every Thursday at 6:00 PM:
1. Gets all players
2. Checks if each is marked as available
3. Sends personalized emails
4. Creates in-app notifications

To test daily instead of weekly, uncomment this line in `server.js`:
```javascript
// cron.schedule('0 18 * * *', sendThursdayReminders);
```

---

## 🔐 Security & Privacy

- **Admin-Only Access**: Only admins can view the "Available Players" list
- **Player Control**: Players choose when to mark themselves available
- **In-App Only**: Admin notifications are private, in-app messages
- **Email Security**: Transporter validates email credentials on startup

---

## 📱 Player Workflow Example

**Monday:**
- Player signs up and creates account
- Status: **Unavailable** (default)
- Can't see in admin available list

**Wednesday:**
- Player marks themselves **Available**
- Status changes immediately
- Admin is notified
- Player appears in "Available Players" list

**Thursday 6 PM:**
- Player receives email: "Weekend Games Summary"
- Lists upcoming games
- Links to RSVP for specific games

**Friday:**
- Admin creates a Saturday game
- Contacts available players
- Players RSVP via app

**Saturday Morning:**
- Game happens with confirmed players
- After game, players can update status if needed

---

## 🚀 API Endpoints

### Player Status Endpoints
- `GET /api/player/status` - Get current player's status
- `POST /api/player/status/available` - Mark as available
- `POST /api/player/status/unavailable` - Mark as unavailable

### Admin Endpoints
- `GET /api/players/available` - Get all available players
- `GET /api/players/inactive` - Get all inactive players
- `POST /api/admin/reminder/send` - Manually trigger reminders (optional)

### Notification Endpoints
- `GET /api/notifications` - Get user's notifications
- `GET /api/notifications/unread/count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

---

## 🛠️ Troubleshooting

### Emails Not Sending

1. **Check `.env` file**
   ```bash
   cat .env | grep SMTP
   ```

2. **Check server startup logs**
   ```
   ✓ Email service ready for notifications
   # OR
   ⚠️ Email not configured properly. Notifications disabled.
   ```

3. **Verify SMTP credentials**
   - Gmail: Use App Password, not regular password
   - Check SMTP_HOST and SMTP_PORT are correct

4. **Check server logs**
   - Look for "Email sent to:" messages
   - Check for error messages

### Thursday Reminders Not Sending

1. **Server must be running**
   - Cron jobs only run while server is active
   - If using Heroku free tier, dyno may sleep

2. **Timezone**
   - Reminders use server timezone
   - Adjust cron schedule if needed: `0 18 * * 4`

3. **Manual Test**
   - To test manually, call: `GET /api/test/send-reminders`
   - (Can add this endpoint for testing)

### Notifications Not Showing

1. **Check browser notifications**
   - Click the bell icon 🔔
   - Refresh the page

2. **Check database**
   - Verify notifications table exists
   - Check if records are being created

3. **Check permissions**
   - Admin notifications only show to admins
   - Only your notifications show to you

---

## 📈 Future Enhancements

Possible additions:
- SMS notifications (text messages)
- Slack integration
- Discord webhook notifications
- Push notifications on mobile app
- Player statistics (games played, streak, etc.)
- Team assignments
- Waiting list for full games
- Email digest of weekly activity

---

## 📞 Support

For issues:
1. Check `.env.example` for correct configuration
2. Review server startup logs
3. Test email with `npm test:email` (if implemented)
4. Check browser console for errors (F12)

---

**Ready to activate your players! 🚀**
