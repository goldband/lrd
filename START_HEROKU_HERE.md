# 🚀 START HERE - Heroku Deployment for LRD

**Welcome!** Your LRD app is ready to deploy. Follow these simple steps.

---

## ⚡ 10-Minute Deployment Path

If you want to deploy in 10 minutes, follow this order:

1. **READ** → `HEROKU_QUICK_DEPLOY.md` (5 min read + 5 min to execute)
2. **THEN** → `FILE_STRUCTURE_GUIDE.md` (if you need help organizing files)
3. **THEN** → Deploy and you're done!

---

## 📚 Complete Documentation Path

If you want detailed instructions:

1. **HEROKU_DEPLOYMENT_SUMMARY.txt** ← Start here (visual overview)
2. **FILE_STRUCTURE_GUIDE.md** ← How to organize your files
3. **HEROKU_QUICK_DEPLOY.md** ← Fast deployment checklist
4. **HEROKU_DEPLOYMENT_GUIDE.md** ← Detailed step-by-step walkthrough

---

## 🎯 Which Guide Should I Read?

### "I just want to deploy quickly" 
→ Read: **HEROKU_QUICK_DEPLOY.md** (10 minutes total)

### "I want detailed instructions"
→ Read: **HEROKU_DEPLOYMENT_GUIDE.md** (30 minutes, very detailed)

### "I'm confused about file organization"
→ Read: **FILE_STRUCTURE_GUIDE.md** (explains folder structure)

### "I want a visual overview first"
→ Read: **HEROKU_DEPLOYMENT_SUMMARY.txt** (2 min overview)

---

## ✅ Quick Checklist

Before you start, make sure you have:

- [ ] Heroku account (free at heroku.com)
- [ ] Heroku CLI installed
- [ ] Git installed
- [ ] All LRD files from `/outputs/`
- [ ] Gmail account (for email notifications)

---

## 🚀 Quick Start (Copy-Paste Commands)

If you want to just run commands:

```bash
# 1. Create folder
mkdir lrd-app
cd lrd-app
mkdir public

# 2. Copy files from /outputs/
# - server.js → lrd-app/
# - package.json → lrd-app/
# - index.html → lrd-app/public/
# - Procfile → lrd-app/

# 3. Create .env file with your config (see HEROKU_QUICK_DEPLOY.md)

# 4. Initialize Git
git init
git add .
git commit -m "Initial commit"

# 5. Login to Heroku
heroku login

# 6. Create app
heroku create your-app-name

# 7. Set config
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set PORT=3001
heroku config:set NODE_ENV=production
heroku config:set APP_URL=https://your-app-name.herokuapp.com
heroku config:set SMTP_HOST=smtp.gmail.com
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=your-email@gmail.com
heroku config:set SMTP_PASS=your-app-password

# 8. Deploy
git push heroku main

# 9. Open app
heroku open
```

---

## 📁 File Structure You Need

```
lrd-app/
├── server.js               ← From /outputs/
├── package.json            ← From /outputs/
├── Procfile               ← From /outputs/
├── .env                   ← Create this
├── .gitignore            ← Create this
│
└── public/                ← Create folder
    └── index.html        ← From /outputs/
```

**That's all you need!**

---

## 📝 Files to Create

### .env (Configuration)
```env
JWT_SECRET=your-secret
PORT=3001
NODE_ENV=production
APP_URL=https://your-app-name.herokuapp.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### .gitignore (Prevent committing secrets)
```
.env
node_modules/
league.db
uploads/
*.log
```

---

## 🎯 Key Points

✅ **10 minutes** - That's how long deployment takes
✅ **Free** - No cost to deploy (optional $5/month upgrade)
✅ **Easy** - Just copy files and run commands
✅ **Live immediately** - Your public URL works right away
✅ **Notifications work automatically** - Scheduled tasks included

---

## 📊 After Deployment

Your app will be at:
```
https://your-app-name.herokuapp.com
```

Then:
1. Share URL with your league
2. Players sign up
3. Create games
4. Players mark availability
5. Get automatic notifications!

---

## 🆘 Need Help?

| Question | Answer |
|----------|--------|
| How do I organize files? | Read: `FILE_STRUCTURE_GUIDE.md` |
| What's the quick way? | Read: `HEROKU_QUICK_DEPLOY.md` |
| I need all details | Read: `HEROKU_DEPLOYMENT_GUIDE.md` |
| Something broke | Check logs: `heroku logs --tail` |
| Gmail won't send emails | Check: `HEROKU_DEPLOYMENT_GUIDE.md` → Troubleshooting |

---

## 🎓 Learning Path

**For beginners:**
```
1. HEROKU_DEPLOYMENT_SUMMARY.txt (understand what's happening)
2. FILE_STRUCTURE_GUIDE.md (organize your files)
3. HEROKU_QUICK_DEPLOY.md (follow checklist)
4. Deploy!
```

**For experienced developers:**
```
1. HEROKU_QUICK_DEPLOY.md (checklist)
2. Deploy!
```

---

## 🔐 Important Security Notes

⚠️ **Never commit .env file!** It has secrets!

✅ Make sure `.env` is in `.gitignore`

✅ `JWT_SECRET` should be random (Heroku generates it)

✅ `SMTP_PASS` should be Gmail app password, not regular password

---

## 💡 Common Questions

**Q: Do I need to understand Node.js?**
A: No! Just follow the steps.

**Q: Will my data be safe?**
A: Yes! SQLite database is auto-backed up with Heroku.

**Q: Can I use a custom domain?**
A: Yes! See `HEROKU_DEPLOYMENT_GUIDE.md` → "Custom Domain"

**Q: How much does it cost?**
A: Free tier is fine. Optional upgrade is $5/month for always-on.

**Q: Can I update the app later?**
A: Yes! Just modify files and `git push heroku main`

---

## 📞 Support Resources

- Heroku Docs: https://devcenter.heroku.com
- Heroku Status: https://status.heroku.com
- LRD API Docs: See `API_REFERENCE.md`
- LRD Features: See `FEATURES.md`

---

## 🎬 Next Steps

1. **Choose your path** (quick vs detailed)
2. **Read the appropriate guide**
3. **Organize your files**
4. **Run the deployment commands**
5. **Share your public URL** with your league
6. **Done!** 🎉

---

## 📋 Document Quick Links

| Document | Purpose | Time |
|----------|---------|------|
| HEROKU_DEPLOYMENT_SUMMARY.txt | Overview | 2 min |
| FILE_STRUCTURE_GUIDE.md | File organization | 10 min |
| HEROKU_QUICK_DEPLOY.md | Fast deployment | 5-10 min |
| HEROKU_DEPLOYMENT_GUIDE.md | Detailed walkthrough | 30 min |
| HEROKU_DEPLOYMENT_GUIDE.md#troubleshooting | Problem solving | As needed |

---

## 🚀 Ready?

Pick your guide and get started! Your LRD app will be live in 10-30 minutes.

**Recommended:** Start with `HEROKU_QUICK_DEPLOY.md` → 10 minutes to live app!

---

**Status**: ✅ Ready to Deploy
**Time**: 10-30 minutes
**Difficulty**: Easy
**Cost**: Free (optional upgrade)

Let's go! ⚽🚀
