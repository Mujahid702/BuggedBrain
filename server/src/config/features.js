const FEATURES = {
  AI_CAREER: process.env.FEATURE_AI === 'true' || true,
  INTERVIEW_SIM: process.env.FEATURE_INTERVIEW === 'true' || false,
  PRS_SYSTEM: process.env.FEATURE_PRS === 'true' || true,
  SOCIAL_HUB: process.env.FEATURE_SOCIAL === 'true' || false,
  NOTIFICATIONS: process.env.FEATURE_NOTIFICATIONS === 'true' || true
};

module.exports = FEATURES;
