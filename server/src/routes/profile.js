const express = require('express');
const router = express.Router();
const { db } = require('../db/db');
const { auth } = require('../middleware/auth');
const { generateRoadmap } = require('../services/roadmapService');

// GET /api/profile - Fetch user profile and roadmap
router.get('/', auth, (req, res) => {
  try {
    const profile = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(req.user.id);
    const roadmap = db.prepare('SELECT * FROM roadmaps WHERE user_id = ?').get(req.user.id);
    const progress = db.prepare('SELECT step_id, is_completed FROM roadmap_progress WHERE user_id = ?').all(req.user.id);

    res.json({
      profile: profile || null,
      roadmap: roadmap ? JSON.parse(roadmap.roadmap_json) : null,
      progress: progress.reduce((acc, curr) => {
        acc[curr.step_id] = !!curr.is_completed;
        return acc;
      }, {})
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// POST /api/profile - Save/Update profile and generate roadmap
router.post('/', auth, (req, res) => {
  const { level, preferred_role, skills, goal, time_availability } = req.body;
  const userId = req.user.id;

  try {
    // 1. Save or Update Profile
    const existingProfile = db.prepare('SELECT id FROM user_profiles WHERE user_id = ?').get(userId);
    
    if (existingProfile) {
      db.prepare(`
        UPDATE user_profiles 
        SET level = ?, preferred_role = ?, skills = ?, goal = ?, time_availability = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `).run(level, preferred_role, JSON.stringify(skills), goal, time_availability, userId);
    } else {
      db.prepare(`
        INSERT INTO user_profiles (user_id, level, preferred_role, skills, goal, time_availability)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(userId, level, preferred_role, JSON.stringify(skills), goal, time_availability);
    }

    // 2. Generate Roadmap
    const updatedProfile = { level, preferred_role, skills: JSON.stringify(skills), goal, time_availability };
    const roadmap = generateRoadmap(updatedProfile);

    // 3. Save or Update Roadmap
    const existingRoadmap = db.prepare('SELECT id FROM roadmaps WHERE user_id = ?').get(userId);
    if (existingRoadmap) {
      db.prepare('UPDATE roadmaps SET roadmap_json = ? WHERE user_id = ?').run(JSON.stringify(roadmap), userId);
    } else {
      db.prepare('INSERT INTO roadmaps (user_id, roadmap_json) VALUES (?, ?)').run(userId, JSON.stringify(roadmap));
    }

    res.json({ message: 'Profile and roadmap updated successfully', roadmap });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/profile/progress - Update roadmap step progress
router.post('/progress', auth, (req, res) => {
  const { step_id, is_completed } = req.body;
  const userId = req.user.id;

  try {
    db.prepare(`
      INSERT INTO roadmap_progress (user_id, step_id, is_completed, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, step_id) DO UPDATE SET
      is_completed = excluded.is_completed,
      updated_at = CURRENT_TIMESTAMP
    `).run(userId, step_id, is_completed ? 1 : 0);

    res.json({ message: 'Progress updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

module.exports = router;
