import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const ProjectDetails = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await API.get(`/tasks/${projectId}`);
      setTasks(response.data);
    } catch (err) {
      setError('Failed to load tasks.');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post(`/tasks/${projectId}`, { title, description, status: 'todo' });
      setTasks([response.data, ...tasks]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to create task.');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await API.put(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? response.data : t));
    } catch (err) {
      setError('Failed to update task status.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  return (
    <div className="app-layout">
      <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ marginBottom: '20px' }}>
        &larr; Back to Dashboard
      </button>

      <div className="app-header" style={{ marginBottom: '20px' }}>
        <h2>Project Task Board</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="card-form">
        <h3>Add New Task</h3>
        <form onSubmit={handleCreateTask}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Task Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }}>
            Add Task
          </button>
        </form>
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Tasks</h3>
      {tasks.length === 0 ? (
        <div className="empty-state">
          No tasks found for this project yet.
        </div>
      ) : (
        <div className="grid-list">
          {tasks.map((task) => (
            <div key={task.id} className="item-card">
              <div className="item-info">
                <h4>{task.title}</h4>
                <p>{task.description || 'No description.'}</p>
                <div>
                  <span className={`badge badge-${task.status}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <select 
                  value={task.status} 
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  style={{ width: '130px', padding: '8px' }}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button 
                  onClick={() => handleDeleteTask(task.id)} 
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;