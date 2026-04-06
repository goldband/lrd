# ⚡ Email Notifications - Quick Setup

Get reminders and notifications working in 5 minutes!

---

## 🚀 Step 1: Get Email Credentials

### Option A: Gmail (Recommended - Free)

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click "Security" → "App passwords"
3. Select "Mail" and "Windows Computer"
4. Google generates a 16-character password
5. Copy this password

### Option B: SendGrid (Free tier available)

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Copy the API key

### Option C: Mailgun (Free tier available)

1. Sign up at [mailgun.com](https://www.mailgun.com)
2. Get your SMTP credentials
3. Copy host, user, and password

---

## 📝 Step 2: Configure .env File

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your email credentials:

### Gmail Example:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
APP_URL=http://localhost:3001
```

### SendGrid Example:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.your-api-key-here
APP_URL=http://localhost:3001
```

### Mailgun Example:
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@yourdomain.mailgun.org
SMTP_PASS=your-mailgun-password
APP_URL=http://localhost:3001
```

---

## 🔧 Step 3: Install Dependencies

```bash
npm install
```

New packages added:
- `nodemailer` - Email sending
- `node-cron` - Scheduled tasks

---

## ▶️ Step 4: Start Server

```bash
npm start
```

Check for this message:
```
✓ Email service ready for notifications
```

If you see:
```
⚠️ Email not configured properly. Notifications disabled.
```

Check your `.env` file credentials.

---

## 🧪 Step 5: Test It Works

1. **Player marks themselves available**
   - Go to "Your Profile"
   - Click "✓ Available"
   - Check admin notifications (bell icon)

2. **Admins see new player**
   - Go to "Admin Control"
   - Click "Available Players" tab
   - Should see the player listed

3. **Player updates game RSVP**
   - Mark yourself as "Playing" for a game
   - Check admin notifications again
   - Should get real-time update

---

## ⏰ Scheduled Reminders

### Thursday at 6 PM:
- Inactive players get: "Mark yourself available!" emails
- Active players get: "Weekend games summary" emails

### To Test Reminders:

**Option 1: Wait until Thursday 6 PM**
(Not practical for testing)

**Option 2: Change schedule to daily**
Edit `server.js`:
```javascript
// Change this line:
cron.schedule('0 18 * * 4', () => {

// To this (tests at 6 PM every day):
cron.schedule('0 18 * * *', () => {
```

Then restart server and test at 6 PM any day.

**Option 3: Change to different time**
Test at 6:05 PM:
```javascript
cron.schedule('5 18 * * *', () => {
```

---

## 📧 What Players See

### Email 1: Thursday Reminder (6 PM)

**If Inactive:**
```
Subject: ⚽ We Need You This Weekend!

Hey [Player Name]!

You haven't marked yourself as available to play yet.

Mark yourself as AVAILABLE so we can include you in 
this weekend's games!

[Mark Yourself Available Now Button]
```

**If Active:**
```
Subject: ⚽ Weekend Games - You're Active!

Games This Weekend:
- Saturday, Apr 5 at 3:00 PM (12 confirmed)
- Sunday, Apr 6 at 10:00 AM (8 confirmed)

You're marked as AVAILABLE to play.

[View All Games & Mark Your Availability Button]
```

### Email 2: Real-Time (When player updates status)

Only admins get these. Shows:
```
Subject: Availability Update: [Player Name]

[Player Name] has marked themselves as "Playing" for 
the game on Apr 5 at 3:00 PM

[View Game Details Button]
```

---

## 🔔 In-App Notifications

### Notification Bell
- Located in top-right corner
- Red badge shows unread count
- Click to expand and view

### Types of Notifications
1. **Player Available** - When a player marks themselves available
2. **Availability Change** - When a player updates RSVP
3. **Activation Reminder** - Weekly reminders
4. **Weekend Summary** - Upcoming games summary

---

## ✅ Checklist

- [ ] Got email credentials (Gmail app password or SendGrid/Mailgun key)
- [ ] Created `.env` file from `.env.example`
- [ ] Filled in SMTP credentials
- [ ] Set APP_URL correctly
- [ ] Ran `npm install`
- [ ] Started server with `npm start`
- [ ] See "✓ Email service ready" message
- [ ] Player marked themselves available
- [ ] Admin can see them in "Available Players" tab
- [ ] Admin received notification

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Email not configured" error | Check `.env` file syntax and credentials |
| Emails send but don't arrive | Check spam folder, verify sender address |
| Gmail app password not working | Must use 16-char app password, not regular password |
| Cron job not running | Server must stay running; may sleep on free Heroku tier |
| Wrong email sender | SMTP_USER should be valid email address |
| Emails have broken links | Set APP_URL to your public domain |

---

## 📊 Monitoring

### View Server Logs
```bash
# Watch for these messages:
# ✓ Email sent to: player@example.com
# 🔔 Running scheduled Thursday reminder task
# ✓ Thursday reminders sent successfully
```

### Test Email Manually
Add this endpoint to `server.js` for testing:
```javascript
app.get('/api/test/email', async (req, res) => {
    const html = '<h1>Test Email</h1><p>If you see this, emails work!</p>';
    const sent = await sendEmail('your-email@gmail.com', 'Test', html);
    res.json({ success: sent });
});
```

Then visit: `http://localhost:3001/api/test/email`

---

## 🚀 Deployment Notes

### Vercel
- ✅ Works great
- ✅ Cron jobs run automatically
- ✅ Free tier sufficient for most leagues

### Heroku
- ⚠️ Free tier: Dyno may sleep, cron won't run
- ✅ Paid tier: Full support

### Your Own Server
- ✅ Full control
- ✅ Cron jobs always run
- ✅ Set timezone if needed

---

## 📞 Need Help?

1. **Check NOTIFICATIONS_GUIDE.md** - Comprehensive documentation
2. **Check .env.example** - All configuration options
3. **Check server logs** - See what's happening
4. **Verify email credentials** - Are they correct?
5. **Test from browser** - Use browser console (F12)

---

**Done! Your league now has smart notifications. 🎉**

Players will automatically get reminders, and admins will know exactly who's available to play!
