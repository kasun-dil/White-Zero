import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, Play, Hexagon, LogOut, User as UserIcon, Bell, Info, FileText, Layout, Users, Mail, Cpu, Settings } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMobileNotice, setShowMobileNotice] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setShowMobileNotice(true);
      const timer = setTimeout(() => setShowMobileNotice(false), 10000);
      return () => clearTimeout(timer);
    }
  }, []);

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
            setUnreadCount(data.count || 0);
            setTotalCount(data.totalCount || 0);
            setNotifications(data.notifications || []);
          }
        } catch (err) {
          console.error('[NOTIFICATION ERROR]', err);
        }
      };
      const handleReportEvent = () => {
        setTimeout(fetchUnread, 500);
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
    { name: 'About', path: '/about', icon: <Info size={18} /> },
    { name: 'Features', path: '/features', icon: <Cpu size={18} /> },
    { name: 'Blog', path: '/blog', icon: <Layout size={18} /> },
    { name: 'Articles', path: '/articles', icon: <FileText size={18} /> },
    { name: 'Contact', path: '/contact', icon: <Mail size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Mobile Optimization Alert */}
      {showMobileNotice && (
        <div className="mobile-notice-overlay">
          <div className="mobile-notice-card">
            <div className="notice-header">
              <Shield size={20} className="text-[#00d2ff]" />
              <span>TACTICAL PROTOCOL ALERT</span>
              <X size={16} onClick={() => setShowMobileNotice(false)} style={{ cursor: 'pointer', marginLeft: 'auto' }} />
            </div>
            <p>White Zero interface is optimized for high-authority <strong>Desktop Operations</strong>. Mobile mode active with limited telemetry view.</p>
            <div className="notice-progress"></div>
          </div>
        </div>
      )}

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{ position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Hexagon size={36} className="text-[#00d2ff]" style={{ position: 'absolute' }} />
              <Shield size={18} color="white" style={{ position: 'absolute', zIndex: 1 }} />
            </div>
            <div className="logo-text-wrapper">
              <span className="logo-brand">WHITE ZERO</span>
              <span className="logo-sub">OSINT FRAMEWORK</span>
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
                  className="notification-toggle"
                >
                  <Bell size={22} color={unreadCount > 0 ? "#00d2ff" : "#888"} />
                  {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </button>

                {showNotifications && (
                  <div className="notifications-dropdown glass">
                    <div className="dropdown-header">FORENSIC ALERTS</div>
                    <div className="notifications-list">
                      {notifications && notifications.length > 0 ? notifications.map((n, i) => (
                        <div 
                          key={i} 
                          onClick={() => {
                            setShowNotifications(false);
                            navigate(user.role === 'user' ? '/my-reports' : '/police-dashboard');
                          }}
                          className="notification-item"
                        >
                          <div className="item-meta">
                            <div className="item-ref">
                              {((user.role === 'user' && !n.isReadByUser) || (user.role !== 'user' && !n.isReadByPolice)) && (
                                <div className="unread-dot"></div>
                              )}
                              <span>{n.referenceId}</span>
                            </div>
                            <span className="item-time">{new Date(n.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="item-title">{n.title}</div>
                        </div>
                      )) : (
                        <div className="empty-notifications">
                          <Bell size={32} />
                          <p>No active transmissions detected.</p>
                        </div>
                      )}
                    </div>
                    <Link to={user.role === 'user' ? '/my-reports' : '/police-dashboard'} onClick={() => setShowNotifications(false)} className="view-all-link">
                      ACCESS COMMAND CENTER
                    </Link>
                  </div>
                )}
              </div>
            )}
            <Link to="/osint-trial" className="btn-outline desktop-only">
              <Play size={16} />
              Try OSINT
            </Link>
            {user ? (
              <Link to="/profile" className="nav-profile-pill">
                <div className="profile-avatar-box">
                  {user.profileImage ? <img src={user.profileImage} alt="Avatar" /> : <UserIcon size={14} />}
                </div>
                <span className="desktop-only">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link to="/login" className="btn-primary desktop-only">Login</Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Backdrop for Mobile Menu */}
        {isOpen && <div className="mobile-menu-backdrop" onClick={() => setIsOpen(false)}></div>}

        {/* RIGHT SIDE TACTICAL DRAWER */}
        <div className={`mobile-menu-drawer ${isOpen ? 'open' : ''}`}>
          <div className="drawer-header">
            <Shield size={20} className="text-[#00d2ff]" />
            <span>COMMAND MENU</span>
            <X size={24} onClick={() => setIsOpen(false)} style={{ cursor: 'pointer', marginLeft: 'auto' }} />
          </div>

          <div className="drawer-links">
            <div className="drawer-section-title">INTELLIGENCE ASSETS</div>
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="drawer-link" onClick={() => setIsOpen(false)}>
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}

            <div className="drawer-section-title">OPERATIONAL PORTALS</div>
            {user?.role === 'admin' && (
              <Link to="/admin" className="drawer-link portal-link-admin" onClick={() => setIsOpen(false)}>
                <Shield size={18} />
                <span>Admin Portal</span>
              </Link>
            )}
            {user?.role === 'police' && (
              <Link to="/police-dashboard" className="drawer-link portal-link-police" onClick={() => setIsOpen(false)}>
                <Users size={18} />
                <span>Police Portal</span>
              </Link>
            )}
            {user && (
              <Link to="/my-reports" className="drawer-link portal-link-user" onClick={() => setIsOpen(false)}>
                <Layout size={18} />
                <span>My Reports</span>
              </Link>
            )}
            
            <Link to="/osint-trial" className="drawer-link" onClick={() => setIsOpen(false)}>
              <Play size={18} className="text-[#00d2ff]" />
              <span>Live OSINT Scan</span>
            </Link>

            <div className="drawer-section-title">USER ACCOUNT</div>
            {user ? (
              <>
                <Link to="/profile" className="drawer-link" onClick={() => setIsOpen(false)}>
                  <UserIcon size={18} />
                  <span>Profile Settings</span>
                </Link>
                <button onClick={handleLogout} className="drawer-link logout-btn" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="drawer-link login-btn-mobile" onClick={() => setIsOpen(false)}>
                <UserIcon size={18} />
                <span>Sign In / Login</span>
              </Link>
            )}
          </div>
          
          <div className="drawer-footer">
            <span style={{ opacity: 0.5 }}>WHITE ZERO v1.0.4</span>
            <div className="status-indicator">
              <div className="status-dot"></div>
              SYSTEM_READY
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
