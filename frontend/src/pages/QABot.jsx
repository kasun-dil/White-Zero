import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, ShieldAlert, Lock, Globe, Zap, Database, Brain, Activity } from 'lucide-react';
import { chatWithAI } from '../services/api';
import ReactMarkdown from 'react-markdown';
import './QABot.css';

// Importing the generated brain image
// Note: In a real project, this would be imported normally. 
// Since I can't move files easily, I'll use a relative path if possible or assume it's in a known location.
// For this demo, I'll use the path provided in the previous step.
const BRAIN_IMAGE = "/cyber_intelligence_brain_1777654616106.png"; 

const QABot = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: '### Intelligence Hub Online\nI am the **White Zero Cyber Intelligence AI**. I have been trained on vast repositories of security data, threat intelligence, and OSINT methodologies.\n\nHow can I help you strengthen your digital defenses today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeModule, setActiveModule] = useState('General QA');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    if (text === input) setInput('');
    setLoading(true);

    try {
      const data = await chatWithAI(text, `Mode: ${activeModule}`);
      const aiResponse = { role: 'assistant', content: data.content };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: '### System Error\nConnection to the neural network was interrupted. Please re-initialize.' }]);
    } finally {
      setLoading(false);
    }
  };

  const modules = [
    { name: 'General QA', icon: <Brain size={18} /> },
    { name: 'Threat Intel', icon: <ShieldAlert size={18} /> },
    { name: 'OSINT Training', icon: <Globe size={18} /> },
    { name: 'System Audit', icon: <Lock size={18} /> }
  ];

  return (
    <div className="qa-container fade-in">
      {/* Left Sidebar: Training Brain */}
      <aside className="qa-sidebar">
        <div className="brain-container">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/2103/2103633.png" // Fallback icon if the local one isn't served
            alt="Cyber Brain" 
            className="neural-brain" 
          />
          <div className="brain-status">
            <h2>Neural Core v3.1</h2>
            <span>Status: Operational</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <h3>Intelligence Modules</h3>
          {modules.map((m) => (
            <div 
              key={m.name} 
              className={`nav-item ${activeModule === m.name ? 'active' : ''}`}
              onClick={() => setActiveModule(m.name)}
            >
              <span className={activeModule === m.name ? 'text-[#00d2ff]' : 'text-muted'}>{m.icon}</span>
              {m.name}
            </div>
          ))}
        </nav>
      </aside>

      {/* Center: Main Chat Area */}
      <main className="qa-chat-area">
        <div className="qa-messages custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`qa-message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className="message-bubble">
                <div className="bubble-content glass">
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p style={{ margin: '0 0 0.8rem 0' }} {...props} />,
                      ul: ({node, ...props}) => <ul style={{ margin: '0.8rem 0', paddingLeft: '1.5rem' }} {...props} />,
                      ol: ({node, ...props}) => <ol style={{ margin: '0.8rem 0', paddingLeft: '1.5rem' }} {...props} />,
                      h3: ({node, ...props}) => <h3 style={{ fontSize: '1.1rem', margin: '1rem 0 0.5rem 0', color: '#00d2ff' }} {...props} />,
                      strong: ({node, ...props}) => <strong style={{ color: '#00d2ff' }} {...props} />
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="qa-message assistant">
              <div className="message-avatar">
                <Loader2 className="animate-spin text-[#00d2ff]" size={20} />
              </div>
              <div className="message-bubble">
                <div className="bubble-content glass">
                  <span className="text-muted italic">Processing query through neural layers...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="qa-input-container">
          <input 
            type="text" 
            placeholder={`Ask our Intelligence Core about ${activeModule}...`} 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="send-btn" onClick={() => handleSend()} disabled={loading}>
            <Send size={20} />
          </button>
        </div>
      </main>

      {/* Right Sidebar: Stats & Intel */}
      <aside className="qa-intel-sidebar">
        <div className="intel-card glass">
          <h4><Activity size={16} /> Live Metrics</h4>
          <div className="intel-stat">
            <span>Threat Level:</span>
            <strong className="text-yellow-400">MODERATE</strong>
          </div>
          <div className="intel-stat">
            <span>Active Sensors:</span>
            <strong>1,248</strong>
          </div>
          <div className="intel-stat">
            <span>Data Ingested:</span>
            <strong>2.4 TB/hr</strong>
          </div>
        </div>

        <div className="intel-card glass">
          <h4><Database size={16} /> Neural Knowledge</h4>
          <div className="intel-stat">
            <span>Domains Covered:</span>
            <strong>45+</strong>
          </div>
          <div className="intel-stat">
            <span>Success Rate:</span>
            <strong>98.2%</strong>
          </div>
          <button 
            className="btn-secondary w-full mt-4" 
            style={{ fontSize: '0.8rem', padding: '0.5rem' }}
          >
            Upgrade Intelligence
          </button>
        </div>

        <div className="intel-card glass">
          <h4><Zap size={16} /> Quick Tips</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Rotate your API keys every 30 days to minimize exposure risks.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default QABot;
