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
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (text === input) setInput('');
    setLoading(true);

    try {
      // Send history for neural memory (excluding initial welcome message)
      const history = newMessages.slice(1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      
      const data = await chatWithAI(text, history);
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
          width: 'min(calc(100vw - 2.5rem), 380px)', 
          height: 'min(calc(100vh - 12rem), 550px)',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          border: '1px solid rgba(0, 210, 255, 0.4)',
          background: 'rgba(5, 5, 10, 0.95)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          transformOrigin: 'bottom right'
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
          <div className="custom-scrollbar" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                width: '100%'
              }}>
                {msg.role === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', paddingLeft: '0.2rem' }}>
                    <Bot size={14} color="#00d2ff" />
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#00d2ff', letterSpacing: '1px' }}>WHITE ZERO INTEL</span>
                  </div>
                )}
                <div className="ai-message-content" style={{ 
                  padding: '1rem 1.2rem', 
                  borderRadius: '20px', 
                  background: msg.role === 'user' ? 'rgba(0, 210, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: 'white',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  borderTopRightRadius: msg.role === 'user' ? '4px' : '20px',
                  borderTopLeftRadius: msg.role === 'assistant' ? '4px' : '20px',
                  wordBreak: 'break-word',
                  border: '1px solid rgba(255,255,255,0.05)',
                  boxShadow: msg.role === 'user' ? '0 4px 15px rgba(0, 210, 255, 0.1)' : 'none',
                  maxWidth: '90%'
                }}>
                  <ReactMarkdown 
                    components={{
                      p: ({node, ...props}) => <p style={{ margin: '0 0 0.8rem 0' }} {...props} />,
                      ul: ({node, ...props}) => <ul style={{ margin: '0.8rem 0', paddingLeft: '1.2rem' }} {...props} />,
                      ol: ({node, ...props}) => <ol style={{ margin: '0.8rem 0', paddingLeft: '1.2rem' }} {...props} />,
                      li: ({node, ...props}) => <li style={{ marginBottom: '0.5rem' }} {...props} />,
                      h3: ({node, ...props}) => <h3 style={{ fontSize: '1.1rem', margin: '1rem 0 0.5rem 0', color: '#00d2ff', fontWeight: '800' }} {...props} />,
                      strong: ({node, ...props}) => <strong style={{ color: '#00d2ff', fontWeight: '700' }} {...props} />
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
