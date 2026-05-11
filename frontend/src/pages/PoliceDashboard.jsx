import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Shield, Mail, Phone, Clock, CheckCircle, MessageSquare, 
  Send, User, ChevronRight, Search, LayoutDashboard, 
  BookOpen, Trash2, Edit3, X, Plus, LogOut, Globe, Hexagon, Star,
  Eye, EyeOff, Camera, Link as LinkIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getAvatarUrl } from '../utils/avatar';
import FadeInSection from '../components/FadeInSection';

const PoliceDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusReports, setFocusReports] = useState(new Set());
  const [showOnlyFocus, setShowOnlyFocus] = useState(false);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Article State
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [imageMode, setImageMode] = useState('url'); // 'url' or 'upload'
  const [uploading, setUploading] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '', 
    category: 'Cyber Security', 
    excerpt: '', 
    content: '', 
    image: '', 
    introBold: '',
    conclusion: '',
    galleryImages: [],
    authorRole: 'police',
    isHidden: false
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'police' && user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchReports();
    fetchArticles();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedReport) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedReport?._id]);

  useEffect(() => {
    if (selectedReport && !selectedReport.isReadByPolice) {
      fetch(`/api/police-reports/${selectedReport._id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
    }
  }, [selectedReport]);

  const fetchReports = async () => {
    if (!user || !user.token) return;
    try {
      const res = await fetch('/api/police/reports', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles?all=true');
      const data = await res.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles', error);
    }
  };

  const handleRespond = async (e) => {
    e.preventDefault();
    if (!response.trim()) return;

    try {
      const res = await fetch(`/api/police/reports/${selectedReport._id}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ message: response })
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedReport(updated);
        setResponse('');
        toast.success('Response transmitted.');
        fetchReports();
      }
    } catch (error) {
      toast.error('Failed to send response');
    }
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm('CRITICAL WARNING: You are about to permanently purge this forensic record. This action cannot be undone. Proceed?')) return;

    try {
      const res = await fetch(`/api/police/reports/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        toast.success('Investigation purged.');
        setSelectedReport(null);
        fetchReports();
      }
    } catch (error) {
      toast.error('Failed to purge investigation');
    }
  };

  const handleAddArticle = async (e) => {
    e.preventDefault();
    try {
      const url = editingArticle ? `/api/articles/${editingArticle._id}` : '/api/articles';
      const method = editingArticle ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(newArticle)
      });
      if (res.ok) {
        fetchArticles();
        setShowAddArticle(false);
        setEditingArticle(null);
        setNewArticle({ 
          title: '', 
          category: 'Cyber Security', 
          excerpt: '', 
          content: '', 
          image: '', 
          introBold: '',
          conclusion: '',
          galleryImages: [],
          authorRole: 'police',
          isHidden: false
        });
        toast.success(editingArticle ? 'Intelligence synchronized.' : 'Article transmitted.');
      }
    } catch (error) {
      console.error('Error saving article', error);
      toast.error('Transmission failed.');
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      const res = await fetch(`/api/articles/${id}/visibility`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        toast.success('Visibility toggled.');
        fetchArticles();
      }
    } catch (error) {
      toast.error('Visibility sync failed.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setNewArticle({ ...newArticle, image: data.url });
        toast.success('Imagery synchronized.');
      }
    } catch (error) {
      toast.error('Upload protocol failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('image', file));

    try {
      const res = await fetch('/api/upload/multiple', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setNewArticle({ ...newArticle, galleryImages: [...newArticle.galleryImages, ...data.urls] });
        toast.success('Gallery telemetry updated.');
      }
    } catch (error) {
      toast.error('Gallery sync failed.');
    } finally {
      setUploading(false);
    }
  };

  const filteredReports = reports
    .filter(r => {
      const matchesSearch = 
        r.victimName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.referenceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.title?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFocus = showOnlyFocus ? focusReports.has(r._id) : true;
      return matchesSearch && matchesFocus;
    })
    .sort((a, b) => {
      // Prioritize focus cases
      if (focusReports.has(a._id) && !focusReports.has(b._id)) return -1;
      if (!focusReports.has(a._id) && focusReports.has(b._id)) return 1;
      
      // Send closed cases to bottom
      if (a.isClosed && !b.isClosed) return 1;
      if (!a.isClosed && b.isClosed) return -1;
      
      // Sort by latest activity (updatedAt)
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    });

  const toggleFocus = (id, e) => {
    e.stopPropagation();
    const newFocus = new Set(focusReports);
    if (newFocus.has(id)) newFocus.delete(id);
    else newFocus.add(id);
    setFocusReports(newFocus);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderAddArticleModal = () => {
    return (
      <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(10px)' }}>
        <div className="glass" style={{ padding: '2.5rem', borderRadius: '30px', width: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <button onClick={() => { setShowAddArticle(false); setEditingArticle(null); }} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
          
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}><BookOpen className="text-[#10b981]" /> {editingArticle ? 'Update Intelligence' : 'Draft New Article'}</h3>

          <form onSubmit={handleAddArticle}>
            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Intel Title</label>
              <input type="text" value={newArticle.title} onChange={e => setNewArticle({ ...newArticle, title: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.2rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Category</label>
                <select value={newArticle.category} onChange={e => setNewArticle({ ...newArticle, category: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: '#111', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Intelligence">Intelligence</option>
                  <option value="Forensics">Forensics</option>
                  <option value="Data Breach">Data Breach</option>
                  <option value="Malware">Malware</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Imagery Source</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" onClick={() => setImageMode('url')} style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', background: imageMode === 'url' ? '#10b981' : 'rgba(255,255,255,0.05)', border: 'none', color: imageMode === 'url' ? 'black' : 'white', borderRadius: '5px', cursor: 'pointer' }}>URL</button>
                  <button type="button" onClick={() => setImageMode('upload')} style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', background: imageMode === 'upload' ? '#10b981' : 'rgba(255,255,255,0.05)', border: 'none', color: imageMode === 'upload' ? 'black' : 'white', borderRadius: '5px', cursor: 'pointer' }}>Browse</button>
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {imageMode === 'url' ? 'Address (Link)' : 'Local Forensic Asset'}
              </label>
              {imageMode === 'url' ? (
                <input type="text" value={newArticle.image} onChange={e => setNewArticle({ ...newArticle, image: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} placeholder="https://..." required />
              ) : (
                <div style={{ position: 'relative' }}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                  {uploading && <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.5rem' }}>Uploading asset...</div>}
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Excerpt (Summary)</label>
              <textarea rows="2" value={newArticle.excerpt} onChange={e => setNewArticle({ ...newArticle, excerpt: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} required />
            </div>

            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Introduction (Forensic Overview)</label>
              <textarea rows="2" value={newArticle.introBold} onChange={e => setNewArticle({ ...newArticle, introBold: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Primary Intelligence Narrative</label>
              <textarea rows="6" value={newArticle.content} onChange={e => setNewArticle({ ...newArticle, content: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} required />
            </div>

            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Operational Conclusion</label>
              <textarea rows="3" value={newArticle.conclusion} onChange={e => setNewArticle({ ...newArticle, conclusion: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Forensic Gallery (Upload Multiple)</label>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {newArticle.galleryImages?.map((img, i) => (
                  <div key={i} style={{ position: 'relative', width: '60px', height: '60px' }}>
                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                    <button type="button" onClick={() => setNewArticle({...newArticle, galleryImages: newArticle.galleryImages.filter((_, idx) => idx !== i)})} style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', cursor: 'pointer' }}>X</button>
                  </div>
                ))}
                <label style={{ width: '60px', height: '60px', borderRadius: '8px', border: '1px dashed #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#10b981' }}>
                  <Camera size={20} />
                  <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={uploading}>
              {editingArticle ? 'Synchronize Updates' : 'Transmit to Feed'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  if (!user) return null;
  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', color: '#10b981', fontSize: '1.2rem', fontWeight: 'bold' }}>
      <Hexagon className="animate-spin" style={{ marginRight: '1rem' }} /> INITIALIZING SECURE TERMINAL...
    </div>
  );

  const navBtnStyle = (isActive) => ({
    width: '100%', padding: '1rem', borderRadius: '12px', border: 'none',
    background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
    color: isActive ? '#10b981' : 'white', display: 'flex', alignItems: 'center', gap: '1rem',
    fontSize: '0.9rem', fontWeight: isActive ? 'bold' : 'normal', textAlign: 'left', cursor: 'pointer',
    transition: 'all 0.3s ease'
  });

  return (
    <div className="admin-container">
      <aside className="glass">
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Hexagon size={36} className="text-[#10b981]" style={{ position: 'absolute' }} />
            <Shield size={18} color="white" style={{ position: 'absolute', zIndex: 1 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '1px', background: 'linear-gradient(90deg, #fff, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              WHITEZERO
            </span>
            <span style={{ fontSize: '0.6rem', color: '#10b981', letterSpacing: '1.5px', fontWeight: '600' }}>POLICE OPS</span>
          </div>
        </div>

        <nav>
          <button onClick={() => setActiveTab('reports')} style={navBtnStyle(activeTab === 'reports')}>
            <LayoutDashboard size={18} /> <span>Incident Reports</span>
          </button>
          <button onClick={() => setActiveTab('articles')} style={navBtnStyle(activeTab === 'articles')}>
            <BookOpen size={18} /> <span>Cyber Blog</span>
          </button>
        </nav>

        <div className="desktop-only" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button className="btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              <Globe size={18} /> Return to Home
            </button>
          </Link>
          <button onClick={handleLogout} className="btn-primary" style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
            <LogOut size={18} /> Terminate Session
          </button>
        </div>
      </aside>

      <main>
        <header className="admin-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: '800' }}>Command <span className="text-gradient" style={{ background: 'linear-gradient(90deg, #fff, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Operations</span></h1>
            <p style={{ color: 'var(--text-muted)' }}>Secure forensic analysis and field intelligence moderation.</p>
          </div>
          <div className="glass admin-profile-badge" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.6rem 1.2rem', borderRadius: '15px' }}>
            <div className="desktop-only" style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Field Intelligence Officer</div>
            </div>
            <img src={getAvatarUrl(user)} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #10b981' }} />
          </div>
        </header>
        {activeTab === 'reports' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            {/* List */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', height: 'fit-content' }}>
              <div className="osint-search-box" style={{ 
                marginBottom: '2rem',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '16px',
                padding: '0.4rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.3s ease',
                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
              }}>
                <Search size={18} className="text-[#10b981] animate-pulse" />
                <input 
                  type="text" 
                  placeholder="Scan forensic archive..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'white', 
                    outline: 'none', 
                    width: '100%', 
                    fontSize: '0.9rem',
                    padding: '0.6rem 0'
                  }}
                />
              </div>
              
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', opacity: 0.6 }}>Assigned Intelligence</h3>
                <button 
                  onClick={() => setShowOnlyFocus(!showOnlyFocus)}
                  style={{ background: showOnlyFocus ? 'rgba(0, 210, 255, 0.1)' : 'transparent', border: '1px solid rgba(0, 210, 255, 0.2)', color: showOnlyFocus ? '#00d2ff' : '#888', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Star size={12} fill={showOnlyFocus ? "#00d2ff" : "none"} /> {showOnlyFocus ? 'Focused' : 'All'}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Array.isArray(filteredReports) && filteredReports.map(r => (
                  <div key={r._id} onClick={() => setSelectedReport(r)} className={`report-item glass chat-item-animation ${selectedReport?._id === r._id ? 'active' : ''} ${!r.isReadByPolice && !r.isClosed ? 'unread-report' : ''}`} 
                    style={{ 
                      padding: '1rem', 
                      borderRadius: '12px', 
                      cursor: 'pointer', 
                      border: selectedReport?._id === r._id ? '1px solid #10b981' : (r.isReadByPolice ? '1px solid rgba(255,255,255,0.05)' : 'none'), 
                      background: selectedReport?._id === r._id ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)',
                      opacity: r.isClosed ? 0.6 : 1,
                      position: 'relative'
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: r.isClosed ? '#888' : 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {r.isClosed && <CheckCircle size={14} style={{ color: '#10b981' }} />}
                        {!r.isReadByPolice && !r.isClosed && <span className="new-badge">NEW ALERT</span>}
                        <span>{r.title}</span>
                      </div>
                      <button 
                        onClick={(e) => toggleFocus(r._id, e)}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: focusReports.has(r._id) ? '#00d2ff' : '#444' }}
                      >
                        <Star size={16} fill={focusReports.has(r._id) ? "#00d2ff" : "none"} />
                      </button>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{r.victimName}</span>
                      <span style={{ fontFamily: 'monospace' }}>{r.referenceId}</span>
                    </div>
                    {r.isClosed && <div style={{ fontSize: '0.65rem', color: '#10b981', marginTop: '0.5rem', fontWeight: 'bold' }}>RESOLVED / ARCHIVED</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Detail */}
            <div className="glass" style={{ padding: '2.5rem', borderRadius: '25px', minHeight: '80vh' }}>
              {selectedReport ? (
                <FadeInSection>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{selectedReport.title}</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Case ID: {selectedReport.referenceId} | Transmitted: {new Date(selectedReport.createdAt).toLocaleString()}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 'bold' }}>{selectedReport.status}</span>
                      <button 
                        onClick={() => handleDeleteReport(selectedReport._id)}
                        className="btn-outline" 
                        style={{ padding: '0.6rem', borderRadius: '10px', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                        title="Purge Record"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                      <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Reporter Bio-Data</h4>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{selectedReport.victimName}</div>
                      <div style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={14} /> {selectedReport.victimEmail}</div>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                      <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Intelligence Parameters</h4>
                      <div style={{ fontSize: '0.9rem' }}>Platform: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{selectedReport.platform === 'Others' ? selectedReport.otherPlatform : selectedReport.platform || 'General Cyber Vector'}</span></div>
                      {selectedReport.platformDetails && <div style={{ fontSize: '0.8rem', marginTop: '0.3rem', color: 'var(--text-muted)' }}>Target: {selectedReport.platformDetails}</div>}
                      <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Incident Date: <span style={{ color: '#f59e0b' }}>{selectedReport.incidentDate ? new Date(selectedReport.incidentDate).toLocaleDateString() : 'Unspecified'}</span></div>
                    </div>
                  </div>

                  <div className="glass" style={{ padding: '2rem', borderRadius: '15px', marginBottom: '2.5rem', background: 'rgba(255,255,255,0.01)' }}>
                    <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Incident Narrative</h4>
                    <p style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{selectedReport.description}</p>
                  </div>

                  <div className="investigation-log">
                    <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MessageSquare size={18} /> Investigative Dialogue</h4>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '1.2rem', 
                      maxHeight: '450px', 
                      overflowY: 'auto', 
                      padding: '1rem',
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: '20px',
                      marginBottom: '1.5rem',
                      border: '1px solid rgba(255,255,255,0.02)'
                    }}>
                      {selectedReport.responses?.map((resp, i) => (
                        <div key={i} className="message-animation" style={{ 
                          alignSelf: resp.role === 'user' ? 'flex-start' : 'flex-end',
                          maxWidth: '80%',
                          background: resp.role === 'user' ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #10b981, #059669)',
                          padding: '1.2rem',
                          borderRadius: resp.role === 'user' ? '20px 20px 20px 4px' : '20px 20px 4px 20px',
                          boxShadow: resp.role !== 'user' ? '0 4px 15px rgba(16, 185, 129, 0.2)' : 'none',
                          border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', marginBottom: '0.6rem' }}>
                            <span style={{ 
                              fontSize: '0.65rem', 
                              fontWeight: 'bold', 
                              color: resp.role === 'user' ? '#00d2ff' : 'rgba(255,255,255,0.8)',
                              letterSpacing: '1px'
                            }}>
                              {resp.role === 'user' ? 'VICTIM / INFORMANT' : 'YOU (OFFICER)'}
                            </span>
                            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                              {new Date(resp.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.95rem', margin: 0, lineHeight: '1.5', color: 'white' }}>{resp.message}</p>
                        </div>
                      ))}
                    </div>

                    {!selectedReport.isClosed ? (
                      <div style={{ marginTop: '2rem' }}>
                        <form onSubmit={handleRespond} style={{ display: 'flex', gap: '1rem' }}>
                          <input 
                            type="text" 
                            placeholder="Type investigative solution or instructions..." 
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', padding: '1rem' }}
                          />
                          <button type="submit" className="btn-primary" style={{ padding: '1rem 2rem', borderRadius: '12px' }}><Send size={20} /></button>
                        </form>
                        <button 
                          onClick={() => {
                            const reason = prompt('CRITICAL: Enter final investigation conclusion/reason to close this case:');
                            if (reason) {
                              fetch(`/api/reports/police/${selectedReport._id}/close`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                                body: JSON.stringify({ reason })
                              }).then(res => res.json()).then(data => {
                                setSelectedReport(data);
                                fetchReports();
                              });
                            }
                          }}
                          className="btn-outline" 
                          style={{ width: '100%', marginTop: '1rem', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}
                        >
                          <CheckCircle size={18} style={{ marginRight: '0.5rem' }} /> Finalize Investigation & Close Case
                        </button>
                      </div>
                    ) : (
                      <div className="glass" style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '15px', border: '1px solid #10b981', background: 'rgba(16, 185, 129, 0.05)' }}>
                        <h4 style={{ color: '#10b981', marginBottom: '0.5rem' }}>INVESTIGATION CONCLUDED</h4>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}><strong>Closing Statement:</strong> {selectedReport.conclusion}</p>
                      </div>
                    )}
                  </div>
                </FadeInSection>
              ) : (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
                  <Shield size={80} />
                  <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>Awaiting Target Selection</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="glass" style={{ padding: '2rem', borderRadius: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}><BookOpen className="text-[#10b981]" /> Cyber Blog Intelligence</h2>
              <button onClick={() => setShowAddArticle(true)} className="btn-primary"><Plus size={18} /> New Intelligence Asset</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {Array.isArray(articles) && articles
                .filter(a => a.authorRole === 'police')
                .map(a => (
                <div 
                  key={a._id} 
                  className="glass" 
                  style={{ 
                    padding: '1rem', 
                    borderRadius: '15px', 
                    position: 'relative', 
                    display: 'flex', 
                    flexDirection: 'column',
                    border: `1px solid rgba(16, 185, 129, 0.2)`,
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.05)'
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={a.image} 
                      style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px' }} 
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800'; }} 
                    />
                    <span style={{ 
                      position: 'absolute', 
                      top: '10px', 
                      right: '10px', 
                      background: a.authorRole === 'police' ? '#10b981' : '#00d2ff', 
                      color: 'black', 
                      fontSize: '0.6rem', 
                      fontWeight: 'bold', 
                      padding: '2px 8px', 
                      borderRadius: '5px',
                      textTransform: 'uppercase'
                    }}>
                      {a.authorRole}
                    </span>
                  </div>
                  <h4 style={{ margin: '1rem 0 0.5rem 0', fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{a.category} | {new Date(a.createdAt).toLocaleDateString()}</p>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button 
                      onClick={() => handleToggleVisibility(a._id)}
                      style={{ background: a.isHidden ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: 'none', color: a.isHidden ? '#ef4444' : '#10b981', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      title={a.isHidden ? "Hidden - Click to Show" : "Public - Click to Hide"}
                    >
                      {a.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button 
                      onClick={() => { setEditingArticle(a); setNewArticle(a); setShowAddArticle(true); }} 
                      style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <Edit3 size={16} /> Edit
                    </button>
                    <button 
                      onClick={async () => { if(window.confirm('Delete article?')) { await fetch(`/api/articles/${a._id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${user.token}` } }); fetchArticles(); } }} 
                      style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <Trash2 size={16} /> Purge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showAddArticle && renderAddArticleModal()}
    </div>
  );
};

export default PoliceDashboard;
