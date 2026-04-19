const express = require('express');
const router = express.Router();
const { db } = require('../db/db');
const { auth } = require('../middleware/auth');

// GET /api/bookmarks - Get current user's bookmarks
router.get('/', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const bookmarks = db.prepare(`
      SELECT d.* FROM drives d
      JOIN bookmarks b ON d.id = b.drive_id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `).all(userId);
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// POST /api/bookmarks/:driveId - Add a bookmark
router.post('/:driveId', auth, (req, res) => {
  const userId = req.user.id;
  const driveId = req.params.driveId;

  try {
    // Check if drive exists
    const drive = db.prepare('SELECT id FROM drives WHERE id = ?').get(driveId);
    if (!drive) return res.status(404).json({ error: 'Drive not found' });

    const insert = db.prepare('INSERT OR IGNORE INTO bookmarks (user_id, drive_id) VALUES (?, ?)');
    insert.run(userId, driveId);
    res.status(201).json({ message: 'Bookmark added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add bookmark' });
  }
});

// DELETE /api/bookmarks/:driveId - Remove a bookmark
router.delete('/:driveId', auth, (req, res) => {
  const userId = req.user.id;
  const driveId = req.params.driveId;

  try {
    const result = db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND drive_id = ?').run(userId, driveId);
    if (result.changes === 0) return res.status(404).json({ error: 'Bookmark not found' });
    res.json({ message: 'Bookmark removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove bookmark' });
  }
});

module.exports = router;
