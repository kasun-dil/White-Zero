import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  Users, BookOpen, MessageSquare, Shield, ExternalLink,
  Plus, Trash2, Check, X, Settings, LogOut, LayoutDashboard,
  Search, Filter, MoreVertical, Edit2, Globe, TrendingUp, Clock, Activity,
  Eye, EyeOff, Star, Mail, Hexagon, AlertTriangle
} from 'lucide-react';
import FadeInSection from '../../components/FadeInSection';
import { toast } from 'react-hot-toast';
import '../PageStyles.css';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  // Data States
  const [stats, setStats] = useState({ users: 0, articles: 0, feedbacks: 0, pendingFeedback: 0, messages: 0, unreadMessages: 0, unreadPoliceReports: 0 });
  const [recentActivity, setRecentActivity] = useState({ searches: [], topArticles: [] });
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [articleFilter, setArticleFilter] = useState('all');
  const [feedbacks, setFeedbacks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [policeMetadata, setPoliceMetadata] = useState([]);
  const [policeSearchTerm, setPoliceSearchTerm] = useState('');

  // Form States
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [newArticle, setNewArticle] = useState({ title: '', category: 'Cyber Security', excerpt: '', content: '', image: '', link: '' });
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [imageMode, setImageMode] = useState('url'); // 'url' or 'upload'
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchDashboardData();
    fetchPoliceMetadata();
  }, [user, navigate]);

  const fetchPoliceMetadata = async () => {
    try {
      const res = await fetch('/api/admin/police-reports/metadata', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setPoliceMetadata(data);
    } catch (error) {
      console.error('Error fetching police metadata', error);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${user.token}` };

      const [sRes, aActRes, uRes, artRes, fRes, mRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }).catch(() => ({ json: () => ({}) })),
        fetch('/api/admin/activity', { headers }).catch(() => ({ json: () => ({ searches: [], topArticles: [] }) })),
        fetch('/api/admin/users', { headers }).catch(() => ({ json: () => ([]) })),
        fetch('/api/articles?all=true').catch(() => ({ json: () => ([]) })),
        fetch('/api/feedback', { headers }).catch(() => ({ json: () => ([]) })),
        fetch('/api/admin/messages', { headers }).catch(() => ({ json: () => ([]) }))
      ]);

      const sData = await sRes.json().catch(() => ({}));
      const aData = await aActRes.json().catch(() => ({ searches: [], topArticles: [] }));
      const uData = await uRes.json().catch(() => ([]));
      const artData = await artRes.json().catch(() => ([]));
      const fData = await fRes.json().catch(() => ([]));
      const mData = await mRes.json().catch(() => ([]));

      setStats({
        users: sData?.users || 0,
        articles: sData?.articles || 0,
        feedbacks: sData?.feedbacks || 0,
        pendingFeedback: sData?.pendingFeedback || 0,
        messages: sData?.messages || 0,
        unreadMessages: sData?.unreadMessages || 0,
        unreadPoliceReports: sData?.unreadPoliceReports || 0
      });
      setRecentActivity({
        searches: Array.isArray(aData?.searches) ? aData.searches : [],
        topArticles: Array.isArray(aData?.topArticles) ? aData.topArticles : []
      });
      setUsers(Array.isArray(uData) ? uData : []);
      setArticles(Array.isArray(artData) ? artData : []);
      setFeedbacks(Array.isArray(fData) ? fData : []);
      setMessages(Array.isArray(mData) ? mData : []);
    } catch (error) {
      console.error('Error fetching admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllMessagesRead = async () => {
    setStats(prev => ({ ...prev, unreadMessages: 0 }));
    try {
      await fetch('/api/admin/messages/read-all', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      // Small buffer to allow DB synchronization before refreshing stats
      setTimeout(fetchDashboardData, 500);
    } catch (error) {
      console.error('Error clearing messages', error);
    }
  };

  const handleMarkAllPoliceRead = async () => {
    setStats(prev => ({ ...prev, unreadPoliceReports: 0 }));
    fetchPoliceMetadata();
    // In a real scenario, you'd have a mark-all-read for police too
    setTimeout(fetchDashboardData, 500);
  };

  const handleUpdateFeedbackStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/feedback/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchDashboardData();
    } catch (error) {
      console.error('Error updating feedback status', error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) fetchDashboardData();
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        fetchDashboardData();
        setNewUser({ name: '', email: '', password: '', role: 'user' });
        setShowAddUser(false);
      }
    } catch (error) {
      console.error('Error adding user', error);
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
        fetchDashboardData();
        setNewArticle({ title: '', category: 'Cyber Security', excerpt: '', content: '', image: '', link: '' });
        setShowAddArticle(false);
        setEditingArticle(null);
      }
    } catch (error) {
      console.error('Error saving article', error);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) fetchDashboardData();
    } catch (error) {
      console.error('Error deleting article', error);
    }
  };

  const handleToggleVisibility = async (id) => {
    console.log('Toggling visibility for article:', id);
    try {
      const res = await fetch(`/api/articles/${id}/visibility`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        setArticles(prev => prev.map(a => a._id === id ? { ...a, isHidden: !a.isHidden } : a));
        toast.success('Visibility synchronized.');
        fetchDashboardData();
      } else {
        const errorData = await res.json();
        toast.error(`Failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error toggling visibility', error);
    }
  };

  const openEditArticle = (article) => {
    setEditingArticle(article);
    setImageMode('url');
    setNewArticle({
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      content: article.content,
      image: article.image,
      link: article.link
    });
    setShowAddArticle(true);
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
        body: formData
      });
      const imageUrl = await res.text();
      setNewArticle({ ...newArticle, image: imageUrl });
    } catch (error) {
      console.error('Upload failed', error);
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="glass">
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Hexagon size={36} className="text-[#00d2ff]" style={{ position: 'absolute' }} />
            <Shield size={18} color="white" style={{ position: 'absolute', zIndex: 1 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '1px', background: 'linear-gradient(90deg, #fff, #00d2ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              WHITEZERO
            </span>
            <span style={{ fontSize: '0.6rem', color: '#00d2ff', letterSpacing: '1.5px', fontWeight: '600' }}>ADMIN HUB</span>
          </div>
        </div>

        <nav>
          <button onClick={() => setActiveTab('dashboard')} className={`admin-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} style={navBtnStyle(activeTab === 'dashboard')}>
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('users')} className={`admin-nav-btn ${activeTab === 'users' ? 'active' : ''}`} style={navBtnStyle(activeTab === 'users')}>
            <Users size={18} /> <span>Users</span>
          </button>
          <button onClick={() => { setActiveTab('police'); handleMarkAllPoliceRead(); }} className={`admin-nav-btn ${activeTab === 'police' ? 'active' : ''}`} style={navBtnStyle(activeTab === 'police')}>
            <Shield size={18} /> <span>Police Investigations </span> {stats.unreadPoliceReports > 0 && activeTab !== 'police' && <span style={{ marginLeft: 'auto', background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold' }}>{stats.unreadPoliceReports}</span>}
          </button>
          <button onClick={() => setActiveTab('articles')} className={`admin-nav-btn ${activeTab === 'articles' ? 'active' : ''}`} style={navBtnStyle(activeTab === 'articles')}>
            <BookOpen size={18} /> <span>Articles</span>
          </button>
          <button onClick={() => setActiveTab('feedback')} className={`admin-nav-btn ${activeTab === 'feedback' ? 'active' : ''}`} style={navBtnStyle(activeTab === 'feedback')}>
            <MessageSquare size={18} /> <span>Feedback</span> {stats.pendingFeedback > 0 && <span style={{ marginLeft: 'auto', background: '#f59e0b', color: 'black', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold' }}>{stats.pendingFeedback}</span>}
          </button>
          <button onClick={() => { setActiveTab('messages'); handleMarkAllMessagesRead(); }} className={`admin-nav-btn ${activeTab === 'messages' ? 'active' : ''}`} style={navBtnStyle(activeTab === 'messages')}>
            <Mail size={18} /> <span>Messages</span> {stats.unreadMessages > 0 && activeTab !== 'messages' && <span style={{ marginLeft: 'auto', background: '#00d2ff', color: 'black', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold' }}>{stats.unreadMessages}</span>}
          </button>
        </nav>

        <div className="desktop-only" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button className="btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              <Globe size={18} /> Go to Website
            </button>
          </Link>
          <button onClick={logout} className="btn-primary" style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main>
        <header className="admin-header-flex">
          <div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: '800' }}>WhiteZero <span className="text-gradient">Admin Hub</span></h1>
            <p style={{ color: 'var(--text-muted)' }}>Real-time platform insights and moderation controls.</p>
          </div>
          <div className="glass admin-profile-badge">
            <div className="desktop-only" style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#00d2ff' }}>Super Administrator</div>
            </div>
            <img src={user.profileImage || 'https://ui-avatars.com/api/?name=Admin'} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #00d2ff' }} />
          </div>
        </header>

        {activeTab === 'dashboard' && renderDashboardView()}
        {activeTab === 'users' && renderUsersSection()}
        {activeTab === 'police' && renderPoliceSection()}
        {activeTab === 'articles' && renderArticlesSection()}
        {activeTab === 'feedback' && renderFeedbackSection()}
        {activeTab === 'messages' && renderMessagesSection()}
      </main>

      {/* Modals for Adding content */}
      {showAddUser && renderAddUserModal()}
      {showAddArticle && renderAddArticleModal()}
    </div>
  );

  function renderDashboardView() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {[
            { label: 'Total Users', value: stats.users, icon: <Users />, color: '#00d2ff' },
            { label: 'Live Articles', value: stats.articles, icon: <BookOpen />, color: '#10b981' },
            { label: 'Ongoing Cases', value: stats.ongoingCases || 0, icon: <Shield />, color: '#10b981', action: () => { setActiveTab('police'); handleMarkAllPoliceRead(); } },
            { label: 'New Messages', value: stats.unreadMessages || 0, icon: <Mail />, color: '#00d2ff', action: () => { setActiveTab('messages'); handleMarkAllMessagesRead(); } }
          ].map((item, i) => (
            <div 
              key={i} 
              className="glass" 
              onClick={item.action}
              style={{ 
                padding: '1.5rem', 
                borderRadius: '20px', 
                borderLeft: `4px solid ${item.color}`,
                cursor: item.action ? 'pointer' : 'default',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{item.label}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{item.value}</div>
                </div>
                <div style={{ color: item.color, opacity: 0.8 }}>{item.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Feed */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="glass" style={{ padding: '2rem', borderRadius: '25px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <TrendingUp className="text-[#00d2ff]" /> Recent Global Searches
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
              {recentActivity.searches?.map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{s?.query}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>by {s?.userId?.name || 'Unknown User'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: '#00d2ff' }}>{s?.resultsCount} results</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s?.createdAt ? new Date(s.createdAt).toLocaleTimeString() : ''}</div>
                  </div>
                </div>
              ))}
              {recentActivity.searches.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No recent activity</p>}
            </div>
          </div>

          <div className="glass" style={{ padding: '2rem', borderRadius: '25px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <Star className="text-[#10b981]" /> Top 5 Trending Intelligence
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
              {recentActivity.topArticles?.map((art, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #10b981' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{art?._id}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{art?.category || 'General Intelligence'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#10b981' }}>{art?.count}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Unique Reads</div>
                  </div>
                </div>
              ))}
              {recentActivity.topArticles.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No trending data yet</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderUsersSection() {
    return (
      <div className="glass" style={{ padding: '2rem', borderRadius: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users className="text-[#00d2ff]" /> User Management
          </h2>
          <button onClick={() => setShowAddUser(true)} className="btn-primary">Add User</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>User</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Joined Date</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map(u => (
                <tr key={u?._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={u?.profileImage || `https://ui-avatars.com/api/?name=${u?.name}`} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                    {u?.name}
                  </td>
                  <td style={{ padding: '1rem' }}>{u?.email}</td>
                  <td style={{ padding: '1rem' }}>{u?.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}</td>
                  <td style={{ padding: '1rem' }}>
                    <button onClick={() => handleDeleteUser(u?._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderArticlesSection() {
    return (
      <div className="glass" style={{ padding: '2rem', borderRadius: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BookOpen className="text-[#10b981]" /> Articles & Intelligence
          </h2>
          <div style={{ display: 'flex', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {['all', 'admin', 'police'].map(f => (
              <button
                key={f}
                onClick={() => setArticleFilter(f)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: articleFilter === f ? (f === 'police' ? '#10b981' : (f === 'admin' ? '#00d2ff' : 'rgba(255,255,255,0.1)')) : 'transparent',
                  color: articleFilter === f ? 'black' : 'white',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease'
                }}
              >
                {f}
              </button>
            ))}
            <button onClick={() => setShowAddArticle(true)} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={14} /> New
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {articles
            .filter(a => articleFilter === 'all' || a.authorRole === articleFilter)
            .map(a => (
            <div 
              key={a._id} 
              className="glass" 
              style={{ 
                padding: '1rem', 
                borderRadius: '15px', 
                position: 'relative', 
                opacity: a.isHidden ? 0.6 : 1, 
                display: 'flex', 
                flexDirection: 'column',
                border: `1px solid ${a.authorRole === 'police' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 210, 255, 0.2)'}`,
                boxShadow: a.authorRole === 'police' ? '0 4px 15px rgba(16, 185, 129, 0.05)' : '0 4px 15px rgba(0, 210, 255, 0.05)'
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
              <h4 style={{ margin: '1rem 0 0.5rem 0', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{a.category} {a.isHidden && <span style={{ color: '#ef4444', marginLeft: '0.5rem' }}>(Hidden)</span>}</p>

              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button
                  onClick={() => handleToggleVisibility(a._id)}
                  style={{ background: a.isHidden ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: 'none', color: a.isHidden ? '#ef4444' : '#10b981', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title={a.isHidden ? "Hidden - Click to Show" : "Public - Click to Hide"}
                >
                  {a.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={() => openEditArticle(a)}
                  style={{ background: 'rgba(0, 210, 255, 0.1)', border: 'none', color: '#00d2ff', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDeleteArticle(a._id)}
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) fetchDashboardData();
    } catch (error) {
      console.error('Error deleting message', error);
    }
  };

  function renderFeedbackSection() {
    return (
      <div className="glass" style={{ padding: '2rem', borderRadius: '25px' }}>
        <h2>Feedback Moderation</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
          {feedbacks.map(f => (
            <div key={f._id} className="glass" style={{ padding: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '1.1rem' }}>{f.name}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({f.userId?.email || 'No Email'})</span>
                  <div style={{ display: 'flex', gap: '2px', color: '#f59e0b', marginLeft: 'auto', marginRight: '2rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < f.rating ? "#f59e0b" : "none"} />
                    ))}
                  </div>
                </div>
                <p style={{ margin: '0.5rem 0', fontStyle: 'italic', color: '#eee' }}>"{f.text}"</p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: f.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: f.status === 'approved' ? '#10b981' : '#f59e0b' }}>
                    {f.status.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(f.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {f.status !== 'approved' && <button onClick={() => handleUpdateFeedbackStatus(f._id, 'approved')} className="btn-primary" style={{ padding: '0.6rem', borderRadius: '10px' }} title="Approve"><Check size={18} /></button>}
                {f.status !== 'rejected' && <button onClick={() => handleUpdateFeedbackStatus(f._id, 'rejected')} className="btn-outline" style={{ padding: '0.6rem', borderRadius: '10px' }} title="Reject"><X size={18} /></button>}
              </div>
            </div>
          ))}
          {feedbacks.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No feedback received yet.</p>}
        </div>
      </div>
    );
  }

  function renderMessagesSection() {
    return (
      <div className="glass" style={{ padding: '2rem', borderRadius: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Mail className="text-[#00d2ff]" /> Command Center Messages
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{messages.length} total transmissions</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages?.map(m => (
            <div key={m?._id} className="glass" style={{ padding: '1.5rem', borderRadius: '15px', borderLeft: '4px solid #00d2ff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{m?.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#00d2ff' }}>{m?.email}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{m?.createdAt ? new Date(m.createdAt).toLocaleString() : ''}</div>
                  <button onClick={() => handleDeleteMessage(m?._id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', fontSize: '0.95rem', lineHeight: '1.6', border: '1px solid rgba(255,255,255,0.05)' }}>
                {m?.message}
              </div>
            </div>
          ))}
          {messages.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>No messages in the command center.</p>}
        </div>
      </div>
    );
  }

  function renderPoliceSection() {
    return (
      <div className="glass" style={{ padding: '2rem', borderRadius: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield className="text-[#10b981]" /> Police Intelligence Metadata
          </h2>
          <div style={{ padding: '0.5rem 1rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.75rem' }}>
            <AlertTriangle size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Forensic details isolated from Admin view
          </div>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1.25rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', maxWidth: '400px' }}>
            <Search size={18} style={{ opacity: 0.5, marginRight: '0.75rem' }} />
            <input
              type="text"
              placeholder="Search by ID or Victim Name..."
              value={policeSearchTerm}
              onChange={(e) => setPoliceSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Reference ID</th>
                <th style={{ padding: '1rem' }}>Victim Name</th>
                <th style={{ padding: '1rem' }}>Contact Email</th>
                <th style={{ padding: '1rem' }}>Incident Title</th>
                <th style={{ padding: '1rem' }}>Submission Date</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Conclusion</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(policeMetadata) && policeMetadata
                .filter(r =>
                  r.referenceId?.toLowerCase().includes(policeSearchTerm.toLowerCase()) ||
                  r.victimName?.toLowerCase().includes(policeSearchTerm.toLowerCase())
                )
                .map(r => (
                  <tr key={r._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem', color: '#00d2ff', fontWeight: 'bold', fontFamily: 'monospace' }}>{r.referenceId}</td>
                    <td style={{ padding: '1rem' }}>{r.victimName}</td>
                    <td style={{ padding: '1rem' }}>{r.victimEmail}</td>
                    <td style={{ padding: '1rem' }}>{r.title}</td>
                    <td style={{ padding: '1rem' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ color: r.isClosed ? '#10b981' : '#f59e0b', fontSize: '0.85rem' }}>
                        {r.isClosed ? 'Resolved' : r.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {r.conclusion || 'Ongoing...'}
                    </td>
                  </tr>
                ))}
              {(!Array.isArray(policeMetadata) || policeMetadata.length === 0) && (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No police reports transmitted to system metadata.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderAddUserModal() {
    return (
      <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
        <div className="glass" style={{ padding: '2.5rem', borderRadius: '30px', width: '450px', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => setShowAddUser(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}><Users className="text-[#00d2ff]" /> New User</h3>

          <form onSubmit={handleAddUser}>
            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Full Name</label>
              <input type="text" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} required />
            </div>
            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email Address</label>
              <input type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} required />
            </div>
            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
              <input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} required />
            </div>
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Assign Role</label>
              <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: '#111', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                <option value="user">Standard User</option>
                <option value="police">Police Officer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>Create Account</button>
          </form>
        </div>
      </div>
    );
  }

  function renderAddArticleModal() {
    return (
      <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
        <div className="glass" style={{ padding: '2.5rem', borderRadius: '30px', width: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => { setShowAddArticle(false); setEditingArticle(null); setNewArticle({ title: '', category: 'Cyber Security', excerpt: '', content: '', image: '', link: '' }); }} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}><BookOpen className="text-[#10b981]" /> {editingArticle ? 'Edit Article' : 'Publish Article'}</h3>

          <form onSubmit={handleAddArticle}>
            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Article Title</label>
              <input type="text" value={newArticle.title} onChange={e => setNewArticle({ ...newArticle, title: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.2rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Category</label>
                <select value={newArticle.category} onChange={e => setNewArticle({ ...newArticle, category: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: '#111', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Intelligence">Intelligence</option>
                  <option value="Privacy">Privacy</option>
                  <option value="Data Breach">Data Breach</option>
                  <option value="Malware">Malware</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Image Source</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" onClick={() => setImageMode('url')} style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', background: imageMode === 'url' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', border: 'none', color: imageMode === 'url' ? 'black' : 'white', borderRadius: '5px', cursor: 'pointer' }}>URL</button>
                  <button type="button" onClick={() => setImageMode('upload')} style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', background: imageMode === 'upload' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', border: 'none', color: imageMode === 'upload' ? 'black' : 'white', borderRadius: '5px', cursor: 'pointer' }}>Browse</button>
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {imageMode === 'url' ? 'Image Address' : 'Select Image from PC'}
              </label>
              {imageMode === 'url' ? (
                <input type="text" value={newArticle.image} onChange={e => setNewArticle({ ...newArticle, image: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} placeholder="https://images.unsplash.com/..." required />
              ) : (
                <div style={{ position: 'relative' }}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                  {uploading && <div style={{ fontSize: '0.8rem', color: '#00d2ff', marginTop: '0.5rem' }}>Uploading intelligence asset...</div>}
                </div>
              )}
              {newArticle.image && <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '0.5rem' }}>Image set: {newArticle.image.substring(0, 50)}...</div>}
            </div>

            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Brief Excerpt</label>
              <textarea rows="2" value={newArticle.excerpt} onChange={e => setNewArticle({ ...newArticle, excerpt: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} required />
            </div>
            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Full Content (Markdown Supported)</label>
              <textarea rows="6" value={newArticle.content} onChange={e => setNewArticle({ ...newArticle, content: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} required />
            </div>
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>External Link (Optional)</label>
              <input type="text" value={newArticle.link} onChange={e => setNewArticle({ ...newArticle, link: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={uploading}>{editingArticle ? 'Update Article' : 'Publish Now'}</button>
          </form>
        </div>
      </div>
    );
  }

  function navBtnStyle(isActive) {
    return {
      width: '100%', padding: '1rem', borderRadius: '12px', border: 'none',
      background: isActive ? 'rgba(0, 210, 255, 0.1)' : 'transparent',
      color: isActive ? '#00d2ff' : 'white', display: 'flex', alignItems: 'center', gap: '1rem',
      fontSize: '0.9rem', fontWeight: isActive ? 'bold' : 'normal', textAlign: 'left', cursor: 'pointer'
    };
  }
};

export default AdminDashboard;
