require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { initDB } = require('./db/db');
const globalErrorHandler = require('./middleware/error');

// Initialize Database
initDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/drives', require('./routes/drives'));
app.use('/api/bookmarks', require('./routes/bookmarks'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/checklist', require('./routes/checklist'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/prs', require('./routes/prs'));
app.use('/api/notifications', require('./routes/notifications'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to BuggedBrain API' });
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
