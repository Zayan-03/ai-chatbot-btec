const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');

// List conversations
router.get('/', authenticateToken, (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = parseInt(req.query.offset) || 0;

  db.all(
    'SELECT * FROM conversations WHERE user_id = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?',
    [req.user.id, limit, offset],
    (err, conversations) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Database error', code: 'DB_ERROR' });
      }

      db.get(
        'SELECT COUNT(*) as count FROM conversations WHERE user_id = ?',
        [req.user.id],
        (err, result) => {
          res.json({
            success: true,
            data: conversations || [],
            total: result?.count || 0
          });
        }
      );
    }
  );
});

// Create conversation
router.post('/', authenticateToken, validateRequest(schemas.createConversation), (req, res) => {
  const { title, description } = req.validatedData;
  const conversationId = uuidv4();
  const now = new Date().toISOString();

  db.run(
    'INSERT INTO conversations (id, user_id, title, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [conversationId, req.user.id, title, description || null, now, now],
    (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Database error', code: 'DB_ERROR' });
      }
      res.status(201).json({
        success: true,
        data: { id: conversationId, user_id: req.user.id, title, description, created_at: now }
      });
    }
  );
});

// Get conversation
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.get(
    'SELECT * FROM conversations WHERE id = ? AND user_id = ?',
    [id, req.user.id],
    (err, conversation) => {
      if (!conversation) {
        return res.status(404).json({ success: false, error: 'Conversation not found', code: 'NOT_FOUND' });
      }

      db.all(
        'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
        [id],
        (err, messages) => {
          res.json({
            success: true,
            data: { ...conversation, messages }
          });
        }
      );
    }
  );
});

// Update conversation
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description, is_pinned, is_archived } = req.body;
  const now = new Date().toISOString();

  db.run(
    'UPDATE conversations SET title = ?, description = ?, is_pinned = ?, is_archived = ?, updated_at = ? WHERE id = ? AND user_id = ?',
    [title, description, is_pinned ? 1 : 0, is_archived ? 1 : 0, now, id, req.user.id],
    function(err) {
      if (this.changes === 0) {
        return res.status(404).json({ success: false, error: 'Conversation not found', code: 'NOT_FOUND' });
      }
      res.json({ success: true, message: 'Conversation updated' });
    }
  );
});

// Delete conversation
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run(
    'DELETE FROM conversations WHERE id = ? AND user_id = ?',
    [id, req.user.id],
    function(err) {
      if (this.changes === 0) {
        return res.status(404).json({ success: false, error: 'Conversation not found', code: 'NOT_FOUND' });
      }
      res.json({ success: true, message: 'Conversation deleted' });
    }
  );
});

module.exports = router;
