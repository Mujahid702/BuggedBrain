const express = require('express');
const router = express.Router();
const multer = require('multer');
const { z } = require('zod');
const { prisma } = require('../db/db');
const { auth, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { getCache, setCache, clearCachePattern } = require('../config/redis');
const { uploadToCloudinary } = require('../config/cloudinary');

// Multer using temp storage before uploading to Cloudinary
const upload = multer({ dest: 'uploads/temp/' });

const getYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// GET /api/drives - List all drives with caching
router.get('/', async (req, res, next) => {
  try {
    const cached = await getCache('drives:all');
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const drives = await prisma.drive.findMany({
      orderBy: { created_at: 'desc' }
    });

    await setCache('drives:all', JSON.stringify(drives), 300); // 5 mins cache
    res.json(drives);
  } catch (err) {
    next(err);
  }
});

// GET /api/drives/:id - Single drive details
router.get('/:id', async (req, res, next) => {
  try {
    const driveId = parseInt(req.params.id, 10);
    const cached = await getCache(`drives:${driveId}`);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const drive = await prisma.drive.findUnique({ where: { id: driveId } });
    if (!drive) return res.status(404).json({ success: false, message: 'Drive not found' });
    
    await setCache(`drives:${driveId}`, JSON.stringify(drive), 300);
    res.json(drive);
  } catch (err) {
    next(err);
  }
});

// Create drive validation schema
const driveSchema = z.object({
  body: z.object({
    company_name: z.string(),
    job_role: z.string(),
    description: z.string(),
    youtube_link: z.string().optional(),
    deadline: z.string().optional(),
    tags: z.string().optional(),
    is_featured: z.preprocess((val) => val === 'true' || val === true, z.boolean().optional()),
    location: z.string().optional(),
    job_type: z.string().optional(),
    checklist: z.string().optional()
  }) // Multer form data can pass all fields as strings, but zod will parse them.
});

// POST /api/drives - Create new drive
router.post('/', auth, adminOnly, upload.fields([
  { name: 'placement_kit', maxCount: 1 },
  { name: 'logo', maxCount: 1 }
]), validate(driveSchema), async (req, res, next) => {
  try {
    const resultBody = req.body;
    let pdf_path = null;
    let logo_path = null;

    if (req.files['placement_kit']) {
      pdf_path = await uploadToCloudinary(req.files['placement_kit'][0].path, 'drives/kits');
    }
    if (req.files['logo']) {
      logo_path = await uploadToCloudinary(req.files['logo'][0].path, 'drives/logos');
    }

    const drive = await prisma.drive.create({
      data: {
        company_name: resultBody.company_name,
        job_role: resultBody.job_role,
        description: resultBody.description,
        youtube_link: getYoutubeId(resultBody.youtube_link),
        pdf_path,
        logo_path,
        deadline: resultBody.deadline,
        tags: resultBody.tags,
        is_featured: resultBody.is_featured,
        location: resultBody.location,
        job_type: resultBody.job_type,
        checklist: resultBody.checklist
      }
    });

    await clearCachePattern('drives:*'); // Invalidate caches
    res.status(201).json({ success: true, id: drive.id, message: 'Drive created successfully' });
  } catch (err) {
    next(err);
  }
});

// PUT /api/drives/:id - Update drive
router.put('/:id', auth, adminOnly, upload.fields([
  { name: 'placement_kit', maxCount: 1 },
  { name: 'logo', maxCount: 1 }
]), validate(driveSchema), async (req, res, next) => {
  try {
    const driveId = parseInt(req.params.id, 10);
    const existing = await prisma.drive.findUnique({ where: { id: driveId } });
    if (!existing) return res.status(404).json({ success: false, message: 'Drive not found' });

    const resultBody = req.body;
    let pdf_path = existing.pdf_path;
    let logo_path = existing.logo_path;

    if (req.files && req.files['placement_kit']) {
      pdf_path = await uploadToCloudinary(req.files['placement_kit'][0].path, 'drives/kits');
    }
    if (req.files && req.files['logo']) {
      logo_path = await uploadToCloudinary(req.files['logo'][0].path, 'drives/logos');
    }

    await prisma.drive.update({
      where: { id: driveId },
      data: {
        company_name: resultBody.company_name || existing.company_name,
        job_role: resultBody.job_role || existing.job_role,
        description: resultBody.description || existing.description,
        youtube_link: resultBody.youtube_link ? getYoutubeId(resultBody.youtube_link) : existing.youtube_link,
        pdf_path,
        logo_path,
        deadline: resultBody.deadline || existing.deadline,
        tags: resultBody.tags || existing.tags,
        is_featured: resultBody.is_featured !== undefined ? resultBody.is_featured : existing.is_featured,
        location: resultBody.location || existing.location,
        job_type: resultBody.job_type || existing.job_type,
        checklist: resultBody.checklist || existing.checklist
      }
    });

    await clearCachePattern('drives:*');
    res.json({ success: true, message: 'Drive updated successfully' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/drives/:id - Delete drive
router.delete('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const driveId = parseInt(req.params.id, 10);
    await prisma.drive.delete({ where: { id: driveId } });
    
    await clearCachePattern('drives:*');
    res.json({ success: true, message: 'Drive deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') {
       return res.status(404).json({ success: false, message: 'Drive not found' });
    }
    next(err);
  }
});

// POST /api/drives/download/:id - Track kit download
router.post('/download/:id', auth, async (req, res, next) => {
  try {
    const driveId = req.params.id;
    await prisma.userActivity.create({
      data: {
        user_id: req.user.id,
        action: 'kit_download',
        metadata: driveId
      }
    });
    
    res.json({ success: true, message: 'Download tracked' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
