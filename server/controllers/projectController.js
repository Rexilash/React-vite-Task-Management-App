const pool = require('../db/db');

// Get all projects for the logged-in user
const getProjects = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from the JWT auth middleware
    const projects = await pool.query(
      'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(projects.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while fetching projects' });
  }
};

// Create a new project
const createProject = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  try {
    const newProject = await pool.query(
      'INSERT INTO projects (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description || '', userId]
    );
    res.status(201).json(newProject.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while creating project' });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const deletedProject = await pool.query(
      'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (deletedProject.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while deleting project' });
  }
};

module.exports = { getProjects, createProject, deleteProject };