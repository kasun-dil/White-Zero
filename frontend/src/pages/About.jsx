import React, { useState } from 'react';
import { Shield, Target, Users, Search, Cpu, FileText, Layout, CheckCircle, Zap, Globe, MessageSquare, Terminal } from 'lucide-react';
import FadeInSection from '../components/FadeInSection';
import './PageStyles.css';

const CapabilityCard = ({ icon, title, desc, steps, color }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      className="glass" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        padding: '2.5rem', 
        borderRadius: '24px', 
        height: '100%', 
        border: `1px solid ${isHovered ? color : 'rgba(255,255,255,0.05)'}`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        background: isHovered ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
        transform: isHovered ? 'translateY(-10px)' : 'none',
        boxShadow: isHovered ? `0 20px 50px rgba(0,0,0,0.5), 0 0 20px ${color}11` : 'none'
      }}
    >
      <div style={{ padding: '1rem', background: `${color}11`, borderRadius: '16px', width: 'fit-content', marginBottom: '1.5rem', transition: 'transform 0.3s' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: isHovered ? color : 'white', transition: 'color 0.3s' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
        {desc}
      </p>
      
      <div style={{ 
        maxHeight: isHovered ? '250px' : '0',
        opacity: isHovered ? 1 : 0,
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
      }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', border: `1px solid ${color}33`, marginTop: '1rem' }}>
          <h4 style={{ fontSize: '0.7rem', color: color, letterSpacing: '2px', marginBottom: '0.8rem', fontWeight: '800' }}>TACTICAL PROTOCOL:</h4>
          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#ccc', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {steps.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      </div>
      
      {!isHovered && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: color, fontWeight: 'bold', letterSpacing: '1.5px', marginTop: '1.5rem', opacity: 0.6 }}>
          <Zap size={12} className="animate-pulse" /> REVEAL PROTOCOL
        </div>
      )}
    </div>
  );
};

const About = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top right, #001f3f, #050505)', width: '100%', position: 'relative' }}>
      <div className="page-container fade-in" style={{ paddingBottom: '80px', maxWidth: '1400px', margin: '0 auto' }}>
        <FadeInSection direction="down">
          <div className="page-header" style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 210, 255, 0.1)', padding: '0.5rem 1rem', borderRadius: '30px', border: '1px solid rgba(0, 210, 255, 0.2)', marginBottom: '1.5rem' }}>
              <Shield size={14} className="text-[#00d2ff]" />
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#00d2ff', letterSpacing: '2px' }}>FORENSIC OPERATIONAL GUIDE v1.0</span>
            </div>
            <h1 style={{ fontSize: '3.5rem' }}>The <span className="text-gradient">White Zero</span> Framework</h1>
            <p style={{ maxWidth: '800px', margin: '1rem auto', fontSize: '1.1rem', lineHeight: '1.7', opacity: 0.8 }}>
              White Zero is an elite Cyber Intelligence and OSINT framework engineered to provide high-authority digital forensics, 
              automated target tracking, and secure investigative documentation.
            </p>
          </div>
        </FadeInSection>

        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Intelligence Mission Section */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'center', marginBottom: '8rem' }}>
            <FadeInSection direction="right">
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', background: 'linear-gradient(90deg, #fff, #00d2ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Digital Justice Through Intelligence</h2>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                In an era where digital footprints are increasingly obscured, White Zero provides the clarity required for official investigations. 
                Our framework is designed to bridge the gap between fragmented public data and actionable forensic intelligence.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <CheckCircle size={20} className="text-[#10b981]" />
                  <span style={{ fontSize: '0.95rem' }}>Signature-Verified OSINT Analysis</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <CheckCircle size={20} className="text-[#10b981]" />
                  <span style={{ fontSize: '0.95rem' }}>High-Authority Incident Documentation</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <CheckCircle size={20} className="text-[#10b981]" />
                  <span style={{ fontSize: '0.95rem' }}>Neural Misinformation Detection</span>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection direction="left">
              <div style={{ position: 'relative' }}>
                <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80" alt="Forensic Analysis" style={{ width: '100%', borderRadius: '24px', border: '1px solid rgba(0, 210, 255, 0.2)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} />
                <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: 'rgba(5,5,5,0.9)', padding: '1.2rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(0, 210, 255, 0.3)', backdropFilter: 'blur(10px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#10b981', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '1px' }}>
                    <Terminal size={14} /> LIVE_FEED_VERIFIED
                  </div>
                </div>
              </div>
            </FadeInSection>
          </section>

          {/* Tactical Capabilities Section */}
          <section style={{ marginBottom: '8rem' }}>
            <FadeInSection>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>Tactical Capabilities</h2>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '4rem' }}>Professional manual for executing high-impact investigations.</p>
            </FadeInSection>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
              <FadeInSection delay={0.1}>
                <CapabilityCard 
                  icon={<Search size={32} className="text-[#00d2ff]" />}
                  title="Target Footprint OSINT"
                  desc="Identify and track digital identities across 20+ social nodes using our Signature-Verified scanner."
                  color="#00d2ff"
                  steps={[
                    "Input Username or Phone in the Intelligence Dock.",
                    "Wait for the Neural Engine to perform deep content verification.",
                    "Confirm results by viewing live profile links verified by Playwright."
                  ]}
                />
              </FadeInSection>

              <FadeInSection delay={0.2}>
                <CapabilityCard 
                  icon={<FileText size={32} className="text-[#10b981]" />}
                  title="Forensic Incident Reporter"
                  desc="Transform raw incident data into official, forensic-grade documentation suitable for legal submissions."
                  color="#10b981"
                  steps={[
                    "Select the investigation type (Cyberbullying, Scam, etc.).",
                    "Verify identity through the secure Forensic OTP system.",
                    "Use the AI Refiner to optimize the narrative for professional authority."
                  ]}
                />
              </FadeInSection>

              <FadeInSection delay={0.3}>
                <CapabilityCard 
                  icon={<Cpu size={32} className="text-[#f59e0b]" />}
                  title="Sentinel Neural Analyst"
                  desc="Advanced content verification engine that detects misinformation and extracts forensic metadata."
                  color="#f59e0b"
                  steps={[
                    "Submit the target URL to the Intelligence Lab scanner.",
                    "Analyze the Neural Sentiment and Misinformation Probability score.",
                    "Extract hidden owner data and platform engagement metrics."
                  ]}
                />
              </FadeInSection>
            </div>
          </section>

          {/* Operational Flow */}
          <section style={{ marginBottom: '8rem', textAlign: 'center' }}>
            <FadeInSection>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Operational Workflow</h2>
            </FadeInSection>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {[
                { icon: <Zap />, label: "Initiate Scan", desc: "Launch OSINT target tracking" },
                { icon: <Shield />, label: "Verify Data", desc: "Identity & incident validation" },
                { icon: <MessageSquare />, label: "Transmit", desc: "Secure police communication" },
                { icon: <CheckCircle />, label: "Resolved", desc: "Official case closure" }
              ].map((step, i) => (
                <FadeInSection key={i} delay={i * 0.1}>
                  <div className="glass" style={{ width: '240px', padding: '2rem', borderRadius: '20px', position: 'relative' }}>
                    <div style={{ fontSize: '1.5rem', color: '#00d2ff', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{step.icon}</div>
                    <h4 style={{ marginBottom: '0.5rem' }}>{step.label}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{step.desc}</p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </section>

          {/* Global Access Section */}
          <section style={{ marginBottom: '4rem' }}>
            <FadeInSection>
              <div className="glass" style={{ padding: '4rem', borderRadius: '32px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(0, 31, 63, 0.4), rgba(5, 5, 5, 0.8))', border: '1px solid rgba(0, 210, 255, 0.1)' }}>
                <Globe size={48} className="text-[#00d2ff]" style={{ margin: '0 auto 1.5rem' }} />
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Professional Intelligence Network</h2>
                <p style={{ maxWidth: '700px', margin: '0 auto 2.5rem', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                  White Zero connects everyday digital investigators with official law enforcement portals, 
                  creating a global network of transparent, high-fidelity intelligence.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#00d2ff' }}>100%</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>ACCURACY TARGET</div>
                  </div>
                  <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}>256-BIT</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>SECURE ENCRYPTION</div>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </section>

        </div>
      </div>
    </div>
  );
};

export default About;
