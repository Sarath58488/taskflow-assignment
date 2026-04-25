require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'TaskManager API is running 🚀' });
});

// Temporary seed route
app.get('/seed', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');
    const Task = require('./models/Task');
    await User.deleteMany({});
    await Task.deleteMany({});
    const admin = await User.create({ name: 'Admin User', email: 'admin@taskmanager.com', password: await bcrypt.hash('admin123', 10), role: 'admin' });
    const alice = await User.create({ name: 'Alice Johnson', email: 'alice@taskmanager.com', password: await bcrypt.hash('user123', 10), role: 'user' });
    const bob = await User.create({ name: 'Bob Smith', email: 'bob@taskmanager.com', password: await bcrypt.hash('user123', 10), role: 'user' });
    await Task.create([{ title: 'Design landing page', description: 'Create wireframes', status: 'pending', priority: 'high', assignedTo: alice._id, createdBy: admin._id }]);
    res.json({ success: true, message: 'Seeded!' });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
// Temporary seed route - remove after seeding
app.get('/seed', async (req, res) => {
  try {
    const { execSync } = require('child_process');
    execSync('node config/seed.js');
    res.json({ success: true, message: 'Seeded!' });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

module.exports = app;
