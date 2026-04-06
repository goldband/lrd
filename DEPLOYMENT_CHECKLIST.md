# 🚀 Deployment Checklist

Complete this checklist before deploying to production.

## Pre-Deployment

- [ ] Read `QUICK_START.md` 
- [ ] Install Node.js (v14+)
- [ ] Run `npm install` locally
- [ ] Test with `npm start` on localhost:3001
- [ ] Create test account and mark availability
- [ ] Test admin features (create game, manage players)

## Security

- [ ] Generate strong JWT_SECRET (min 32 chars)
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Set JWT_SECRET in `.env` file
- [ ] Change NODE_ENV to `production`
- [ ] Review CORS settings for your domain
- [ ] Verify no hardcoded secrets in code
- [ ] Test password validation (min 4 chars)

## Configuration

- [ ] Create `.env` file from `.env.example`
- [ ] Set all required environment variables
- [ ] Update domain in CORS if using custom domain
- [ ] Check database path is writable
- [ ] Verify PORT is not in use

## Database

- [ ] Backup existing `league.db` (if upgrading)
- [ ] Test database connection locally
- [ ] Verify SQLite version compatibility
- [ ] Setup automated backups (for production)
- [ ] Document database schema changes

## Frontend

- [ ] Update API_URL in `index.html` for production
- [ ] Test all form validations
- [ ] Test responsive design on mobile/tablet
- [ ] Verify all links work
- [ ] Test authentication flow (signup/login/logout)
- [ ] Test game creation and availability marking

## Backend

- [ ] Run linter/formatter
- [ ] Test all API endpoints with curl or Postman
- [ ] Verify error handling
- [ ] Check logging in place
- [ ] Test database migrations/initialization
- [ ] Verify response times

## Deployment (Choose One)

### For Vercel
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Connect to Vercel
- [ ] Add environment variables in Vercel dashboard
- [ ] Deploy
- [ ] Test deployed URL
- [ ] Setup custom domain (optional)
- [ ] Configure auto-deployments

### For Heroku
- [ ] Install Heroku CLI
- [ ] Create Heroku account
- [ ] Login: `heroku login`
- [ ] Create app: `heroku create app-name`
- [ ] Set environment variables: `heroku config:set KEY=VALUE`
- [ ] Deploy: `git push heroku main`
- [ ] View logs: `heroku logs --tail`
- [ ] Test app: `heroku open`

### For Custom Server
- [ ] SSH into server
- [ ] Install Node.js
- [ ] Install PM2: `npm install -g pm2`
- [ ] Clone repository
- [ ] Install dependencies: `npm install`
- [ ] Setup `.env` file
- [ ] Start with PM2: `pm2 start server.js`
- [ ] Setup Nginx/Apache reverse proxy
- [ ] Install SSL certificate (Let's Encrypt)
- [ ] Configure firewall
- [ ] Setup automated backups

## Post-Deployment

- [ ] Test login/signup with production URL
- [ ] Verify all API endpoints respond
- [ ] Create test game as admin
- [ ] Test player availability marking
- [ ] Check database is being written to
- [ ] Monitor error logs
- [ ] Verify HTTPS is working (if applicable)
- [ ] Test on multiple browsers
- [ ] Test on mobile device
- [ ] Share public URL with team

## Monitoring

- [ ] Setup error tracking (Sentry, etc.)
- [ ] Setup uptime monitoring (UptimeRobot, etc.)
- [ ] Configure log aggregation
- [ ] Set up performance monitoring
- [ ] Create backup schedule
- [ ] Document recovery procedures

## Documentation

- [ ] Document deployment process
- [ ] Create admin onboarding guide
- [ ] Document API for future developers
- [ ] Create player help guide
- [ ] Document configuration options
- [ ] List known limitations/TODOs

## Performance

- [ ] Test with multiple concurrent users
- [ ] Check database query performance
- [ ] Verify API response times < 500ms
- [ ] Test on slow internet (throttled)
- [ ] Check for memory leaks
- [ ] Monitor disk usage

## Final Checks

- [ ] Code review completed
- [ ] No console errors in browser
- [ ] No errors in server logs
- [ ] All tests passing
- [ ] Backup strategy in place
- [ ] Recovery plan documented
- [ ] Rollback plan ready
- [ ] Team trained on admin dashboard

---

## Deployment Environments

### Development
- Local machine: `npm start`
- Database: `league.db`
- Port: `3001`

### Staging (Optional)
- Test environment before production
- Database: Separate from production
- Monitor before going live

### Production
- Public URL for league
- Database: Regular backups
- SSL/HTTPS: Required
- Monitoring: Active

---

## Rollback Plan

If something goes wrong:

1. **Revert Code**
   ```bash
   git revert <commit-hash>
   git push
   ```

2. **Restore Database**
   ```bash
   cp league.db.backup league.db
   npm start
   ```

3. **Check Logs**
   ```bash
   # Vercel: Check dashboard
   # Heroku: heroku logs --tail
   # Server: Check /var/log/app.log
   ```

4. **Contact Support** if needed

---

## Post-Launch Monitoring

### Daily
- [ ] Check error logs
- [ ] Verify uptime
- [ ] Spot check data integrity

### Weekly
- [ ] Review performance metrics
- [ ] Check database size
- [ ] Verify backup completion

### Monthly
- [ ] Security updates
- [ ] Database maintenance
- [ ] Performance optimization
- [ ] User feedback review

---

## Common Issues During Deployment

| Issue | Solution |
|-------|----------|
| Port already in use | Use different PORT, or kill process |
| Database locked | Delete league.db, restart |
| JWT token invalid | Clear localStorage, re-login |
| CORS errors | Check CORS origin in server.js |
| Environment vars missing | Create .env file with required vars |
| Module not found | Run `npm install` |
| Permission denied | Check file permissions on server |

---

## Support Contacts

- **Vercel Support**: vercel.com/support
- **Heroku Support**: heroku.com/help
- **GitHub Issues**: github.com/your-repo/issues
- **Node.js Docs**: nodejs.org/docs

---

**Deployment Checklist Version**: 1.0
**Last Updated**: 2024
**Status**: Ready for Production

✅ **All items checked? Ready to deploy!**
