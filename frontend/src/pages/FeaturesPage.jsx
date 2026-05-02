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
        <div className="page-header" style={{ marginBottom: '5rem' }}>
          <h1 style={{ fontSize: '3.5rem' }}>Intelligence <span className="text-gradient">Hub</span></h1>
          <p style={{ fontSize: '1.2rem' }}>Explore our specialized modules designed for forensic analysis, threat detection, and digital safety.</p>
        </div>
      </FadeInSection>

      <div className="features-page-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
        {features.map((f, i) => (
          <FadeInSection key={f.id} delay={i * 0.1}>
            <div className={`feature-detail-card glass ${f.locked ? 'locked-feature' : ''}`} style={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start', 
              textAlign: 'left',
              padding: '3rem',
              position: 'relative',
              overflow: 'hidden',
              opacity: f.locked ? 0.5 : 1,
              filter: f.locked ? 'grayscale(1)' : 'none',
              pointerEvents: f.locked ? 'none' : 'auto'
            }}>
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                padding: '0.8rem 1.5rem', 
                background: f.locked ? 'rgba(255, 77, 77, 0.1)' : 'rgba(255,255,255,0.05)', 
                fontSize: '0.7rem', 
                letterSpacing: '1px', 
                color: f.locked ? '#ff4d4d' : 'var(--text-muted)',
                borderBottomLeftRadius: '20px',
                fontWeight: '700'
              }}>
                {f.category}
              </div>
              
              <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '15px' }}>
                {f.icon}
              </div>
              
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                {f.title}
                {f.locked && <Lock size={18} color="#ff4d4d" />}
              </h2>
              <p style={{ flex: 1, marginBottom: '2rem', fontSize: '1rem' }}>{f.desc}</p>
              
              {f.locked ? (
                <div className="btn-primary" style={{ width: '100%', textAlign: 'center', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', cursor: 'not-allowed' }}>
                  Access Restricted
                </div>
              ) : (
                <Link to={f.link} className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                  Launch Module
                </Link>
              )}
            </div>
          </FadeInSection>
        ))}
      </div>

      <div style={{ height: '100px' }}></div>
    </div>
  );
};

export default FeaturesPage;
