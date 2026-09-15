const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { upload, deleteFile } = require('../utils/fileHandler');
const path = require('path');

// Upload file
router.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded', code: 'NO_FILE' });
  }

  const { conversationId } = req.body;
  const fileId = uuidv4();
  const now = new Date().toISOString();

  db.run(
    'INSERT INTO files (id, conversation_id, user_id, filename, file_type, file_size, file_path, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [fileId, conversationId, req.user.id, req.file.originalname, req.file.mimetype, req.file.size, req.file.path, now],
    (err) => {
      if (err) {
        deleteFile(req.file.path);
        return res.status(500).json({ success: false, error: 'Database error', code: 'DB_ERROR' });
      }

      res.status(201).json({
        success: true,
        data: {
          id: fileId,
          filename: req.file.originalname,
          file_type: req.file.mimetype,
          file_size: req.file.size,
          created_at: now
        }
      });
    }
  );
});

// Get file info
router.get('/:fileId', authenticateToken, (req, res) => {
  const { fileId } = req.params;

  db.get(
    'SELECT * FROM files WHERE id = ? AND user_id = ?',
    [fileId, req.user.id],
    (err, file) => {
      if (!file) {
        return res.status(404).json({ success: false, error: 'File not found', code: 'NOT_FOUND' });
      }
      res.json({ success: true, data: file });
    }
  );
});

// Delete file
router.delete('/:fileId', authenticateToken, (req, res) => {
  const { fileId } = req.params;

  db.get(
    'SELECT file_path FROM files WHERE id = ? AND user_id = ?',
    [fileId, req.user.id],
    (err, file) => {
      if (!file) {
        return res.status(404).json({ success: false, error: 'File not found', code: 'NOT_FOUND' });
      }

      db.run(
        'DELETE FROM files WHERE id = ?',
        [fileId],
        (err) => {
          if (err) {
            return res.status(500).json({ success: false, error: 'Database error', code: 'DB_ERROR' });
          }
          deleteFile(file.file_path);
          res.json({ success: true, message: 'File deleted' });
        }
      );
    }
  );
});

module.exports = router;
