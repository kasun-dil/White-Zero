import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import FadeInSection from '../components/FadeInSection';
import { 
  User, Mail, Lock, Save, Shield, Edit2, LogOut, Upload, X, 
  Search, BookOpen, MessageSquare, Check, Trash2, Trophy, 
  Zap, Calendar, Award, Info, Terminal, Activity, Globe,
  FileText, ExternalLink, Download, Printer, ChevronLeft, ChevronRight
} from 'lucide-react';
import './PageStyles.css';

const DEFAULT_AVATARS = [
  '/avatars/hacker.png',
  '/avatars/robot.png',
  '/avatars/ninja.png',
  '/avatars/retro.png',
  '/avatars/operative.png',
  '/avatars/female_hacker.png',
  '/avatars/female_operative.png',
  '/avatars/female_ninja.png'
];

const Profile = () => {
  const { user, updateProfile, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activity, setActivity] = useState({ searches: [], reads: [], feedback: [], bookmarks: [], stats: {} });
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [readFilter, setReadFilter] = useState('all');
  
  const fileInputRef = useRef(null);

  const [ipAddress, setIpAddress] = useState('Detecting...');
  const [bandwidth, setBandwidth] = useState('0 Mbps');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setProfileImage(user.profileImage || '');
      fetchActivity();
      fetchReports();

      fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => setIpAddress(data.ip))
        .catch(() => setIpAddress('127.0.0.1 (Local Node)'));

      if (navigator.connection) {
        setBandwidth(`${navigator.connection.downlink} Mbps`);
      } else {
        setBandwidth('100 Mbps (Stable)');
      }
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchActivity = async () => {
    try {
      const res = await fetch('/api/users/profile/activity', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setActivity(data);
    } catch (error) {
      console.error('Error fetching activity', error);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports/my', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) setReports(data);
    } catch (error) {
      console.error('Error fetching reports', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('/api/users/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setProfileImage(data.imageUrl);
        setMessage({ type: 'success', text: 'Image uploaded! Click Save to apply.' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Upload failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image.' });
    } finally {
      setIsUploading(false);
    }
  };

  const reportsScrollRef = useRef(null);

  const scrollReports = (direction) => {
    if (reportsScrollRef.current) {
      const { scrollLeft, clientWidth } = reportsScrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth
        : scrollLeft + clientWidth;
      reportsScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('PERMANENT DELETION: Are you sure you want to purge this forensic report from the secure archive?')) return;
    
    try {
      console.log(`[PURGE REQUEST]: Purging intelligence node ${reportId}...`);
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('[PURGE SUCCESS]: Intelligence purged.');
        setReports(prev => prev.filter(r => r._id !== reportId));
        alert('SUCCESS: Forensic report has been permanently removed from the security archive.');
      } else {
        console.error('[PURGE FAILED]:', data.message);
        alert('PURGE FAILED: ' + (data.message || 'The security server rejected the deletion request.'));
      }
    } catch (error) {
      console.error('[NETWORK ERROR]:', error);
      alert('CONNECTION ERROR: Could not reach the security server. Please ensure the backend is active.');
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('SECURITY ALERT: This will PERMANENTLY PURGE all archived reports, search history, and saved intelligence. This action cannot be undone. Proceed?')) return;
    
    try {
      const response = await fetch('/api/users/profile/clear-history', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      
      if (response.ok) {
        setReports([]);
        setActivity({ searches: [], bookmarks: [] });
        alert('FULL ARCHIVE PURGE COMPLETE: All forensic records and intelligence history have been removed.');
      } else {
        alert('Failed to clear forensic history.');
      }
    } catch (error) {
      console.error('Clear history error:', error);
      alert('Network error: Could not reach the security node.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (newPassword) {
      if (!oldPassword) {
        setMessage({ type: 'error', text: 'Current password is REQUIRED to set a new password.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match.' });
        return;
      }
    }
    const userData = { name, bio, profileImage };
    if (newPassword) {
      userData.password = newPassword;
      userData.oldPassword = oldPassword;
    }
    const res = await updateProfile(userData);
    if (res.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setIsEditing(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMessage({ type: 'error', text: res.error });
    }
  };

  const handlePrint = (report) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Forensic Report - ${report.referenceId}</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; padding: 40px; line-height: 1.6; color: #333; background: white; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: 12pt; }
            .header { border-bottom: 2px solid #000; margin-bottom: 20px; padding-bottom: 10px; }
            .footer { margin-top: 50px; font-size: 10pt; color: #777; border-top: 1px solid #ccc; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>WHITE ZERO FORENSIC INTELLIGENCE</h2>
            <p>Archived Incident Documentation</p>
          </div>
          <pre>${report.content}</pre>
          <div class="footer">
            <p>This is an archived forensic document. Reference ID: ${report.referenceId}. Generated via White Zero Platform.</p>
          </div>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const renderEmptyState = (icon, text) => (
    <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
      {icon}
      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{text}</p>
    </div>
  );

  const renderViewMode = () => {
    const currentLevel = Math.floor(reports.length / 10) + 1;
    const getRank = (lvl) => {
      if (lvl === 1) return 'Alpha';
      if (lvl === 2) return 'Beta';
      if (lvl === 3) return 'Gamma';
      return 'Omega';
    };
    const networkRank = getRank(currentLevel);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Profile Header Card */}
              <div className="glass" style={{ padding: '3rem', borderRadius: '30px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0, 210, 255, 0.1) 0%, transparent 70%)', zIndex: 0 }}></div>
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: '160px', height: '160px', borderRadius: '50%', border: '4px solid #00d2ff', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(0, 210, 255, 0.2)' }}>
                      {profileImage ? <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={80} color="rgba(255,255,255,0.1)" />}
                    </div>
                    <div style={{ position: 'absolute', bottom: '5px', right: '5px', background: '#10b981', border: '3px solid #0a0b10', width: '25px', height: '25px', borderRadius: '50%' }}></div>
                  </div>
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '800' }}>{user?.name}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Mail size={16} /> {user?.email}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={16} /> Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => setIsEditing(true)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}>
                          <Edit2 size={16} /> Edit Profile
                        </button>
                        <button onClick={handleClearHistory} className="btn-outline" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}>
                          <Trash2 size={16} /> Clear History
                        </button>
                        <button onClick={handleLogout} className="btn-primary" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444' }}>
                          <LogOut size={16} />
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <div className="glass" style={{ padding: '0.4rem 1rem', borderRadius: '15px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 210, 255, 0.1)', color: '#00d2ff', fontWeight: 'bold' }}>
                        <Shield size={14} /> {user?.role?.toUpperCase()} ACCOUNT
                      </div>
                      <div className="glass" style={{ padding: '0.4rem 1rem', borderRadius: '15px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Award size={14} className="text-[#f59e0b]" /> LEVEL {currentLevel} INVESTIGATOR
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {[
                  { label: 'Secure Node IP', value: ipAddress, icon: <Globe size={20} />, color: '#10b981' },
                  { label: 'Investigations', value: reports.length, icon: <Search size={20} />, color: '#00d2ff' },
                  { label: 'Intelligence Read', value: activity.stats?.readCount || 0, icon: <Award size={20} />, color: '#f59e0b' },
                  { label: 'Network Rank', value: networkRank, icon: <Trophy size={20} />, color: '#a855f7' }
                ].map((stat, i) => (
                  <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: '20px', textAlign: 'center' }}>
                    <div style={{ color: stat.color, marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {/* Forensic Reports Section */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '25px', gridColumn: '1 / -1', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', margin: 0 }}>
              <FileText size={20} className="text-[#f59e0b]" /> Forensic Intelligence Reports
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-icon" onClick={() => scrollReports('left')} style={{ 
                padding: '0.4rem', 
                borderRadius: '50%', 
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                cursor: 'pointer'
              }}>
                <ChevronLeft size={18} />
              </button>
              <button className="btn-icon" onClick={() => scrollReports('right')} style={{ 
                padding: '0.4rem', 
                borderRadius: '50%', 
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                cursor: 'pointer'
              }}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          
          <div className="modern-scroll-container" ref={reportsScrollRef} style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            overflowX: 'auto', 
            paddingBottom: '1.5rem',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth'
          }}>
            {reports.map((report) => (
              <div key={report._id} className="glass premium-card" style={{ 
                minWidth: 'calc(33.33% - 1rem)', 
                flexShrink: 0, 
                padding: '1.5rem', 
                borderRadius: '20px', 
                borderLeft: '4px solid #f59e0b', 
                transition: '0.3s',
                scrollSnapAlign: 'start',
                position: 'relative'
              }}>
                <button 
                  onClick={() => handleDeleteReport(report._id)}
                  style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', opacity: 0.6 }}
                  title="Purge Report"
                >
                  <Trash2 size={16} />
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 'bold' }}>INCIDENT LOG</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 style={{ marginBottom: '0.5rem', maxWidth: '85%' }}>{report.platform} Analysis</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{report.incidentType}</p>
                
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => setSelectedReport(report)}>
                    View Letter
                  </button>
                  <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: '#f59e0b', color: 'black', border: 'none' }} onClick={() => handlePrint(report)}>
                    <Printer size={14} /> Print
                  </button>
                </div>
              </div>
            ))}
          </div>
          {reports.length === 0 && renderEmptyState(<FileText size={30} />, "No forensic reports archived yet.")}
        </div>

        {/* Search Activity */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '25px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <Search size={20} className="text-[#00d2ff]" /> Investigation Log
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activity.searches.slice(0, 5).map((s, i) => (
              <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: '3px solid #00d2ff' }}>
                <div style={{ fontWeight: 'bold' }}>{s.query}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(s.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Intelligence */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '25px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <Save size={20} className="text-[#a855f7]" /> Saved Articles
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activity.bookmarks?.slice(0, 5).map((art) => (
              <Link key={art._id} to={`/articles/${art._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="glass premium-card" style={{ padding: '1rem', borderRadius: '12px', borderLeft: '3px solid #a855f7' }}>
                  <div style={{ fontWeight: 'bold' }}>{art.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <div className="modal-backdrop" onClick={() => setSelectedReport(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '3rem', borderRadius: '30px', background: 'white', color: '#111' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #111', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <h2 style={{ color: '#111' }}>Forensic Report</h2>
              <button onClick={() => setSelectedReport(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}><X /></button>
            </div>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: "'Times New Roman', serif", fontSize: '1.1rem', lineHeight: '1.6' }}>
              {selectedReport.content}
            </pre>
            <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => handlePrint(selectedReport)}>
                <Printer size={18} /> Print Now
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    );
  };

  const renderEditMode = () => (
    <div className="glass" style={{ padding: '3rem', borderRadius: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2>Edit Profile</h2>
        <button onClick={() => setIsEditing(false)} className="btn-outline">Cancel</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="profile-titles">
            <h1>{user.name}</h1>
            <p className="user-role"><Shield size={14} /> Security Analyst</p>
          </div>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows="3" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleClearHistory} className="btn-outline" style={{ borderColor: 'rgba(255, 77, 77, 0.3)', color: '#ff4d4d', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trash2 size={18} /> Clear Forensic History
          </button>
          <button onClick={logout} className="logout-btn">
            <LogOut size={18} /> Logout
          </button>
        </div>
        <button type="submit" className="btn-primary" style={{ marginTop: '2rem', width: '100%' }}>Save Changes</button>
      </form>
    </div>
  );

  if (!user) return null;

  return (
    <div className="page-container">
      <FadeInSection direction="down">
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
          {isEditing ? renderEditMode() : renderViewMode()}
        </div>
      </FadeInSection>
    </div>
  );
};

export default Profile;
