const express = require('express');
const router = express.Router();
const { getProjects, createProject, deleteProject } = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getProjects);
router.post('/', authMiddleware, createProject);
router.delete('/:id', authMiddleware, deleteProject);

module.exports = router;