import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, Play, Hexagon, LogOut, User as UserIcon, Bell, Info, FileText, Layout, Users, Mail, Cpu, Settings, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/avatar';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMobileNotice, setShowMobileNotice] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  
  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `- ${diffMins}m ago`;
    if (diffHours < 24) return `- ${diffHours} hours ago`;
    return `- ${diffDays} days ago`;
  };

  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [triggerNotification, setTriggerNotification] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const isFeaturePage = location.pathname.startsWith('/features') || 
                          location.pathname.startsWith('/osint-trial') || 
                          location.pathname.startsWith('/intelligence-lab') || 
                          location.pathname.startsWith('/content-sentinel');
                          
    if (isMobile && isFeaturePage) {
      setShowMobileNotice(true);
      const timer = setTimeout(() => setShowMobileNotice(false), 10000);
      return () => clearTimeout(timer);
    } else {
      setShowMobileNotice(false);
    }
  }, [location.pathname]);

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
            const newCount = data.count || 0;
            
            // Trigger animation if unread count increased
            if (newCount > unreadCount) {
              setTriggerNotification(true);
              setTimeout(() => setTriggerNotification(false), 1000);
            }
            
            setUnreadCount(newCount);
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
  }, [user, unreadCount]);

  const navLinks = [
    { name: 'About', path: '/about', icon: <Info size={18} /> },
    { name: 'Tactical Suite', path: '/features', icon: <Cpu size={18} /> },
    { name: 'Cyber Blog', path: '/articles', icon: <FileText size={18} /> },
    { name: 'Contact', path: '/contact', icon: <Mail size={18} /> },
  ];

  const handleClearNotifications = async (e) => {
    e.stopPropagation();
    if (!user || !user.token) return;
    try {
      const res = await fetch('/api/police-reports/clear-all', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        setUnreadCount(0);
        setTotalCount(0);
        setNotifications([]);
      }
    } catch (err) {
      console.error('[CLEAR ALL NOTIFICATIONS ERROR]', err);
    }
  };

  const handleClearIndividualNotification = async (e, reportId) => {
    e.stopPropagation();
    if (!user || !user.token) return;
    
    // Optimistic UI updates
    setNotifications(prev => prev.filter(n => n._id !== reportId));
    
    try {
      const res = await fetch(`/api/police-reports/${reportId}/clear`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        // Fetch updated counts
        const countRes = await fetch('/api/police-reports/unread-count', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (countRes.ok) {
          const data = await countRes.json();
          setUnreadCount(data.count || 0);
          setTotalCount(data.totalCount || 0);
        }
      }
    } catch (err) {
      console.error('[CLEAR INDIVIDUAL NOTIFICATION ERROR]', err);
    }
  };

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
            <div className="logo-icon-container" style={{ position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Hexagon size={36} className="logo-hexagon" style={{ position: 'absolute' }} />
              <Shield size={18} className="logo-shield" style={{ position: 'absolute', zIndex: 1 }} />
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
                  className={`notification-toggle ${triggerNotification ? 'animate-bell' : ''}`}
                >
                  <Bell size={22} color={unreadCount > 0 ? "#00d2ff" : "#888"} />
                  {unreadCount > 0 && <span className={`notification-badge ${triggerNotification ? 'animate-badge' : ''}`}>{unreadCount}</span>}
                </button>

                {showNotifications && (
                  <div className="notifications-dropdown glass">
                    <div className="dropdown-header">
                      <span>Notifications</span>
                      {notifications && notifications.length > 0 && (
                        <button 
                          onClick={handleClearNotifications}
                          className="clear-all-btn"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="notifications-list">
                      {notifications && notifications.length > 0 ? notifications.map((n, i) => {
                        const isUnread = (user.role === 'user' && !n.isReadByUser) || (user.role !== 'user' && !n.isReadByPolice);
                        return (
                          <div 
                            key={n._id || i} 
                            onClick={async () => {
                              setShowNotifications(false);
                              navigate(
                                user.role === 'user' ? '/my-reports' : '/police-dashboard',
                                { state: { reportId: n._id } }
                              );
                              
                              // Optimistically clear the notification item from the dropdown list instantly
                              setNotifications(prev => prev.filter(item => item._id !== n._id));
                              
                              // If it was unread, optimistically decrement the unread badge count
                              if (isUnread) {
                                setUnreadCount(prev => Math.max(0, prev - 1));
                              }

                              try {
                                // Mark as read/cleared on backend
                                const res = await fetch(`/api/police-reports/${n._id}/read`, {
                                  method: 'PATCH',
                                  headers: { 'Authorization': `Bearer ${user.token}` }
                                });
                                if (res.ok) {
                                  // Fetch fresh server-side counts to keep states perfectly in sync
                                  const countRes = await fetch('/api/police-reports/unread-count', {
                                    headers: { 'Authorization': `Bearer ${user.token}` }
                                  });
                                  if (countRes.ok) {
                                    const data = await countRes.json();
                                    setUnreadCount(data.count || 0);
                                    setTotalCount(data.totalCount || 0);
                                  }
                                }
                              } catch (err) {
                                console.error('[AUTO CLEAR ON READ ERROR]', err);
                              }
                            }}
                            className={`notification-item ${isUnread ? 'unread' : 'read'}`}
                            style={{ animationDelay: `${i * 0.05}s` }}
                          >
                            <span className={`status-bullet ${isUnread ? 'bullet-unread' : 'bullet-read'}`}></span>
                            <div className="notification-details">
                              <span className="notification-title">{n.title}</span>
                              <span className="notification-time">{getRelativeTime(n.updatedAt)}</span>
                            </div>
                            <button 
                              onClick={(e) => handleClearIndividualNotification(e, n._id)}
                              className="clear-item-btn"
                              title="Clear notification"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      }) : (
                        <div className="empty-notifications">
                          <Bell size={32} />
                          <p>No active transmissions detected.</p>
                        </div>
                      )}
                    </div>
                    <Link to={user.role === 'user' ? '/my-reports' : '/police-dashboard'} onClick={() => setShowNotifications(false)} className="view-all-link">
                      Show all notifications
                    </Link>
                  </div>
                )}
              </div>
            )}
            <Link to="/osint-trial" className="btn-try-osint desktop-only">
              <Search size={14} />
              <span>Try OSINT</span>
            </Link>
            {user ? (
              <Link to="/profile" className="nav-profile-pill">
                <div className="profile-avatar-box">
                  <img src={getAvatarUrl(user)} alt="Avatar" />
                </div>
                <span className="desktop-only">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link to="/login" className="btn-primary desktop-only" style={{ height: '40px', padding: '0 1.5rem', fontSize: '0.85rem' }}>Login</Link>
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
            <span>COMMAND MENU</span>
            <X size={24} onClick={() => setIsOpen(false)} style={{ cursor: 'pointer', marginLeft: 'auto' }} />
          </div>

          <div className="drawer-links">
            <div className="drawer-section-title">INTELLIGENCE ASSETS</div>
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="drawer-link" onClick={() => setIsOpen(false)}>
                <span style={{ marginRight: '1rem', color: '#00d2ff' }}>{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}

            <div className="drawer-section-title">OPERATIONAL PORTALS</div>
            {user?.role === 'admin' && (
              <Link to="/admin" className="drawer-link portal-link-admin" onClick={() => setIsOpen(false)}>
                <span style={{ marginRight: '1rem', color: '#00d2ff' }}><Shield size={18} /></span>
                <span>Admin Portal</span>
              </Link>
            )}
            {user?.role === 'police' && (
              <Link to="/police-dashboard" className="drawer-link portal-link-police" onClick={() => setIsOpen(false)}>
                <span style={{ marginRight: '1rem', color: '#10b981' }}><Shield size={18} /></span>
                <span>Police Portal</span>
              </Link>
            )}
            {user && (
              <Link to="/my-reports" className="drawer-link portal-link-user" onClick={() => setIsOpen(false)}>
                <span style={{ marginRight: '1rem', color: '#00d2ff' }}><FileText size={18} /></span>
                <span>My Reports</span>
              </Link>
            )}
            
            <Link to="/osint-trial" className="drawer-link" onClick={() => setIsOpen(false)}>
              <span style={{ marginRight: '1rem', color: '#00d2ff' }}><Search size={18} /></span>
              <span>Live OSINT Scan</span>
            </Link>

            <div className="drawer-section-title">USER ACCOUNT</div>
            {user ? (
              <>
                <Link to="/profile" className="drawer-link" onClick={() => setIsOpen(false)}>
                  <span style={{ marginRight: '1rem', color: '#00d2ff' }}><UserIcon size={18} /></span>
                  <span>Profile Settings</span>
                </Link>
                <button onClick={handleLogout} className="drawer-link logout-btn" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                  <span style={{ marginRight: '1rem', color: '#ef4444' }}><LogOut size={18} /></span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="drawer-link login-btn-mobile" onClick={() => setIsOpen(false)}>
                <span style={{ marginRight: '1rem', color: '#00d2ff' }}><UserIcon size={18} /></span>
                <span>Sign In / Login</span>
              </Link>
            )}
          </div>
          
          <div className="drawer-footer">
            <span className="footer-brand">WHITE ZERO</span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
