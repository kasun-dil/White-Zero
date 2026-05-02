import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Features from '../components/Features';
import FadeInSection from '../components/FadeInSection';
import { Shield, Mail, ArrowRight, Zap, Target, Lock, FileText, Search } from 'lucide-react';

const Home = () => {
  return (
    <main className="fade-in" style={{ background: '#020617' }}>
      <Hero />

      {/* Features Grid */}
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '40%', height: '80%', background: 'radial-gradient(circle, rgba(0,210,255,0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: 0 }}></div>
        <FadeInSection>
          <Features />
        </FadeInSection>
      </div>

      {/* Flagship Feature 1: Forensic Reporting */}
      <section style={{ padding: '6rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-10%', top: '20%', width: '50%', height: '60%', background: 'radial-gradient(circle, rgba(0, 210, 255, 0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: 0 }}></div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ flex: '1 1 300px' }}>
            <FadeInSection direction="right">
              <img src="https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80&w=800" alt="Forensic Documentation" style={{ width: '100%', borderRadius: '20px', border: '1px solid rgba(245,158,11,0.3)', boxShadow: '0 20px 40px rgba(245,158,11,0.1)' }} />
            </FadeInSection>
          </div>
          <div style={{ flex: '1 1 300px' }}>
            <FadeInSection>
              <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', borderRadius: '50px', fontWeight: '600', marginBottom: '1rem' }}>Legal & Compliance</div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>Automated Forensic Incident Reporting</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                Generate high-authority, plain-text forensic letters for official submission to law enforcement and platform compliance teams. Our wizard reconstructs incident timelines and technical evidence into legal-grade documentation.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><FileText color="#f59e0b" size={20} /> Professional Letter Generation</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Target color="#f59e0b" size={20} /> Technical Evidence Structuring</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Lock color="#f59e0b" size={20} /> Secure Profile Archiving</li>
              </ul>
              <Link to="/report-crime" className="btn-primary" style={{ background: '#f59e0b', border: 'none', color: 'black' }}>Generate Forensic Report</Link>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Flagship Feature 2: AI OSINT */}
      <section style={{ padding: '6rem 2rem', position: 'relative', overflow: 'hidden', background: 'rgba(0, 210, 255, 0.02)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: '4rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px' }}>
            <FadeInSection>
              <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(0,210,255,0.1)', color: '#00d2ff', borderRadius: '50px', fontWeight: '600', marginBottom: '1rem' }}>Investigative Engine</div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>AI Intelligence Search & Harvesting</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                Deploy our advanced OSINT harvesting engine to extract public posts, engagement metrics, and behavioral patterns from social media repositories. Convert raw data into actionable intelligence with high-speed neural filtering.
              </p>
              <Link to="/osint-trial" className="btn-outline">Launch Intelligence Search</Link>
            </FadeInSection>
          </div>
          <div style={{ flex: '1 1 300px' }}>
            <FadeInSection direction="left">
              <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhifG3FoC2yoAToDqTVKCkxBwkahTxkUpWedPwF67Q2elT6FXjBa9nnU63_Vw7xcUYu4tO7D9R9HECD749AE3iOs3xMwkye6gne-iie31nhzcYFF4yz4mETXNFSUoV9UQnxSS6uc8ZSl8DvEOD8reRPw8bVUMA_RSeAE4ZdBJDBV8UthcUZzafGguUChkYG/s16000/OSINT%20.webp" alt="AI Intelligence Engine" style={{ width: '100%', borderRadius: '20px', border: '1px solid rgba(0,210,255,0.3)', boxShadow: '0 20px 40px rgba(0,210,255,0.15)' }} />
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Methodology / About Preview */}
      <section className="focus-section" style={{ padding: '8rem 2rem', background: 'var(--bg-card)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px' }}>
            <FadeInSection>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Professional Intelligence Standard</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                White Zero is a specialized OSINT framework engineered for modern digital investigation. We bridge the gap between raw web data and official forensic reporting, providing investigators with high-impact intelligence tools.
              </p>
              <Link to="/about" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                Discover Our Framework <ArrowRight size={16} />
              </Link>
            </FadeInSection>
          </div>
          <div style={{ flex: '1 1 300px', display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <FadeInSection direction="left" delay={0.2}>
              <div className="glass" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderRadius: '15px' }}>
                <div style={{ padding: '1rem', background: 'rgba(0,210,255,0.1)', borderRadius: '12px' }}><Shield size={32} className="text-[#00d2ff]" /></div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>Forensic Integrity</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Legal-grade documentation standards.</p>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection direction="left" delay={0.4}>
              <div className="glass" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderRadius: '15px' }}>
                <div style={{ padding: '1rem', background: 'rgba(0,210,255,0.1)', borderRadius: '12px' }}><Lock size={32} className="text-[#00d2ff]" /></div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>Secure Intel Nodes</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>End-to-end encrypted report storage.</p>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <FadeInSection direction="down">
        <section style={{ padding: '6rem 2rem', background: 'linear-gradient(to right, rgba(0, 210, 255, 0.1), rgba(16,185,129,0.05))' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <Mail size={48} className="text-[#00d2ff]" style={{ margin: '0 auto 1.5rem' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Secure Your Investigation Today</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>Connect with the White Zero team for specialized framework access or technical inquiries.</p>
            <Link to="/contact" className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>Contact Intelligence Team</Link>
          </div>
        </section>
      </FadeInSection>
    </main>
  );
};

export default Home;
