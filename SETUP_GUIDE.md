# League Scheduler - Setup & Deployment Guide

A production-grade sports league game scheduling application with player management, availability tracking, and admin controls.

## 📋 Features

- **User Authentication**: Secure login/signup with JWT tokens
- **Game Management**: Create, view, and manage games for Saturdays & Sundays
- **Availability Tracking**: Players can mark themselves as Playing, Maybe, or Not Playing
- **Admin Dashboard**: Full control over games and player management
- **Cloud Ready**: Built for easy deployment to Vercel, Heroku, or your own server
- **Persistent Storage**: SQLite database with data backup support

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 14+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)

### Step 1: Setup

```bash
# Extract/navigate to the project folder
cd league-scheduler

# Install dependencies
npm install
```

### Step 2: Create Environment File

Create a `.env` file in the root directory:

```
JWT_SECRET=your-super-secret-key-change-this
PORT=3001
NODE_ENV=development
```

### Step 3: Run Locally

```bash
# Start the server
npm start

# Server will run at: http://localhost:3001
```

Open your browser and go to `http://localhost:3001`

### Step 4: Test Login

**Sample Test Accounts** (after first user creates account):
- Create your own account by signing up
- Or create multiple test accounts to test the system

**Make First User Admin**:
1. Open the browser console
2. Run: `localStorage.setItem('isAdmin', 'true')`
3. Refresh the page
4. Admin panel will appear

---

## 🌐 Deploy to Vercel (Recommended - Free!)

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from project directory
vercel
```

Follow the prompts. Vercel will:
- Create a public URL automatically
- Deploy in seconds
- Set up continuous deployment

### Option 2: Using GitHub

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/league-scheduler.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Vercel auto-detects and deploys!

3. **Set Environment Variables in Vercel Dashboard**:
   - Go to Settings → Environment Variables
   - Add: `JWT_SECRET` with your secret key

### Vercel Configuration File

Create a `vercel.json` file:

```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "server.js" }
  ]
}
```

---

## 🚀 Deploy to Heroku (Free - With Limits)

1. **Install Heroku CLI**:
   - Download from [heroku.com/cli](https://www.heroku.com/cli)

2. **Create Procfile**:
   ```
   web: node server.js
   ```

3. **Deploy**:
   ```bash
   heroku login
   heroku create your-app-name
   heroku config:set JWT_SECRET=your-secret-key
   git push heroku main
   ```

4. **View your app**:
   ```bash
   heroku open
   ```

---

## 🚀 Deploy to Your Own Server

### Using a VPS (DigitalOcean, Linode, AWS, etc.)

1. **SSH into your server**:
   ```bash
   ssh root@your-server-ip
   ```

2. **Install Node.js**:
   ```bash
   curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone and setup**:
   ```bash
   git clone https://github.com/yourusername/league-scheduler.git
   cd league-scheduler
   npm install
   ```

4. **Setup with PM2** (keeps app running):
   ```bash
   npm install -g pm2
   pm2 start server.js --name league-scheduler
   pm2 startup
   pm2 save
   ```

5. **Setup Nginx** (reverse proxy):
   ```bash
   sudo apt-get install nginx
   ```

   Edit `/etc/nginx/sites-available/default`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
       }
   }
   ```

   Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

6. **Setup SSL** (HTTPS):
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## 📁 File Structure

```
league-scheduler/
├── server.js              # Express backend
├── index.html             # Frontend (served as public/index.html)
├── package.json           # Dependencies
├── .env                   # Environment variables (create this)
├── league.db              # SQLite database (auto-created)
├── vercel.json            # Vercel config (optional)
└── Procfile               # Heroku config (if using Heroku)
```

---

## 🔧 Environment Variables

Required for production:

```env
JWT_SECRET=your-very-long-secret-key-that-is-hard-to-guess
PORT=3001
NODE_ENV=production
```

---

## 🎯 Admin Features

Once logged in as admin, you can:

1. **Create Games**: Set date, time, venue, and max players
2. **Manage Players**: 
   - Promote players to admin
   - Delete player accounts
   - View all registered players
3. **View Statistics**: See availability counts for each game

To make your first account an admin:
1. Sign up
2. In database: `UPDATE users SET role = 'admin' WHERE email = 'your@email.com'`

Or via API:
```bash
curl -X PUT http://localhost:3001/api/users/{userId}/promote \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔐 Security Tips

For production:

1. **Change JWT_SECRET**: Use a strong, random string (min 32 characters)
2. **Enable HTTPS**: Use SSL certificates
3. **Setup Database Backups**: Regular SQLite backups
4. **Rate Limiting**: Add rate limiting middleware
5. **Input Validation**: All inputs are validated (add more if needed)

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use a different port
PORT=3002 npm start
```

### Database Errors
```bash
# Reset database
rm league.db
npm start  # Creates new empty database
```

### CORS Errors
- Check that frontend URL matches CORS settings in server.js
- Update CORS in server.js if needed:
```javascript
app.use(cors({
  origin: 'https://your-domain.com'
}));
```

### JWT Token Issues
- Clear localStorage: `localStorage.clear()`
- Re-login
- Check JWT_SECRET matches between .env and code

---

## 📊 API Reference

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Games
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get specific game
- `POST /api/games` - Create game (admin)
- `PUT /api/games/:id` - Update game (admin)
- `DELETE /api/games/:id` - Delete game (admin)

### Availability
- `POST /api/availability` - Update availability
- `GET /api/availability/:gameId` - Get player's availability

### Users (Admin)
- `GET /api/users` - Get all users (admin)
- `PUT /api/users/:id/promote` - Promote to admin (admin)
- `DELETE /api/users/:id` - Delete user (admin)

### Stats
- `GET /api/stats/game/:id` - Get game statistics

---

## 🎨 Customization

### Change Colors
Edit CSS variables in `index.html`:
```css
:root {
    --primary: #0f172a;      /* Primary color */
    --accent: #0ea5e9;       /* Accent color */
    --success: #10b981;      /* Success color */
    --danger: #ef4444;       /* Danger/delete color */
}
```

### Change Game Days
In `server.js`, modify the game generation logic to change which days games are scheduled.

### Add Fields
Modify the database schema in `server.js`:
```javascript
db.run(`
    CREATE TABLE IF NOT EXISTS games (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        venue TEXT,
        max_players INTEGER DEFAULT 20,
        your_new_field TEXT,  // Add here
        ...
    )
`);
```

---

## 📈 Scaling

For large numbers of players:

1. **Use PostgreSQL instead of SQLite**:
   - SQLite is fine for <1000 concurrent users
   - Switch to PostgreSQL for production

2. **Add Caching**:
   - Use Redis for frequent queries
   - Cache game listings

3. **Database Indexing**:
   - Add indexes on frequently queried fields
   - Improves performance

---

## 📞 Support

For issues:
1. Check the troubleshooting section
2. Review API logs: `console.log()` in server.js
3. Browser console: `F12` → Console tab

---

## 📝 License

MIT - Feel free to modify and use as needed.

---

## 🚀 Next Steps

1. ✅ Setup locally with `npm start`
2. ✅ Test with sample accounts
3. ✅ Deploy to Vercel/Heroku
4. ✅ Share public URL with your league
5. ✅ Have players sign up and mark availability
6. ✅ Use admin panel to manage games

**Good luck with your league! 🏆**