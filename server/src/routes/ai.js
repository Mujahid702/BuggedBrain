const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const aiService = require('../services/aiService');
const FEATURES = require('../config/features');

// POST /api/ai/analyze-resume - AI Resume analysis
router.post('/analyze-resume', auth, async (req, res) => {
  if (!FEATURES.AI_CAREER) {
    return res.status(503).json({ error: 'AI Career module is currently disabled' });
  }

  const { resumeText } = req.body;
  if (!resumeText) {
    return res.status(400).json({ error: 'Resume content required for analysis' });
  }

  try {
    const analysis = await aiService.analyzeResume(resumeText);
    res.json(analysis);
  } catch (err) {
    console.error('AI Route Error:', err);
    res.status(500).json({ error: 'AI analysis failed' });
  }
});

// GET /api/ai/roadmap-advice - Get AI advice based on current roadmap
router.get('/roadmap-advice', auth, async (req, res) => {
  if (!FEATURES.AI_CAREER) {
    return res.status(503).json({ error: 'AI Career module is currently disabled' });
  }

  try {
    const { db } = require('../db/db');
    const profile = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(req.user.id);
    const roadmap = db.prepare('SELECT * FROM roadmaps WHERE user_id = ?').get(req.user.id);
    const progress = db.prepare('SELECT step_id, is_completed FROM roadmap_progress WHERE user_id = ?').all(req.user.id);

    if (!profile || !roadmap) {
       return res.status(404).json({ error: 'Profile or Roadmap not found. Please complete onboarding first.' });
    }

    const advice = await aiService.getRoadmapAdvice(profile, JSON.parse(roadmap.roadmap_json), progress);
    res.json(advice);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate AI advice' });
  }
});

module.exports = router;
