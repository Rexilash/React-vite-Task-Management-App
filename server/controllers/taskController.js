const pool = require('../db/db');

// Get all tasks for a specific project
const getTasks = async (req, res) => {
  const { projectId } = req.params;
  try {
    const tasks = await pool.query(
      'SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC',
      [projectId]
    );
    res.json(tasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while fetching tasks' });
  }
};

// Create a new task within a project
const createTask = async (req, res) => {
  const { projectId } = req.params;
  const { title, description, status } = req.body;

  try {
    const newTask = await pool.query(
      'INSERT INTO tasks (project_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [projectId, title, description || '', status || 'todo']
    );
    res.status(201).json(newTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while creating task' });
  }
};

// Update task status (e.g., todo -> in_progress -> completed)
const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  try {
    const updatedTask = await pool.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, taskId]
    );
    
    if (updatedTask.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while updating task' });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const deletedTask = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [taskId]
    );

    if (deletedTask.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while deleting task' });
  }
};

module.exports = { getTasks, createTask, updateTaskStatus, deleteTask };