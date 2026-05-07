import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, Play, Hexagon, LogOut, User as UserIcon, Bell } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUnread = async () => {
        if (!user || !user.token) return;
        try {
          const res = await fetch('/api/police-reports/unread-count', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          if (res.ok) {
            const data = await res.json();
            console.log('[NOTIFICATION SYNC] Count:', data.count, 'Items:', data.notifications?.length, 'Total:', data.totalCount);
            setUnreadCount(data.count || 0);
            setTotalCount(data.totalCount || 0);
            setNotifications(data.notifications || []);
          }
        } catch (err) {
          console.error('[NOTIFICATION ERROR]', err);
        }
      };
      const handleReportEvent = () => {
        setTimeout(fetchUnread, 500); // 500ms delay to ensure DB consistency
      };
      window.addEventListener('reportSubmitted', handleReportEvent);
      fetchUnread();
      const interval = setInterval(fetchUnread, 30000);
      return () => {
        clearInterval(interval);
        window.removeEventListener('reportSubmitted', handleReportEvent);
      };
    }
  }, [user]);

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
            <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} style={{ color: '#00d2ff' }}>
              Admin Portal
            </Link>
          )}
          {user?.role === 'police' && (
            <Link to="/police-dashboard" className={`nav-link ${location.pathname === '/police-dashboard' ? 'active' : ''}`} style={{ color: '#10b981' }}>
              Police Portal
            </Link>
          )}
          {user && user.role === 'user' && totalCount > 0 && (
            <Link to="/my-reports" className={`nav-link ${location.pathname === '/my-reports' ? 'active' : ''}`} style={{ color: '#00d2ff' }}>
              My Reports
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="nav-actions">
          {user && (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'white', marginRight: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                title="Notifications"
              >
                <Bell size={22} color={unreadCount > 0 ? "#00d2ff" : "#888"} />
                {unreadCount > 0 && (
                  <span style={{ 
                    position: 'absolute', 
                    top: '-5px', 
                    right: '-8px', 
                    background: '#ef4444', 
                    color: 'white', 
                    fontSize: '0.65rem', 
                    padding: '1px 5px', 
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
                    animation: 'pulse 2s infinite'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div style={{ 
                  position: 'absolute', 
                  top: '50px', 
                  right: '0', 
                  width: '320px', 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  zIndex: 1000,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                  border: '1px solid rgba(0, 210, 255, 0.3)',
                  background: '#0a0a0a', // Solid dark background for better legibility
                  backdropFilter: 'blur(20px)'
                }}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(to right, rgba(0, 210, 255, 0.1), transparent)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '1px', color: '#00d2ff' }}>
                    FORENSIC ALERTS
                  </div>
                  <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                    {notifications && notifications.length > 0 ? notifications.map((n, i) => (
                      <div 
                        key={i} 
                        onClick={() => {
                          setShowNotifications(false);
                          navigate(user.role === 'user' ? '/my-reports' : '/police-dashboard');
                        }}
                        style={{ 
                          padding: '1rem 1.25rem', 
                          borderBottom: '1px solid rgba(255,255,255,0.05)', 
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        className="notification-item-hover"
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {((user.role === 'user' && !n.isReadByUser) || (user.role !== 'user' && !n.isReadByPolice)) && (
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00d2ff', boxShadow: '0 0 10px #00d2ff' }}></div>
                            )}
                            <span style={{ color: '#00d2ff', fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'monospace' }}>{n.referenceId}</span>
                          </div>
                          <span style={{ fontSize: '0.6rem', color: '#555' }}>{new Date(n.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#eee', fontWeight: '600', lineHeight: '1.4' }}>{n.title}</div>
                      </div>
                    )) : (
                      <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                        <Bell size={32} style={{ color: '#222', marginBottom: '1rem' }} />
                        <p style={{ color: '#555', fontSize: '0.85rem', margin: 0 }}>No active transmissions detected.</p>
                      </div>
                    )}
                  </div>
                  <Link 
                    to={user.role === 'user' ? '/my-reports' : '/police-dashboard'} 
                    onClick={() => setShowNotifications(false)}
                    style={{ 
                      display: 'block', 
                      padding: '1rem', 
                      textAlign: 'center', 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold',
                      color: '#00d2ff', 
                      textDecoration: 'none', 
                      background: 'rgba(255,255,255,0.02)',
                      borderTop: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    ACCESS COMMAND CENTER
                  </Link>
                </div>
              )}
            </div>
          )}
          <Link to="/osint-trial" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Play size={16} />
            Try OSINT
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
          <Link to="/admin" className="nav-link" style={{ color: '#00d2ff' }} onClick={() => setIsOpen(false)}>
            Admin Portal
          </Link>
        )}
        {user?.role === 'police' && (
          <Link to="/police-dashboard" className="nav-link" style={{ color: '#10b981' }} onClick={() => setIsOpen(false)}>
            Police Portal
          </Link>
        )}
        {user && user.role === 'user' && (
          <Link to="/my-reports" className="nav-link" style={{ color: '#00d2ff' }} onClick={() => setIsOpen(false)}>
            My Reports
          </Link>
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
