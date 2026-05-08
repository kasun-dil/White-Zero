import React, { useState, useEffect, useContext } from 'react';
import { Mail, MapPin, Phone, Star, MessageSquare } from 'lucide-react';
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
        gap: '3rem', 
        marginBottom: '6rem' 
      }}>
        <FadeInSection direction="right">
          <div className="contact-info glass" style={{ padding: '3.5rem', height: '100%', borderRadius: '30px' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>Contact Information</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Reach out to our team for support, feature requests, or collaboration inquiries.</p>
            
            <div className="info-items" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="info-item" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div className="icon-wrapper" style={{ padding: '1rem', background: 'rgba(0, 210, 255, 0.1)', borderRadius: '15px' }}>
                  <Mail size={24} className="text-[#00d2ff]" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Email</h4>
                  <p style={{ color: 'var(--text-muted)' }}>support@whitezero.lk</p>
                </div>
              </div>
              <div className="info-item" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div className="icon-wrapper" style={{ padding: '1rem', background: 'rgba(0, 210, 255, 0.1)', borderRadius: '15px' }}>
                  <Phone size={24} className="text-[#00d2ff]" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Phone</h4>
                  <p style={{ color: 'var(--text-muted)' }}>+94 11 234 5678</p>
                </div>
              </div>
              <div className="info-item" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div className="icon-wrapper" style={{ padding: '1rem', background: 'rgba(0, 210, 255, 0.1)', borderRadius: '15px' }}>
                  <MapPin size={24} className="text-[#00d2ff]" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Location</h4>
                  <p style={{ color: 'var(--text-muted)' }}>Colombo, Sri Lanka</p>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection direction="left">
          <form className="contact-form glass" style={{ padding: '3.5rem', height: '100%', borderRadius: '30px' }} onSubmit={handleContactSubmit}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '2.5rem' }}>Send a Message</h2>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                placeholder="Your Name" 
                value={contactName} 
                onChange={(e) => setContactName(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="Your Email" 
                value={contactEmail} 
                onChange={(e) => setContactEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea 
                rows="5" 
                placeholder="How can we help you?" 
                value={contactMessage} 
                onChange={(e) => setContactMessage(e.target.value)} 
                required
              ></textarea>
            </div>
            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', marginTop: '1.5rem', padding: '1.2rem' }}>
              {isSubmitting ? 'Transmitting...' : 'Send Message'}
            </button>
          </form>
        </FadeInSection>
      </div>

      {/* User Feedback & Reviews Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4rem' }}>
        <FadeInSection>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>User Feedback</h2>
            <p style={{ color: 'var(--text-muted)' }}>See what the community is saying about White Zero.</p>
          </div>
        </FadeInSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {/* Display Reviews */}
          <div className="custom-scrollbar" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem', 
            maxHeight: '480px', 
            overflowY: 'auto',
            paddingRight: '1rem'
          }}>
            {reviews.map((review, i) => (
              <FadeInSection key={review._id} delay={i * 0.1}>
                <div className="glass" style={{ padding: '1.2rem', borderRadius: '15px' }}>
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
                  <p style={{ fontStyle: 'italic', marginBottom: '1rem', lineHeight: '1.5', fontSize: '0.95rem' }}>"{review.text}"</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <img 
                        src={review.userId?.profileImage || `https://ui-avatars.com/api/?name=${review.name}`} 
                        alt="" 
                        style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} 
                      />
                      <span style={{ fontWeight: 'bold', color: 'white' }}>{review.name}</span>
                    </div>
                    <span>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>

          {/* Submit Review Form */}
          <FadeInSection direction="left">
            <div className="glass" style={{ padding: '2rem', borderRadius: '15px', height: 'fit-content' }}>
              {!user ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <p>Please login to leave a review.</p>
                  <a href="/login" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>Login Now</a>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <MessageSquare size={24} className="text-[#00d2ff]" />
                    <h3 style={{ margin: 0 }}>Leave a Review</h3>
                  </div>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="form-group">
                      <label>Rating</label>
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
                      <label>Your Experience</label>
                      <textarea 
                        rows="4" 
                        placeholder="Tell us what you think about White Zero..." 
                        value={newReviewText} 
                        onChange={(e) => setNewReviewText(e.target.value)} 
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn-outline" style={{ width: '100%' }}>Post Review</button>
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
