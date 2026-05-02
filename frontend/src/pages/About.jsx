import React from 'react';
import { Shield, Target, Users, Search, Cpu, FileText, Layout } from 'lucide-react';
import FadeInSection from '../components/FadeInSection';
import './PageStyles.css';

const About = () => {
  return (
    <div className="page-container fade-in">
      <FadeInSection direction="down">
        <div className="page-header" style={{ marginBottom: '6rem' }}>
          <h1>About <span className="text-gradient">White Zero</span></h1>
          <p style={{ maxWidth: '800px', margin: '1rem auto', fontSize: '1.2rem', lineHeight: '1.6' }}>
            White Zero is a professional-grade OSINT framework engineered for forensic intelligence and digital incident management.
          </p>
        </div>
      </FadeInSection>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Mission Section */}
        <section style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', marginBottom: '8rem' }}>
          <div style={{ flex: '1 1 500px' }}>
            <FadeInSection direction="right">
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', background: 'linear-gradient(90deg, #fff, #00d2ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Our Mission</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                In an era of sophisticated cyber-adversaries and digital misinformation, standard security measures are insufficient. White Zero was founded to professionalize digital forensics by providing investigators with high-authority intelligence harvesting and documentation tools.
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                We bridge the gap between raw public data and official forensic records, enabling rapid incident response and high-impact intelligence gathering.
              </p>
            </FadeInSection>
          </div>
          <div style={{ flex: '1 1 500px' }}>
            <FadeInSection direction="left">
              <img src="https://dcnnmagazine.com/wp-content/uploads/2023/08/bigstock-Hacker-Cyber-Criminal-With-La-477781497-scaled.jpg" alt="Professional Intelligence Mission" style={{ width: '100%', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,210,255,0.1)' }} />
            </FadeInSection>
          </div>
        </section>

        {/* Core Values / Methodology */}
        <section style={{ marginBottom: '8rem', textAlign: 'center' }}>
          <FadeInSection>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Our Methodology</h2>
          </FadeInSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <FadeInSection delay={0.1}>
              <div className="glass" style={{ padding: '3rem 2rem', borderRadius: '20px', height: '100%' }}>
                <Search size={48} className="text-[#3a7bd5]" style={{ margin: '0 auto 1.5rem' }} />
                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Deep OSINT</h3>
                <p style={{ color: 'var(--text-muted)' }}>We employ advanced harvesting scripts to parse public social media data far beyond standard API limitations.</p>
              </div>
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <div className="glass" style={{ padding: '3rem 2rem', borderRadius: '20px', height: '100%' }}>
                <Shield size={48} className="text-[#10b981]" style={{ margin: '0 auto 1.5rem' }} />
                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Forensic Integrity</h3>
                <p style={{ color: 'var(--text-muted)' }}>All documentation is structured to meet professional legal standards, ensuring high authority in official submissions.</p>
              </div>
            </FadeInSection>
            <FadeInSection delay={0.3}>
              <div className="glass" style={{ padding: '3rem 2rem', borderRadius: '20px', height: '100%' }}>
                <Cpu size={48} className="text-[#00d2ff]" style={{ margin: '0 auto 1.5rem' }} />
                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Neural Analysis</h3>
                <p style={{ color: 'var(--text-muted)' }}>Our engine leverages AI to filter massive datasets, identifying coordinated inauthentic behavior and threat vectors.</p>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Feature Breakdown Section */}
        <section style={{ marginBottom: '4rem' }}>
          <FadeInSection>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Flagship Modules</h2>
          </FadeInSection>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Feature 1 */}
            <FadeInSection direction="right">
              <div className="glass" style={{ display: 'flex', gap: '2rem', padding: '2rem', borderRadius: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ padding: '1.5rem', background: 'rgba(58,123,213,0.1)', borderRadius: '15px' }}>
                  <Search size={40} className="text-[#3a7bd5]" />
                </div>
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>AI Intelligence Search</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>High-speed harvesting of public posts and engagement data. Analyze massive social repositories for critical intelligence gathering and threat mapping.</p>
                </div>
              </div>
            </FadeInSection>

            {/* Feature 2 */}
            <FadeInSection direction="left">
              <div className="glass" style={{ display: 'flex', gap: '2rem', padding: '2rem', borderRadius: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ padding: '1.5rem', background: 'rgba(245,158,11,0.1)', borderRadius: '15px' }}>
                  <FileText size={40} className="text-[#f59e0b]" />
                </div>
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Forensic Incident Reporter</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Generate professional, plain-text reporting letters for law enforcement. Transform raw incident data into legal-grade forensic documentation instantly.</p>
                </div>
              </div>
            </FadeInSection>

            {/* Feature 3 */}
            <FadeInSection direction="right">
              <div className="glass" style={{ display: 'flex', gap: '2rem', padding: '2rem', borderRadius: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ padding: '1.5rem', background: 'rgba(0,210,255,0.1)', borderRadius: '15px' }}>
                  <Layout size={40} className="text-[#00d2ff]" />
                </div>
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Archived Intelligence Gallery</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Securely manage and navigate your investigation history with our modern, tactile slider interface. Purge or print records with full administrative control.</p>
                </div>
              </div>
            </FadeInSection>

          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
