import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import FadeInSection from '../components/FadeInSection';
import { 
  User, Mail, Lock, Save, Shield, Edit2, LogOut, Upload, X, 
  Search, BookOpen, MessageSquare, Check, Trash2, Trophy, 
  Zap, Calendar, Award, Info, Terminal, Activity, Globe,
  FileText, ExternalLink, Download, Printer, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Move
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
  
  // Alignment States
  const [isAligning, setIsAligning] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setTempImage(reader.result);
      setIsAligning(true);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setDragging(false);

  const handleSaveAlignment = async () => {
    setIsUploading(true);
    setIsAligning(false);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = tempImage;

    img.onload = async () => {
      canvas.width = 400;
      canvas.height = 400;
      
      // Calculate crop
      const aspect = img.width / img.height;
      let drawWidth, drawHeight;
      
      if (aspect > 1) {
        drawHeight = 400 * zoom;
        drawWidth = drawHeight * aspect;
      } else {
        drawWidth = 400 * zoom;
        drawHeight = drawWidth / aspect;
      }

      ctx.fillStyle = '#0a0b10';
      ctx.fillRect(0, 0, 400, 400);
      
      // Draw circular clip
      ctx.beginPath();
      ctx.arc(200, 200, 200, 0, Math.PI * 2);
      ctx.clip();
      
      ctx.drawImage(
        img, 
        200 - (drawWidth / 2) + position.x, 
        200 - (drawHeight / 2) + position.y, 
        drawWidth, 
        drawHeight
      );

      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('image', blob, 'identity_asset.png');
        
        try {
          const res = await fetch('/api/users/upload', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${user.token}` },
            body: formData
          });
          const data = await res.json();
          if (res.ok) {
            setProfileImage(data.imageUrl);
            setMessage({ type: 'success', text: 'Forensic asset calibrated and archived.' });
          } else {
            setMessage({ type: 'error', text: 'Calibration failed.' });
          }
        } catch (error) {
          setMessage({ type: 'error', text: 'Archive error.' });
        } finally {
          setIsUploading(false);
        }
      }, 'image/png');
    };
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
        toast.success('SUCCESS: Forensic report removed from archive.');
      } else {
        console.error('[PURGE FAILED]:', data.message);
        toast.error('PURGE FAILED: ' + (data.message || 'Access Denied.'));
      }
    } catch (error) {
      console.error('[NETWORK ERROR]:', error);
      toast.error('CONNECTION ERROR: Security server unreachable.');
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
        toast.success('FULL ARCHIVE PURGE COMPLETE.');
      } else {
        toast.error('Failed to clear forensic history.');
      }
    } catch (error) {
      console.error('Clear history error:', error);
      toast.error('Network error: Could not reach security node.');
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
    if (!printWindow) {
      toast.error('PRINT ERROR: Browser blocked the document transmission. Enable pop-ups.');
      return;
    }
    
    const reportBody = report.content || `
      PLATFORM: ${report.platform}
      INCIDENT: ${report.incidentType}
      REFERENCE: ${report.referenceId}
      TIMESTAMP: ${new Date(report.createdAt).toLocaleString()}
    `;

    printWindow.document.write(`
      <html>
        <head>
          <style>
            /* This is the tactical fix to remove browser headers/footers (URL, Title) */
            @page { 
              margin: 0; 
            }
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
              padding: 1in; 
              line-height: 1.8; 
              color: #000; 
              background: white; 
              margin: 0;
            }
            pre { 
              white-space: pre-wrap; 
              word-wrap: break-word;
              font-family: inherit; 
              font-size: 11pt; 
              margin: 0;
            }
            .minimal-footer { 
              margin-top: 50px; 
              font-size: 9pt; 
              color: #888; 
              text-align: center;
              border-top: 1px solid #eee;
              padding-top: 20px;
              letter-spacing: 1px;
              text-transform: uppercase;
            }
            @media print {
              body { padding: 1in; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <pre>${reportBody}</pre>
          <div class="minimal-footer">
            Document generated by White Zero Intelligence Framework
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
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

      <div className="responsive-grid">
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
                minWidth: '280px', 
                flex: '1 0 30%',
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
    <div className="glass" style={{ padding: '3rem', borderRadius: '30px', animation: 'fadeIn 0.5s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Operational Identity Config</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Modify forensic persona and security credentials.</p>
        </div>
        <button onClick={() => setIsEditing(false)} className="btn-outline" style={{ padding: '0.8rem 1.5rem' }}>Cancel</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {/* Avatar Section */}
        <div className="edit-section">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <User size={18} className="text-[#00d2ff]" /> Forensic Persona Selection
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {DEFAULT_AVATARS.map((avatar, i) => (
              <div 
                key={i} 
                onClick={() => setProfileImage(avatar)}
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '15px', 
                  cursor: 'pointer',
                  border: profileImage === avatar ? '3px solid #00d2ff' : '1px solid rgba(255,255,255,0.1)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  transform: profileImage === avatar ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: profileImage === avatar ? '0 0 20px rgba(0, 210, 255, 0.3)' : 'none'
                }}
              >
                <img src={avatar} alt={`Avatar ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              type="button" 
              onClick={() => fileInputRef.current.click()}
              className="btn-outline" 
              style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
            >
              <Upload size={14} style={{ marginRight: '0.5rem' }} /> Custom Identity Upload
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
              accept="image/*"
            />
            {isUploading && <span style={{ fontSize: '0.8rem', color: '#00d2ff' }}>Uploading forensic asset...</span>}
          </div>
        </div>

        <div className="responsive-grid" style={{ gap: '2rem' }}>
          {/* General Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Edit2 size={18} className="text-[#a855f7]" /> Personal Metadata
            </h3>
            <div className="form-group">
              <label>Operative Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Full Name"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}
                required 
              />
            </div>
            <div className="form-group">
              <label>Intelligence Bio</label>
              <textarea 
                value={bio} 
                onChange={e => setBio(e.target.value)} 
                placeholder="Briefly describe your forensic specialization..."
                rows="4" 
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          </div>

          {/* Security Credentials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Lock size={18} className="text-[#f59e0b]" /> Security Synchronization
            </h3>
            <div className="form-group">
              <label>Current Credentials (Required for Password Change)</label>
              <input 
                type="password" 
                value={oldPassword} 
                onChange={e => setOldPassword(e.target.value)}
                placeholder="••••••••"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
            <div className="form-group">
              <label>New Access Code</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
            <div className="form-group">
              <label>Confirm Access Code</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`message ${message.type}`} style={{ padding: '1rem', borderRadius: '10px', background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: message.type === 'error' ? '#ef4444' : '#10b981', border: `1px solid ${message.type === 'error' ? '#ef4444' : '#10b981'}` }}>
            {message.text}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary" style={{ flex: 1, padding: '1.2rem', fontSize: '1rem', fontWeight: 'bold' }}>
            Synchronize Profile
          </button>
        </div>
      </form>
    </div>
  );

  const renderAlignerModal = () => (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '600px', padding: '3rem', borderRadius: '40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Forensic Asset Calibration</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Align and zoom the identity asset within the viewfinder.</p>
        
        <div 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ 
            width: '350px', 
            height: '350px', 
            margin: '0 auto 2rem', 
            borderRadius: '50%', 
            border: '4px solid #00d2ff',
            overflow: 'hidden',
            position: 'relative',
            cursor: dragging ? 'grabbing' : 'grab',
            background: `#0a0b10 url(${tempImage}) no-repeat`,
            backgroundSize: `${zoom * 100}%`,
            backgroundPosition: `calc(50% + ${position.x}px) calc(50% + ${position.y}px)`,
            boxShadow: '0 0 40px rgba(0, 210, 255, 0.2)',
            transition: dragging ? 'none' : 'background-position 0.1s ease, background-size 0.1s ease'
          }}
        >
          {/* Viewfinder crosshair */}
          <div style={{ position: 'absolute', top: 0, left: '50%', width: '1px', height: '100%', background: 'rgba(0, 210, 255, 0.2)', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'rgba(0, 210, 255, 0.2)', pointerEvents: 'none' }}></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
            <ZoomOut size={20} color="var(--text-muted)" />
            <input 
              type="range" 
              min="0.1" 
              max="5" 
              step="0.05" 
              value={zoom} 
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              style={{ width: '200px' }}
            />
            <ZoomIn size={20} color="#00d2ff" />
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Zoom Level: {Math.round(zoom * 100)}% | Click and drag to position
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <button onClick={() => setIsAligning(false)} className="btn-outline" style={{ flex: 1 }}>Discard</button>
          <button onClick={handleSaveAlignment} className="btn-primary" style={{ flex: 1 }}>Confirm Calibration</button>
        </div>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="page-container">
      {isAligning && renderAlignerModal()}
      <FadeInSection direction="down">
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
          {isEditing ? renderEditMode() : renderViewMode()}
        </div>
      </FadeInSection>
    </div>
  );
};

export default Profile;
