import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  
  const [newEmployee, setNewEmployee] = useState({ name: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    } else if (user) {
      fetchEmployees();
    }
  }, [user, navigate]);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/auth/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await api.post('/auth/employee', newEmployee);
      setSuccess('Employee created successfully!');
      setNewEmployee({ name: '', username: '', password: '' });
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="container-main" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>Admin Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage your employees here.</p>
      </div>

      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <h3 className="section-title">Add New Employee</h3>
        
        {error && <div style={{ color: '#ef4444', marginBottom: '15px' }}>{error}</div>}
        {success && <div style={{ color: '#10b981', marginBottom: '15px' }}>{success}</div>}
        
        <form onSubmit={handleCreateEmployee}>
          <div className="flex-row">
            <div className="premium-input-group flex-1">
              <label>Full Name</label>
              <input type="text" className="premium-input" placeholder="e.g. John Doe" value={newEmployee.name} onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} required />
            </div>
            <div className="premium-input-group flex-1">
              <label>Username</label>
              <input type="text" className="premium-input" placeholder="e.g. johnd" value={newEmployee.username} onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})} required />
            </div>
          </div>
          
          <div className="premium-input-group">
            <label>Password</label>
            <input type="password" className="premium-input" placeholder="Choose a secure password (min 6 chars)" value={newEmployee.password} onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})} required minLength="6" />
          </div>
          
          <button type="submit" className="btn-premium btn-primary" disabled={loading}>
            {loading ? 'CREATING...' : 'CREATE EMPLOYEE'}
          </button>
        </form>
      </div>

      <div className="glass-card">
        <h3 className="section-title">Employee List</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {employees.map(emp => (
            <div key={emp._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{emp.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>@{emp.username}</div>
              </div>
              <div>
                <span className="badge-type non-dcr">Employee</span>
              </div>
            </div>
          ))}
          {employees.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No employees found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
