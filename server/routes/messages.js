const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const aiService = require('../utils/aiService');
const { validateRequest, schemas } = require('../middleware/validation');

// Send message and get AI response (streaming)
router.post('/:conversationId/send', authenticateToken, validateRequest(schemas.sendMessage), (req, res) => {
  const { conversationId } = req.params;
  const { content } = req.validatedData;

  // Verify conversation exists and belongs to user
  db.get(
    'SELECT * FROM conversations WHERE id = ? AND user_id = ?',
    [conversationId, req.user.id],
    (err, conversation) => {
      if (!conversation) {
        return res.status(404).json({ success: false, error: 'Conversation not found', code: 'NOT_FOUND' });
      }

      // Save user message
      const userMessageId = uuidv4();
      const now = new Date().toISOString();

      db.run(
        'INSERT INTO messages (id, conversation_id, user_id, content, role, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userMessageId, conversationId, req.user.id, content, 'user', now],
        async (err) => {
          if (err) {
            return res.status(500).json({ success: false, error: 'Database error', code: 'DB_ERROR' });
          }

          try {
            // Get conversation history
            db.all(
              'SELECT content, role FROM messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT 10',
              [conversationId],
              async (err, messages) => {
                if (err) {
                  return res.status(500).json({ success: false, error: 'Database error', code: 'DB_ERROR' });
                }

                // Get AI response
                const aiResponse = await aiService.getResponse(content, aiService.formatConversationHistory(messages || []));

                // Save AI message
                const aiMessageId = uuidv4();
                db.run(
                  'INSERT INTO messages (id, conversation_id, user_id, content, role, created_at) VALUES (?, ?, ?, ?, ?, ?)',
                  [aiMessageId, conversationId, 'system', aiResponse, 'assistant', new Date().toISOString()],
                  (err) => {
                    if (err) {
                      return res.status(500).json({ success: false, error: 'Failed to save response', code: 'DB_ERROR' });
                    }

                    res.json({
                      success: true,
                      data: {
                        userMessage: { id: userMessageId, content, role: 'user' },
                        aiMessage: { id: aiMessageId, content: aiResponse, role: 'assistant' }
                      }
                    });
                  }
                );
              }
            );
          } catch (error) {
            console.error('AI error:', error);
            res.status(500).json({ success: false, error: error.message, code: 'AI_ERROR' });
          }
        }
      );
    }
  );
});

// Get messages in conversation
router.get('/:conversationId', authenticateToken, (req, res) => {
  const { conversationId } = req.params;
  const limit = Math.min(parseInt(req.query.limit) || 50, 100);
  const offset = parseInt(req.query.offset) || 0;

  db.get(
    'SELECT * FROM conversations WHERE id = ? AND user_id = ?',
    [conversationId, req.user.id],
    (err, conversation) => {
      if (!conversation) {
        return res.status(404).json({ success: false, error: 'Conversation not found', code: 'NOT_FOUND' });
      }

      db.all(
        'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [conversationId, limit, offset],
        (err, messages) => {
          if (err) {
            return res.status(500).json({ success: false, error: 'Database error', code: 'DB_ERROR' });
          }
          res.json({ success: true, data: messages || [] });
        }
      );
    }
  );
});

// Edit message
router.put('/:messageId', authenticateToken, (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;
  const now = new Date().toISOString();

  db.run(
    'UPDATE messages SET content = ?, edited_at = ? WHERE id = ? AND user_id = ?',
    [content, now, messageId, req.user.id],
    function(err) {
      if (this.changes === 0) {
        return res.status(404).json({ success: false, error: 'Message not found', code: 'NOT_FOUND' });
      }
      res.json({ success: true, message: 'Message updated' });
    }
  );
});

// Delete message
router.delete('/:messageId', authenticateToken, (req, res) => {
  const { messageId } = req.params;

  db.run(
    'DELETE FROM messages WHERE id = ? AND user_id = ?',
    [messageId, req.user.id],
    function(err) {
      if (this.changes === 0) {
        return res.status(404).json({ success: false, error: 'Message not found', code: 'NOT_FOUND' });
      }
      res.json({ success: true, message: 'Message deleted' });
    }
  );
});

module.exports = router;
