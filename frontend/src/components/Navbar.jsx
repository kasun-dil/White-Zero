import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, Play, Hexagon, LogOut, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Blog', path: '/blog' },
    { name: 'Articles', path: '/articles' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{ position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Hexagon size={36} className="text-[#00d2ff]" style={{ position: 'absolute' }} />
            <Shield size={18} color="white" style={{ position: 'absolute', zIndex: 1 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '1px', background: 'linear-gradient(90deg, #fff, #00d2ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              WHITE ZERO
            </span>
            <span style={{ fontSize: '0.6rem', color: '#00d2ff', letterSpacing: '2px', fontWeight: '600' }}>OSINT FRAMEWORK</span>
          </div>
        </Link>

        {/* Center Links - Desktop */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <>
              <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} style={{ color: '#00d2ff' }}>
                Admin Portal
              </Link>
            </>
          )}
        </div>

        {/* Right Actions */}
        <div className="nav-actions">
          <Link to="/osint-trial" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Play size={16} />
            Try Trial
          </Link>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'white', padding: '0.5rem 1rem', background: 'rgba(0, 210, 255, 0.1)', borderRadius: '20px', border: '1px solid rgba(0, 210, 255, 0.3)' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #00d2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)' }}>
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <UserIcon size={14} />
                  )}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user.name.split(' ')[0]}</span>
              </Link>
            </div>
          ) : (
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            {link.name}
          </Link>
        ))}
        {user?.role === 'admin' && (
          <>
            <Link to="/admin" className="nav-link" style={{ color: '#00d2ff' }} onClick={() => setIsOpen(false)}>
              Admin Portal
            </Link>
          </>
        )}
        <Link to="/osint-trial" className="btn-outline" style={{ textAlign: 'center' }} onClick={() => setIsOpen(false)}>
          Try Trial
        </Link>
        <Link to="/login" className="btn-primary" style={{ textAlign: 'center' }} onClick={() => setIsOpen(false)}>
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
