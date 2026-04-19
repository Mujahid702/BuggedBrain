const express = require('express');
const router = express.Router();
const { db } = require('../db/db');
const { auth } = require('../middleware/auth');

// POST /api/applications/:driveId - Submit application
router.post('/:driveId', auth, (req, res) => {
  const driveId = req.params.driveId;
  const userId = req.user.id;

  try {
    const insert = db.prepare('INSERT INTO applications (user_id, drive_id) VALUES (?, ?)');
    insert.run(userId, driveId);
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'You have already applied for this drive' });
    }
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// GET /api/applications/status/:driveId - Check application status
router.get('/status/:driveId', auth, (req, res) => {
  try {
    const app = db.prepare('SELECT status FROM applications WHERE user_id = ? AND drive_id = ?')
                  .get(req.user.id, req.params.driveId);
    res.json({ applied: !!app, status: app ? app.status : null });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check application status' });
  }
});

// GET /api/applications/me - List my applications
router.get('/me', auth, (req, res) => {
  try {
    const apps = db.prepare(`
      SELECT a.*, d.company_name, d.job_role, d.logo_path 
      FROM applications a
      JOIN drives d ON a.drive_id = d.id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
    `).all(req.user.id);
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your applications' });
  }
});

module.exports = router;
