import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ShieldAlert, MessageSquare, Camera, Globe, Search,
  ChevronRight, Lock, Key, Smartphone, FileText, Download, 
  RefreshCcw, AlertTriangle, CheckCircle, Brain, Terminal, Activity, Zap
} from 'lucide-react';
import { chatWithAI } from '../services/api';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import './SecurityAuditor.css';

const SecurityAuditor = () => {
  const [step, setStep] = useState('platform'); // platform, questions, analyzing, result
  const [platform, setPlatform] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const platforms = [
    { 
      id: 'facebook', 
      name: 'Facebook', 
      logo: 'https://img.icons8.com/ios-filled/100/ffffff/facebook-new.png', 
      color: '#1877F2' 
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      logo: 'https://img.icons8.com/ios-filled/100/ffffff/instagram-new.png', 
      color: '#E4405F' 
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      logo: 'https://img.icons8.com/ios-filled/100/ffffff/linkedin.png', 
      color: '#0077B5' 
    },
    { 
      id: 'google', 
      name: 'Google', 
      logo: 'https://img.icons8.com/ios-filled/100/ffffff/google-logo.png', 
      color: '#34A853' 
    },
  ];

  const questions = {
    all: [
      { id: 'pass_length', text: 'What is the approximate length of your password?', options: ['< 8 chars', '8-12 chars', '12+ chars', 'Managed by Password Manager'] },
      { id: 'two_factor', text: 'Is Two-Factor Authentication (2FA) enabled?', options: ['No', 'Yes (SMS/Email)', 'Yes (Auth App/Security Key)'] },
      { id: 'reuse', text: 'Do you reuse this password for other accounts?', options: ['Yes, many', 'Yes, a few', 'No, it is unique'] },
      { id: 'privacy', text: 'Is your profile visibility restricted to friends/connections only?', options: ['Public', 'Limited/Friends only', 'Private/Stealth mode'] },
      { id: 'apps', text: 'Have you audited third-party apps connected to your account recently?', options: ['Never', 'Over 6 months ago', 'Recently (last 30 days)'] },
    ]
  };

  const handlePlatformSelect = (plat) => {
    setPlatform(plat);
    setStep('questions');
  };

  const handleAnswer = (option) => {
    const qId = questions.all[currentQuestionIndex].id;
    setAnswers(prev => ({ ...prev, [qId]: option }));

    if (currentQuestionIndex < questions.all.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      performAudit();
    }
  };

  const performAudit = async () => {
    setStep('analyzing');
    setIsAnalyzing(true);

    const auditData = {
      platform: platform.name,
      responses: answers
    };

    const prompt = `Perform a professional forensic security audit for a ${platform.name} account based on these user responses:
    ${Object.entries(answers).map(([q, a]) => `- ${q}: ${a}`).join('\n')}
    
    Format your response STRICTLY with these 3 exact section headers:
    [Account Status]
    Include: Security Score: X/100
    Include: Risk Level: [Low/Medium/High]
    
    [Account Risk]
    (Detail vulnerabilities)
    
    [Security Improvement]
    (Step-by-step instructions)
    
    Do NOT include section numbers. Keep the score format simple like "12/100".`;

    try {
      const data = await chatWithAI(prompt, [{ role: 'system', content: 'You are an advanced AI Security Auditor for the White Zero Intelligence Framework.' }]);
      setAuditResult(data.content);
      setStep('result');
    } catch (error) {
      toast.error('Audit Engine Failure: Connection lost.');
      setStep('platform');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const extractScore = (content) => {
    if (!content) return 0;
    // Robust regex for "12/100", "12 / 100", "12%", "12 %", etc.
    const match = content.match(/(\d+)\s*\/\s*100|(\d+)\s*%/);
    if (match) return parseInt(match[1] || match[2]);
    return 0;
  };

  const parseSection = (content, sectionName) => {
    if (!content) return '';
    const sections = content.split(/\[Account Status\]|\[Account Risk\]|\[Security Improvement\]/);
    let targetIndex = 0;
    if (sectionName === 'Account Status') targetIndex = 1;
    else if (sectionName === 'Account Risk') targetIndex = 2;
    else if (sectionName === 'Security Improvement') targetIndex = 3;
    
    if (!sections[targetIndex]) return 'Analyzing...';
    
    // Clean up any trailing numbers like "2." or "3."
    return sections[targetIndex].replace(/\n\s*\d+\.\s*$/, '').trim();
  };

  const resetAudit = () => {
    setStep('platform');
    setPlatform(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setAuditResult(null);
  };

  const getRiskLevel = (content) => {
    if (!content) return { label: 'Analyzing', color: '#888' };
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('high') || lowerContent.includes('critical') || lowerContent.includes('danger')) 
      return { label: 'CRITICAL RISK', color: '#ff3d71' };
    if (lowerContent.includes('medium') || lowerContent.includes('moderate') || lowerContent.includes('average')) 
      return { label: 'MEDIUM RISK', color: '#ffaa00' };
    return { label: 'SECURE / LOW RISK', color: '#00d68f' };
  };

  const risk = getRiskLevel(auditResult);

  return (
    <div className="security-auditor-page page-container">
      <div className="auditor-header fade-in">
        <h1 className="text-gradient">Neural Security <span className="neon-text">Auditor</span></h1>
        <p>Comprehensive forensic diagnostic of your digital identity assets.</p>
      </div>

      <div className="auditor-content glass-workspace">
        <AnimatePresence mode="wait">
          {step === 'platform' && (
            <motion.div 
              key="platform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="platform-selection"
            >
              <h3>Select Target Platform</h3>
              <div className="platform-row">
                {platforms.map(p => (
                  <motion.div 
                    key={p.id} 
                    className="platform-box"
                    onClick={() => handlePlatformSelect(p)}
                    style={{ backgroundColor: p.color }}
                    whileHover={{ y: -15, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="logo-container">
                      <img src={p.logo} alt={p.name} className="platform-logo" />
                    </div>
                    <span className="platform-name">{p.name}</span>
                    <div className="box-shine"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'questions' && (
            <motion.div 
              key="questions"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="question-phase"
            >
              <div className="audit-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(currentQuestionIndex / questions.all.length) * 100}%` }}
                  ></div>
                </div>
                <span>Module {currentQuestionIndex + 1} of {questions.all.length}</span>
              </div>

              <div className="question-card glass">
                <div className="q-header">
                  <Terminal size={20} className="text-[#00d2ff]" />
                  <h2>Diagnostic Protocol</h2>
                </div>
                <p className="q-text">{questions.all[currentQuestionIndex].text}</p>
                <div className="options-list">
                  {questions.all[currentQuestionIndex].options.map(opt => (
                    <button 
                      key={opt} 
                      className="option-btn glass-btn"
                      onClick={() => handleAnswer(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'analyzing' && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="analyzing-phase"
            >
              <div className="scanner-container">
                <div className="scanning-line"></div>
                <Brain size={64} className="pulse-icon text-[#00d2ff]" />
                <h3>Synthesizing Intelligence...</h3>
                <p>Applying heuristic analysis to platform security vectors.</p>
              </div>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="result-phase-full"
            >
              <div className="result-header-modern">
                <div className="title-area">
                  <ShieldCheck size={40} className="text-[#00d2ff]" />
                  <div>
                    <h2>Forensic Intelligence Dossier</h2>
                    <div className="risk-indicator-large" style={{ backgroundColor: risk.color }}>
                      <AlertTriangle size={18} /> <span>{risk.label}</span>
                    </div>
                  </div>
                </div>
                <div className="platform-pill" style={{ backgroundColor: platform.color }}>{platform.name} Asset</div>
              </div>

              <div className="audit-sections-container">
                <div className="audit-section-card status-card">
                  <div className="section-title"><CheckCircle size={18} /> ACCOUNT STATUS</div>
                  <div className="status-overview">
                    <div className="score-gauge" style={{ '--score-color': risk.color }}>
                      <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" className="gauge-bg" />
                        <circle 
                          cx="50" cy="50" r="45" 
                          className="gauge-fill" 
                          style={{ strokeDashoffset: 283 - (283 * (extractScore(auditResult) || 0)) / 100 }}
                        />
                      </svg>
                      <div className="score-value">
                        <span className="big-num">{extractScore(auditResult) || '??'}</span>
                        <span className="percent">%</span>
                      </div>
                    </div>
                    <div className="section-content">
                      <ReactMarkdown>{parseSection(auditResult, 'Account Status')}</ReactMarkdown>
                    </div>
                  </div>
                </div>

                <div className="audit-section-card risk-card">
                  <div className="section-title"><AlertTriangle size={18} /> ACCOUNT RISK FACTORS</div>
                  <div className="section-content">
                    <ReactMarkdown>{parseSection(auditResult, 'Account Risk')}</ReactMarkdown>
                  </div>
                </div>

                <div className="audit-section-card improve-card">
                  <div className="section-title"><Zap size={18} /> SECURITY IMPROVEMENT PLAN</div>
                  <div className="section-content">
                    <ReactMarkdown>{parseSection(auditResult, 'Security Improvement')}</ReactMarkdown>
                  </div>
                </div>
              </div>

              <div className="result-actions-centered">
                <button className="btn-reset-large" onClick={resetAudit}>
                  <RefreshCcw size={20} /> Initialize New Diagnostic Protocol
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="auditor-footer">
        <div className="status-item">
          <Activity size={14} className="text-green-500" />
          <span>NEURAL LINK: STABLE</span>
        </div>
        <div className="status-item">
          <Lock size={14} className="text-[#00d2ff]" />
          <span>ENCRYPTION: AES-256</span>
        </div>
        <div className="status-item">
          <Terminal size={14} className="text-muted" />
          <span>PROTOCOL: WZ-AUDIT-4.0</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityAuditor;
