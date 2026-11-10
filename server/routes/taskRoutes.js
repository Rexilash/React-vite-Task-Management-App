const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTaskStatus, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

router.get('/:projectId', authMiddleware, getTasks);
router.post('/:projectId', authMiddleware, createTask);
router.put('/:taskId/status', authMiddleware, updateTaskStatus);
router.delete('/:taskId', authMiddleware, deleteTask);

module.exports = router;