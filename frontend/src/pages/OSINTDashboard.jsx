import React, { useState, useContext } from 'react';
import { Search, Filter, User, Users, Flag, MessageSquare, ThumbsUp, Calendar, ExternalLink, ChevronRight, Loader2, Globe, Phone } from 'lucide-react';
import { searchOSINT } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import FadeInSection from '../components/FadeInSection';
import './OSINTDashboard.css';

const OSINTDashboard = () => {
  const [searchType, setSearchType] = useState('people');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [usernameResults, setUsernameResults] = useState(null);
  const [phoneResults, setPhoneResults] = useState(null);
  const { user } = useContext(AuthContext);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setScanning(true);
    setUsernameResults(null);
    try {
      let data;
      if (searchType === 'username') {
        const response = await fetch('/api/osint/username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: query })
        });
        data = await response.json();
        setUsernameResults(data);
        setPhoneResults(null);
        setResults([]);
        setPosts([]);
        setSelectedEntity(null);
      } else if (searchType === 'phone') {
        const response = await fetch('/api/osint/phone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: query })
        });
        data = await response.json();
        setPhoneResults(data);
        setUsernameResults(null);
        setResults([]);
        setPosts([]);
        setSelectedEntity(null);
      } else {
        data = await searchOSINT(query, searchType);
        if (searchType === 'post') {
          setPosts(data);
          setResults([]);
          setSelectedEntity(null);
        } else {
          setResults(data);
          setPosts([]);
        }
      }

      // Record search history if user is logged in
      if (user && data) {
        const count = searchType === 'username' ? (data.results?.length || 0) : (data?.length || 0);
        await fetch('/api/history/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({
            query: `[${searchType.toUpperCase()}] ${query}`,
            resultsCount: count
          })
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setScanning(false);
      }, 1500); // Simulate forensic scanning time
    }
  };

  const handleExport = () => {
    if (!usernameResults) return;

    let report = `WHITE ZERO OSINT USER NAME SEARCH REPORT\n`;
    report += `===============================================\n`;
    report += `TARGET USERNAME: ${usernameResults.username}\n`;
    report += `SCAN DATE: ${new Date().toLocaleString()}\n`;
    report += `===============================================\n\n`;

    report += `FOUND PROFILES:\n`;
    report += `----------------\n`;

    const found = usernameResults.results.filter(r => r.status === 'Found');
    if (found.length > 0) {
      found.forEach(res => {
        report += `[+] PLATFORM: ${res.platform}\n`;
        report += `    PROFILE URL: ${res.link}\n\n`;
      });
    } else {
      report += `[!] No public profiles discovered in this scan.\n`;
    }

    report += `\n=============================================\n`;
    report += `END OF INTELLIGENCE REPORT\n`;

    const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(report);
    const exportFileDefaultName = `Forensic_Report_${usernameResults.username}.txt`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleEntityClick = (entity) => {
    setSelectedEntity(entity);
    setLoading(true);
    // Simulate fetching posts for a profile/page/group
    setTimeout(() => {
      setPosts([
        { id: 101, text: 'Forensic Analysis: Content verified against known databases.', likes: 1200, comments: 45, date: '2024-04-20', trust_score: 0.88, risk_level: 'Low' },
        { id: 102, text: 'Suspicious activity detected in recent interactions.', likes: 850, comments: 32, date: '2024-04-18', trust_score: 0.35, risk_level: 'High' },
        { id: 103, text: 'Metadata analysis indicates multi-source dissemination.', likes: 2100, comments: 89, date: '2024-04-15', trust_score: 0.62, risk_level: 'Medium' }
      ]);
      setLoading(false);
    }, 1000);
  };

  const SocialIcon = ({ platform, size = 24 }) => {
    const p = platform.toLowerCase();
    const colors = {
      facebook: '#1877F2', instagram: '#E4405F', twitter: '#1DA1F2',
      github: '#FFF', linkedin: '#0A66C2', youtube: '#FF0000', reddit: '#FF4500', tiktok: '#000',
      'global intelligence': '#00d2ff'
    };
    const color = colors[p] || '#888';

    // Inline SVGs for 100% reliability
    const svgs = {
      facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
      instagram: (
        <>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </>
      ),
      twitter: <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />,
      github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />,
      linkedin: (
        <>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </>
      ),
      youtube: (
        <>
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z" />
          <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
        </>
      ),
      reddit: (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z" />
        </>
      ),
      tiktok: (
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      ),
      'global intelligence': (
        <>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </>
      )
    };

    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {svgs[p] || (
          <>
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </>
        )}
      </svg>
    );
  };

  const getPlatformIcon = (platform) => {
    return <SocialIcon platform={platform} />;
  };

  return (
    <div className="osint-container">
      <div className="osint-sidebar glass">
        <FadeInSection direction="right">
          <div className="osint-logo">
            <Filter size={24} className="text-[#00d2ff]" />
            <span>WHITE ZERO OSINT</span>
          </div>

          <div className="search-section">
            <div className="search-type-selector">
              <button className={searchType === 'post' ? 'active' : ''} onClick={() => setSearchType('post')}>
                <User size={16} /> Posts
              </button>
              <button className={searchType === 'people' ? 'active' : ''} onClick={() => setSearchType('people')}>
                <User size={16} /> People
              </button>
              <button className={searchType === 'page' ? 'active' : ''} onClick={() => setSearchType('page')}>
                <Flag size={16} /> Pages
              </button>
              <button className={searchType === 'group' ? 'active' : ''} onClick={() => setSearchType('group')}>
                <Users size={16} /> Groups
              </button>
              <button className={searchType === 'phone' ? 'active' : ''} onClick={() => setSearchType('phone')}>
                <Phone size={16} /> Phone
              </button>
              <button className={searchType === 'username' ? 'active' : ''} onClick={() => setSearchType('username')}>
                <User size={16} /> Username
              </button>
            </div>
            <div className={`osint-search-box ${loading ? 'scanning' : ''}`}>
              <input
                type="text"
                placeholder={`Forensic Search ${searchType}...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch} disabled={loading}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              </button>
            </div>
          </div>

          <div className="osint-results-list">
            {scanning && (
              <div className="scanning-overlay">
                <div className="scan-line"></div>
                <p>SCANNING GLOBAL DATABASES...</p>
              </div>
            )}
            {!scanning && results.map(res => (
              <div key={res.id} className={`result-item glass ${selectedEntity?.id === res.id ? 'active' : ''}`} onClick={() => handleEntityClick(res)}>
                <img src={res.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(res.name)}&background=00d2ff&color=fff`} alt="" />
                <div className="res-info">
                  <h4>{res.name}</h4>
                  <div className="res-badges">
                    <span className={`risk-badge ${res.risk_level?.toLowerCase()}`}>{res.risk_level} Risk</span>
                    <span>{Math.round(res.trust_score * 100)}% Trust</span>
                  </div>
                </div>
                <ChevronRight size={16} className="chevron" />
              </div>
            ))}
          </div>
        </FadeInSection>
      </div>

      <div className="osint-main-content">
        {scanning ? (
          <div className="forensic-loading">
            <div className="data-stream">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="stream-line" style={{ animationDelay: `${i * 0.1}s` }}>
                  01010110 10010101 11001100 10101010 01011111 00110011
                </div>
              ))}
            </div>
            <h2>INTELLIGENCE RETRIEVAL IN PROGRESS</h2>
            <p>Accessing public nodes and analyzing metadata patterns...</p>
          </div>
        ) : usernameResults ? (
          <div className="username-investigation">
            <FadeInSection direction="down">
              <div className="dashboard-header glass">
                <div className="entity-meta">
                  <div className="avatar-placeholder">@</div>
                  <div>
                    <h1>Username: {usernameResults.username}</h1>
                    <p>Cross-Platform Digital Footprint Analysis</p>
                  </div>
                </div>
                <div className="header-actions">
                  <button className="btn-primary" onClick={handleExport}>Export Analysis</button>
                </div>
              </div>
            </FadeInSection>

            <div className="platforms-grid">
              {usernameResults.results ? (
                usernameResults.results.map((res, i) => (
                  <FadeInSection key={res.platform} delay={i * 0.05} direction="up">
                    <div className={`platform-card glass ${res.status.toLowerCase()}`}>
                      <div className="platform-header">
                        <div className={`platform-icon-box ${res.status.toLowerCase()}`}>
                          {getPlatformIcon(res.platform)}
                        </div>
                        <div className={`status-tag ${res.status.toLowerCase()}`}>
                          {res.status}
                        </div>
                      </div>
                      <div className="platform-info">
                        <h3>{res.platform}</h3>
                        <p className="platform-url">{res.link}</p>
                      </div>
                      <div className="platform-footer">
                        <a href={res.link} target="_blank" rel="noreferrer" className="btn-visit">
                          Visit Profile <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </FadeInSection>
                ))
              ) : (
                <div className="engine-error glass">
                  <p>INTELLIGENCE ENGINE OFFLINE: {usernameResults.message || 'Unknown Error'}</p>
                </div>
              )}
            </div>
          </div>
        ) : phoneResults ? (
            <div className="username-investigation">
              <FadeInSection direction="down">
                <div className="dashboard-header glass">
                  <div className="entity-meta">
                    <div className="avatar-placeholder"><Phone size={32} /></div>
                    <div>
                      <h1>Phone: {phoneResults.phone}</h1>
                      <p>Global Mobile Intelligence & Social Linkage</p>
                    </div>
                  </div>
                  <div className="header-actions">
                    <button className="btn-primary" onClick={() => {
                      let report = `PHONE INVESTIGATION REPORT\nNUMBER: ${phoneResults.phone}\n`;
                      phoneResults.results.filter(r => r.status === 'Found').forEach(res => {
                        report += `[+] ${res.platform}: ${res.link}\n`;
                      });
                      const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(report);
                      const linkElement = document.createElement('a');
                      linkElement.setAttribute('href', dataUri);
                      linkElement.setAttribute('download', `Phone_Report_${phoneResults.phone}.txt`);
                      linkElement.click();
                    }}>Export Analysis</button>
                  </div>
                </div>
              </FadeInSection>

              <div className="forensic-feed">
                {phoneResults.results.some(r => r.status === 'Found') ? (
                  phoneResults.results.filter(r => r.status === 'Found').map((res, i) => (
                    <FadeInSection key={i} delay={i * 0.05} direction="up">
                      <div className="forensic-entry glass">
                        <div className="entry-header">
                          <div className="entry-icon">{getPlatformIcon(res.platform)}</div>
                          <div className="entry-meta">
                            <span className="entry-title">{res.title || res.platform}</span>
                            <span className="entry-platform">{res.platform}</span>
                          </div>
                          <div className="entry-status">DECRYPTED</div>
                        </div>
                        <div className="entry-content">
                          <p className="entry-snippet">{res.snippet}</p>
                          <a href={res.link} target="_blank" rel="noreferrer" className="entry-link">
                            {res.link} <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    </FadeInSection>
                  ))
                ) : (
                  <div className="empty-intel glass">
                    <p>NO PUBLIC DIGITAL FOOTPRINT DETECTED IN PRIMARY NODES</p>
                    <span>Hint: Try searching the username associated with this number instead.</span>
                  </div>
                )}
              </div>
            </div>
        ) : !selectedEntity && posts.length === 0 ? (
          <FadeInSection>
            <div className="empty-state">
              <Search size={64} className="text-[#00d2ff] opacity-20" />
              <h2>OSINT CENTRAL COMMAND</h2>
              <p>Initialize a search to begin forensic data extraction from social networks.</p>
              <div className="command-hints">
                <span>[ALT+S] SEARCH</span>
                <span>[ALT+F] FILTER</span>
                <span>[ALT+E] EXPORT</span>
              </div>
            </div>
          </FadeInSection>
        ) : (
          <div className="entity-dashboard">
            <FadeInSection direction="down">
              <div className="dashboard-header glass">
                <div className="entity-meta">
                  {selectedEntity ? (
                    <>
                      <img src={selectedEntity.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedEntity.name)}&background=00d2ff&color=fff`} alt="" />
                      <div>
                        <h1>{selectedEntity.name}</h1>
                        <p>{selectedEntity.type.toUpperCase()} • Forensic Analysis Profile</p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <h1>Keyword: {query}</h1>
                      <p>POST SEARCH RESULTS • Global Public Content</p>
                    </div>
                  )}
                </div>
                <div className="header-actions">
                  <button className="btn-outline"><ExternalLink size={16} /> View Source</button>
                  <button className="btn-primary">Generate Report</button>
                </div>
              </div>
            </FadeInSection>

            <div className="posts-grid">
              {posts.map((post, i) => (
                <FadeInSection key={post.id} delay={i * 0.1} direction="up">
                  <div className="post-card glass forensic-card" onClick={() => setSelectedPost(post)}>
                    <div className="card-forensic-header">
                      <span className={`risk-dot ${post.risk_level?.toLowerCase()}`}></span>
                      <span className="trust-percent">{Math.round(post.trust_score * 100)}% Match</span>
                    </div>
                    <p className="post-text">{post.content || post.text}</p>
                    <div className="post-stats">
                      <span><ThumbsUp size={14} /> {post.likes}</span>
                      <span><MessageSquare size={14} /> {post.comments}</span>
                      <span><Calendar size={14} /> {post.date || post.timestamp}</span>
                    </div>
                    <div className="card-footer">
                      <span className="forensic-id">ID: {post.id}</span>
                      <span className="risk-label">{post.risk_level} Risk</span>
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>

            {selectedPost && (
              <div className="modal-backdrop" onClick={() => setSelectedPost(null)}>
                <FadeInSection>
                  <div className="post-detail-modal forensic-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3>FORENSIC POST ANALYSIS</h3>
                      <button onClick={() => setSelectedPost(null)}>×</button>
                    </div>
                    <div className="modal-body">
                      <div className="forensic-meta-grid">
                        <div className="meta-box">
                          <label>Timestamp</label>
                          <p>{selectedPost.date || selectedPost.timestamp}</p>
                        </div>
                        <div className="meta-box">
                          <label>Trust Score</label>
                          <p className="text-[#00d2ff]">{Math.round(selectedPost.trust_score * 100)}%</p>
                        </div>
                        <div className="meta-box">
                          <label>Risk Level</label>
                          <p className={`risk-${selectedPost.risk_level?.toLowerCase()}`}>{selectedPost.risk_level}</p>
                        </div>
                        <div className="meta-box">
                          <label>Interaction Rate</label>
                          <p>{selectedPost.likes + selectedPost.comments} total</p>
                        </div>
                      </div>

                      <div className="content-analysis-box">
                        <h4>RAW CONTENT</h4>
                        <p className="full-text">{selectedPost.content || selectedPost.text}</p>
                      </div>

                      <div className="comment-analysis">
                        <h4>SENTIMENT & KEYWORD SCANNING</h4>
                        <div className="filter-input">
                          <input type="text" placeholder="Scanning for disinformation patterns..." readOnly />
                          <Search size={16} className="animate-pulse" />
                        </div>
                        <div className="comments-list">
                          <div className="comment-item forensic">
                            <div className="comment-header">
                              <strong>NODE_ALPHA</strong>
                              <span className="sentiment positive">Positive</span>
                            </div>
                            This information aligns with established datasets.
                            <span>2024-04-20 10:30 AM</span>
                          </div>
                          <div className="comment-item forensic">
                            <div className="comment-header">
                              <strong>NODE_BETA</strong>
                              <span className="sentiment negative">Suspicious</span>
                            </div>
                            Patterns of coordinated inauthentic behavior detected.
                            <span>2024-04-20 11:15 AM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInSection>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OSINTDashboard;
