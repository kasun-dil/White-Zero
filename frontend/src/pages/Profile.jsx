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
import { getAvatarUrl } from '../utils/avatar';
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

  // Alignment States
  const [isAligning, setIsAligning] = useState(false);
  const [activeTab, setActiveTab] = useState('reports');
  const [searchPage, setSearchPage] = useState(1);
  const SEARCH_PER_PAGE = 12;
  const [ipAddress, setIpAddress] = useState('FETCHING...');
  const [bandwidth, setBandwidth] = useState('0 Mbps');
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Report Editing States
  const [isEditingReport, setIsEditingReport] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isSavingReport, setIsSavingReport] = useState(false);

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
    // Fetch IP Address
    const fetchIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (err) {
        setIpAddress('127.0.0.1');
      }
    };
    fetchIP();
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

  const handleDownloadDoc = (report) => {
    const reportContent = report._id === selectedReport?._id ? editedContent : report.content;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
      "xmlns:w='urn:schemas-microsoft-com:office:word' " +
      "xmlns='http://www.w3.org/TR/REC-html40'>" +
      "<head><meta charset='utf-8'><title>Forensic Report</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + `<pre style="font-family: 'Courier New', Courier, monospace; font-size: 10pt; white-space: pre-wrap;">${reportContent}</pre>` + footer;

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileLink = document.createElement("a");
    document.body.appendChild(fileLink);
    fileLink.href = source;
    fileLink.download = `Forensic_Report_${report.referenceId || report._id}.doc`;
    fileLink.click();
    document.body.removeChild(fileLink);
    toast.success('Dossier exported as editable .DOC');
  };

  const handleSaveReportEdits = async () => {
    if (!selectedReport) return;
    setIsSavingReport(true);
    try {
      const res = await fetch(`/api/reports/${selectedReport._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ content: editedContent })
      });

      if (res.ok) {
        const updatedReport = await res.json();
        setReports(prev => prev.map(r => r._id === updatedReport._id ? updatedReport : r));
        setSelectedReport(updatedReport);
        setIsEditingReport(false);
        toast.success('SUCCESS: Forensic intelligence updated.');
      } else {
        toast.error('FAILED: Could not update intelligence node.');
      }
    } catch (error) {
      toast.error('NETWORK ERROR: Server unreachable.');
    } finally {
      setIsSavingReport(false);
    }
  };

  const openReportModal = (report) => {
    setSelectedReport(report);
    setEditedContent(report.content);
    setIsEditingReport(false);
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
        {/* Dashboard Profile Card */}
        <div className="profile-dashboard-card">
          <div className="profile-banner">
            <div className="profile-banner-overlay"></div>
            <div className="banner-top-left-info">
              <div className="ip-badge-glass">
                <Shield size={12} /> <span>SECURE ACCESS: {ipAddress}</span>
              </div>
            </div>
            <div className="profile-banner-actions">
              <button onClick={() => setIsEditing(true)} className="btn-banner-glass cyan">
                <Edit2 size={14} /> <span>Edit</span>
              </button>
              <button onClick={handleClearHistory} className="btn-banner-glass white">
                <Trash2 size={14} /> <span>Reset</span>
              </button>
              <button onClick={handleLogout} className="btn-banner-glass red">
                <LogOut size={14} /> <span>Logout</span>
              </button>
            </div>
          </div>

          <div className="profile-header-content">
            <div className="avatar-overlap-wrapper">
              <div className="avatar-overlap">
                <img src={getAvatarUrl({ profileImage, name: user?.name })} alt="Profile" />
              </div>
            </div>

            <div className="profile-main-info">
              <h2>{user?.name}</h2>
              <p>{user?.role} Investigator</p>
            </div>
          </div>

          <div className="profile-sub-nav">
            <button
              onClick={() => setActiveTab('reports')}
              className={`nav-link-mini ${activeTab === 'reports' ? 'active' : ''}`}
            >
              <FileText size={16} /> My Reports
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`nav-link-mini ${activeTab === 'search' ? 'active' : ''}`}
            >
              <Search size={16} /> Search History
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`nav-link-mini ${activeTab === 'saved' ? 'active' : ''}`}
            >
              <Save size={16} /> Saved Articles
            </button>
          </div>
        </div>

        <div className="profile-tab-content-wrapper">
          {/* My Reports Tab */}
          {activeTab === 'reports' && (
            <FadeInSection direction="up">
              <div className="premium-content-card">
                <h3 className="section-title">
                  <FileText size={22} className="text-[#f59e0b]" /> Intelligence Archive
                </h3>

                <div className="blog-archive-grid" style={{ marginTop: '2rem' }}>
                  {reports.map((report) => (
                    <div key={report._id} className="report-item-professional">
                      <div style={{ flex: 1 }}>
                        <div className="report-tag-lux">INCIDENT LOG • {report.platform}</div>
                        <h4 className="report-title-lux">{report.incidentType}</h4>
                        <div className="report-date-lux">{new Date(report.createdAt).toLocaleDateString()}</div>
                        <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                          <button className="btn-banner-glass white" onClick={() => openReportModal(report)}>Review</button>
                          <button className="btn-banner-glass cyan" onClick={() => handleDownloadDoc(report)}>Download .DOC</button>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteReport(report._id)} className="btn-purge"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
                {reports.length === 0 && renderEmptyState(<FileText size={30} />, "No forensic reports archived yet.")}
              </div>
            </FadeInSection>
          )}

          {/* Search History Tab */}
          {activeTab === 'search' && (
            <FadeInSection direction="up">
              <div className="premium-content-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3 className="section-title" style={{ margin: 0 }}><Search size={20} className="text-[#00d2ff]" /> Investigation Log</h3>
                  <div className="pagination-controls">
                    <button 
                      className="btn-icon-small" 
                      disabled={searchPage === 1}
                      onClick={() => setSearchPage(p => p - 1)}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="page-indicator">PAGE {searchPage}</span>
                    <button 
                      className="btn-icon-small" 
                      disabled={searchPage * SEARCH_PER_PAGE >= activity.searches.length}
                      onClick={() => setSearchPage(p => p + 1)}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="search-grid-compact">
                  {activity.searches
                    .slice((searchPage - 1) * SEARCH_PER_PAGE, searchPage * SEARCH_PER_PAGE)
                    .map((s, i) => (
                    <div key={i} className="search-pill-tactical">
                      <div className="search-meta">
                        <Terminal size={12} className="text-[#00d2ff]" />
                        <span>QUERY NODE</span>
                      </div>
                      <div className="search-query-text">{s.query}</div>
                      <div className="search-timestamp">
                        {new Date(s.createdAt).toLocaleDateString()} • {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                </div>
                {activity.searches.length === 0 && renderEmptyState(<Search size={30} />, "No search history recorded.")}
              </div>
            </FadeInSection>
          )}

          {/* Saved Articles Tab */}
          {activeTab === 'saved' && (
            <FadeInSection direction="up">
              <div className="premium-content-card">
                <h3 className="section-title"><Save size={20} className="text-[#a855f7]" /> Saved Intelligence</h3>
                <div className="blog-archive-grid" style={{ marginTop: '2rem' }}>
                  {activity.bookmarks?.map((art) => (
                    <Link key={art._id} to={`/articles/${art._id}`} style={{ textDecoration: 'none' }}>
                      <article className="blog-card glass" style={{ height: '100%', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                          <img 
                            src={art.image || 'https://via.placeholder.com/400x200?text=Forensic+Dossier'} 
                            alt={art.title} 
                            className="blog-img" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                          <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2 }}>
                            <span className="blog-category" style={{ fontSize: '0.6rem', padding: '2px 8px' }}>
                              {art.category || 'Intelligence'}
                            </span>
                          </div>
                        </div>
                        <div className="blog-content" style={{ padding: '1.25rem' }}>
                          <h4 style={{ fontSize: '1rem', margin: '0 0 0.5rem 0', color: '#fff', lineHeight: '1.3' }}>{art.title}</h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', opacity: 0.7 }}>
                            {art.excerpt}
                          </p>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
                {(!activity.bookmarks || activity.bookmarks.length === 0) && renderEmptyState(<Save size={30} />, "No saved intelligence yet.")}
              </div>
            </FadeInSection>
          )}
        </div>

        {/* Report Modal */}
        {selectedReport && (
          <div className="modal-backdrop" onClick={() => setSelectedReport(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', padding: '3rem', borderRadius: '30px', background: 'white', color: '#111' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #111', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <FileText color="#111" />
                  <h2 style={{ color: '#111', fontSize: '1.5rem', fontWeight: '800' }}>Intelligence Workplace</h2>
                </div>
                <button onClick={() => setSelectedReport(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#111' }}><X /></button>
              </div>

              <div className="report-editor-container">
                <textarea 
                  className="report-content-editor"
                  value={editedContent}
                  onChange={(e) => {
                    setEditedContent(e.target.value);
                    setIsEditingReport(true);
                  }}
                  spellCheck="false"
                />
              </div>

              <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
                <button 
                  className={`btn-primary ${isSavingReport ? 'loading' : ''}`} 
                  style={{ 
                    flex: 1, 
                    background: isEditingReport ? '#111' : '#333', 
                    border: '1px solid rgba(0,0,0,0.1)',
                    opacity: isSavingReport ? 0.7 : 1,
                    cursor: isSavingReport ? 'wait' : 'pointer'
                  }} 
                  onClick={handleSaveReportEdits}
                  disabled={isSavingReport}
                >
                  <Save size={18} /> {isSavingReport ? 'Archiving...' : 'Save Changes'}
                </button>
                <button 
                  className="btn-primary" 
                  style={{ flex: 1, background: '#00d2ff', border: 'none', color: '#000' }} 
                  onClick={() => handleDownloadDoc(selectedReport)}
                >
                  <Download size={18} /> Download .DOC
                </button>
              </div>
              <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
                * Edits made here will be reflected in the final .DOC file.
              </p>
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
        <div style={{ width: '100%', paddingBottom: '4rem' }}>
          {isEditing ? renderEditMode() : renderViewMode()}
        </div>
      </FadeInSection>
    </div>
  );
};

export default Profile;
