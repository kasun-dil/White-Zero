import React from 'react';
import { MessageSquare, ShieldCheck, Search, FileText, Cpu, Zap, Globe, ShieldAlert, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeInSection from '../components/FadeInSection';
import './PageStyles.css';

const FeaturesPage = () => {
  const features = [
    {
      id: 'osint',
      title: 'AI Intelligence Search',
      icon: <Search size={40} className="text-[#3a7bd5]" />,
      desc: 'Deep-dive harvesting of public data from social media platforms and web repositories for intelligence gathering.',
      link: '/osint-trial',
      category: 'Data Extraction',
      locked: false
    },
    {
      id: 'police-report',
      title: 'Automated Incident Report',
      icon: <FileText size={40} className="text-[#10b981]" />,
      desc: 'Smart wizard to generate professional cybercrime reports for official submission to law enforcement agencies.',
      link: '/report-crime',
      category: 'Legal & Compliance',
      locked: false
    },
    {
      id: 'intel-lab',
      title: 'Neural Intelligence Lab',
      icon: <Cpu size={40} className="text-[#00d2ff]" />,
      desc: 'Real-time global threat mapping, neural analysis of vulnerability trends, and advanced OSINT forecasting.',
      link: '/intelligence-lab',
      category: 'Coming Soon',
      locked: true
    },
    {
      id: 'sentinel',
      title: 'Sentinel AI Analyst',
      icon: <ShieldCheck size={40} className="text-[#00d2ff]" />,
      desc: 'Advanced forensic auditing of social media content using neural heuristics to verify integrity and detect misinformation.',
      link: '/content-sentinel',
      category: 'Coming Soon',
      locked: true
    },
    {
      id: 'qa-bot',
      title: 'Cyber Security QA',
      icon: <MessageSquare size={40} className="text-[#f59e0b]" />,
      desc: 'Instant access to a specialized security expert to answer your safety and privacy questions 24/7.',
      link: '/qa-bot',
      category: 'Coming Soon',
      locked: true
    },
    {
      id: 'report-assist',
      title: 'Profile Security Guide',
      icon: <ShieldAlert size={40} className="text-[#004e92]" />,
      desc: 'Guided assistance for securing compromised profiles and generating step-by-step reporting instructions.',
      link: '/report-assistant',
      category: 'Coming Soon',
      locked: true
    }
  ];

  return (
    <div className="page-container fade-in">
      <FadeInSection direction="down">
        <div className="page-header" style={{ marginBottom: '5rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-2px' }}>Forensic Intelligence <span className="text-gradient">Hub</span></h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '1rem auto' }}>Deploy specialized modules for high-impact forensic analysis, automated intelligence gathering, and digital truth verification.</p>
        </div>
      </FadeInSection>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '2.5rem', 
        alignItems: 'stretch',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {features.map((f, i) => (
          <FadeInSection key={f.id} delay={i * 0.1}>
            <div className={`feature-detail-card glass ${f.locked ? 'locked-feature' : ''}`} style={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              alignItems: 'flex-start', 
              textAlign: 'left',
              padding: '2rem', /* Reduced for professional look */
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '24px',
              border: f.locked ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0, 210, 255, 0.2)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              background: f.locked ? 'rgba(5, 5, 10, 0.4)' : 'rgba(10, 10, 15, 0.8)',
              opacity: f.locked ? 0.7 : 1,
              boxShadow: f.locked ? 'none' : '0 10px 30px rgba(0,0,0,0.4)'
            }}>
              {/* Background Glow */}
              {!f.locked && <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(0, 210, 255, 0.1) 0%, transparent 70%)', zIndex: 0 }}></div>}

              <div style={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                padding: '0.6rem 1.2rem', 
                background: f.locked ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 210, 255, 0.1)', 
                fontSize: '0.65rem', 
                letterSpacing: '1.5px', 
                color: f.locked ? '#ef4444' : '#00d2ff',
                borderBottomLeftRadius: '20px',
                fontWeight: '800',
                textTransform: 'uppercase',
                zIndex: 1
              }}>
                {f.category}
              </div>
              
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
                {f.icon}
              </div>
              
              <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: '700', position: 'relative', zIndex: 1 }}>
                {f.title}
                {f.locked && <Lock size={16} color="#ef4444" style={{ opacity: 0.6 }} />}
              </h2>
              <p style={{ flex: 1, marginBottom: '2rem', fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.7', position: 'relative', zIndex: 1 }}>{f.desc}</p>
              
              <div style={{ width: '100%', position: 'relative', zIndex: 1 }}>
                {f.locked ? (
                  <div style={{ width: '100%', textAlign: 'center', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    ACCESS CLASSIFIED
                  </div>
                ) : (
                  <Link to={f.link} className="btn-primary" style={{ width: '100%', textAlign: 'center', borderRadius: '14px', boxShadow: '0 4px 15px rgba(0, 210, 255, 0.2)' }}>
                    Launch Module
                  </Link>
                )}
              </div>
            </div>
          </FadeInSection>
        ))}
      </div>

      <div style={{ height: '100px' }}></div>
    </div>
  );
};

export default FeaturesPage;
