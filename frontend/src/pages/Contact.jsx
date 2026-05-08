import React, { useState, useEffect, useContext, useRef } from 'react';
import { Mail, MapPin, Phone, Star, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import FadeInSection from '../components/FadeInSection';
import './PageStyles.css';

const Contact = () => {
  const [reviews, setReviews] = useState([]);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchApprovedReviews();
    if (user) {
      setNewReviewName(user.name);
      setContactName(user.name);
      setContactEmail(user.email);
    }
  }, [user]);

  const fetchApprovedReviews = async () => {
    try {
      const res = await fetch('/api/feedback/approved');
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews', error);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let intervalId;
    const startAutoScroll = () => {
      intervalId = setInterval(() => {
        if (scrollContainer) {
          const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
          // Calculate scroll amount based on client width (approx 50% for dual card)
          const scrollAmount = scrollContainer.clientWidth > 768 ? scrollContainer.clientWidth / 2 + 16 : scrollContainer.clientWidth;
          
          if (scrollContainer.scrollLeft >= maxScroll - 20) {
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }
      }, 1800);
    };

    startAutoScroll();

    const handleMouseEnter = () => clearInterval(intervalId);
    const handleMouseLeave = () => startAutoScroll();

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(intervalId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [reviews]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMessage })
      });
      if (res.ok) {
        toast.success('Message sent successfully!');
        setContactMessage('');
      } else {
        toast.error('Failed to send message.');
      }
    } catch (error) {
      console.error('Contact error', error);
      toast.error('Error connecting to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit feedback');
      return;
    }

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ 
          text: newReviewText, 
          rating
        })
      });
      const data = await res.json();
      
      toast.success('Feedback submitted and pending approval!');
      setNewReviewText('');
    } catch (error) {
      console.error('Error submitting feedback', error);
      toast.error('Failed to submit feedback');
    }
  };

  return (
    <div className="page-container fade-in">
      <FadeInSection direction="down">
        <div className="page-header">
          <h1>Get in <span className="text-gradient">Touch</span></h1>
          <p>Have questions about the White Zero framework? We're here to help.</p>
        </div>
      </FadeInSection>

      <div className="contact-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', 
        gap: '2rem', 
        marginBottom: '4rem' 
      }}>
        <FadeInSection direction="right">
          <div className="contact-info glass" style={{ padding: '2rem 2.5rem', height: '100%', borderRadius: '30px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.2rem' }}>Contact Information</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>Reach out to our team for support, feature requests, or collaboration inquiries.</p>
            
            <div className="info-items" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="info-item" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div className="icon-wrapper" style={{ padding: '0.8rem', background: 'rgba(0, 210, 255, 0.1)', borderRadius: '12px' }}>
                  <Mail size={20} className="text-[#00d2ff]" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.1rem' }}>Email</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>support@whitezero.lk</p>
                </div>
              </div>
              <div className="info-item" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div className="icon-wrapper" style={{ padding: '0.8rem', background: 'rgba(0, 210, 255, 0.1)', borderRadius: '12px' }}>
                  <Phone size={20} className="text-[#00d2ff]" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.1rem' }}>Phone</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>+94 11 234 5678</p>
                </div>
              </div>
              <div className="info-item" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div className="icon-wrapper" style={{ padding: '0.8rem', background: 'rgba(0, 210, 255, 0.1)', borderRadius: '12px' }}>
                  <MapPin size={20} className="text-[#00d2ff]" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.1rem' }}>Location</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Colombo, Sri Lanka</p>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection direction="left">
          <form className="contact-form glass" style={{ padding: '2rem 2.5rem', height: '100%', borderRadius: '30px' }} onSubmit={handleContactSubmit}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Send a Message</h2>
            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ marginBottom: '0.5rem' }}>Name</label>
              <input 
                type="text" 
                placeholder="Your Name" 
                value={contactName} 
                onChange={(e) => setContactName(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ marginBottom: '0.5rem' }}>Email</label>
              <input 
                type="email" 
                placeholder="Your Email" 
                value={contactEmail} 
                onChange={(e) => setContactEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ marginBottom: '0.5rem' }}>Message</label>
              <textarea 
                rows="4" 
                placeholder="How can we help you?" 
                value={contactMessage} 
                onChange={(e) => setContactMessage(e.target.value)} 
                required
              ></textarea>
            </div>
            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', marginTop: '0.5rem', padding: '1rem' }}>
              {isSubmitting ? 'Transmitting...' : 'Send Message'}
            </button>
          </form>
        </FadeInSection>
      </div>

      {/* User Feedback Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4rem', paddingBottom: '6rem' }}>
        <FadeInSection>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>User Feedback</h2>
            <p style={{ color: 'var(--text-muted)' }}>See what the community is saying about White Zero.</p>
          </div>
        </FadeInSection>

        <div style={{ position: 'relative', marginBottom: '4rem' }}>
          {/* Navigation Arrows */}
          <button 
            onClick={() => scroll('left')}
            className="carousel-nav-btn left"
            style={{
              position: 'absolute',
              left: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(0, 210, 255, 0.1)',
              border: '1px solid rgba(0, 210, 255, 0.3)',
              borderRadius: '50%',
              padding: '0.8rem',
              color: 'white',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
          >
            <ChevronLeft size={20} />
          </button>

          <button 
            onClick={() => scroll('right')}
            className="carousel-nav-btn right"
            style={{
              position: 'absolute',
              right: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(0, 210, 255, 0.1)',
              border: '1px solid rgba(0, 210, 255, 0.3)',
              borderRadius: '50%',
              padding: '0.8rem',
              color: 'white',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
          >
            <ChevronRight size={20} />
          </button>

          <div 
            ref={scrollRef}
            className="custom-scrollbar" 
            style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              gap: '2rem', 
              overflowX: 'auto',
              padding: '1rem 0.5rem',
              scrollBehavior: 'smooth',
              scrollSnapType: 'x mandatory',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {reviews.map((review, i) => (
              <div key={review._id} style={{ minWidth: 'calc(50% - 1rem)', flexShrink: 0, scrollSnapAlign: 'start' }}>
                <FadeInSection delay={i * 0.1}>
                  <div className="glass" style={{ padding: '1.5rem', borderRadius: '15px', height: '100%' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', color: '#f59e0b', marginBottom: '0.6rem' }}>
                      {[...Array(5)].map((_, starIndex) => (
                        <Star 
                          key={starIndex}
                          size={14} 
                          fill={starIndex < review.rating ? "currentColor" : "none"} 
                          className={starIndex < review.rating ? "text-[#f59e0b]" : "text-gray-600"}
                        />
                      ))}
                    </div>
                    <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '0.95rem', height: '80px', overflowY: 'auto' }}>"{review.text}"</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <img 
                          src={review.userId?.profileImage || `https://ui-avatars.com/api/?name=${review.name}`} 
                          alt="" 
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} 
                        />
                        <span style={{ fontWeight: 'bold', color: 'white' }}>{review.name}</span>
                      </div>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </FadeInSection>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Review Section */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <FadeInSection direction="up">
            <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
              {!user ? (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <p style={{ marginBottom: '1.5rem' }}>Please login to share your intelligence feedback.</p>
                  <a href="/login" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>Login Now</a>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <MessageSquare size={24} className="text-[#00d2ff]" />
                    <h3 style={{ margin: 0 }}>Broadcast Intelligence Feedback</h3>
                  </div>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="form-group">
                      <label>Forensic Rating</label>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            size={24} 
                            style={{ cursor: 'pointer', color: star <= rating ? '#f59e0b' : '#374151' }}
                            fill={star <= rating ? '#f59e0b' : 'none'}
                            onClick={() => setRating(star)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Narrative Report</label>
                      <textarea 
                        rows="3" 
                        placeholder="Detail your experience with the White Zero framework..." 
                        value={newReviewText} 
                        onChange={(e) => setNewReviewText(e.target.value)} 
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn-glass" style={{ width: '100%', padding: '1rem' }}>Transmit Feedback</button>
                  </form>
                </>
              )}
            </div>
          </FadeInSection>
        </div>
      </div>
    </div>
  );
};

export default Contact;
