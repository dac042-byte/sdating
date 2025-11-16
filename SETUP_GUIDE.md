# Coupling - Comprehensive Setup & Usage Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Running the Application](#running-the-application)
4. [Using the Application](#using-the-application)
5. [Stopping the Application](#stopping-the-application)
6. [Database Management](#database-management)
7. [Troubleshooting](#troubleshooting)
8. [Development Workflow](#development-workflow)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v16 or higher)
  - Check version: `node --version`
  - Download: https://nodejs.org/

- **npm** (comes with Node.js)
  - Check version: `npm --version`

- **Git** (optional, for version control)
  - Check version: `git --version`

### Verify Installation
```bash
# Check Node.js
node --version
# Should output: v16.x.x or higher

# Check npm
npm --version
# Should output: 8.x.x or higher
```

---

## Initial Setup

### Step 1: Navigate to Project Directory
```bash
cd /home/user/sdating
```

### Step 2: Install Dependencies

**Option A: Install Everything at Once (Recommended)**
```bash
npm run install:all
```

**Option B: Install Separately**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

**What gets installed:**
- Backend: Express, SQLite, bcrypt, JWT, CORS
- Frontend: React, React Router, Vite

### Step 3: Seed the Database

This creates placeholder users for testing:

```bash
node server/seed.js
```

**You should see:**
```
Database initialized successfully
Clearing existing data...
Seeding placeholder users...
✓ Successfully seeded 13 users

You can sign in with any of these accounts:
Email: sarah.chen@mit.edu (or any other email above)
Password: password123

Database seeding complete!
```

---

## Running the Application

### Method 1: Run Both Servers Concurrently (Recommended)

This starts both the backend and frontend servers together:

```bash
npm run dev
```

**You should see:**
```
[0] Database initialized successfully
[0] Server running on port 3001
[1] VITE v5.4.21 ready in 320 ms
[1] ➜ Local: http://localhost:3000/
```

### Method 2: Run Servers Separately

**Terminal 1 - Backend Server:**
```bash
npm run server
```
Output: `Server running on port 3001`

**Terminal 2 - Frontend Server:**
```bash
npm run client
```
Output: `VITE ready - Local: http://localhost:3000/`

### Access the Application

Once running, open your browser:

🌐 **Frontend:** http://localhost:3000
📡 **Backend API:** http://localhost:3001

---

## Using the Application

### First Time User Journey

#### 1. **Access the Application**
- Open browser to http://localhost:3000
- You'll be redirected to the Sign In page

#### 2. **Sign In with Test Account**

**Technical User (Engineer/Developer):**
```
Email: sarah.chen@mit.edu
Password: password123
```

**Non-Technical User (Idea Maker):**
```
Email: david.miller@yale.edu
Password: password123
```

**All available test accounts:**
- sarah.chen@mit.edu
- alex.kumar@stanford.edu
- emma.wilson@harvard.edu
- marcus.johnson@berkeley.edu
- lily.zhang@caltech.edu
- david.miller@yale.edu
- sophia.rodriguez@columbia.edu
- james.anderson@princeton.edu
- olivia.brown@cornell.edu
- ryan.patel@duke.edu
- maya.thompson@uchicago.edu
- ethan.lee@northwestern.edu
- isabella.garcia@upenn.edu

(All passwords: `password123`)

#### 3. **Discover Page (Main Swipe Interface)**

After signing in, you'll see user cards with:
- Profile picture (avatar with initial)
- Name and type (Technical/Idea Maker)
- Country and University
- Bio
- Skills (for technical users)
- Project idea, equity offer, timeline (for non-technical users)

**Actions:**
- ✕ **Swipe Left** - Pass on this user
- ♥ **Swipe Right** - Like this user
- If both users swipe right → **It's a Match!** 🎉

#### 4. **Matches Page**

Click "Matches" button to see:
- All users you've matched with
- Their profiles and badges
- Click any match to start chatting

#### 5. **Chat Functionality**

- Click on a match to open chat
- Type messages in the input box
- Press "Send" to send messages
- Messages update every 3 seconds (polling)
- Click "← Back" to return to matches

#### 6. **Theme Toggle**

Click the ☀️/🌙 button anywhere to switch between:
- 🌙 **Dark Theme** - Purple and dark tones (default)
- ☀️ **Light Theme** - Pink and light tones

### Creating Your Own Account

1. Click "Sign up" on the Sign In page
2. Fill out the form:
   - Full Name
   - Email (use .edu for authenticity)
   - Password (min 6 characters)
   - Confirm Password
   - Country
   - University
   - User Type: Technical or Non-Technical
   - Bio (optional)
   - Additional fields based on type

3. Click "Create Account"
4. You'll be automatically signed in

---

## Stopping the Application

### If Running with `npm run dev`

**Press:** `Ctrl + C` (or `Cmd + C` on Mac)

You'll see:
```
^C[0] npm run server exited with code SIGINT
[1] npm run client exited with code SIGINT
```

### If Running Separate Terminals

Press `Ctrl + C` in each terminal running a server.

### Verify Servers Stopped

```bash
# Check if port 3000 is free
lsof -i :3000

# Check if port 3001 is free
lsof -i :3001

# If ports are still in use, kill the process
kill -9 <PID>
```

---

## Database Management

### Database Location
```
/home/user/sdating/server/coupling.db
```

### Reset Database (Clear All Data)

**Method 1: Re-run Seed Script**
```bash
node server/seed.js
```
This clears ALL data and re-creates the 13 placeholder users.

**Method 2: Delete Database File**
```bash
rm server/coupling.db
node server/seed.js
```

### View Database Contents

**Install SQLite (if needed):**
```bash
# Ubuntu/Debian
sudo apt-get install sqlite3

# macOS
brew install sqlite3
```

**Query the Database:**
```bash
sqlite3 server/coupling.db

# View all users
SELECT id, name, email, user_type FROM users;

# View all matches
SELECT * FROM matches;

# View all messages
SELECT * FROM messages;

# Exit SQLite
.quit
```

### Database Schema

**Tables:**
- `users` - User profiles and authentication
- `swipes` - Record of all swipes (left/right)
- `matches` - Matched user pairs
- `messages` - Chat messages between matches

---

## Troubleshooting

### Issue: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
# Edit client/vite.config.js and change port
```

### Issue: Module Not Found

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
rm -rf client/node_modules
npm run install:all
```

### Issue: Database Locked

**Error:**
```
Error: SQLITE_BUSY: database is locked
```

**Solution:**
```bash
# Stop all running servers
# Delete and recreate database
rm server/coupling.db
node server/seed.js
```

### Issue: Authentication Fails

**Error:** "Invalid credentials" or "Token expired"

**Solution:**
```bash
# Clear browser storage
# Open browser console (F12)
localStorage.clear()
# Refresh page
```

### Issue: Can't See Any Users to Swipe

**Possible Causes:**
1. You've swiped on all users
2. Database is empty

**Solution:**
```bash
# Reset database
node server/seed.js

# Or create new accounts via Sign Up
```

### Issue: Messages Not Updating

**Solution:**
- Messages update every 3 seconds (polling)
- Refresh the page manually
- Check browser console for errors (F12)

---

## Development Workflow

### Project Structure
```
sdating/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   │   ├── SignIn.jsx    # Sign in page
│   │   │   ├── SignUp.jsx    # Sign up page
│   │   │   ├── Main.jsx      # Swipe interface
│   │   │   ├── Matches.jsx   # Matches list
│   │   │   ├── Chat.jsx      # Chat messages
│   │   │   └── Auth.css      # Auth page styles
│   │   ├── App.jsx           # Main app component
│   │   ├── App.css           # App styles
│   │   ├── index.css         # Global styles & themes
│   │   └── main.jsx          # Entry point
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite configuration
│   └── package.json          # Frontend dependencies
│
├── server/                    # Express Backend
│   ├── index.js              # API routes & server
│   ├── database.js           # Database schema
│   ├── auth.js               # Authentication logic
│   ├── seed.js               # Database seeding
│   └── coupling.db           # SQLite database
│
├── package.json              # Root configuration
├── README.md                 # Project overview
└── SETUP_GUIDE.md           # This file
```

### Making Changes

**Frontend Changes:**
- Edit files in `client/src/`
- Changes hot-reload automatically
- Check browser console for errors (F12)

**Backend Changes:**
- Edit files in `server/`
- Restart server: `Ctrl+C` then `npm run dev`
- Check terminal for errors

**Style Changes:**
- Edit CSS files in `client/src/`
- Changes apply immediately
- Theme colors in `client/src/index.css` (CSS variables)

### API Endpoints Reference

**Authentication:**
- `POST /api/signup` - Create account
- `POST /api/signin` - Sign in

**Users:**
- `GET /api/profile` - Get current user
- `GET /api/users/discover` - Get users to swipe on

**Matching:**
- `POST /api/swipe` - Swipe on a user
- `GET /api/matches` - Get all matches

**Messaging:**
- `GET /api/messages/:matchId` - Get messages
- `POST /api/messages` - Send message

### Testing API Endpoints

Using `curl`:

```bash
# Sign in
curl -X POST http://localhost:3001/api/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"sarah.chen@mit.edu","password":"password123"}'

# Get profile (replace TOKEN)
curl http://localhost:3001/api/profile \
  -H "Authorization: Bearer <TOKEN>"

# Discover users (replace TOKEN)
curl http://localhost:3001/api/users/discover \
  -H "Authorization: Bearer <TOKEN>"
```

### Building for Production

```bash
# Build frontend
cd client && npm run build

# Output will be in client/dist/
```

### Git Workflow

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Your message"

# Push to your branch
git push origin claude/coupling-matching-platform-01XUSKE3g6gB9vcsnSQofNpJ
```

---

## Quick Reference Commands

### Daily Usage
```bash
# Start app
npm run dev

# Stop app
Ctrl + C

# Reset database
node server/seed.js
```

### First Time Setup
```bash
npm run install:all
node server/seed.js
npm run dev
```

### Troubleshooting
```bash
# Reinstall everything
rm -rf node_modules client/node_modules
npm run install:all

# Reset database
rm server/coupling.db
node server/seed.js

# Check running processes
lsof -i :3000
lsof -i :3001
```

---

## Support & Resources

### File Locations
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Database**: `/home/user/sdating/server/coupling.db`
- **Logs**: Terminal output

### Key Files
- Main app logic: `client/src/App.jsx`
- API routes: `server/index.js`
- Database schema: `server/database.js`
- Theme styles: `client/src/index.css`

### Common Tasks

**Add new test user:** Edit `server/seed.js` and run it

**Change theme colors:** Edit CSS variables in `client/src/index.css`

**Modify API behavior:** Edit `server/index.js`

**Update UI:** Edit components in `client/src/pages/`

---

## Next Steps

1. ✅ Application is running at http://localhost:3000
2. 🎯 Sign in with test account (sarah.chen@mit.edu / password123)
3. 💬 Start swiping and matching!
4. 🎨 Try the theme toggle
5. 📱 Test the chat functionality
6. 🚀 Create your own account and explore

**Happy Matching! 🎉**
