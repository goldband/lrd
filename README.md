# ⚽ League Scheduler - Production-Ready Game Management System

A **complete, cloud-ready** sports league scheduling application with user authentication, game management, and real-time availability tracking.

> **Built with**: Node.js + Express + SQLite + Modern Frontend
> 
> **Deploy in seconds** to Vercel, Heroku, or your own server

---

## ✨ Features

### For Players
- 🔐 Secure signup & login with JWT authentication
- 📅 View all upcoming games (Saturdays & Sundays)
- ✅ Mark availability: **Playing**, **Maybe**, or **Not Playing**
- 👥 See who else is playing each game
- 📱 Fully responsive mobile design

### For Admins
- ⚙️ Complete admin dashboard
- 🎮 Create & manage games (date, time, venue, capacity)
- 👨‍💼 Manage player accounts
- 📊 View game statistics
- 🔧 Promote players to admin status

### Technical
- ✅ **Production-ready** backend with error handling
- 🔐 Secure password hashing (bcryptjs)
- 🎫 JWT token authentication
- 📦 SQLite database (built-in, no setup needed)
- 🚀 Cloud-ready (Vercel, Heroku, AWS, DigitalOcean)
- 📡 RESTful API for extensibility
- 🎨 Modern, dark-theme UI with smooth animations

---

## 📦 What You Get

```
league-scheduler/
├── server.js              ← Node.js/Express backend
├── index.html             ← Frontend (HTML + CSS + JS)
├── package.json           ← Dependencies
├── QUICK_START.md         ← Fast setup guide
├── SETUP_GUIDE.md         ← Detailed deployment guide
├── .env.example           ← Configuration template
├── Procfile               ← Heroku deployment
├── vercel.json            ← Vercel deployment
└── league.db              ← SQLite database (auto-created)
```

---

## 🚀 Deploy in 60 Seconds

### Option 1: Vercel (Recommended)

```bash
# 1. Upload files to GitHub
# 2. Go to vercel.com
# 3. Click "Import Project"
# 4. Select your repository
# Done! 🎉

# You get a public URL like:
# https://league-scheduler-abc.vercel.app
```

### Option 2: Heroku

```bash
npm install -g heroku
heroku login
heroku create your-app-name
git push heroku main
heroku open
```

### Option 3: Local Development

```bash
npm install
npm start
# Runs on http://localhost:3001
```

---

## 🎯 Quick Start

### 1. **Setup (5 minutes)**
   - See `QUICK_START.md` for step-by-step instructions
   - Or read `SETUP_GUIDE.md` for detailed deployment options

### 2. **Create Account**
   - Sign up with email & password
   - Automatic login

### 3. **Make Yourself Admin**
   - Needed to create games and manage players
   - See admin section in setup guides

### 4. **Create Games**
   - Set date, time, venue, max players
   - Games auto-populate for all Saturdays & Sundays

### 5. **Share with Your League**
   - Send the public URL to all players
   - They sign up and mark availability

---

## 🔑 Key Endpoints

### Authentication
```
POST   /api/auth/signup          Register new user
POST   /api/auth/login           Login user
```

### Games
```
GET    /api/games                Get all games
GET    /api/games/:id            Get game details
POST   /api/games                Create game (admin)
PUT    /api/games/:id            Update game (admin)
DELETE /api/games/:id            Delete game (admin)
```

### Availability
```
POST   /api/availability         Mark availability
GET    /api/availability/:gameId Get player's status
```

### Admin
```
GET    /api/users                Get all players (admin)
PUT    /api/users/:id/promote    Make player admin (admin)
DELETE /api/users/:id            Delete player (admin)
GET    /api/stats/game/:id       Get game stats
```

---

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Role-based access control
- ✅ Input validation on all endpoints
- ✅ CORS protection
- ✅ SQL injection prevention
- ⚠️ **Change JWT_SECRET** before production

---

## 📊 Admin Dashboard

Once logged in as admin, you get:

### Games Tab
- Create new games with date, time, venue
- View all scheduled games
- (Update/delete coming in next version)

### Players Tab
- View all registered players
- Promote players to admin
- Delete player accounts
- See player email & registration date

---

## 🎨 UI/UX Highlights

- **Dark Theme**: Modern, eye-friendly interface
- **Responsive**: Works on desktop, tablet, mobile
- **Fast**: Optimized animations & instant feedback
- **Intuitive**: Clear CTAs, status indicators
- **Accessible**: Semantic HTML, keyboard navigation

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | SQLite 3 |
| **Auth** | JWT + bcryptjs |
| **Deployment** | Vercel, Heroku, VPS |

---

## 📈 Scaling

For production with many users:

1. **Database**: Migrate from SQLite to PostgreSQL
2. **Caching**: Add Redis for frequent queries
3. **API**: Add rate limiting & request throttling
4. **Monitoring**: Setup error tracking (Sentry)
5. **Backups**: Automated database backups

---

## 🆘 Common Issues

### "Port already in use"
```bash
PORT=3002 npm start
```

### "Database locked"
```bash
rm league.db
npm start
```

### "Can't login"
- Clear browser cache: `Ctrl+Shift+Del`
- Try incognito mode
- Check email spelling

### "Admin features not showing"
- Make sure JWT token is valid
- Check database has `role='admin'` set
- Re-login

See `SETUP_GUIDE.md` for more troubleshooting.

---

## 📝 Configuration

### Environment Variables
Create a `.env` file (copy from `.env.example`):

```env
JWT_SECRET=your-secret-key-here
PORT=3001
NODE_ENV=production
```

### Customize Colors
Edit CSS in `index.html`:
```css
:root {
    --primary: #0f172a;
    --accent: #0ea5e9;
    --success: #10b981;
    --danger: #ef4444;
}
```

### Change Game Frequency
Modify `server.js` to generate games for different days.

---

## 📚 Documentation

- **QUICK_START.md** - Fast setup (5 min)
- **SETUP_GUIDE.md** - Complete guide with all options
- **This README** - Feature overview

---

## 🤝 Contributing

Want to improve the app?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Ideas for enhancements:
- Email notifications
- Player statistics
- Game history
- Team creation
- Payment integration
- Mobile app

---

## 📄 License

MIT License - Use freely for personal or commercial projects.

---

## 🎯 Next Steps

1. **Read**: `QUICK_START.md` for fastest setup
2. **Deploy**: Pick Vercel, Heroku, or local
3. **Customize**: Adjust colors, text, game times
4. **Share**: Send URL to your league
5. **Manage**: Use admin dashboard to create games

---

## 💬 Support

Having issues? 

1. Check `SETUP_GUIDE.md` troubleshooting section
2. Review error messages in browser console (`F12`)
3. Check server logs for API errors
4. Clear browser cache and try again

---

## 🏆 Ready to Go!

Your league scheduling system is ready to deploy! 

**Current Status**: ✅ Production-Ready
**Deployment Time**: ~2 minutes
**Cost**: $0-12/month (Vercel free, Heroku ~$7)

Get your URL and start scheduling! 🚀

---

**Built with ⚽ for sports enthusiasts everywhere.**
