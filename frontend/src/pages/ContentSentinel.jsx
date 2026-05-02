import React, { useState } from 'react';
import { Search, Loader2, AlertTriangle, CheckCircle, ShieldAlert, Fingerprint, Globe, BarChart3, Info, ExternalLink } from 'lucide-react';
import { analyzePost } from '../services/api';
import { User, ThumbsUp, MessageCircle, Calendar } from 'lucide-react';
import FadeInSection from '../components/FadeInSection';
import './ContentSentinel.css';

const ContentSentinel = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);

    try {
      const data = await analyzePost(url);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (prediction) => {
    if (prediction === 'Real') return 'real';
    if (prediction.includes('Fake')) return 'fake';
    return 'suspicious';
  };

  return (
    <div className="sentinel-container">
      <FadeInSection direction="down">
        <div className="sentinel-hero">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.2rem', background: 'rgba(0, 210, 255, 0.1)', borderRadius: '100px', color: '#00d2ff', fontSize: '0.8rem', fontWeight: '700', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
            <ShieldAlert size={14} /> AI Content Integrity
          </div>
          <h1>Sentinel AI Analyst</h1>
          <p>Deploy advanced AI heuristics to detect misinformation, deepfakes, and manipulated social media content in seconds.</p>
          
          <div className="sentinel-search">
            <input 
              type="text" 
              placeholder="Paste Facebook, Twitter, or Instagram link for forensic audit..." 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button className="btn-primary" onClick={handleAnalyze} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
              Run Audit
            </button>
          </div>
        </div>
      </FadeInSection>

      {loading && (
        <div className="sentinel-loading">
          <div className="scanning-box">
            <div className="scanning-line"></div>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.2 }}>
              <Fingerprint size={100} className="text-[#00d2ff]" />
            </div>
          </div>
          <p className="text-xl font-bold mb-2">Forensic Scan in Progress...</p>
          <div className="loading-grid">
            <div className="loading-item"><Globe size={14} className="text-[#00d2ff]" /> Metadata Extraction</div>
            <div className="loading-item"><BarChart3 size={14} className="text-[#00d2ff]" /> Sentiment Heuristics</div>
            <div className="loading-item"><Fingerprint size={14} className="text-[#00d2ff]" /> Forensic Comparison</div>
            <div className="loading-item"><ShieldAlert size={14} className="text-[#00d2ff]" /> Misinformation Shield</div>
          </div>
        </div>
      )}

      {result && (
        <div className="sentinel-result">
          <div className="result-main glass">
            <div className="verdict-box">
              <div className="verdict-header">
                <div className={`status-indicator ${getStatusClass(result.prediction)}`}>
                  {result.prediction === 'Real' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                  {result.prediction}
                </div>
                <div className="truth-score">
                  <span className="score-value">{result.score}/10</span>
                  <span className="score-label">Truth Score</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4">{result.verdict}</h2>
            </div>

            <div className="analysis-details">
              <h3><Info size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} /> Analysis Report</h3>
              <p>{result.details}</p>
            </div>

            {result.extractedData && (
              <div className="extracted-data mt-10 pt-10 border-t border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Fingerprint className="text-[#00d2ff]" size={20} /> Post Intelligence
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="data-item">
                    <span className="block text-xs text-muted uppercase tracking-widest mb-1">Owner / Provider</span>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <User size={16} className="text-[#00d2ff]" /> {result.extractedData.owner}
                    </div>
                  </div>
                  <div className="data-item">
                    <span className="block text-xs text-muted uppercase tracking-widest mb-1">Platform</span>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <Globe size={16} className="text-[#00d2ff]" /> {result.extractedData.platform}
                    </div>
                  </div>
                  <div className="data-item">
                    <span className="block text-xs text-muted uppercase tracking-widest mb-1">Engagement</span>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <BarChart3 size={16} className="text-[#00d2ff]" /> {result.extractedData.engagement}
                    </div>
                  </div>
                  <div className="data-item">
                    <span className="block text-xs text-muted uppercase tracking-widest mb-1">Likes</span>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <ThumbsUp size={16} className="text-[#00d2ff]" /> {result.extractedData.likes}
                    </div>
                  </div>
                  <div className="data-item">
                    <span className="block text-xs text-muted uppercase tracking-widest mb-1">Comments</span>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <MessageCircle size={16} className="text-[#00d2ff]" /> {result.extractedData.comments}
                    </div>
                  </div>
                  <div className="data-item">
                    <span className="block text-xs text-muted uppercase tracking-widest mb-1">Detected At</span>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <Calendar size={16} className="text-[#00d2ff]" /> {result.extractedData.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="result-sidebar">
            <div className="sidebar-card glass">
              <h4><AlertTriangle size={16} /> Red Flags Detected</h4>
              <div className="flag-list">
                {result.redFlags.map((flag, i) => (
                  <div key={i} className="flag-item">
                    <ShieldAlert size={14} /> {flag}
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-card glass">
              <h4><BarChart3 size={16} /> Content Metrics</h4>
              <div className="metric-row">
                <span>Confidence:</span>
                <span>{result.confidence}%</span>
              </div>
              <div className="metric-row">
                <span>Sentiment:</span>
                <span>{result.sentiment}</span>
              </div>
              <div className="metric-row">
                <span>AI Reliability:</span>
                <span>HIGH</span>
              </div>
            </div>

            <button className="btn-secondary w-full py-4 flex items-center justify-center gap-2">
              <ExternalLink size={16} /> View Forensic Log
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default ContentSentinel;
