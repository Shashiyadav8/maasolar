import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/maa-solar-logo.jpeg';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <header className="glass-header">
        <div className="header-container">
          <Link className="brand-logo" to="/" onClick={closeMenu}>
            <img src={logo} alt="MAA Solar" className="navbar-logo-img" />
          </Link>
          
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {menuOpen ? '✕' : '☰'}
          </button>
          
          <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {user ? (
              <>
                <Link className={`nav-item ${location.pathname === '/new' ? 'active' : ''}`} to="/new" onClick={closeMenu}>
                  New Quotation
                </Link>
                <Link className={`nav-item ${location.pathname === '/history' ? 'active' : ''}`} to="/history" onClick={closeMenu}>
                  History
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`} to="/settings" onClick={closeMenu}>
                      Settings
                    </Link>
                    <Link className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`} to="/admin" onClick={closeMenu}>
                      Admin
                    </Link>
                  </>
                )}
                <button className="nav-item" onClick={handleLogout} style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  Logout ({user.name})
                </button>
              </>
            ) : (
              <Link className={`nav-item ${location.pathname === '/login' ? 'active' : ''}`} to="/login" onClick={closeMenu}>
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
