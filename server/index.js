import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db, { initializeDatabase } from './database.js';
import { authMiddleware, hashPassword, comparePassword, generateToken } from './auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase();

// Auth routes
app.post('/api/signup', (req, res) => {
  try {
    const { email, password, name, country, university, userType, bio, skills, ideaDescription, equityOffer, timeline } = req.body;

    if (!email || !password || !name || !country || !university || !userType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = hashPassword(password);

    const stmt = db.prepare(`
      INSERT INTO users (email, password, name, country, university, user_type, bio, skills, idea_description, equity_offer, timeline)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(email, hashedPassword, name, country, university, userType, bio, skills, ideaDescription, equityOffer, timeline);

    const token = generateToken(result.lastInsertRowid);

    res.json({
      token,
      user: {
        id: result.lastInsertRowid,
        email,
        name,
        country,
        university,
        userType
      }
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/signin', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user || !comparePassword(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        country: user.country,
        university: user.university,
        userType: user.user_type
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected routes
app.get('/api/profile', authMiddleware, (req, res) => {
  const user = db.prepare(`
    SELECT id, email, name, country, university, user_type, bio, skills, idea_description, equity_offer, timeline, avatar_url
    FROM users WHERE id = ?
  `).get(req.user.id);

  res.json(user);
});

app.get('/api/users/discover', authMiddleware, (req, res) => {
  try {
    // Get users that the current user hasn't swiped on yet
    const users = db.prepare(`
      SELECT id, name, country, university, user_type, bio, skills, idea_description, equity_offer, timeline, avatar_url
      FROM users
      WHERE id != ?
      AND id NOT IN (
        SELECT swiped_user_id FROM swipes WHERE user_id = ?
      )
      ORDER BY RANDOM()
      LIMIT 50
    `).all(req.user.id, req.user.id);

    res.json(users);
  } catch (error) {
    console.error('Discover error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/swipe', authMiddleware, (req, res) => {
  try {
    const { swipedUserId, direction } = req.body;

    if (!swipedUserId || !direction) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Record the swipe
    const stmt = db.prepare('INSERT INTO swipes (user_id, swiped_user_id, direction) VALUES (?, ?, ?)');
    stmt.run(req.user.id, swipedUserId, direction);

    // Check if it's a match (both users swiped right on each other)
    let isMatch = false;
    if (direction === 'right') {
      const otherUserSwipe = db.prepare('SELECT * FROM swipes WHERE user_id = ? AND swiped_user_id = ? AND direction = ?')
        .get(swipedUserId, req.user.id, 'right');

      if (otherUserSwipe) {
        // Create a match
        const user1Id = Math.min(req.user.id, swipedUserId);
        const user2Id = Math.max(req.user.id, swipedUserId);

        db.prepare('INSERT OR IGNORE INTO matches (user1_id, user2_id) VALUES (?, ?)').run(user1Id, user2Id);
        isMatch = true;
      }
    }

    res.json({ success: true, isMatch });
  } catch (error) {
    console.error('Swipe error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/matches', authMiddleware, (req, res) => {
  try {
    const matches = db.prepare(`
      SELECT
        m.id as match_id,
        m.created_at,
        u.id, u.name, u.country, u.university, u.user_type, u.bio, u.skills, u.idea_description, u.avatar_url
      FROM matches m
      JOIN users u ON (
        (m.user1_id = ? AND m.user2_id = u.id) OR
        (m.user2_id = ? AND m.user1_id = u.id)
      )
      ORDER BY m.created_at DESC
    `).all(req.user.id, req.user.id);

    res.json(matches);
  } catch (error) {
    console.error('Matches error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/messages/:matchId', authMiddleware, (req, res) => {
  try {
    const { matchId } = req.params;

    // Verify the user is part of this match
    const match = db.prepare('SELECT * FROM matches WHERE id = ? AND (user1_id = ? OR user2_id = ?)')
      .get(matchId, req.user.id, req.user.id);

    if (!match) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const messages = db.prepare(`
      SELECT m.*, u.name as sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.match_id = ?
      ORDER BY m.created_at ASC
    `).all(matchId);

    res.json(messages);
  } catch (error) {
    console.error('Messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/messages', authMiddleware, (req, res) => {
  try {
    const { matchId, message } = req.body;

    if (!matchId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify the user is part of this match
    const match = db.prepare('SELECT * FROM matches WHERE id = ? AND (user1_id = ? OR user2_id = ?)')
      .get(matchId, req.user.id, req.user.id);

    if (!match) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const stmt = db.prepare('INSERT INTO messages (match_id, sender_id, message) VALUES (?, ?, ?)');
    const result = stmt.run(matchId, req.user.id, message);

    const newMessage = db.prepare(`
      SELECT m.*, u.name as sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.id = ?
    `).get(result.lastInsertRowid);

    res.json(newMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
