const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getUsers,
} = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/users', adminOnly, getUsers);
router.route('/').get(getTasks).post(adminOnly, createTask);
router.route('/:id').get(getTask).put(updateTask).delete(adminOnly, deleteTask);

module.exports = router;
