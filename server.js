const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
const db = new Database('coupling.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    university TEXT NOT NULL,
    user_type TEXT NOT NULL,
    bio TEXT,
    skills TEXT,
    equity_offer TEXT,
    project_idea TEXT,
    timeline TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    matched_user_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (matched_user_id) REFERENCES users(id),
    UNIQUE(user_id, matched_user_id)
  );

  CREATE TABLE IF NOT EXISTS swipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    swiper_id INTEGER NOT NULL,
    swiped_id INTEGER NOT NULL,
    direction TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (swiper_id) REFERENCES users(id),
    FOREIGN KEY (swiped_id) REFERENCES users(id),
    UNIQUE(swiper_id, swiped_id)
  );
`);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'coupling-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Auth middleware
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, name, country, university, userType, bio, skills, equityOffer, projectIdea, timeline } = req.body;

    if (!email || !password || !name || !country || !university || !userType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare(`
      INSERT INTO users (email, password, name, country, university, user_type, bio, skills, equity_offer, project_idea, timeline)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(email, hashedPassword, name, country, university, userType, bio || '', skills || '', equityOffer || '', projectIdea || '', timeline || '');

    req.session.userId = result.lastInsertRowid;
    res.json({ success: true, userId: result.lastInsertRowid });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    res.json({ success: true, userId: user.id });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/signout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/api/me', requireAuth, (req, res) => {
  const stmt = db.prepare('SELECT id, email, name, country, university, user_type, bio, skills, equity_offer, project_idea, timeline FROM users WHERE id = ?');
  const user = stmt.get(req.session.userId);
  res.json(user);
});

app.get('/api/potential-matches', requireAuth, (req, res) => {
  try {
    const userId = req.session.userId;

    // Get user's type
    const userStmt = db.prepare('SELECT user_type FROM users WHERE id = ?');
    const currentUser = userStmt.get(userId);

    // Get users already swiped on
    const swipedStmt = db.prepare('SELECT swiped_id FROM swipes WHERE swiper_id = ?');
    const swipedUsers = swipedStmt.all(userId).map(s => s.swiped_id);

    // Get potential matches (opposite user type, not already swiped)
    const oppositeType = currentUser.user_type === 'technical' ? 'non-technical' : 'technical';

    let query = `
      SELECT id, name, country, university, user_type, bio, skills, equity_offer, project_idea, timeline
      FROM users
      WHERE user_type = ? AND id != ?
    `;

    if (swipedUsers.length > 0) {
      query += ` AND id NOT IN (${swipedUsers.join(',')})`;
    }

    query += ' ORDER BY RANDOM() LIMIT 10';

    const stmt = db.prepare(query);
    const matches = stmt.all(oppositeType, userId);

    res.json(matches);
  } catch (error) {
    console.error('Error fetching potential matches:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/swipe', requireAuth, (req, res) => {
  try {
    const { swipedUserId, direction } = req.body;
    const swiperId = req.session.userId;

    // Record the swipe
    const swipeStmt = db.prepare('INSERT INTO swipes (swiper_id, swiped_id, direction) VALUES (?, ?, ?)');
    swipeStmt.run(swiperId, swipedUserId, direction);

    // Check if it's a match (both users swiped right on each other)
    if (direction === 'right') {
      const matchCheckStmt = db.prepare('SELECT * FROM swipes WHERE swiper_id = ? AND swiped_id = ? AND direction = "right"');
      const reciprocalSwipe = matchCheckStmt.get(swipedUserId, swiperId);

      if (reciprocalSwipe) {
        // Create a match!
        const matchStmt = db.prepare('INSERT OR IGNORE INTO matches (user_id, matched_user_id, status) VALUES (?, ?, "matched")');
        matchStmt.run(swiperId, swipedUserId);
        matchStmt.run(swipedUserId, swiperId);

        return res.json({ success: true, match: true });
      }
    }

    res.json({ success: true, match: false });
  } catch (error) {
    console.error('Swipe error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/matches', requireAuth, (req, res) => {
  try {
    const userId = req.session.userId;

    const stmt = db.prepare(`
      SELECT u.id, u.name, u.email, u.country, u.university, u.user_type, u.bio, u.skills, u.equity_offer, u.project_idea, u.timeline
      FROM matches m
      JOIN users u ON m.matched_user_id = u.id
      WHERE m.user_id = ? AND m.status = 'matched'
      ORDER BY m.created_at DESC
    `);

    const matches = stmt.all(userId);
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signin.html'));
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

app.listen(PORT, () => {
  console.log(`Coupling server running on http://localhost:${PORT}`);
});
