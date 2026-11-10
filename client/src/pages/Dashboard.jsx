import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await API.get('/projects');
      setProjects(response.data);
    } catch (err) {
      setError('Failed to load projects. Please log in again.');
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/projects', { title, description });
      setProjects([response.data, ...projects]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to create project.');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project and all its tasks?')) return;
    try {
      await API.delete(`/projects/${projectId}`);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      setError('Failed to delete project.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  return (
    <div className="app-layout">
      <div className="app-header">
        <h2>Workspace &bull; {user?.username}</h2>
        <button onClick={handleLogout} className="btn-danger">
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="card-form">
        <h3>Create New Project</h3>
        <form onSubmit={handleCreateProject}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Project Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }}>
            Add Project
          </button>
        </form>
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Your Projects</h3>
      {projects.length === 0 ? (
        <div className="empty-state">
          No projects found. Create one above to get started!
        </div>
      ) : (
        <div className="grid-list">
          {projects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => navigate(`/projects/${project.id}`)}
              className="item-card clickable"
            >
              <div className="item-info">
                <h4>{project.title}</h4>
                <p>{project.description || 'No description provided.'}</p>
                <div className="item-meta">Created on: {new Date(project.created_at).toLocaleDateString()}</div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject(project.id);
                }}
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;