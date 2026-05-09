import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import FadeInSection from '../components/FadeInSection';
import { BookOpen, Calendar, User, ChevronRight } from 'lucide-react';
import './PageStyles.css';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useContext(AuthContext);
  const postsPerPage = 12;

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleRead = async (post) => {
    if (!user) return;
    try {
      await fetch('/api/history/read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          articleId: post._id,
          articleTitle: post.title,
          articleUrl: post.link || `/articles/${post._id}`,
          category: post.category
        })
      });
    } catch (error) {
      console.error('Failed to record read history', error);
    }
  };

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = articles.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(articles.length / postsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); 
  };

  return (
    <div className="page-container fade-in">
      <FadeInSection direction="down">
        <div className="page-header">
          <h1>Internal <span className="text-gradient">Articles</span></h1>
          <p>Private repository of articles and intelligence reports published by administrators. ({articles.length} total)</p>
        </div>
      </FadeInSection>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
          <div className="loader">Loading internal reports...</div>
        </div>
      ) : (
        <>
          <div className="blog-grid" style={{ marginBottom: '4rem' }}>
            {currentPosts.map(post => (
              <FadeInSection direction="up" key={post._id}>
                <article 
                  className="blog-card glass" 
                  style={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    border: `1px solid ${post.authorRole === 'police' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 210, 255, 0.2)'}`,
                    boxShadow: post.authorRole === 'police' ? '0 4px 15px rgba(16, 185, 129, 0.05)' : '0 4px 15px rgba(0, 210, 255, 0.05)'
                  }}
                >
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <img 
                      src={post.image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'} 
                      alt={post.title} 
                      className="blog-img" 
                      style={{ transition: 'transform 0.5s ease' }}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800'; }}
                    />
                    <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 2 }}>
                      <span style={{ 
                        background: post.authorRole === 'police' ? '#10b981' : '#00d2ff', 
                        color: 'black', 
                        fontSize: '0.6rem', 
                        fontWeight: 'bold', 
                        padding: '4px 10px', 
                        borderRadius: '6px',
                        textTransform: 'uppercase',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                      }}>
                        {post.authorRole || 'Admin Hub'}
                      </span>
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '1rem' }}>
                      <span className="blog-category" style={{ margin: 0 }}>{post.category}</span>
                    </div>
                  </div>
                  
                  <div className="blog-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.3rem', margin: '0.5rem 0', lineHeight: '1.4' }}>{post.title}</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.excerpt}
                    </p>
                    
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={14} /> {post.author || 'Admin'}</span>
                      </div>
                      
                      {post.link && post.link !== '#' ? (
                        <a 
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleArticleRead(post)}
                          className="btn-outline"
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', borderColor: post.authorRole === 'police' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(0, 210, 255, 0.3)' }}
                        >
                          Read External <ChevronRight size={16} />
                        </a>
                      ) : (
                        <Link 
                          to={`/articles/${post._id}`}
                          onClick={() => handleArticleRead(post)}
                          className="btn-outline"
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', borderColor: post.authorRole === 'police' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(0, 210, 255, 0.3)' }}
                        >
                          Read Report <ChevronRight size={16} />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              </FadeInSection>
            ))}
          </div>

          {articles.length > postsPerPage && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', paddingBottom: '4rem' }}>
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="btn-outline"
                style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => paginate(i + 1)}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    background: currentPage === i + 1 ? 'var(--primary)' : 'var(--bg-card)', 
                    border: '1px solid var(--glass-border)', 
                    color: currentPage === i + 1 ? 'black' : 'white', 
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    fontWeight: currentPage === i + 1 ? 'bold' : 'normal'
                  }}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="btn-outline"
                style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          )}

          {articles.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
              <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>No internal reports have been published yet.</p>
              {user.role === 'admin' && (
                <a href="/admin" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block', textDecoration: 'none' }}>
                  Create First Article
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Articles;
