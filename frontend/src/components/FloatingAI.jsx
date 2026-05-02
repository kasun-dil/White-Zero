import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Loader2, MessageSquare, ShieldAlert, Lock, Globe, FileText } from 'lucide-react';
import { chatWithAI } from '../services/api';
import ReactMarkdown from 'react-markdown';

const FloatingAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to the White Zero Cyber Assistant. I can help you with OSINT analysis, security best practices, and reporting cybercrimes.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    if (text === input) setInput('');
    setLoading(true);

    try {
      const data = await chatWithAI(text);
      const aiResponse = { role: 'assistant', content: data.content };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the intelligence network.' }]);
    } finally {
      setLoading(false);
    }
  };

  const presetQuestions = [
    { icon: <Lock size={14} />, text: "How to check my password security?" },
    { icon: <ShieldAlert size={14} />, text: "I think I clicked a phishing link" },
    { icon: <FileText size={14} />, text: "How do I report a cybercrime?" }
  ];

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
      {/* Chat Window */}
      {isOpen && (
        <div className="glass fade-in" style={{ 
          position: 'absolute', 
          bottom: '5rem', 
          right: '0', 
          width: '350px', 
          height: '500px',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          border: '1px solid rgba(0, 210, 255, 0.2)'
        }}>
          {/* Header */}
          <div style={{ padding: '1rem', background: 'rgba(0, 210, 255, 0.1)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot className="text-[#00d2ff]" size={20} />
              <strong style={{ fontSize: '1rem', color: 'white' }}>White Zero AI</strong>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="custom-scrollbar" style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div className="ai-message-content" style={{ 
                  padding: '0.8rem 1rem', 
                  borderRadius: '15px', 
                  background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  color: msg.role === 'user' ? 'black' : 'white',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  borderBottomRightRadius: msg.role === 'user' ? '0' : '15px',
                  borderBottomLeftRadius: msg.role === 'assistant' ? '0' : '15px',
                  wordBreak: 'break-word'
                }}>
                  <ReactMarkdown 
                    components={{
                      p: ({node, ...props}) => <p style={{ margin: '0 0 0.5rem 0' }} {...props} />,
                      ul: ({node, ...props}) => <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem' }} {...props} />,
                      ol: ({node, ...props}) => <ol style={{ margin: '0.5rem 0', paddingLeft: '1.2rem' }} {...props} />,
                      li: ({node, ...props}) => <li style={{ marginBottom: '0.3rem' }} {...props} />,
                      h3: ({node, ...props}) => <h3 style={{ fontSize: '1rem', margin: '0.8rem 0 0.4rem 0', color: '#00d2ff' }} {...props} />,
                      strong: ({node, ...props}) => <strong style={{ color: '#00d2ff' }} {...props} />
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '15px' }}>
                <Loader2 size={16} className="animate-spin text-[#00d2ff]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Presets */}
          {messages.length === 1 && !loading && (
            <div style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', scrollbarWidth: 'none' }} className="custom-scrollbar">
              {presetQuestions.map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(q.text)}
                  style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.5rem 0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: 'white', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  <span style={{ color: '#00d2ff' }}>{q.icon}</span> {q.text}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Ask AI assistant..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                style={{ flex: 1, padding: '0.8rem', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.9rem' }}
              />
              <button 
                onClick={() => handleSend()} 
                disabled={loading}
                style={{ padding: '0 1rem', borderRadius: '10px', background: 'var(--primary)', border: 'none', color: 'black', cursor: 'pointer' }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '50%', 
          background: isOpen ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #00d2ff, #3a7bd5)', 
          border: isOpen ? '1px solid rgba(255,255,255,0.2)' : 'none',
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease'
        }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default FloatingAI;
