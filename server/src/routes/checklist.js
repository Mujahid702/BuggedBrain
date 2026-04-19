const express = require('express');
const router = express.Router();
const { db } = require('../db/db');
const { auth } = require('../middleware/auth');

// GET /api/checklist/:driveId - Fetch user's progress for a drive
router.get('/:driveId', auth, (req, res) => {
  try {
    const progress = db.prepare('SELECT item_index, is_checked FROM checklist_progress WHERE user_id = ? AND drive_id = ?')
                      .all(req.user.id, req.params.driveId);
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch checklist progress' });
  }
});

// PATCH /api/checklist/:driveId - Toggle a checklist item
router.patch('/:driveId', auth, (req, res) => {
  const { item_index, is_checked } = req.body;
  const driveId = req.params.driveId;
  const userId = req.user.id;

  try {
    const upsert = db.prepare(`
      INSERT INTO checklist_progress (user_id, drive_id, item_index, is_checked)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, drive_id, item_index) DO UPDATE SET is_checked = excluded.is_checked
    `);
    upsert.run(userId, driveId, item_index, is_checked ? 1 : 0);
    res.json({ message: 'Progress updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

module.exports = router;
