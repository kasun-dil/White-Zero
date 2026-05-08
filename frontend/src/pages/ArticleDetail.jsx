import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import FadeInSection from '../components/FadeInSection';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Calendar, User, Clock, Share2, Bookmark } from 'lucide-react';
import './PageStyles.css';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [togglingBookmark, setTogglingBookmark] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        console.log(`[DETAIL] Loading article ${id}`);
        const res = await fetch(`/api/articles`);
        const data = await res.json();
        const found = data.find(a => a._id === id);
        
        if (!found) {
          console.error(`[DETAIL] Article ${id} not found in repository`);
          return;
        }

        setArticle(found);

        // Check if bookmarked (if user logged in)
        if (user) {
          console.log(`[DETAIL] Checking bookmarks for user ${user.email}`);
          const profileRes = await fetch('/api/users/profile', {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          const profileData = await profileRes.json();
          const bookmarks = profileData.bookmarks || [];
          const bookmarked = bookmarks.some(bId => (bId._id || bId).toString() === found._id);
          setIsBookmarked(bookmarked);
          console.log(`[DETAIL] Is bookmarked: ${bookmarked}`);

          // Record History
          await fetch('/api/history/read', {
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
      } catch (error) {
        console.error('Error fetching article', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
    window.scrollTo(0, 0);
  }, [id, user]);

  const handleBookmark = async () => {
    if (!user) return toast.error('Please login to save articles');
    if (togglingBookmark) return;

    setTogglingBookmark(true);
    try {
      console.log(`[BOOKMARK] Toggling bookmark for ${id}...`);
      const res = await fetch(`/api/articles/${id}/bookmark`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      
      if (res.ok) {
        setIsBookmarked(data.isBookmarked);
        toast.success(data.isBookmarked ? 'Article saved.' : 'Article removed.');
      } else {
        toast.error('Could not update bookmarks.');
      }
    } catch (error) {
      console.error('[BOOKMARK CLIENT ERROR]:', error);
      toast.error('Network Error: Server unreachable.');
    } finally {
      setTogglingBookmark(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) return (
    <div className="page-container" style={{ textAlign: 'center', padding: '10rem' }}>
      <div className="loader">Analyzing Report...</div>
    </div>
  );

  if (!article) return (
    <div className="page-container" style={{ textAlign: 'center', padding: '10rem' }}>
      <h1>Report <span className="text-gradient">Not Found</span></h1>
      <p style={{ marginBottom: '2rem' }}>The requested intelligence report could not be located.</p>
      <Link to="/articles" className="btn-primary">Back to Articles</Link>
    </div>
  );

  return (
    <div className="page-container fade-in">
      <FadeInSection direction="down">
        <Link to="/articles" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#00d2ff', textDecoration: 'none', marginBottom: '2rem', fontWeight: '600' }}>
          <ArrowLeft size={18} /> Back to Repository
        </Link>
      </FadeInSection>

      <article>
        <FadeInSection direction="up">
          <div style={{ marginBottom: '3rem' }}>
            <span className="blog-category" style={{ fontSize: '0.9rem', padding: '0.4rem 1rem', background: 'rgba(0, 210, 255, 0.1)', borderRadius: '50px', border: '1px solid rgba(0, 210, 255, 0.2)', color: '#00d2ff' }}>
              {article.category}
            </span>
            <h1 style={{ fontSize: '3.5rem', marginTop: '1.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>
              {article.title}
            </h1>
            
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={18} /> {new Date(article.createdAt).toLocaleDateString()}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={18} /> {article.author || 'Intelligence Admin'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={18} /> 5 Min Read</div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
                <Share2 size={20} style={{ cursor: 'pointer' }} onClick={handleShare} />
                <Bookmark 
                  size={20} 
                  style={{ cursor: 'pointer', color: isBookmarked ? '#f59e0b' : 'inherit' }} 
                  fill={isBookmarked ? '#f59e0b' : 'none'}
                  onClick={handleBookmark} 
                />
              </div>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection direction="up">
          <div style={{ marginBottom: '4rem', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img 
              src={article.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80'} 
              alt={article.title} 
              style={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }}
            />
          </div>
        </FadeInSection>

        <FadeInSection direction="up">
          <div className="article-body" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.2rem', lineHeight: '1.8', color: '#e0e0e0' }}>
            <p style={{ fontSize: '1.4rem', color: '#00d2ff', fontWeight: '500', marginBottom: '3rem', fontStyle: 'italic', borderLeft: '4px solid #00d2ff', paddingLeft: '1.5rem' }}>
              {article.excerpt}
            </p>
            
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {article.content}
            </div>
            
            <div className="glass" style={{ marginTop: '5rem', padding: '3rem', borderRadius: '25px', textAlign: 'center', border: '1px solid rgba(0, 210, 255, 0.1)' }}>
              <h3 style={{ marginBottom: '1rem' }}>Disclaimer</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                This report is for informational purposes only. White Zero intelligence reports are generated based on available data points at the time of publication. 
                Always consult with your security operations center before taking action.
              </p>
            </div>
          </div>
        </FadeInSection>
      </article>

      <div style={{ height: '100px' }}></div>
    </div>
  );
};

export default ArticleDetail;
