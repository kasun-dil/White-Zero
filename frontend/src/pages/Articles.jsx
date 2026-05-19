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
  const [activeSlide, setActiveSlide] = useState(0);
  const { user } = useContext(AuthContext);
  const postsPerPage = 9;

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

  useEffect(() => {
    if (articles.length > 0) {
      const timer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % Math.min(articles.length, 5));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [articles]);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredArticles = articles.filter(a => a.isFeatured).slice(0, 5);
  // If no featured articles, fall back to latest 5
  const displaySlides = featuredArticles.length > 0 ? featuredArticles : articles.slice(0, 5);

  return (
    <div className="page-container fade-in">
      <FadeInSection direction="down">
        <div className="page-header" style={{ marginBottom: '2rem' }}>
          <h1>Cyber <span className="text-gradient">Blog</span></h1>
          <p>Official repository of forensic reports and threat intelligence curated by administrators.</p>
        </div>
      </FadeInSection>

      {loading ? (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="loader" style={{ marginBottom: '1.5rem' }}></div>
            <p style={{ color: '#00d2ff', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 'bold' }}>Synchronizing Repository...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Slideshow Section */}
          {displaySlides.length > 0 && (
            <FadeInSection direction="up">
              <div style={{ 
                position: 'relative', 
                height: '400px', 
                borderRadius: '25px', 
                overflow: 'hidden', 
                marginBottom: '4rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                {displaySlides.map((slide, index) => (
                  <div 
                    key={slide._id} 
                    style={{ 
                      position: 'absolute', 
                      top: 0, left: 0, width: '100%', height: '100%',
                      opacity: activeSlide === index ? 1 : 0,
                      transform: activeSlide === index ? 'scale(1)' : 'scale(1.05)',
                      transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      zIndex: activeSlide === index ? 1 : 0
                    }}
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(0,0,0,0.9) 20%, transparent 100%)', zIndex: 1 }}></div>
                    <img src={slide.image} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '5%', transform: 'translateY(-50%)', zIndex: 2, maxWidth: '500px' }}>
                      <span style={{ color: '#00d2ff', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Featured Intelligence</span>
                      <h2 style={{ fontSize: '2.5rem', margin: '1rem 0', lineHeight: '1.1' }}>{slide.title}</h2>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{slide.excerpt}</p>
                      <Link to={`/articles/${slide._id}`} className="btn-primary" style={{ textDecoration: 'none' }}>Access Report</Link>
                    </div>
                  </div>
                ))}
                <div style={{ position: 'absolute', bottom: '20px', right: '30px', display: 'flex', gap: '8px', zIndex: 3 }}>
                  {displaySlides.map((_, i) => (
                    <div key={i} onClick={() => setActiveSlide(i)} style={{ width: activeSlide === i ? '30px' : '10px', height: '10px', borderRadius: '5px', background: activeSlide === i ? '#00d2ff' : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.3s ease' }}></div>
                  ))}
                </div>
              </div>
            </FadeInSection>
          )}

          <div className="blog-archive-grid" style={{ marginBottom: '4rem' }}>
            {currentPosts.map(post => (
              <FadeInSection direction="up" key={post._id}>
                <article 
                  className="blog-card glass" 
                  style={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                >
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="blog-img" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 2 }}>
                      <span style={{ 
                        background: post.authorRole === 'police' ? '#10b981' : '#00d2ff', 
                        color: 'black', 
                        fontSize: '0.6rem', 
                        fontWeight: '900', 
                        padding: '4px 10px', 
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                      }}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="blog-content" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.2rem', margin: '0 0 1rem 0', lineHeight: '1.3', fontWeight: '700' }}>{post.title}</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.6' }}>
                      {post.excerpt}
                    </p>
                    
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.7 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={12} /> {post.author}</span>
                      </div>
                      
                      <Link 
                        to={`/articles/${post._id}`}
                        onClick={() => handleArticleRead(post)}
                        className="btn-outline"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.9rem' }}
                      >
                        Read Report <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              </FadeInSection>
            ))}
          </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', paddingBottom: '4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="btn-outline"
                  style={{ opacity: currentPage === 1 ? 0.3 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                >
                  Prev
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => paginate(i + 1)}
                    style={{ 
                      width: '40px',
                      height: '40px',
                      background: currentPage === i + 1 ? 'var(--primary)' : 'rgba(255,255,255,0.05)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      color: currentPage === i + 1 ? 'black' : 'white', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="btn-outline"
                  style={{ opacity: currentPage === totalPages ? 0.3 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                >
                  Next
                </button>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', opacity: 0.6 }}>
                Showing {indexOfFirstPost + 1} - {Math.min(indexOfLastPost, articles.length)} of {articles.length} reports
              </div>
            </div>

          {articles.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
              <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>No internal reports have been published yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Articles;
