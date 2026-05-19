import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import FadeInSection from '../components/FadeInSection';
import { AuthContext } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/avatar';
import { ArrowLeft, Calendar, User, Clock, Share2, Bookmark, BookOpen, Send, Edit3, Trash2, MessageSquare, MoreVertical, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './PageStyles.css';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [togglingBookmark, setTogglingBookmark] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/articles`);
        const data = await res.json();
        
        const found = data.find(a => a._id === id);
        if (found) {
          setArticle(found);
          // Get 6 recent articles excluding the current one
          const recent = data
            .filter(a => a._id !== id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 6);
          setRecentArticles(recent);

          // Check if bookmarked
          if (user) {
            const profileRes = await fetch('/api/users/profile', {
              headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const profileData = await profileRes.json();
            const bookmarks = profileData.bookmarks || [];
            setIsBookmarked(bookmarks.some(bId => (bId._id || bId).toString() === found._id));

            // Record History
            fetch('/api/history/read', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
              },
              body: JSON.stringify({
                articleId: found._id,
                articleTitle: found.title,
                articleUrl: `/articles/${found._id}`,
                category: found.category
              })
            });
          }
        }
      } catch (error) {
        console.error('Error fetching article', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id, user]);

  const handleBookmark = async () => {
    if (!user) return toast.error('Please login to save articles');
    if (togglingBookmark) return;
    setTogglingBookmark(true);
    try {
      const res = await fetch(`/api/articles/${id}/bookmark`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setIsBookmarked(data.isBookmarked);
        toast.success(data.isBookmarked ? 'Article saved.' : 'Article removed.');
      }
    } catch (error) {
      toast.error('Network Error.');
    } finally {
      setTogglingBookmark(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to participate in the briefing.');
    if (!commentText.trim()) return;
    
    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/articles/${id}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ text: commentText })
      });
      const newComment = await res.json();
      if (res.ok) {
        setArticle(prev => ({ ...prev, comments: [...prev.comments, newComment] }));
        setCommentText('');
        toast.success('Comment transmitted.');
      } else {
        toast.error(newComment.message || 'Transmission failed.');
      }
    } catch (err) {
      toast.error('Network failure.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editCommentText.trim()) return;
    try {
      const res = await fetch(`/api/articles/${id}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ text: editCommentText })
      });
      if (res.ok) {
        setArticle(prev => ({
          ...prev,
          comments: prev.comments.map(c => c._id === commentId ? { ...c, text: editCommentText } : c)
        }));
        setEditingCommentId(null);
        toast.success('Comment synchronized.');
      }
    } catch (err) {
      toast.error('Sync failed.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Purge this transmission from the record?')) return;
    try {
      const res = await fetch(`/api/articles/${id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        setArticle(prev => ({
          ...prev,
          comments: prev.comments.filter(c => c._id !== commentId)
        }));
        toast.success('Comment purged.');
      }
    } catch (err) {
      toast.error('Purge failed.');
    }
  };

  if (loading) return (
    <div className="page-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="loader" style={{ marginBottom: '1.5rem' }}></div>
        <p style={{ color: '#00d2ff', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 'bold' }}>Analyzing Report...</p>
      </div>
    </div>
  );
  if (!article) return <div className="page-container" style={{ textAlign: 'center', padding: '10rem' }}><h1>Not Found</h1><Link to="/articles" className="btn-primary">Back</Link></div>;

  return (
    <div className="page-container fade-in" style={{ padding: '110px 0 0', height: '100vh', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', height: '100%', gap: '0' }}>
        
        {/* Main Content Area (Scrollable) */}
        <div style={{ 
          height: '100%', 
          overflowY: 'auto', 
          padding: '40px 4rem 100px',
          background: 'rgba(5, 5, 10, 0.4)',
          borderRight: '1px solid rgba(255,255,255,0.05)'
        }} className="modern-scroll-container">
          
          <FadeInSection direction="down">
            <Link to="/articles" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#00d2ff', textDecoration: 'none', marginBottom: '2.5rem', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '2px' }}>
              <ArrowLeft size={14} /> BACK TO CYBER BLOG
            </Link>
          </FadeInSection>

          <article style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <FadeInSection direction="up">
              <div style={{ marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '4.2rem', color: '#ffffff', fontWeight: '950', lineHeight: '1.0', textTransform: 'uppercase', marginBottom: '2.5rem', textShadow: '0 0 40px rgba(255, 255, 255, 0.2)' }}>
                  {article.title}
                </h1>
                
                {/* Consolidated Metadata & Action Bar */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#00d2ff', 
                  fontWeight: '800', 
                  fontSize: '0.8rem', 
                  padding: '1.5rem 0', 
                  borderTop: '1px solid rgba(0, 210, 255, 0.2)',
                  borderBottom: '1px solid rgba(0, 210, 255, 0.2)', 
                  letterSpacing: '2px' 
                }}>
                  <div style={{ display: 'flex', gap: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <Calendar size={18} strokeWidth={2.5} /> {new Date(article.createdAt).toLocaleDateString().toUpperCase()}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <User size={18} strokeWidth={2.5} /> {article.author.toUpperCase()}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <BookOpen size={18} strokeWidth={2.5} /> {article.category.toUpperCase()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                    <div 
                      onClick={handleShare}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}
                    >
                      <Share2 size={18} strokeWidth={2.5} /> SHARE
                    </div>
                    <div 
                      onClick={handleBookmark}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', color: isBookmarked ? '#f59e0b' : '#00d2ff' }}
                    >
                      <Bookmark size={18} strokeWidth={2.5} fill={isBookmarked ? '#f59e0b' : 'none'} /> {isBookmarked ? 'SAVED' : 'SAVE'}
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection direction="up">
              <div style={{ borderRadius: '35px', overflow: 'hidden', background: 'rgba(15, 15, 25, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}>
                {/* Single Large Top Image */}
                <div style={{ width: '100%', height: '550px', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={article.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80'} 
                    alt={article.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80'; }}
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '150px', background: 'linear-gradient(to top, rgba(15,15,25,1), transparent)' }}></div>
                </div>

                <div style={{ padding: '5rem', marginTop: '-50px', position: 'relative', zIndex: 2 }}>
                  <div className="markdown-content" style={{ fontSize: '1.25rem', color: '#e5e7eb', lineHeight: '2.0', letterSpacing: '0.3px' }}>
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                  </div>

                  {article.conclusion && (
                    <div style={{ 
                      marginTop: '4rem', 
                      padding: '2rem 2.5rem', 
                      background: 'rgba(255, 152, 0, 0.03)', 
                      border: '1px solid rgba(255, 152, 0, 0.2)', 
                      borderRadius: '15px', 
                      boxShadow: 'inset 0 0 20px rgba(255, 152, 0, 0.05)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#ff9800' }}></div>
                      <h3 style={{ 
                        color: '#ff9800', 
                        marginBottom: '1rem', 
                        textTransform: 'uppercase', 
                        fontSize: '0.8rem', 
                        letterSpacing: '2px', 
                        fontWeight: '900',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <AlertTriangle size={14} /> Operational Conclusion
                      </h3>
                      <p style={{ 
                        color: '#d1d5db', 
                        fontSize: '1rem', 
                        lineHeight: '1.6',
                        margin: 0,
                        fontStyle: 'normal'
                      }}>{article.conclusion}</p>
                    </div>
                  )}
                </div>

                {/* Comment Section */}
                <div style={{ padding: '0 5rem 5rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(5, 5, 10, 0.2)' }}>
                  <div style={{ marginTop: '4rem' }}>
                    <h3 style={{ color: '#00d2ff', fontSize: '1.4rem', fontWeight: '900', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem', letterSpacing: '2px' }}>
                      <MessageSquare size={24} /> OPERATIONAL INTEL FEED ({article.comments?.filter(c => !c.isHidden).length || 0})
                    </h3>

                    {user ? (
                      <form onSubmit={handleAddComment} style={{ marginBottom: '4rem', position: 'relative' }}>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                          <img src={getAvatarUrl(user)} style={{ width: '50px', height: '50px', borderRadius: '15px', border: '2px solid #00d2ff', objectFit: 'cover' }} />
                          <div style={{ flex: 1, position: 'relative' }}>
                            <textarea
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Add to the briefing..."
                              style={{ 
                                width: '100%', 
                                background: 'rgba(255,255,255,0.03)', 
                                border: '1px solid rgba(0, 210, 255, 0.1)', 
                                borderRadius: '20px', 
                                color: 'white', 
                                padding: '1.5rem', 
                                fontSize: '1.1rem',
                                minHeight: '120px',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = 'rgba(0, 210, 255, 0.4)'}
                              onBlur={(e) => e.target.style.borderColor = 'rgba(0, 210, 255, 0.1)'}
                            />
                            <button 
                              type="submit" 
                              disabled={submittingComment || !commentText.trim()}
                              style={{ 
                                position: 'absolute', 
                                bottom: '15px', 
                                right: '15px', 
                                background: '#00d2ff', 
                                color: 'black', 
                                border: 'none', 
                                width: '45px', 
                                height: '45px', 
                                borderRadius: '12px', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: !commentText.trim() ? 0.5 : 1,
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <Send size={20} />
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div style={{ padding: '3rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '20px', textAlign: 'center', marginBottom: '4rem', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                        <p style={{ color: '#888', marginBottom: '1.5rem' }}>Authentication required to contribute to the briefing.</p>
                        <Link to="/login" className="btn-primary" style={{ padding: '0.8rem 2rem' }}>LOG IN TO COMMENT</Link>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                      {article.comments?.filter(c => !c.isHidden).length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', py: '3rem', opacity: 0.5 }}>No active transmissions on this topic.</p>
                      ) : (
                        [...article.comments].filter(c => !c.isHidden).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map(comment => (
                          <div key={comment._id} style={{ display: 'flex', gap: '1.5rem', animation: 'fadeIn 0.5s ease forwards' }}>
                            <img 
                              src={getAvatarUrl({ profileImage: comment.userImage, name: comment.userName })} 
                              style={{ width: '50px', height: '50px', borderRadius: '15px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} 
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                                <div>
                                  <span style={{ color: '#00d2ff', fontWeight: '900', fontSize: '1rem', letterSpacing: '1px' }}>{comment.userName.toUpperCase()}</span>
                                  <span style={{ color: '#4b5563', fontSize: '0.75rem', marginLeft: '1rem', fontWeight: 'bold' }}>{new Date(comment.createdAt).toLocaleString().toUpperCase()}</span>
                                </div>
                                
                                {user && user._id === comment.userId && (
                                  <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button 
                                      onClick={() => { setEditingCommentId(comment._id); setEditCommentText(comment.text); }}
                                      style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', transition: 'color 0.2s' }}
                                      onMouseEnter={(e) => e.currentTarget.style.color = '#00d2ff'}
                                      onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                                    >
                                      <Edit3 size={16} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteComment(comment._id)}
                                      style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', transition: 'color 0.2s' }}
                                      onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                                      onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                )}
                              </div>
                              
                              {editingCommentId === comment._id ? (
                                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                                  <textarea
                                    value={editCommentText}
                                    onChange={(e) => setEditCommentText(e.target.value)}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid #00d2ff', borderRadius: '15px', color: 'white', padding: '1rem', minHeight: '80px', outline: 'none' }}
                                  />
                                  <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button onClick={() => handleEditComment(comment._id)} style={{ background: '#00d2ff', color: 'black', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>UPDATE</button>
                                    <button onClick={() => setEditingCommentId(null)} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>CANCEL</button>
                                  </div>
                                </div>
                              ) : (
                                <p style={{ color: '#d1d5db', lineHeight: '1.7', fontSize: '1.05rem', margin: 0 }}>{comment.text}</p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </article>
        </div>

        {/* Sidebar (Fixed Area) */}
        <aside style={{ height: '100%', background: 'rgba(0, 0, 0, 0.2)', padding: '40px 2.5rem', overflowY: 'auto' }} className="modern-scroll-container">
          <h3 style={{ color: '#00d2ff', fontSize: '1.1rem', fontWeight: '900', marginBottom: '3rem', borderBottom: '3px solid #00d2ff', display: 'inline-block', paddingBottom: '0.6rem', letterSpacing: '3px' }}>
            LATEST INTELLIGENCE
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {recentArticles.map(post => (
              <Link key={post._id} to={`/articles/${post._id}`} style={{ display: 'flex', gap: '1.5rem', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0, boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>
                  <img 
                      src={post.image} 
                      alt={post.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=200&q=80'; }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h4 style={{ fontSize: '1rem', color: '#fff', fontWeight: '750', lineHeight: '1.4', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.title}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#00d2ff', marginTop: '0.6rem', fontWeight: '900', letterSpacing: '1px' }}>{post.category.toUpperCase()}</span>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ArticleDetail;
