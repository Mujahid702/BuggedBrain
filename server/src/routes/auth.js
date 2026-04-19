const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { prisma } = require('../db/db');
const { JWT_SECRET, auth } = require('../middleware/auth');
const validate = require('../middleware/validate');

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  })
});

// POST /api/auth/register
router.post('/register', validate(registerSchema), async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if any user exists. First user will be admin.
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? 'admin' : 'student';

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        name,
      }
    });

    const userPayload = { id: user.id, email: user.email, role: user.role, name: user.name, is_premium: user.is_premium ? 1 : 0 };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ token, user: userPayload });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', validate(loginSchema), async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const userWithoutPassword = { id: user.id, email: user.email, role: user.role, name: user.name, is_premium: user.is_premium ? 1 : 0 };
    const token = jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/auth/profile - Update user info
router.put('/profile', auth, async (req, res, next) => {
  const { name, email } = req.body;
  
  try {
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email }
    });
    
    // Create payload without iat/exp
    const { iat, exp, ...userData } = req.user;
    const updatedUserPayload = { ...userData, name: updated.name, email: updated.email };
    const token = jwt.sign(updatedUserPayload, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ token, user: updatedUserPayload });
  } catch (err) {
    console.error('Profile update error:', err);
    if (err.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    next(err);
  }
});

// POST /api/auth/subscribe - Mock premium subscription
router.post('/subscribe', auth, async (req, res, next) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { is_premium: true }
    });
    
    // Create payload without iat/exp
    const { iat, exp, ...userData } = req.user;
    const updatedUserPayload = { ...userData, is_premium: 1 };
    const token = jwt.sign(updatedUserPayload, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ token, user: updatedUserPayload });
  } catch (err) {
    console.error('Subscription error:', err);
    next(err);
  }
});

module.exports = router;
