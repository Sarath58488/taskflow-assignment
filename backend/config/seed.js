require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const User = require('../models/User');
const Task = require('../models/Task');

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Task.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Create users
  const hashedAdminPass = await bcrypt.hash('admin123', 10);
  const hashedUserPass = await bcrypt.hash('user123', 10);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@taskmanager.com',
    password: hashedAdminPass,
    role: 'admin',
  });

  const user1 = await User.create({
    name: 'Alice Johnson',
    email: 'alice@taskmanager.com',
    password: hashedUserPass,
    role: 'user',
  });

  const user2 = await User.create({
    name: 'Bob Smith',
    email: 'bob@taskmanager.com',
    password: hashedUserPass,
    role: 'user',
  });

  console.log('👥 Created users');

  // Create tasks
  await Task.create([
    {
      title: 'Design new landing page',
      description: 'Create wireframes and mockups for the updated landing page. Focus on mobile responsiveness.',
      status: 'pending',
      priority: 'high',
      assignedTo: user1._id,
      createdBy: admin._id,
    },
    {
      title: 'Fix login bug',
      description: 'Users are unable to log in using Google OAuth. Investigate and resolve the issue.',
      status: 'in_progress',
      priority: 'high',
      assignedTo: user1._id,
      createdBy: admin._id,
    },
    {
      title: 'Write API documentation',
      description: 'Document all REST API endpoints using Swagger. Include request/response examples.',
      status: 'completed',
      priority: 'medium',
      assignedTo: user1._id,
      createdBy: admin._id,
    },
    {
      title: 'Set up CI/CD pipeline',
      description: 'Configure GitHub Actions for automated testing and deployment to staging and production.',
      status: 'pending',
      priority: 'medium',
      assignedTo: user2._id,
      createdBy: admin._id,
    },
    {
      title: 'Database performance audit',
      description: 'Review slow queries and add necessary indexes. Target sub-200ms response times.',
      status: 'in_progress',
      priority: 'low',
      assignedTo: user2._id,
      createdBy: admin._id,
    },
    {
      title: 'User onboarding flow',
      description: 'Build a 3-step onboarding wizard for new users after registration.',
      status: 'pending',
      priority: 'high',
      assignedTo: user2._id,
      createdBy: admin._id,
    },
  ]);

  console.log('📋 Created tasks');
  console.log('\n✅ Seed complete! Login credentials:');
  console.log('   Admin  → admin@taskmanager.com / admin123');
  console.log('   Alice  → alice@taskmanager.com / user123');
  console.log('   Bob    → bob@taskmanager.com   / user123');

  process.exit(0);
};

seedData().catch((err) => {
  console.error(err);
  process.exit(1);
});
