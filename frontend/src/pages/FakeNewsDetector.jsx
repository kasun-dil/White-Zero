import React, { useState } from 'react';
import { Search, Loader2, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { analyzePost } from '../services/api';
import FadeInSection from '../components/FadeInSection';
import './FakeNewsDetector.css';

const FakeNewsDetector = () => {
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

  return (
    <div className="detector-container">
      <FadeInSection direction="down">
        <div className="detector-hero">
          <h1>Real or Fake Post Detector</h1>
          <p>Paste a social media link below to verify its authenticity using White Zero AI.</p>
          
          <div className="search-box glass">
            <input 
              type="text" 
              placeholder="Paste Facebook or Instagram link here..." 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button className="btn-primary" onClick={handleAnalyze} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Search />}
              Analyze
            </button>
          </div>
        </div>
      </FadeInSection>

      {loading && (
        <FadeInSection>
          <div className="analysis-loading">
            <div className="scanner-line"></div>
            <p>AI Engine is researching the post and related news...</p>
            <div className="loading-steps">
              <span>Fetching metadata...</span>
              <span>Checking image forensics...</span>
              <span>Comparing with verified databases...</span>
            </div>
          </div>
        </FadeInSection>
      )}

      {result && (
        <FadeInSection direction="up">
          <div className="result-card glass">
            <div className="result-header">
              <div className={`status-badge ${result.prediction.includes('Fake') ? 'fake' : 'real'}`}>
                {result.prediction.includes('Fake') ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                {result.prediction}
              </div>
              <div className="confidence-score">
                <span>Confidence: {result.confidence}%</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${result.confidence}%` }}></div>
                </div>
              </div>
            </div>

            <div className="result-content">
              <h3>Analysis Summary</h3>
              <p>{result.details}</p>
              
              <div className="tags">
                {result.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
              </div>

              <div className="references">
                <h4>Verified References</h4>
                <div className="ref-list">
                  {result.references.map(ref => (
                    <a key={ref.name} href={ref.link} className="ref-item">
                      <Info size={14} />
                      {ref.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      )}
    </div>
  );
};

export default FakeNewsDetector;
