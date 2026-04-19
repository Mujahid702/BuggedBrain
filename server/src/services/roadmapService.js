const { db } = require('../db/db');

const CURATED_RESOURCES = {
  roles: {
    'Full Stack Developer': {
      foundation: [
        { title: 'HTML/CSS Mastery', type: 'YouTube', link: 'https://youtube.com/playlist?list=PL4Gr5tOafJJ7a29796Y8X9b7k_r7-oFfM' },
        { title: 'JavaScript Fundamentals', type: 'YouTube', link: 'https://youtube.com/playlist?list=PLu0W_9lII9ahR186NCPn_K06k6-6k-K5C' }
      ],
      skillBuilding: [
        { title: 'React.js Complete Course', type: 'YouTube', link: 'https://youtube.com/playlist?list=PLwGdqUZWnOp3aROg4wypcRhZqJGarzltW' },
        { title: 'Node.js & Express Guide', type: 'YouTube', link: 'https://youtube.com/playlist?list=PL4Gr5tOafJJ7a29796Y8X9b7k_r7-oFfM' }
      ],
      finalPrep: [
        { title: 'Full Stack Interview Questions', type: 'PDF', link: '/resources/fullstack-prep.pdf' },
        { title: 'System Design Basics', type: 'YouTube', link: 'https://youtube.com/watch?v=xpDnVSmEs12' }
      ]
    },
    'Backend Developer': {
      foundation: [
        { title: 'Computer Networks', type: 'YouTube', link: 'https://youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XRw78UA8qnv6jEx' },
        { title: 'Operating Systems', type: 'YouTube', link: 'https://youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAeuVcp2O' }
      ],
      skillBuilding: [
        { title: 'SQL & Database Design', type: 'YouTube', link: 'https://youtube.com/playlist?list=PL0Zuz27SZ-6PrE9srvEn8NBh95NWZe7xe' },
        { title: 'Microservices Architecture', type: 'YouTube', link: 'https://youtube.com/watch?v=CdBtNQZH8a4' }
      ],
      finalPrep: [
        { title: 'Scalability & Load Balancing', type: 'YouTube', link: 'https://youtube.com/watch?v=xpDnVSmEs12' }
      ]
    },
    'Data Scientist': {
      foundation: [
        { title: 'Mathematics for ML', type: 'YouTube', link: 'https://youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab' },
        { title: 'Python for Data Science', type: 'YouTube', link: 'https://youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS' }
      ],
      skillBuilding: [
        { title: 'Machine Learning A-Z', type: 'YouTube', link: 'https://youtube.com/playlist?list=PLkDaE6sCZn6FNC6YRfRQc_FBeUhq8ybW3' },
        { title: 'Probability & Statistics', type: 'YouTube', link: 'https://youtube.com/playlist?list=PL2SOU6wwxB0uWWlwS_6p97-fhz7yMTp9S' }
      ],
      finalPrep: [
        { title: 'Data Science Case Studies', type: 'PDF', link: '/resources/ds-case-studies.pdf' }
      ]
    }
  },
  general: {
    'DSA': [
      { title: 'Striver SDE Sheet', type: 'Link', link: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/' },
      { title: 'Blind 75 LeetCode', type: 'Link', link: 'https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions' }
    ],
    'ProductBased': [
      { title: 'Cracking the Coding Interview', type: 'PDF', link: '/resources/ctci.pdf' },
      { title: 'Mock Interview Practice', type: 'YouTube', link: 'https://youtube.com/playlist?list=PL59L8WhA-XvX7Y_d0A8I1u3m3vX6P6kLX' }
    ]
  }
};

function generateRoadmap(profile) {
  const { level, preferred_role, goal, skills } = profile;
  const userSkills = skills ? JSON.parse(skills) : [];
  
  const roadmap = {
    title: `Roadmap to ${preferred_role}`,
    steps: []
  };

  // 1. Foundation Step
  const foundationStep = {
    id: 'foundation',
    title: 'Phase 1: Foundation',
    description: 'Build your core fundamentals.',
    resources: [],
    drives: []
  };

  if (level === 'Beginner') {
    foundationStep.resources.push(...(CURATED_RESOURCES.roles[preferred_role]?.foundation || []));
  } else {
    foundationStep.description = 'Reviewing advanced fundamentals.';
    foundationStep.resources.push({ title: 'Advanced Concepts Review', type: 'Link', link: '#' });
  }
  roadmap.steps.push(foundationStep);

  // 2. Skill Building Step
  const skillStep = {
    id: 'skill-building',
    title: 'Phase 2: Skill Building',
    description: `Mastering ${preferred_role} specializations.`,
    resources: [],
    drives: []
  };
  skillStep.resources.push(...(CURATED_RESOURCES.roles[preferred_role]?.skillBuilding || []));
  
  // Suggest DSA if not in skills
  if (!userSkills.includes('DSA')) {
    skillStep.resources.push(...CURATED_RESOURCES.general['DSA']);
  }
  roadmap.steps.push(skillStep);

  // 3. Practice Drives Step
  const driveStep = {
    id: 'practice-drives',
    title: 'Phase 3: Practice & Drives',
    description: 'Apply for matching drives and practice real scenarios.',
    resources: [],
    drives: []
  };

  // Fetch relevant drives from DB
  const matchingDrives = db.prepare(`
    SELECT id, company_name, job_role, logo_path 
    FROM drives 
    WHERE job_role LIKE ? OR tags LIKE ?
    LIMIT 3
  `).all(`%${preferred_role}%`, `%${preferred_role}%`);

  driveStep.drives = matchingDrives;
  roadmap.steps.push(driveStep);

  // 4. Final Preparation Step
  const finalStep = {
    id: 'final-prep',
    title: 'Phase 4: Final Preparation',
    description: 'Cracking the interviews.',
    resources: [],
    drives: []
  };
  
  if (goal === 'Crack product-based companies') {
    finalStep.resources.push(...CURATED_RESOURCES.general['ProductBased']);
  }
  finalStep.resources.push(...(CURATED_RESOURCES.roles[preferred_role]?.finalPrep || []));
  roadmap.steps.push(finalStep);

  return roadmap;
}

module.exports = { generateRoadmap };
