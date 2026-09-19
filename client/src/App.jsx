import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import QuotationForm from './pages/QuotationForm';
import History from './pages/History';
import Settings from './pages/Settings';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { AuthContext } from './context/AuthContext';
import './App.css';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // Wait for auth check

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Navigate to="/new" />} />
          
          <Route path="/new" element={
            <ProtectedRoute><QuotationForm /></ProtectedRoute>
          } />
          
          <Route path="/edit/:id" element={
            <ProtectedRoute><QuotationForm /></ProtectedRoute>
          } />
          
          <Route path="/history" element={
            <ProtectedRoute><History /></ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute adminOnly={true}><Settings /></ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
