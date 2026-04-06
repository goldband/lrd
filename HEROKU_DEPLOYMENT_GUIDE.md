# 🚀 LRD Heroku Deployment Guide

Complete step-by-step guide to deploy LRD to Heroku.

---

## ✅ Prerequisites

Before starting, you need:

1. **Heroku Account**
   - Sign up at heroku.com (free)
   - Verify email

2. **Heroku CLI**
   - Download from: https://devcenter.heroku.com/articles/heroku-cli
   - Install on your computer
   - Verify with: `heroku --version`

3. **Git**
   - Already installed on most computers
   - Verify with: `git --version`

4. **LRD Files**
   - All files from `/outputs/` directory
   - Including server.js, index.html, package.json, etc.

5. **Email Service** (optional but recommended)
   - Gmail account with App Password
   - Or SendGrid/Mailgun account
   - For sending notifications

---

## 🎯 Quick Start (10 minutes)

### Step 1: Create Local Project Folder
```bash
mkdir lrd-app
cd lrd-app
```

### Step 2: Copy LRD Files
Copy these files to your `lrd-app` folder:
- `server.js`
- `index.html`
- `package.json`
- `.env.example` → rename to `.env`

### Step 3: Create Public Folder
```bash
mkdir public
```

Move `index.html` into the `public/` folder:
```bash
mv index.html public/index.html
```

### Step 4: Initialize Git
```bash
git init
git add .
git commit -m "Initial commit - LRD app"
```

### Step 5: Create Heroku App
```bash
heroku login
# Opens browser to log in
# Return to terminal when done

heroku create your-app-name
# Replace 'your-app-name' with something unique
# Example: lrd-soccer-league
# This will be your public URL
```

### Step 6: Set Environment Variables
```bash
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set PORT=3001
heroku config:set NODE_ENV=production
heroku config:set APP_URL=https://your-app-name.herokuapp.com
```

### Step 7: Configure Email (Optional but Recommended)
If using Gmail:
```bash
heroku config:set SMTP_HOST=smtp.gmail.com
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=your-email@gmail.com
heroku config:set SMTP_PASS=your-app-password
```

If using SendGrid:
```bash
heroku config:set SMTP_HOST=smtp.sendgrid.net
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=apikey
heroku config:set SMTP_PASS=SG.your-api-key
```

### Step 8: Deploy
```bash
git push heroku main
# Or: git push heroku master
# (depending on your default branch name)
```

### Step 9: View Your App
```bash
heroku open
# Opens your app in browser
```

**That's it! Your app is now live!** 🎉

---

## 📝 Detailed Setup (Step-by-Step)

### 1. Prerequisites Installation

#### Install Heroku CLI
**Windows:**
- Download: https://cli-assets.heroku.com/heroku-x64.exe
- Run installer
- Restart terminal/PowerShell

**Mac:**
```bash
brew tap heroku/brew && brew install heroku
```

**Linux:**
```bash
sudo snap install --classic heroku
```

Verify installation:
```bash
heroku --version
# Output: heroku/7.x.x
```

#### Install Git
**Windows:**
- Download from: https://git-scm.com/download/win
- Run installer

**Mac:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt-get install git
```

Verify:
```bash
git --version
# Output: git version 2.x.x
```

### 2. Create Heroku Account

1. Go to https://www.heroku.com/
2. Click "Sign Up"
3. Fill in form
4. Verify email
5. Create password
6. Done!

### 3. Prepare Local Files

Create folder structure:
```
lrd-app/
├── server.js
├── package.json
├── public/
│   └── index.html
├── .env
├── vercel.json
└── Procfile
```

#### Step 3a: Create Project Folder
```bash
mkdir lrd-app
cd lrd-app
```

#### Step 3b: Copy Files from /outputs/
Copy these files into `lrd-app/`:
- `server.js`
- `package.json`
- `.env.example` (rename to `.env`)
- `vercel.json`
- `Procfile`

#### Step 3c: Create public/ Folder
```bash
mkdir public
```

Move `index.html` into public/:
```bash
cp index.html public/index.html
```

Or on Windows:
```
Move index.html public\index.html
```

#### Step 3d: Create .env File
Create `.env` file with:
```env
JWT_SECRET=your-secret-here-32-chars
PORT=3001
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**IMPORTANT:** Don't commit `.env` to Git!

#### Step 3e: Create .gitignore
Create `.gitignore` file with:
```
node_modules/
.env
league.db
uploads/
*.log
```

### 4. Initialize Git Repository

```bash
cd lrd-app
git init
git config user.name "Your Name"
git config user.email "your@email.com"
git add .
git commit -m "Initial commit - LRD sports league app"
```

### 5. Login to Heroku

```bash
heroku login
```

This opens a browser window. Log in with your Heroku credentials. Return to terminal when done.

Verify login:
```bash
heroku auth:whoami
# Should show your email
```

### 6. Create Heroku App

```bash
heroku create lrd-soccer
```

Replace `lrd-soccer` with your app name (must be unique).

**Output:**
```
Creating ⬢ lrd-soccer... done
https://lrd-soccer.herokuapp.com/ | https://git.heroku.com/lrd-soccer.git
```

**Your public URL**: `https://lrd-soccer.herokuapp.com/`

### 7. Set Environment Variables

These are required for your app to work:

```bash
# Generate a random JWT secret
heroku config:set JWT_SECRET=$(openssl rand -base64 32)

# Basic configuration
heroku config:set PORT=3001
heroku config:set NODE_ENV=production
heroku config:set APP_URL=https://lrd-soccer.herokuapp.com
```

Verify variables set:
```bash
heroku config
```

### 8. Configure Email (Recommended)

**If using Gmail:**
1. Go to https://myaccount.google.com/apppasswords
2. Create an "App password" for Mail
3. Copy the password (without spaces)

```bash
heroku config:set SMTP_HOST=smtp.gmail.com
heroku config:set SMTP_PORT=587
heroku config:set SMTP_SECURE=false
heroku config:set SMTP_USER=your-email@gmail.com
heroku config:set SMTP_PASS=your-app-password
```

**If using SendGrid:**
1. Sign up at sendgrid.com (free tier available)
2. Generate API key in settings

```bash
heroku config:set SMTP_HOST=smtp.sendgrid.net
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=apikey
heroku config:set SMTP_PASS=SG.your-api-key-here
```

**If using Mailgun:**
1. Sign up at mailgun.com (free tier available)
2. Get SMTP credentials from settings

```bash
heroku config:set SMTP_HOST=smtp.mailgun.org
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=postmaster@your-domain.mailgun.org
heroku config:set SMTP_PASS=your-mailgun-password
```

### 9. Deploy to Heroku

Push your code to Heroku:
```bash
git push heroku main
```

Or if your branch is called `master`:
```bash
git push heroku master
```

**You'll see output like:**
```
Counting objects: 10, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (8/8), done.
Writing objects: 100% (10/10), 2.34 KiB | 0 bytes/s, done.
Total 10 (delta 0), reused 0 (delta 0)

remote: Compressing source files... done.
remote: Building source...
remote: -----> Node.js app detected
remote: -----> Installing dependencies
remote: -----> Caching build
remote: -----> Build succeeded! 
remote: -----> Releasing v1
remote: -----> Deploying to Dyno

https://lrd-soccer.herokuapp.com/ deployed to Heroku
```

### 10: Open Your App

```bash
heroku open
```

This opens your app in your default browser!

**URL**: `https://lrd-soccer.herokuapp.com`

---

## 🔗 After Deployment

### Share Your URL
Send this link to your league:
```
https://lrd-soccer.herokuapp.com
```

### Create First Admin
1. Sign up as player
2. In Heroku terminal, promote to admin:
```bash
heroku run "sqlite3 league.db \"UPDATE users SET role='admin' WHERE email='your@email.com'\""
```

Or access Heroku dashboard:
1. Go to https://dashboard.heroku.com
2. Click your app
3. Click "More" → "Run console"
4. Type: `node -e "require('./server.js')"`
5. Then in separate command: `sqlite3 league.db "UPDATE users SET role='admin' WHERE email='your@email.com'"`

### View Logs
```bash
heroku logs --tail
```

This shows real-time logs from your app.

### Check App Status
```bash
heroku status
```

### Restart App
```bash
heroku restart
```

---

## 📊 Monitoring & Maintenance

### View App Health
```bash
heroku dyno:type
```

Shows your current dyno type (free, eco, professional).

### Check Database Size
```bash
heroku run "sqlite3 league.db '.tables'"
```

### View All Config Variables
```bash
heroku config
```

### Update a Config Variable
```bash
heroku config:set SMTP_USER=newemail@gmail.com
```

### Remove a Config Variable
```bash
heroku config:unset SMTP_USER
```

### Backup Database
```bash
heroku run "sqlite3 league.db .dump" > backup.sql
```

---

## 🐛 Troubleshooting

### App Won't Start

**Check logs:**
```bash
heroku logs --tail
```

**Common issues:**
- Missing dependencies: Run `npm install` locally, commit, and push
- Environment variables: Check with `heroku config`
- Port configuration: Should be `PORT=3001`

### "Cannot find module" Error

```bash
# Rebuild
heroku restart

# Or redeploy
git push heroku main
```

### Database Issues

```bash
# Check database exists
heroku run "ls -la *.db"

# Reset database (WARNING: loses all data)
heroku run "rm league.db"

# Then restart
heroku restart
```

### Email Not Sending

```bash
# Check SMTP config
heroku config | grep SMTP

# Test email
heroku run "node -e "console.log(process.env.SMTP_USER)""
```

**Common fixes:**
- Gmail: Verify "Less Secure Apps" is enabled
- App Password: Use correct password from Google
- SendGrid: Verify API key is correct
- Check logs: `heroku logs --tail`

### App Won't Deploy

**Make sure you have:**
1. `package.json` - dependency list
2. `Procfile` - startup command
3. `.git` folder - Git initialized
4. No `.env` committed to Git

**Try:**
```bash
git status
# Should not show .env

git add .
git commit -m "Fix deployment"
git push heroku main
```

### Dyno Sleeping (Free Tier)

Free tier apps sleep after 30 mins of inactivity.

**Solutions:**
1. Send request to wake it: Open browser, wait a few seconds
2. Upgrade to paid dyno: `heroku dyno:type eco`

---

## 💰 Heroku Pricing

### Free Tier
- ✅ Limited free dyno hours per month
- ✅ Apps sleep after 30 mins inactivity
- ✅ Good for testing

**Upgrade to Eco**:
```bash
heroku dyno:type eco
```

- $5/month
- Always running
- Shared resources
- Good for small leagues

**Upgrade to Standard**:
- $10-50/month
- Dedicated resources
- Better performance
- Recommended for 50+ players

---

## 🔒 Security Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure SMTP with real credentials
- [ ] Add .env to .gitignore
- [ ] Never commit sensitive data
- [ ] Use HTTPS (automatic on Heroku)
- [ ] Enable force HTTPS in app

---

## 📱 Custom Domain (Optional)

To use your own domain:

```bash
heroku domains:add www.myleague.com
heroku domains:add myleague.com
```

Then add DNS records with your domain provider pointing to Heroku.

See: https://devcenter.heroku.com/articles/custom-domains

---

## 🚀 Deployment Checklist

Before deploying:
- [ ] Git initialized
- [ ] All files committed
- [ ] No `.env` in git (in .gitignore)
- [ ] Heroku CLI installed and logged in
- [ ] App created with `heroku create`
- [ ] Config variables set
- [ ] Email service configured
- [ ] Procfile present
- [ ] package.json has all dependencies

After deploying:
- [ ] App opens without errors
- [ ] Can sign up and log in
- [ ] Can upload photo
- [ ] Email notifications work (check logs)
- [ ] Games can be created
- [ ] Availability can be marked
- [ ] Admin dashboard works

---

## 📞 Getting Help

**Heroku Documentation**: https://devcenter.heroku.com
**Heroku Status**: https://status.heroku.com
**Heroku Support**: https://help.heroku.com

**LRD Issues**:
1. Check logs: `heroku logs --tail`
2. Verify config: `heroku config`
3. Test locally: `npm start`
4. Check documentation in project files

---

## 📊 Example Deployment Summary

```
Project: LRD Soccer League
Deployment: Heroku
App Name: lrd-soccer
Public URL: https://lrd-soccer.herokuapp.com
Database: SQLite (league.db)
Email: Gmail SMTP
Status: ✅ Live
Cost: Free (or $5+ for paid tier)
```

---

**Your LRD app is now live on Heroku! 🎉**

Share the public URL with your league and start managing games!

---

## Quick Reference Commands

```bash
# Login
heroku login

# Create app
heroku create app-name

# Set config
heroku config:set KEY=value

# Deploy
git push heroku main

# View logs
heroku logs --tail

# Open app
heroku open

# Restart
heroku restart

# List all apps
heroku apps

# Check status
heroku status

# View config
heroku config

# Run command
heroku run "command here"
```

---

**Version**: 1.0.0
**Last Updated**: 2024
**Status**: ✅ Ready for Deployment
