const express = require('express');
const router = express.Router();
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { validateRequest, schemas } = require('../middleware/validation');

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  db.get(
    'SELECT id, email, username, avatar_url, bio, created_at FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found', code: 'NOT_FOUND' });
      }
      res.json({ success: true, data: user });
    }
  );
});

// Update user profile
router.put('/profile', authenticateToken, validateRequest(schemas.updateProfile), (req, res) => {
  const { username, bio, avatar_url } = req.validatedData;
  const now = new Date().toISOString();

  db.run(
    'UPDATE users SET username = ?, bio = ?, avatar_url = ?, updated_at = ? WHERE id = ?',
    [username, bio, avatar_url, now, req.user.id],
    (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Database error', code: 'DB_ERROR' });
      }
      res.json({ success: true, message: 'Profile updated' });
    }
  );
});

// Update user settings
router.put('/settings', authenticateToken, (req, res) => {
  const { theme, notifications_enabled, font_size } = req.body;
  const now = new Date().toISOString();

  db.run(
    'UPDATE users SET theme = ?, notifications_enabled = ?, font_size = ?, updated_at = ? WHERE id = ?',
    [theme, notifications_enabled ? 1 : 0, font_size, now, req.user.id],
    (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Database error', code: 'DB_ERROR' });
      }
      res.json({ success: true, message: 'Settings updated' });
    }
  );
});

// Change password
router.post('/password', authenticateToken, (req, res) => {
  const { current_password, new_password, confirm_password } = req.body;

  if (new_password !== confirm_password) {
    return res.status(400).json({ success: false, error: 'Passwords do not match', code: 'PASSWORD_MISMATCH' });
  }

  db.get('SELECT password_hash FROM users WHERE id = ?', [req.user.id], async (err, user) => {
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found', code: 'NOT_FOUND' });
    }

    try {
      const validPassword = await bcrypt.compare(current_password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ success: false, error: 'Current password is incorrect', code: 'INVALID_PASSWORD' });
      }

      const hashedPassword = await bcrypt.hash(new_password, 10);
      const now = new Date().toISOString();

      db.run(
        'UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?',
        [hashedPassword, now, req.user.id],
        (err) => {
          if (err) {
            return res.status(500).json({ success: false, error: 'Database error', code: 'DB_ERROR' });
          }
          res.json({ success: true, message: 'Password changed successfully' });
        }
      );
    } catch (error) {
      res.status(500).json({ success: false, error: error.message, code: 'SERVER_ERROR' });
    }
  });
});

module.exports = router;
