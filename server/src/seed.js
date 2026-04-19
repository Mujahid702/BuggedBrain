const { db, initDB } = require('./db/db');
const bcrypt = require('bcryptjs');

async function seed() {
  initDB();
  console.log('Seeding data...');

  // Create Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  try {
    db.prepare('INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)').run('admin@buggedbrain.com', hashedPassword, 'admin', 'Master Admin');
    console.log('Admin user created: admin@buggedbrain.com / admin123');
  } catch (err) {
    console.log('Admin user already exists or error.');
  }

  // Create Sample Drives
  const drives = [
    {
      company_name: 'Google',
      job_role: 'Software Engineer University Graduate',
      description: 'Join Google as a Software Engineer and work on complex problems that affect billions of users. We are looking for talented graduates with strong foundations in data structures and algorithms.',
      youtube_link: 'v3MsTid6Yd8',
      deadline: '2026-05-15',
      tags: 'FTE,Off-campus,Remote',
      is_featured: 1,
      location: 'Mountain View, CA (Remote Friendly)',
      job_type: 'Full-time'
    },
    {
      company_name: 'Microsoft',
      job_role: 'Software Engineering Intern',
      description: 'Microsoft is looking for passionate students to join our summer internship program. Gain hands-on experience and work on cutting-edge technologies.',
      youtube_link: '9653019e-a0bf',
      deadline: '2026-04-30',
      tags: 'Internship,On-campus,Azure',
      is_featured: 0,
      location: 'Redmond, WA',
      job_type: 'Internship'
    },
    {
      company_name: 'Amazon',
      job_role: 'Cloud Support Associate',
      description: 'AWS is hiring Cloud Support Associates. Learn about cloud infrastructure and help customers solve technical challenges.',
      youtube_link: 'mdf654dfg',
      deadline: '2026-06-01',
      tags: 'FTE,Hyderabad,AWS',
      is_featured: 1,
      location: 'Hyderabad, India',
      job_type: 'Full-time'
    }
  ];

  const insertDrive = db.prepare(`
    INSERT INTO drives (company_name, job_role, description, youtube_link, deadline, tags, is_featured, location, job_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const drive of drives) {
    insertDrive.run(
      drive.company_name, 
      drive.job_role, 
      drive.description, 
      drive.youtube_link, 
      drive.deadline, 
      drive.tags, 
      drive.is_featured,
      drive.location,
      drive.job_type
    );
  }

  console.log('Sample drives seeded.');
}

seed().catch(console.error);
