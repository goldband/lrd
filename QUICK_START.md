# ⚡ Quick Start - League Scheduler

Get your league scheduler running in 5 minutes!

## 🎯 Option 1: Deploy to Vercel (Fastest - 2 minutes)

### Step 1: Prepare Files
1. Create a new folder: `league-scheduler`
2. Copy these files into it:
   - `server.js`
   - `index.html`
   - `package.json`
   - `vercel.json`
   - `.env.example` (rename to `.env`)

### Step 2: Deploy
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"** and connect your GitHub
4. Or **Drag & drop** the folder
5. Click **"Deploy"**

### Step 3: Get Your URL
After deployment, Vercel gives you a URL like:
```
https://league-scheduler-abc123.vercel.app
```

Share this with your league!

---

## 💻 Option 2: Run Locally (3 minutes)

### Step 1: Install Node.js
Download from [nodejs.org](https://nodejs.org/)

### Step 2: Setup
```bash
# Open terminal/command prompt in the project folder
npm install
```

### Step 3: Run
```bash
npm start
```

Visit: `http://localhost:3001`

---

## 🌍 Option 3: Deploy to Heroku (Free)

### Step 1: Create Heroku Account
Go to [heroku.com](https://www.heroku.com)

### Step 2: Install Heroku CLI
[Download Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

### Step 3: Deploy
```bash
heroku login
heroku create your-app-name
heroku config:set JWT_SECRET=your-secret-key
git push heroku main
heroku open
```

---

## 🎮 First Login

### Create Your Account
1. Click **"Sign up"**
2. Enter your name, email, password
3. Done! You're logged in

### Make Yourself Admin (Optional)
1. Open browser console: `F12`
2. Go to Application/Storage → LocalStorage
3. Add key: `role` with value: `admin`
4. Refresh page
5. ⚙️ Admin panel appears!

---

## 📝 Create a Game (Admin Only)

1. Click **Admin Control** tab
2. Fill in:
   - **Date**: When is the game?
   - **Time**: What time?
   - **Venue**: Where to play
   - **Max Players**: Capacity
3. Click **"Create Game"**

---

## ✅ Mark Your Availability

For each game:
- Click **✓ Playing** - You're in!
- Click **? Maybe** - You might come
- Click **✗ Not Playing** - You're out

---

## 👥 Share With Your League

**Send this link to all players:**
```
https://your-vercel-app-url.vercel.app
```

They can:
1. Sign up with their email
2. See all games
3. Mark availability
4. See who else is playing

---

## 🔧 Troubleshooting

### App won't start
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
npm start
```

### Can't log back in
```bash
# Clear browser storage
Open DevTools (F12) → Application → Clear All
```

### Port already in use
```bash
PORT=3002 npm start
```

---

## 📚 Full Documentation

See `SETUP_GUIDE.md` for:
- Advanced deployment options
- Database management
- API documentation
- Security setup
- Customization guide

---

## 🚀 You're Done!

Your league scheduler is live! 🎉

Next:
1. ✅ Share the URL with teammates
2. ✅ Create some games
3. ✅ Start tracking availability
4. ✅ Have fun!

---

**Questions?** Check `SETUP_GUIDE.md` or the troubleshooting section above.
