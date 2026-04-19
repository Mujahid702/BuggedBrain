const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const prsService = require('../services/prsService');
const FEATURES = require('../config/features');

// GET /api/prs - Get current user PRS score and breakdown
router.get('/', auth, (req, res) => {
  if (!FEATURES.PRS_SYSTEM) {
    return res.status(503).json({ error: 'PRS system is currently disabled' });
  }

  try {
    const scoreData = prsService.calculateUserPRS(req.user.id);
    res.json(scoreData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate PRS score' });
  }
});

module.exports = router;
