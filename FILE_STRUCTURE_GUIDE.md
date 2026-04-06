# 📁 LRD File Structure for Heroku Deployment

Here's exactly how to organize your files for Heroku deployment.

---

## Directory Structure

```
lrd-app/
│
├── server.js                 ← Main backend file
├── package.json              ← Dependencies
├── Procfile                  ← Heroku startup command
├── .env                      ← Environment variables (DO NOT COMMIT)
├── .gitignore               ← Git ignore file
│
├── public/                   ← Static files (IMPORTANT!)
│   └── index.html           ← Frontend application
│
├── uploads/                  ← Auto-created for player photos
│   └── (photos go here)
│
├── league.db                ← Auto-created SQLite database
│
├── node_modules/            ← Auto-created by npm
│   └── (dependencies)
│
└── .git/                    ← Auto-created by git init
    └── (git files)
```

---

## Required Files (Copy From /outputs/)

### ✅ MUST COPY

#### 1. server.js
- **Location**: Root directory (lrd-app/)
- **Size**: ~35 KB
- **Purpose**: Main backend server

#### 2. package.json
- **Location**: Root directory (lrd-app/)
- **Size**: ~1 KB
- **Purpose**: Lists all dependencies

#### 3. index.html
- **Location**: `public/index.html` (CREATE public/ folder)
- **Size**: ~63 KB
- **Purpose**: Frontend application

#### 4. Procfile
- **Location**: Root directory (lrd-app/)
- **Size**: ~50 bytes
- **Content**: `web: node server.js`
- **Purpose**: Tells Heroku how to start app

#### 5. .env
- **Location**: Root directory (lrd-app/)
- **Purpose**: Configuration variables
- **⚠️ IMPORTANT**: Add to .gitignore, never commit!

#### 6. .gitignore
- **Location**: Root directory (lrd-app/)
- **Purpose**: Prevents committing sensitive files

---

## File Setup Instructions

### Option A: Automated (Copy-Paste)

**On Windows (PowerShell):**
```powershell
# Create folder structure
mkdir lrd-app
mkdir lrd-app\public
cd lrd-app

# Create files - you'll do this manually below
```

**On Mac/Linux:**
```bash
# Create folder structure
mkdir -p lrd-app/public
cd lrd-app

# Create files - you'll do this manually below
```

### Option B: Manual Setup

#### Step 1: Create Main Folder
```bash
mkdir lrd-app
cd lrd-app
```

#### Step 2: Copy server.js
- Download from /outputs/server.js
- Save to: `lrd-app/server.js`

#### Step 3: Copy package.json
- Download from /outputs/package.json
- Save to: `lrd-app/package.json`

#### Step 4: Create public/ Folder
```bash
mkdir public
```

#### Step 5: Copy index.html to public/
- Download from /outputs/index.html
- Save to: `lrd-app/public/index.html`

#### Step 6: Copy Procfile
- Download from /outputs/Procfile
- Save to: `lrd-app/Procfile`
- Content should be: `web: node server.js`

#### Step 7: Create .env File
Create new file `lrd-app/.env`:

```env
JWT_SECRET=your-secret-key-here-at-least-32-chars
PORT=3001
NODE_ENV=production
APP_URL=https://your-app-name.herokuapp.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### Step 8: Create .gitignore File
Create new file `lrd-app/.gitignore`:

```
# Dependencies
node_modules/
package-lock.json

# Environment
.env
.env.local
.env.*.local

# Database
league.db
*.db
*.sqlite

# Uploads
uploads/
public/uploads/

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Misc
.cache
dist/
build/
```

---

## Directory Structure - Final

```
lrd-app/
│
├── server.js               ← Backend
├── package.json            ← Dependencies
├── Procfile               ← Startup
├── .env                   ← Config (SECRET)
├── .gitignore            ← Ignore list
│
└── public/
    └── index.html        ← Frontend
```

**That's it!** Just 6 files needed.

---

## File Sizes Reference

| File | Size | Required |
|------|------|----------|
| server.js | ~35 KB | ✅ Yes |
| package.json | ~1 KB | ✅ Yes |
| index.html | ~63 KB | ✅ Yes |
| Procfile | ~50 bytes | ✅ Yes |
| .env | ~500 bytes | ✅ Yes |
| .gitignore | ~500 bytes | ✅ Yes |
| **Total** | **~100 KB** | |

---

## What Gets Created Automatically

These folders/files are created automatically - DO NOT manually create:

```
lrd-app/
├── node_modules/          ← Created by: npm install
├── uploads/               ← Created by: app on first photo upload
├── league.db              ← Created by: app on first run
└── .git/                  ← Created by: git init
```

---

## Important Notes

### ⚠️ DO NOT COMMIT
These should NEVER be in Git:
- `.env` (secrets!)
- `node_modules/` (too large)
- `league.db` (not needed in git)
- `uploads/` (user files)
- `*.log` (logs)

### ✅ DO COMMIT
These should be in Git:
- `server.js`
- `package.json`
- `public/index.html`
- `Procfile`
- `.gitignore`

### 🔐 SECURITY
- `JWT_SECRET` in `.env` - Keep private!
- `SMTP_PASS` in `.env` - Keep private!
- Never share `.env` file
- Add `.env` to `.gitignore`

---

## Checking Your Setup

Before deploying, verify your structure:

```bash
# From lrd-app/ folder

# Check files exist
ls -la                    # Linux/Mac
dir                       # Windows

# Should show:
# - server.js
# - package.json
# - Procfile
# - .env
# - .gitignore
# - public/ (folder)
#   - index.html

# Check public folder
ls -la public/            # Linux/Mac
dir public                # Windows

# Should show:
# - index.html

# Check git is ready
git status
# Should show all files ready to commit
```

---

## File Download Links

All files are in `/mnt/user-data/outputs/`:

| File | Link in Outputs |
|------|-----------------|
| server.js | `/outputs/server.js` |
| index.html | `/outputs/index.html` |
| package.json | `/outputs/package.json` |
| Procfile | `/outputs/Procfile` |
| .env.example | `/outputs/.env.example` (copy and rename to .env) |
| .gitignore | `/outputs/.gitignore` (if exists) |

---

## Common Mistakes to Avoid

❌ **WRONG:** Putting index.html in root
```
lrd-app/
├── index.html    ← WRONG!
└── public/
```

✅ **CORRECT:** Putting index.html in public/
```
lrd-app/
├── public/
│   └── index.html    ← CORRECT!
```

---

❌ **WRONG:** Committing .env to Git
```bash
git add .env    ← WRONG! Will leak secrets!
```

✅ **CORRECT:** .env in .gitignore
```bash
# .gitignore contains:
.env            ← CORRECT! Won't be committed
```

---

❌ **WRONG:** Missing Procfile
```
lrd-app/
├── server.js
└── package.json
# Heroku won't know how to start!
```

✅ **CORRECT:** Procfile present
```
lrd-app/
├── server.js
├── package.json
└── Procfile    ← CORRECT! Heroku startup command
```

---

## Quick Checklist

Before deploying to Heroku:

- [ ] `server.js` in root
- [ ] `package.json` in root
- [ ] `Procfile` in root
- [ ] `.env` in root (not in git)
- [ ] `.gitignore` includes `.env`
- [ ] `public/` folder created
- [ ] `index.html` in `public/index.html`
- [ ] Git initialized (`git init`)
- [ ] Files committed (`git commit`)
- [ ] Ready to deploy (`git push heroku main`)

---

## After Deployment

These folders will be auto-created by the app:
- `uploads/` - Where player photos are stored
- `league.db` - SQLite database file
- `node_modules/` - npm dependencies

---

## Next Steps

1. ✅ Organize files as shown
2. ✅ Initialize Git
3. ✅ Create Heroku app
4. ✅ Deploy with `git push heroku main`
5. ✅ Done! App is live!

See `HEROKU_QUICK_DEPLOY.md` for deployment steps.

---

**File Structure Guide**: Complete
**Status**: Ready for Deployment
**Next**: Follow HEROKU_QUICK_DEPLOY.md
