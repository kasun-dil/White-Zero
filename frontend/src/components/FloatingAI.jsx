import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Loader2, MessageSquare, ShieldAlert, Lock, FileText } from 'lucide-react';
import { chatWithAI } from '../services/api';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

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
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            className="glass" 
            style={{ 
              position: 'absolute', 
              bottom: '7rem', 
              right: '0', 
              width: 'min(calc(100vw - 4rem), 400px)', 
              height: 'min(calc(100vh - 10rem), 550px)',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(5, 5, 10, 0.95)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              transformOrigin: 'bottom right'
            }}
          >
            {/* Header */}
            <div style={{ padding: '1rem', background: 'rgba(0, 210, 255, 0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bot className="text-[#00d2ff]" size={18} />
                <strong style={{ fontSize: '0.9rem', color: 'white', letterSpacing: '0.5px' }}>White Zero Assistant</strong>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="custom-scrollbar" style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  width: '100%'
                }}>
                  {msg.role === 'assistant' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem', paddingLeft: '0.1rem' }}>
                      <Bot size={12} color="#00d2ff" />
                      <span style={{ fontSize: '0.6rem', fontWeight: '800', color: '#00d2ff', letterSpacing: '1px' }}>INTEL OPS</span>
                    </div>
                  )}
                  <div className="ai-message-content" style={{ 
                    padding: '0.8rem 1rem', 
                    borderRadius: '16px', 
                    background: msg.role === 'user' ? 'rgba(0, 210, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    color: 'rgba(255,255,255,0.95)',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
                    borderTopLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
                    wordBreak: 'break-word',
                    border: '1px solid rgba(255,255,255,0.03)',
                    maxWidth: '92%'
                  }}>
                    <ReactMarkdown 
                      components={{
                        p: ({node, ...props}) => <p style={{ margin: '0 0 0.6rem 0' }} {...props} />,
                        ul: ({node, ...props}) => <ul style={{ margin: '0.6rem 0', paddingLeft: '1rem' }} {...props} />,
                        ol: ({node, ...props}) => <ol style={{ margin: '0.6rem 0', paddingLeft: '1rem' }} {...props} />,
                        li: ({node, ...props}) => <li style={{ marginBottom: '0.4rem' }} {...props} />,
                        h3: ({node, ...props}) => <h3 style={{ fontSize: '1rem', margin: '0.8rem 0 0.4rem 0', color: '#00d2ff', fontWeight: '700' }} {...props} />,
                        strong: ({node, ...props}) => <strong style={{ color: '#00d2ff', fontWeight: '600' }} {...props} />
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.03)', padding: '0.6rem', borderRadius: '12px' }}>
                  <Loader2 size={14} className="animate-spin text-[#00d2ff]" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Presets */}
            {messages.length === 1 && !loading && (
              <div style={{ padding: '0.4rem 1rem', display: 'flex', gap: '0.4rem', overflowX: 'auto', scrollbarWidth: 'none' }} className="custom-scrollbar">
                {presetQuestions.map((q, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSend(q.text)}
                    style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.7rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '15px', color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    <span style={{ color: '#00d2ff' }}>{q.icon}</span> {q.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <input 
                  type="text" 
                  placeholder="Intelligence query..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  style={{ flex: 1, padding: '0.7rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '0.85rem', outline: 'none' }}
                />
                <button 
                  onClick={() => handleSend()} 
                  disabled={loading}
                  style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#00d2ff', border: 'none', color: 'black', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          position: 'absolute', 
          bottom: '0', 
          right: isOpen ? 'calc(50% - 45px)' : '0', 
          width: '90px', 
          height: '90px', 
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          padding: 0,
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 10000
        }}
      >
        {/* Main Icon Core */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            position: 'relative',
            overflow: 'visible',
            pointerEvents: 'none'
          }}
        >
          <motion.div
            key="robot"
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{ zIndex: 2, position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* Custom CSS Animated Robot */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: 'relative', width: '60px', height: '50px' }}
            >
              {/* Head Container */}
              <div style={{ 
                width: '100%', 
                height: '100%', 
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(200, 200, 255, 0.3))', 
                borderRadius: '16px',
                border: '2px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
                position: 'relative',
                backdropFilter: 'blur(5px)'
              }}>
                {/* Eyes Area */}
                <div style={{ position: 'absolute', top: '35%', left: '0', right: '0', display: 'flex', justifyContent: 'space-around', padding: '0 12px' }}>
                  <motion.div 
                    animate={{ 
                      scaleY: [1, 1, 0.1, 1, 1],
                      boxShadow: ['0 0 8px #ffffff', '0 0 15px #ffffff', '0 0 8px #ffffff']
                    }}
                    transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
                    style={{ width: '10px', height: '10px', background: '#ffffff', borderRadius: '50%' }} 
                  />
                  <motion.div 
                    animate={{ 
                      scaleY: [1, 1, 0.1, 1, 1],
                      boxShadow: ['0 0 8px #ffffff', '0 0 15px #ffffff', '0 0 8px #ffffff']
                    }}
                    transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
                    style={{ width: '10px', height: '10px', background: '#ffffff', borderRadius: '50%' }} 
                  />
                </div>
                
                {/* Telemetry Light */}
                <motion.div 
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)', width: '20px', height: '3px', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '10px' }} 
                />
              </div>

              {/* Antennas */}
              <div style={{ position: 'absolute', top: '-15px', left: '15px', width: '2px', height: '15px', background: 'rgba(255, 255, 255, 0.8)' }}>
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ position: 'absolute', top: '-4px', left: '-3px', width: '8px', height: '8px', background: '#ffffff', borderRadius: '50%', boxShadow: '0 0 10px #ffffff' }} 
                />
              </div>
              <div style={{ position: 'absolute', top: '-10px', right: '15px', width: '2px', height: '10px', background: 'rgba(255, 255, 255, 0.5)' }} />
              
              {/* Bobbing Shadow underneath */}
              <motion.div 
                animate={{ scale: [1, 0.8, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: 'absolute', bottom: '-20px', left: '10%', right: '10%', height: '4px', background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.4) 0%, transparent 70%)', borderRadius: '50%' }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </button>
    </div>
  );
};

export default FloatingAI;
