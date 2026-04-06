# ⚡ LRD Heroku Quick Deployment (10 Minutes)

Follow this checklist to deploy in 10 minutes.

---

## Step 1: Prerequisites (2 min)
- [ ] Heroku account created (heroku.com)
- [ ] Heroku CLI installed (`heroku --version` works)
- [ ] Git installed (`git --version` works)
- [ ] All LRD files downloaded from /outputs/

---

## Step 2: Prepare Files (2 min)

### Create folder:
```bash
mkdir lrd-app
cd lrd-app
```

### Copy these files from /outputs/:
- [ ] `server.js`
- [ ] `package.json`
- [ ] `Procfile`
- [ ] Copy `index.html` to `public/index.html`

### Create `.env` file:
```env
JWT_SECRET=generate-with-openssl-later
PORT=3001
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Create `.gitignore`:
```
node_modules/
.env
league.db
uploads/
*.log
.DS_Store
```

---

## Step 3: Initialize Git (1 min)

```bash
git init
git add .
git commit -m "Initial commit - LRD"
```

---

## Step 4: Login to Heroku (1 min)

```bash
heroku login
# Browser opens - log in and return to terminal
```

---

## Step 5: Create Heroku App (1 min)

```bash
heroku create your-unique-app-name
# Example: heroku create lrd-soccer-league
# Your URL will be: https://lrd-soccer-league.herokuapp.com
```

**Copy your URL!** You'll need it.

---

## Step 6: Set Configuration (2 min)

### Set Basic Config:
```bash
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set PORT=3001
heroku config:set NODE_ENV=production
heroku config:set APP_URL=https://your-app-name.herokuapp.com
```

Replace `your-app-name` with what you used in Step 5.

### Set Email (Gmail):
```bash
heroku config:set SMTP_HOST=smtp.gmail.com
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=your-email@gmail.com
heroku config:set SMTP_PASS=your-app-password
```

**Note**: For Gmail, create an "App Password" at: https://myaccount.google.com/apppasswords

---

## Step 7: Deploy (1 min)

```bash
git push heroku main
# Or: git push heroku master
```

Wait for deployment to complete (you'll see output).

---

## Step 8: Open App (instant)

```bash
heroku open
```

Your app should open in browser!

**✅ YOU'RE LIVE!**

---

## Step 9: Create Admin Account (optional)

1. Sign up as a regular player
2. Note your email
3. Run this to make yourself admin:

```bash
heroku run "sqlite3 league.db \"UPDATE users SET role='admin' WHERE email='your@email.com'\""
```

Replace `your@email.com` with your actual email.

---

## Step 10: Share URL (instant)

Share your public URL with your league:
```
https://your-app-name.herokuapp.com
```

Players can now sign up!

---

## 🎉 Done! Your App is Live!

| Item | Value |
|------|-------|
| **App Name** | your-app-name |
| **Public URL** | https://your-app-name.herokuapp.com |
| **Database** | SQLite (automatic) |
| **Cost** | Free (or $5+/month) |
| **Status** | ✅ Live |

---

## Troubleshooting Quick Fixes

### App won't start?
```bash
heroku logs --tail
# Shows error messages
```

### Need to restart?
```bash
heroku restart
```

### Check config?
```bash
heroku config
```

### Update email later?
```bash
heroku config:set SMTP_USER=newemail@gmail.com
```

---

## Important Notes

✅ **Free tier is fine** for starting
✅ **App sleeps after 30 mins** - just refresh to wake
✅ **Upgrade to Eco ($5/mo)** if you want it always running
✅ **Database resets** if you delete the app (add backup later)
✅ **Email is optional** - app works without it

---

## Next Steps

1. **Players sign up** at your public URL
2. **Create games** as admin
3. **Players mark availability**
4. **Get notifications** on Friday at 8 PM
5. **Enjoy!** ⚽

---

## Command Reference

```bash
# View logs
heroku logs --tail

# Open app
heroku open

# Restart app
heroku restart

# Deploy changes
git push heroku main

# Check status
heroku status

# View config
heroku config

# View app info
heroku apps:info
```

---

**Total Time**: ~10 minutes
**Difficulty**: Easy
**Cost**: Free (optional upgrade)
**Status**: ✅ Production Ready

---

You're all set! Welcome to LRD! ⚽🏀🎾
