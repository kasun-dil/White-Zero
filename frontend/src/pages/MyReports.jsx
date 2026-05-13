import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Shield, MessageSquare, Send, Clock, CheckCircle, X, AlertTriangle, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const MyReports = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const chatEndRef = React.useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const prevReportIdRef = React.useRef(null);

  useEffect(() => {
    if (selectedReport) {
      if (prevReportIdRef.current !== selectedReport._id) {
        // We just switched to a new report -> GO TO TOP
        window.scrollTo({ top: 0, behavior: 'smooth' });
        prevReportIdRef.current = selectedReport._id;
      } else {
        // We are on the same report, but responses changed -> NEW MESSAGE -> GO TO BOTTOM
        scrollToBottom();
      }
    }
  }, [selectedReport?._id, selectedReport?.responses?.length]);

  useEffect(() => {
    if (user) {
      fetchMyReports();
    }
  }, [user]);

  useEffect(() => {
    if (selectedReport && !selectedReport.isReadByUser) {
      fetch(`/api/police-reports/${selectedReport._id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
    }
  }, [selectedReport]);

  const fetchMyReports = async () => {
    if (!user || !user.token) return;
    try {
      const res = await fetch('/api/reports/police/my', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching reports', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    const url = `/api/police-reports/${selectedReport._id}/reply`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ message: reply })
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedReport(updated);
        setReply('');
        fetchMyReports();
      } else {
        const errorData = await res.json();
        toast.error(`Transmission Error: ${errorData.message || 'Unknown failure'}`);
      }
    } catch (error) {
      toast.error(`Network Error: ${error.message}`);
    }
  };

  const handleClose = async (reason) => {
    try {
      const res = await fetch(`/api/reports/police/${selectedReport._id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedReport(updated);
        toast.success('Investigation Closed Successfully.');
        fetchMyReports();
      }
    } catch (error) {
      toast.error('Failed to close investigation');
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="loader" style={{ marginBottom: '1rem' }}></div>
        <p style={{ color: '#00d2ff', fontSize: '0.9rem', letterSpacing: '2px' }}>DECRYPTING SECURE ARCHIVES...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 0%, #0a1128 0%, #050505 100%)', width: '100%', position: 'relative' }}>
      <div className="page-container" style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div className="fade-in" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(0, 210, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(0, 210, 255, 0.2)' }}>
              <Shield className="text-[#00d2ff]" size={32} />
            </div>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, letterSpacing: '-1px' }}>
                Forensic <span className="text-gradient">Command Center</span>
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Monitor and manage your active investigative reports.</p>
            </div>
          </div>
        </div>

        <div className="responsive-grid">
          
          {/* Sidebar - Case History */}
          <div className="glass fade-in" style={{ borderRadius: '24px', padding: '1.5rem', height: 'fit-content', position: 'sticky', top: '120px', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <Clock size={18} className="text-[#00d2ff]" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0 }}>Case Archive</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reports.length > 0 ? [...reports].sort((a, b) => {
                // Active reports first
                if (a.isClosed && !b.isClosed) return 1;
                if (!a.isClosed && b.isClosed) return -1;
                // Then by latest activity (updatedAt)
                return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
              }).map(r => (
                <div 
                  key={r._id} 
                  onClick={() => setSelectedReport(r)}
                  className="chat-item-animation"
                  style={{ 
                    padding: '1.2rem', 
                    borderRadius: '16px', 
                    cursor: 'pointer',
                    background: selectedReport?._id === r._id ? 'rgba(0, 210, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid',
                    borderColor: selectedReport?._id === r._id ? 'rgba(0, 210, 255, 0.4)' : 'rgba(255,255,255,0.05)',
                    position: 'relative',
                    opacity: r.isClosed ? 0.7 : 1
                  }}
                >
                  {!r.isReadByUser && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', background: '#00d2ff', borderRadius: '50%', boxShadow: '0 0 10px #00d2ff' }} />
                  )}
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.4rem', color: selectedReport?._id === r._id ? '#00d2ff' : 'white' }}>{r.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#666', fontFamily: 'monospace' }}>{r.referenceId}</span>
                    <span style={{ 
                      fontSize: '0.65rem', 
                      padding: '2px 8px', 
                      borderRadius: '20px', 
                      background: r.isClosed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: r.isClosed ? '#10b981' : '#f59e0b',
                      fontWeight: 'bold',
                      border: '1px solid',
                      borderColor: r.isClosed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'
                    }}>
                      {r.isClosed ? 'RESOLVED' : 'ACTIVE'}
                    </span>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <AlertTriangle size={32} style={{ color: '#444', marginBottom: '1rem' }} />
                  <p style={{ color: '#666', fontSize: '0.85rem' }}>No forensic records found under this identity.</p>
                </div>
              )}
            </div>
          </div>

          {/* Main - Case Details & Correspondence */}
          <div className="fade-in">
            {selectedReport ? (
              <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                {/* Case Status Bar */}
                <div style={{ padding: '1.5rem 2rem', background: 'rgba(0, 210, 255, 0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>{selectedReport.title}</h2>
                    <p style={{ fontSize: '0.85rem', color: '#888', margin: 0 }}>Reference: <span style={{ color: '#00d2ff', fontWeight: 'bold' }}>{selectedReport.referenceId}</span> | Opened: {new Date(selectedReport.createdAt).toLocaleDateString()}</p>
                  </div>
                  {selectedReport.isClosed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      <CheckCircle size={18} className="text-[#10b981]" />
                      <span style={{ fontWeight: 'bold', color: '#10b981', fontSize: '0.85rem' }}>OFFICIALLY RESOLVED</span>
                    </div>
                  )}
                </div>

                <div style={{ padding: '2rem' }}>
                  {/* Summary Box */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#888', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                      <Shield size={14} /> INCIDENT SUMMARY
                    </div>
                    <p style={{ color: '#ccc', lineHeight: '1.7', margin: 0 }}>{selectedReport.description}</p>
                  </div>

                  {/* Correspondence Feed */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <MessageSquare size={18} className="text-[#00d2ff]" />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0 }}>Official Correspondence</h3>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1.2rem', 
                    maxHeight: 'calc(100vh - 400px)', 
                    overflowY: 'auto', 
                    padding: '1rem',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '20px',
                    marginBottom: '2rem',
                    border: '1px solid rgba(255,255,255,0.02)'
                  }}>
                    {selectedReport.responses.map((resp, i) => (
                      <div key={i} className="message-animation" style={{ 
                        alignSelf: resp.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        background: resp.role === 'user' ? 'linear-gradient(135deg, #021a30, #004e92)' : 'rgba(255,255,255,0.05)',
                        padding: '1.2rem',
                        borderRadius: resp.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        boxShadow: resp.role === 'user' ? '0 4px 15px rgba(0, 0, 0, 0.4)' : 'none',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', marginBottom: '0.6rem' }}>
                          <span style={{ 
                            fontSize: '0.65rem', 
                            fontWeight: 'bold', 
                            color: resp.role === 'user' ? 'rgba(255,255,255,0.8)' : '#10b981',
                            letterSpacing: '1px'
                          }}>
                            {resp.role === 'user' ? 'INVESTIGATOR (YOU)' : 'POLICE OFFICER'}
                          </span>
                          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                            {new Date(resp.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.95rem', margin: 0, lineHeight: '1.5', color: 'white' }}>{resp.message}</p>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input Section */}
                  {!selectedReport.isClosed ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <form onSubmit={handleReply} style={{ display: 'flex', gap: '1rem' }}>
                        <input 
                          type="text" 
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          placeholder="Type official reply..."
                          style={{ 
                            flex: 1, 
                            background: 'rgba(255,255,255,0.03)', 
                            border: '1px solid rgba(255,255,255,0.1)', 
                            borderRadius: '16px', 
                            padding: '1rem 1.5rem', 
                            color: 'white',
                            outline: 'none',
                            transition: 'border-color 0.3s'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#00d2ff'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '0 2rem', borderRadius: '16px' }}>
                          <Send size={20} />
                        </button>
                      </form>
                      
                      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <button 
                          onClick={() => {
                            const reason = prompt("Enter final conclusion for official case closure:");
                            if (reason) handleClose(reason);
                          }}
                          style={{ 
                            background: 'none', 
                            border: '1px solid rgba(239, 68, 68, 0.3)', 
                            color: '#ef4444', 
                            padding: '0.6rem 1.2rem', 
                            borderRadius: '12px', 
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                          onMouseOver={(e) => { e.target.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                          onMouseOut={(e) => { e.target.style.background = 'none'; }}
                        >
                          FINAL CASE CLOSURE
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '20px', border: '1px dashed rgba(16, 185, 129, 0.3)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#10b981', fontWeight: 'bold', fontSize: '0.8rem' }}>
                        <CheckCircle size={14} /> OFFICIAL CONCLUSION
                      </div>
                      <p style={{ margin: 0, color: '#ccc', fontStyle: 'italic' }}>"{selectedReport.conclusion}"</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass fade-in" style={{ borderRadius: '24px', height: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center' }}>
                <div style={{ position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Hexagon size={36} className="text-[#10b981]" style={{ position: 'absolute' }} />
                  <Shield size={18} color="white" style={{ position: 'absolute', zIndex: 1 }} />
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem' }}>No Investigation Selected</h2>
                <p style={{ color: '#666', maxWidth: '400px', margin: '0 auto' }}>Select a forensic file from the archive to view detailed incident correspondence and intelligence updates.</p>
              </div>
            )}
          </div>

        </div>
      </div>
      </div>
    </div>
  );
};

export default MyReports;
