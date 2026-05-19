import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Features from '../components/Features';
import FadeInSection from '../components/FadeInSection';
import Footer from '../components/Footer';
import { Shield, Mail, ArrowRight, Zap, Target, Lock, FileText, Search, BookOpen, Bookmark } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [hoveredCard, setHoveredCard] = React.useState(null);
  const [osintQuery, setOsintQuery] = React.useState('');
  const [osintState, setOsintState] = React.useState('idle');
  const [osintLogs, setOsintLogs] = React.useState([]);

  const handleOsintSearch = (e) => {
    e.preventDefault();
    if (!osintQuery.trim()) return;

    setOsintState('searching');
    setOsintLogs([]);

    const mockLogs = [
      `Initializing OSINT Engine Node v2.1...`,
      `Handshake established successfully.`,
      `Target Username to scan: "${osintQuery}"`,
      `Querying Google Search resources...`,
      `  -> Filtering 18,420 Google index nodes...`,
      `  -> [SUCCESS] Google profile isolated: ${osintQuery}_official`,
      `Querying DuckDuckGo search indexes...`,
      `  -> Filtering DDG privacy-focused archives...`,
      `  -> [SUCCESS] DuckDuckGo index hit: @${osintQuery} (Match 98%)`,
      `Querying Yahoo Search resources...`,
      `  -> Filtering Yahoo legacy directory feeds...`,
      `  -> [ALERT] Yahoo archive leakage: ${osintQuery}-public (Exposed)`,
      `OSINT Extraction Complete. Filtered and verified matches across Google, DuckDuckGo & Yahoo.`
    ];

    mockLogs.forEach((log, index) => {
      setTimeout(() => {
        setOsintLogs((prev) => [...prev, log]);
        if (index === mockLogs.length - 1) {
          setOsintState('done');
        }
      }, (index + 1) * 600);
    });
  };

  return (
    <main className="fade-in snap-container" style={{ background: '#020617' }}>

      {/* Hero Section */}
      <div className="snap-section">
        <Hero />
      </div>

      {/* Features Grid Section */}
      <div className="snap-section" style={{ position: 'relative' }}>
        <div className="neon-glow-bg" style={{ top: '10%', left: '-10%', width: '40%', height: '80%', background: '#00d2ff' }}></div>
        <FadeInSection style={{ width: '100%' }}>
          <Features />
        </FadeInSection>
      </div>

      {/* Flagship Feature 1: Cyber Intelligence Blog */}
      <section className="blog-home-section snap-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 2, width: '100%' }}>
          <div style={{ flex: '1 1 300px' }}>
            <FadeInSection direction="right">
              <img src="https://i.pinimg.com/564x/1a/e6/7d/1ae67d697c14d29f875f51849cb184c5.jpg" alt="Cyber Blog Analytics" style={{ width: '100%', borderRadius: '20px', border: '1px solid rgba(245,158,11,0.3)', boxShadow: '0 20px 40px rgba(245,158,11,0.15)' }} />
            </FadeInSection>
          </div>
          <div style={{ flex: '1 1 300px', textAlign: 'left' }}>
            <FadeInSection>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.2', fontWeight: '800' }}>Cyber Security Tech Blog</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                Explore our official Articals of published threat intelligence and cyber crime investigations. Stay informed with step-by-step trace tutorials and regulatory reporting guidelines curated by our expert analysis team.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'white' }}>
                  <BookOpen color="#f59e0b" size={20} style={{ flexShrink: 0 }} /> Real-time threat intelligence and investigation articles
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'white' }}>
                  <Shield color="#f59e0b" size={20} style={{ flexShrink: 0 }} /> SLCERT-aligned cyber law timelines and platform notices
                </li>


              </ul>
              <Link to="/articles" className="btn-primary" style={{ background: '#f59e0b', border: 'none', color: 'black', fontWeight: 'bold' }}>Browse Cyber Blog</Link>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Flagship Feature 2: Digital Intelligence Search */}
      <section className="osint-home-section snap-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: '4rem', alignItems: 'center', width: '100%', justifyContent: 'space-between', zIndex: 2 }}>
          <div style={{ flex: '1 1 450px', textAlign: 'left' }}>
            <FadeInSection>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.2', fontWeight: '800' }}>Digital Intelligence Username Search </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                Deploy our advanced OSINT harvesting engine to extract public posts, engagement metrics, and behavioral patterns from social media repositories. Convert raw data into actionable intelligence with high-speed neural filtering.
              </p>
              <Link to="/osint-trial" className="btn-outline">Launch Full OSINT Suite</Link>
            </FadeInSection>
          </div>
          <div style={{ flex: '1 1 450px', width: '100%', maxWidth: '500px' }}>
            <FadeInSection direction="left">
              <div className="glass" style={{
                border: '1px solid rgba(0, 210, 255, 0.25)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0, 210, 255, 0.15)',
                background: 'rgba(5, 8, 20, 0.82)',
                backdropFilter: 'blur(12px)'
              }}>
                {/* Console header bar */}
                <div style={{
                  background: 'rgba(2, 6, 23, 0.95)',
                  padding: '0.8rem 1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ff5f56' }}></span>
                    <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ffbd2e' }}></span>
                    <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#27c93f' }}></span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontWeight: 'bold' }}>
                    White_Zero_OSINT
                  </span>
                  <span style={{ width: '30px' }}></span>
                </div>

                {/* Console main body */}
                <div style={{ padding: '2rem 1.5rem', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                  {osintState === 'idle' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', textAlign: 'left' }}>
                      <h4 style={{ color: 'white', margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>OSINT Profile Searcher</h4>
                      <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                        Execute real-time intelligence search across indexed social telemetry repositories. Type in a username below to begin search:
                      </p>
                      <form onSubmit={handleOsintSearch} style={{ display: 'flex', gap: '0.75rem', width: '100%', boxSizing: 'border-box' }}>
                        <input
                          type="text"
                          placeholder="e.g. cyber_detective"
                          value={osintQuery}
                          onChange={(e) => setOsintQuery(e.target.value)}
                          style={{
                            flexGrow: 1,
                            background: 'rgba(2, 6, 23, 0.8)',
                            border: '1px solid rgba(0, 210, 255, 0.3)',
                            borderRadius: '10px',
                            padding: '0.75rem 1rem',
                            color: '#fff',
                            outline: 'none',
                            fontSize: '0.9rem',
                            transition: 'border-color 0.3s ease',
                            fontFamily: 'monospace'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#00d2ff'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(0, 210, 255, 0.3)'}
                        />
                        <button
                          type="submit"
                          className="btn-primary"
                          style={{
                            padding: '0.75rem 1.5rem',
                            fontSize: '0.9rem',
                            borderRadius: '10px',
                            background: '#00d2ff',
                            color: '#020617',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            boxShadow: '0 0 15px rgba(0, 210, 255, 0.3)'
                          }}
                        >
                          Harvest
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
                      <div style={{
                        background: 'rgba(2, 6, 23, 0.92)',
                        borderRadius: '10px',
                        padding: '1.2rem',
                        fontFamily: 'monospace',
                        fontSize: '0.82rem',
                        color: '#4ade80',
                        minHeight: '220px',
                        maxHeight: '220px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        border: '1px solid rgba(0, 210, 255, 0.15)',
                        textAlign: 'left',
                        boxSizing: 'border-box'
                      }}>
                        {osintLogs.map((log, idx) => (
                          <div key={idx} style={{
                            lineHeight: '1.5',
                            color: log.includes('[SUCCESS]') ? '#4ade80' : log.includes('[ALERT]') ? '#ff3d71' : '#38bdf8'
                          }}>
                            {idx === osintLogs.length - 1 && osintState === 'searching' ? (
                              <span>
                                {log}<span className="blink-cursor">_</span>
                              </span>
                            ) : (
                              log
                            )}
                          </div>
                        ))}
                      </div>

                      {osintState === 'done' && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                          <button
                            onClick={() => {
                              setOsintState('idle');
                              setOsintQuery('');
                            }}
                            className="btn-outline"
                            style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', borderRadius: '8px' }}
                          >
                            Reset Search
                          </button>
                          <Link
                            to="/osint-trial"
                            className="btn-primary"
                            style={{
                              padding: '0.5rem 1.2rem',
                              fontSize: '0.85rem',
                              borderRadius: '8px',
                              background: '#00d2ff',
                              color: '#020617',
                              border: 'none',
                              fontWeight: 'bold',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem'
                            }}
                          >
                            Go to OSINT Suite <ArrowRight size={14} />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Methodology / About Preview */}
      <section className="focus-section snap-section">
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px' }}>
            <FadeInSection>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Help To Recover & Report to police</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                White Zero is a specialized OSINT framework engineered for modern digital investigation. We bridge the gap between raw web data and official forensic reporting, providing investigators with high-impact intelligence tools.
              </p>
              <Link to="/about" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                Discover Our Framework <ArrowRight size={16} />
              </Link>
            </FadeInSection>
          </div>
          <div style={{ flex: '1 1 300px', display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', alignSelf: 'center' }}>
            <FadeInSection direction="left" delay={0.2}>
              <div
                className="glass"
                style={{
                  padding: '1.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  borderRadius: '18px',
                  cursor: 'pointer',
                  border: hoveredCard === 0 ? '1px solid rgba(0, 210, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.22)',
                  background: hoveredCard === 0 ? 'rgba(0, 210, 255, 0.03)' : 'rgba(10, 15, 30, 0.5)',
                  boxShadow: hoveredCard === 0 ? '0 10px 30px rgba(0, 210, 255, 0.1)' : 'none',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={() => setHoveredCard(0)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{
                    padding: '0.8rem',
                    background: hoveredCard === 0 ? '#00d2ff' : 'rgba(0,210,255,0.1)',
                    color: hoveredCard === 0 ? '#020617' : '#00d2ff',
                    borderRadius: '12px',
                    transition: 'all 0.4s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileText size={26} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '750', marginBottom: '0.2rem', color: hoveredCard === 0 ? '#00d2ff' : 'white', transition: 'color 0.3s ease' }}>Social Media Report</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>Platform compliance reporting.</p>
                  </div>
                </div>

                <div style={{
                  maxHeight: hoveredCard === 0 ? '140px' : '0px',
                  opacity: hoveredCard === 0 ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  paddingTop: hoveredCard === 0 ? '0.8rem' : '0rem',
                  borderTop: hoveredCard === 0 ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent'
                }}>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem', margin: '0 0 0.5rem 0', lineHeight: '1.5' }}>
                    Utilize our multi-step interactive reporting wizard designed for all major platforms:
                  </p>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0, color: 'rgba(0, 210, 255, 0.8)', fontSize: '0.82rem', lineHeight: '1.6' }}>
                    <li>Target profile info, URLs, and evidence file attachments</li>
                    <li>Supports Facebook, Instagram, WhatsApp, TikTok & Telegram</li>
                    <li>Instant plain-text legal forensic letter generation</li>
                  </ul>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection direction="left" delay={0.4}>
              <div
                className="glass"
                style={{
                  padding: '1.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  borderRadius: '18px',
                  cursor: 'pointer',
                  border: hoveredCard === 1 ? '1px solid rgba(0, 210, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.22)',
                  background: hoveredCard === 1 ? 'rgba(0, 210, 255, 0.03)' : 'rgba(10, 15, 30, 0.5)',
                  boxShadow: hoveredCard === 1 ? '0 10px 30px rgba(0, 210, 255, 0.1)' : 'none',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={() => setHoveredCard(1)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{
                    padding: '0.8rem',
                    background: hoveredCard === 1 ? '#00d2ff' : 'rgba(0,210,255,0.1)',
                    color: hoveredCard === 1 ? '#020617' : '#00d2ff',
                    borderRadius: '12px',
                    transition: 'all 0.4s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Shield size={26} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '750', marginBottom: '0.2rem', color: hoveredCard === 1 ? '#00d2ff' : 'white', transition: 'color 0.3s ease' }}>Police Report Option</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>Official law enforcement submission.</p>
                  </div>
                </div>

                <div style={{
                  maxHeight: hoveredCard === 1 ? '140px' : '0px',
                  opacity: hoveredCard === 1 ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  paddingTop: hoveredCard === 1 ? '0.8rem' : '0rem',
                  borderTop: hoveredCard === 1 ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent'
                }}>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem', margin: '0 0 0.5rem 0', lineHeight: '1.5' }}>
                    Submit and track cases officially through our direct Sri Lankan Law Enforcement portal:
                  </p>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0, color: 'rgba(0, 210, 255, 0.8)', fontSize: '0.82rem', lineHeight: '1.6' }}>
                    <li>Direct incident synchronization to active Police Officers</li>
                    <li>Real-time chat & document sharing with investigators</li>
                    <li>Live case status tracking on My Reports dashboard</li>
                  </ul>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Combined Contact CTA & Footer Snap Section */}
      <div className="snap-section combined-footer-section" style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between', boxSizing: 'border-box', position: 'relative' }}>
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '6rem 0 2rem 0' }}>
          <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', boxSizing: 'border-box' }}>
            <FadeInSection direction="down">
              <section style={{
                padding: '2.5rem 3rem',
                background: 'linear-gradient(135deg, rgba(10, 15, 30, 0.6) 0%, rgba(0, 210, 255, 0.06) 100%)',
                border: '1px solid rgba(0, 210, 255, 0.15)',
                borderRadius: '24px',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 15px 35px rgba(0, 210, 255, 0.05)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  gap: '2.5rem',
                  flexWrap: 'wrap',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: '1 1 600px' }}>
                    <div style={{
                      background: 'rgba(0, 210, 255, 0.1)',
                      border: '1px solid rgba(0, 210, 255, 0.2)',
                      width: '54px',
                      height: '54px',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00d2ff',
                      flexShrink: 0
                    }}>
                      <Mail size={24} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0 0 0.4rem 0', color: 'white', letterSpacing: '-0.5px' }}>Secure Your Investigation Today</h2>
                      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>Connect with the White Zero team for specialized framework access or inquiries.</p>
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <Link to="/contact" className="btn-primary" style={{ padding: '0.8rem 2.2rem', fontSize: '0.95rem', whiteSpace: 'nowrap', display: 'inline-block' }}>Contact Intelligence Team</Link>
                  </div>
                </div>
              </section>
            </FadeInSection>
          </div>
        </div>
        <div style={{ width: '100%', zIndex: 3 }}>
          <Footer />
        </div>
      </div>

    </main>
  );
};

export default Home;
