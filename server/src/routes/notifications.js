const express = require('express');
const router = express.Router();
const { db } = require('../db/db');
const { auth } = require('../middleware/auth');
const FEATURES = require('../config/features');

// GET /api/notifications - Fetch user's persistent notifications
router.get('/', auth, (req, res) => {
  if (!FEATURES.NOTIFICATIONS) {
    return res.status(503).json({ error: 'Notification system is disabled' });
  }

  try {
    const notifications = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50')
                           .all(req.user.id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// POST /api/notifications/poll - Poll for new matching drives since last check
router.post('/poll', auth, (req, res) => {
  if (!FEATURES.NOTIFICATIONS) {
    return res.status(503).json({ error: 'Notification system is disabled' });
  }

  try {
    const user = db.prepare('SELECT last_notified_at, role FROM users WHERE id = ?').get(req.user.id);
    const profile = db.prepare('SELECT preferred_role FROM user_profiles WHERE user_id = ?').get(req.user.id);
    
    const lastCheck = user.last_notified_at || '1970-01-01';
    const matchRole = profile ? profile.preferred_role : null;

    // Find drives added since lastCheck that match user's role (or are generic)
    let newDrives;
    if (matchRole) {
      newDrives = db.prepare(`
        SELECT id, company_name, job_role FROM drives 
        WHERE created_at > ? AND (job_role LIKE ? OR job_role = 'General')
      `).all(lastCheck, `%${matchRole}%`);
    } else {
      newDrives = db.prepare('SELECT id, company_name, job_role FROM drives WHERE created_at > ?').all(lastCheck);
    }

    // Insert as persistent notifications
    const insertNotif = db.prepare('INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)');
    for (const drive of newDrives) {
      insertNotif.run(
        req.user.id,
        'drive',
        'New Matching Drive!',
        `${drive.company_name} is hiring for ${drive.job_role}. Check it out now.`
      );
    }

    // Update last_notified_at
    db.prepare('UPDATE users SET last_notified_at = CURRENT_TIMESTAMP WHERE id = ?').run(req.user.id);

    res.json({ newCount: newDrives.length });
  } catch (err) {
    console.error('Polling Error:', err);
    res.status(500).json({ error: 'Notification polling failed' });
  }
});

// PATCH /api/notifications/:id/read - Mark single notification as read
router.patch('/:id/read', auth, (req, res) => {
  try {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

module.exports = router;
