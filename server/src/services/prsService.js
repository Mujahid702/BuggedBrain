const { db } = require('../db/db');

/**
 * PRS = 
 * 40% Roadmap Completion
 * 30% Checklist Completion (Avg across applied/bookmarked drives)
 * 20% Unique Kit Downloads (from applied/bookmarked drives)
 * 10% General Activity (Logins, Bookmarks, Applications - capped)
 */

const calculateUserPRS = (userId) => {
  try {
    // 1. Roadmap Completion (40%)
    const roadmap = db.prepare('SELECT roadmap_json FROM roadmaps WHERE user_id = ?').get(userId);
    let roadmapScore = 0;
    if (roadmap) {
      const roadmapData = JSON.parse(roadmap.roadmap_json);
      const totalSteps = roadmapData.steps.length;
      const completedSteps = db.prepare('SELECT COUNT(*) as count FROM roadmap_progress WHERE user_id = ? AND is_completed = 1').get(userId).count;
      roadmapScore = (totalSteps > 0) ? (completedSteps / totalSteps) * 40 : 0;
    }

    // 2. Checklist Completion (30%)
    // Based on items checked vs total items across all "Interacted" drives (applied or bookmarked)
    const checklistStats = db.prepare(`
      WITH interacted_drives AS (
        SELECT drive_id FROM applications WHERE user_id = ?
        UNION
        SELECT drive_id FROM bookmarks WHERE user_id = ?
      )
      SELECT 
        SUM(is_checked) as checked_count,
        (SELECT SUM(length(checklist) - length(replace(checklist, ',', '')) + 1) 
         FROM drives 
         WHERE id IN interacted_drives) as total_items
      FROM checklist_progress
      WHERE user_id = ? AND drive_id IN interacted_drives
    `).get(userId, userId, userId);
    
    let checklistScore = 0;
    if (checklistStats && checklistStats.total_items > 0) {
      checklistScore = (checklistStats.checked_count / checklistStats.total_items) * 30;
    }

    // 3. Unique Kit Downloads (20%) - "Unique kits downloaded from currently applied/bookmarked drives"
    const kitStats = db.prepare(`
      WITH interacted_drives AS (
        SELECT id, pdf_path FROM drives 
        WHERE id IN (SELECT drive_id FROM applications WHERE user_id = ? UNION SELECT drive_id FROM bookmarks WHERE user_id = ?)
        AND pdf_path IS NOT NULL
      )
      SELECT 
        (SELECT COUNT(DISTINCT metadata) FROM user_activity WHERE user_id = ? AND action = 'kit_download' AND metadata IN (SELECT id FROM interacted_drives)) as downloaded_count,
        (SELECT COUNT(*) FROM interacted_drives) as total_kits
    `).get(userId, userId, userId);

    let kitScore = 0;
    if (kitStats && kitStats.total_kits > 0) {
      kitScore = (kitStats.downloaded_count / kitStats.total_kits) * 20;
    }

    // 4. Activity Score (10%)
    // Simple point system: Login=1, Bookmark=2, Application=5. Capped at 100 points -> 10% weight.
    const activityPnts = db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM user_activity WHERE user_id = ? AND action = 'login') * 1 +
        (SELECT COUNT(*) FROM bookmarks WHERE user_id = ?) * 2 +
        (SELECT COUNT(*) FROM applications WHERE user_id = ?) * 5 as total_points
    `).get(userId, userId, userId);

    const activityScore = Math.min(activityPnts.total_points || 0, 100) / 10; // Cap at 10%

    const totalPRS = Math.round(roadmapScore + checklistScore + kitScore + activityScore);

    return {
      totalPRS,
      breakdown: {
        roadmap: Math.round(roadmapScore),
        checklist: Math.round(checklistScore),
        kits: Math.round(kitScore),
        activity: Math.round(activityScore)
      }
    };
  } catch (err) {
    console.error('PRS Calculation Error:', err);
    return { totalPRS: 0, breakdown: {}, error: 'Failed to calculate score' };
  }
};

module.exports = {
  calculateUserPRS
};
