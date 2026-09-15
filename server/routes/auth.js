const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { db } = require('../config/database');
const { authenticateToken, generateToken } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');
const { validateEmail, validatePassword } = require('../utils/validators');

// Register
router.post('/register', validateRequest(schemas.register), async (req, res) => {
  try {
    const { email, username, password } = req.validatedData;

    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (user) {
        return res.status(400).json({ success: false, error: 'User already exists', code: 'USER_EXISTS' });
      }

      try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        const now = new Date().toISOString();

        db.run(
          'INSERT INTO users (id, email, username, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
          [userId, email, username, hashedPassword, now, now],
          (err) => {
            if (err) {
              return res.status(500).json({ success: false, error: 'Database error', code: 'DB_ERROR' });
            }

            const token = generateToken(userId, email, username);
            res.status(201).json({
              success: true,
              data: { id: userId, email, username },
              token
            });
          }
        );
      } catch (error) {
        res.status(500).json({ success: false, error: error.message, code: 'SERVER_ERROR' });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message, code: 'SERVER_ERROR' });
  }
});

// Login
router.post('/login', validateRequest(schemas.login), (req, res) => {
  try {
    const { email, password } = req.validatedData;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials', code: 'INVALID_CREDS' });
      }

      try {
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
          return res.status(401).json({ success: false, error: 'Invalid credentials', code: 'INVALID_CREDS' });
        }

        const token = generateToken(user.id, user.email, user.username);
        res.json({
          success: true,
          data: { id: user.id, email: user.email, username: user.username },
          token
        });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message, code: 'SERVER_ERROR' });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message, code: 'SERVER_ERROR' });
  }
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  db.get('SELECT id, email, username, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found', code: 'NOT_FOUND' });
    }
    res.json({ success: true, data: user });
  });
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
