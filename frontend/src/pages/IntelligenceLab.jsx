import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Globe, Shield, Activity, Zap, Cpu, Search, AlertCircle, BarChart3, Radio, Download } from 'lucide-react';
import FadeInSection from '../components/FadeInSection';
import './PageStyles.css';

const IntelligenceLab = () => {
  const [threatLevel, setThreatLevel] = useState(65);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeNodes, setActiveNodes] = useState(1204);
  const [recentLogs, setRecentLogs] = useState([]);
  const { user } = useContext(AuthContext);
  const [activeTool, setActiveTool] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setThreatLevel(prev => Math.min(100, Math.max(10, prev + (Math.random() * 10 - 5))));
      setScanProgress(prev => (prev + 1) % 100);
      setActiveNodes(prev => prev + Math.floor(Math.random() * 5 - 2));
      
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        event: [
          "DDoS attempt blocked from IP 192.168.x.x",
          "Neural filter identified malicious script",
          "Vulnerability scan completed on Node-04",
          "Encrypted tunnel established: HQ-ALPHA",
          "Brute force detection active: Port 22"
        ][Math.floor(Math.random() * 5)],
        type: Math.random() > 0.7 ? 'alert' : 'info'
      };
      setRecentLogs(prev => [newLog, ...prev].slice(0, 8));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const tools = [
    { id: 'metadata', title: 'Metadata Extractor', icon: <Search />, desc: 'Deep-dive analysis of image and document metadata for forensic evidence.' },
    { id: 'neural', title: 'Neural Threat Predictor', icon: <Cpu />, desc: 'ML-driven model predicting targeted attacks based on historical breach patterns.' },
    { id: 'blockchain', title: 'Blockchain Explorer', icon: <Zap />, desc: 'Tracking suspicious crypto-transactions related to ransomware activity.' }
  ];

  const handleLaunch = async (id) => {
    setActiveTool(id);
    setAnalyzing(true);
    
    // Record as Investigation if user is logged in
    if (user) {
      try {
        const toolName = tools.find(t => t.id === id)?.title || 'Intelligence Tool';
        await fetch('/api/history/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({
            query: `Launched ${toolName}`,
            resultsCount: Math.floor(Math.random() * 50) + 10
          })
        });
      } catch (err) {
        console.error('Failed to record tool investigation', err);
      }
    }
    
    setTimeout(() => setAnalyzing(false), 2000);
  };

  return (
    <div className="page-container fade-in" style={{ padding: '2rem' }}>
      <FadeInSection direction="down">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Neural <span className="text-gradient">Intelligence Lab</span></h1>
            <p style={{ color: 'var(--text-muted)' }}>Advanced OSINT analytics and real-time threat monitoring.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="glass" style={{ padding: '1rem 2rem', borderRadius: '15px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>GLOBAL NODES</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#00d2ff' }}>{activeNodes.toLocaleString()}</div>
            </div>
            <div className="glass" style={{ padding: '1rem 2rem', borderRadius: '15px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>THREAT LEVEL</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: threatLevel > 80 ? '#ef4444' : '#10b981' }}>{Math.floor(threatLevel)}%</div>
            </div>
          </div>
        </div>
      </FadeInSection>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="glass" style={{ height: '500px', borderRadius: '25px', position: 'relative', overflow: 'hidden', background: 'radial-gradient(circle at center, rgba(0, 210, 255, 0.05) 0%, rgba(0,0,0,0.8) 100%)' }}>
          <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 2 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <Radio className="text-[#00d2ff] animate-pulse" size={18} /> LIVE THREAT MAP
            </h3>
          </div>
          <div style={{ width: '100%', height: '100%', backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.3 }}></div>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ position: 'absolute', top: `${20 + Math.random() * 60}%`, left: `${10 + Math.random() * 80}%`, width: '12px', height: '12px', borderRadius: '50%', background: i % 2 === 0 ? '#ef4444' : '#00d2ff', boxShadow: i % 2 === 0 ? '0 0 20px #ef4444' : '0 0 20px #00d2ff', animation: `pulse ${2 + Math.random() * 3}s infinite` }}></div>
          ))}
          <div style={{ position: 'absolute', top: 0, left: `${scanProgress}%`, width: '2px', height: '100%', background: 'linear-gradient(transparent, #00d2ff, transparent)', boxShadow: '0 0 15px #00d2ff', zIndex: 1 }}></div>
        </div>

        <div className="glass" style={{ padding: '1.5rem', borderRadius: '25px', overflowY: 'auto', maxHeight: '500px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity className="text-[#00d2ff]" size={18} /> NETWORK ACTIVITY
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {recentLogs.map(log => (
              <div key={log.id} style={{ fontSize: '0.8rem', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', borderLeft: `3px solid ${log.type === 'alert' ? '#ef4444' : '#10b981'}` }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{log.time}</div>
                <div>{log.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass" style={{ padding: '2rem', borderRadius: '25px', marginBottom: '2rem', position: 'relative' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu className="text-[#00d2ff]" size={18} /> NEURAL PROCESSING CORE
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4rem', height: '150px' }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[0, 1].map((i) => (
              <div key={i} style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', animation: `pulse ${1 + i * 0.5}s infinite` }}>
                <Zap size={20} className="text-[#00d2ff]" />
                <div style={{ position: 'absolute', right: '-2rem', width: '2rem', height: '1px', background: 'rgba(0, 210, 255, 0.3)' }}></div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', minWidth: '250px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '0.5rem' }}>MODEL TRAINING ACTIVE</div>
            <div style={{ fontSize: '2.4rem', fontWeight: '900', color: 'white', textShadow: '0 0 20px rgba(0,210,255,0.6)' }}>EPOCH {Math.floor(scanProgress * 5)}/500</div>
          </div>

          <div style={{ display: 'flex', gap: '2rem' }}>
            {[3, 4].map((i) => (
              <div key={i} style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', animation: `pulse ${1 + i * 0.5}s infinite` }}>
                <Zap size={20} className="text-[#10b981]" />
                <div style={{ position: 'absolute', left: '-2rem', width: '2rem', height: '1px', background: 'rgba(0, 210, 255, 0.3)' }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {tools.map((tool, i) => (
          <FadeInSection key={i} delay={i * 0.1}>
            <div className="glass premium-card" style={{ padding: '2rem', borderRadius: '25px', height: '100%', transition: 'all 0.3s ease' }}>
              <div style={{ color: '#00d2ff', marginBottom: '1.5rem' }}>{React.cloneElement(tool.icon, { size: 32 })}</div>
              <h3>{tool.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{tool.desc}</p>
              <button onClick={() => handleLaunch(tool.id)} className="btn-outline" style={{ width: '100%' }}>Launch Tool</button>
            </div>
          </FadeInSection>
        ))}
      </div>

      {activeTool && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
          <div className="glass" style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '30px', padding: '3rem', position: 'relative' }}>
            <button onClick={() => setActiveTool(null)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '2rem' }}>×</button>
            {analyzing ? (
              <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                <div className="loader"></div>
                <h2 className="animate-pulse">Accessing Intelligence Nodes...</h2>
              </div>
            ) : (
              <div>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#00d2ff' }}>{tools.find(t => t.id === activeTool)?.icon}{tools.find(t => t.id === activeTool)?.title}</h2>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '2rem 0' }}></div>
                {activeTool === 'metadata' && (
                  <div>
                    <div style={{ padding: '3rem', border: '2px dashed rgba(0,210,255,0.3)', borderRadius: '15px', textAlign: 'center', marginBottom: '2rem' }}><Download size={32} className="text-[#00d2ff]" style={{ marginBottom: '1rem' }} /><p>Click or drag file to analyze metadata</p></div>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '15px' }}><h4 style={{ marginBottom: '1rem', color: '#00d2ff' }}>FORENSIC RESULTS (SECURE_DATA_01.PNG)</h4><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}><div><span style={{ color: 'var(--text-muted)' }}>MIME:</span> image/png</div><div><span style={{ color: 'var(--text-muted)' }}>Resolution:</span> 1920x1080</div><div><span style={{ color: 'var(--text-muted)' }}>GPS:</span> REDACTED</div><div><span style={{ color: 'var(--text-muted)' }}>Timestamp:</span> 2026-04-30 23:15:00</div></div></div>
                  </div>
                )}
                {activeTool === 'neural' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[
                      { type: 'Account Hijack Prediction', value: 92, color: '#ef4444' },
                      { type: 'Phishing Campaign Match', value: 74, color: '#f59e0b' },
                      { type: 'Malware Signature Detection', value: 15, color: '#10b981' }
                    ].map((risk, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>{risk.type}</span><span style={{ color: risk.color }}>{risk.value}% Confidence</span></div>
                        <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px' }}><div style={{ width: `${risk.value}%`, height: '100%', background: risk.color, borderRadius: '5px' }}></div></div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTool === 'blockchain' && (
                  <div>
                    <input type="text" placeholder="Wallet Hash..." style={{ width: '100%', padding: '1rem', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,210,255,0.3)', color: 'white', marginBottom: '2rem' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {[
                        { id: 'TX-4402', amount: '0.45 BTC', status: 'MALICIOUS', color: '#ef4444' },
                        { id: 'TX-1189', amount: '2.11 BTC', status: 'CLEAN', color: '#10b981' }
                      ].map((tx, i) => (
                        <div key={i} className="glass" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><code>{tx.id}</code><span>{tx.amount}</span><span style={{ color: tx.color, fontWeight: 'bold' }}>{tx.status}</span></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IntelligenceLab;
