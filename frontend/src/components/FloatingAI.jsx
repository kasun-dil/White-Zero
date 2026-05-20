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
                        p: ({ node, ...props }) => <p style={{ margin: '0 0 0.6rem 0' }} {...props} />,
                        ul: ({ node, ...props }) => <ul style={{ margin: '0.6rem 0', paddingLeft: '1rem' }} {...props} />,
                        ol: ({ node, ...props }) => <ol style={{ margin: '0.6rem 0', paddingLeft: '1rem' }} {...props} />,
                        li: ({ node, ...props }) => <li style={{ marginBottom: '0.4rem' }} {...props} />,
                        h3: ({ node, ...props }) => <h3 style={{ fontSize: '1rem', margin: '0.8rem 0 0.4rem 0', color: '#00d2ff', fontWeight: '700' }} {...props} />,
                        strong: ({ node, ...props }) => <strong style={{ color: '#00d2ff', fontWeight: '600' }} {...props} />
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
          width: '110px',
          height: '110px',
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
          whileHover={{ scale: 1.15, filter: 'drop-shadow(0 0 25px rgba(0, 210, 255, 0.6))' }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, rgba(0, 210, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
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
            style={{ zIndex: 2, position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* Lottie Animated Robot */}
            <iframe
              src="https://lottie.host/embed/c1c0d5b2-7d25-4e0d-91e7-a34c76dc8fa4/tEkdPACc0L.lottie"
              style={{
                width: '140px',
                height: '140px',
                border: 'none',
                background: 'transparent',
                pointerEvents: 'none',
                filter: 'drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.8))'
              }}
              title="AI Assistant Icon"
            ></iframe>
          </motion.div>
        </motion.div>
      </button>
    </div>
  );
};

export default FloatingAI;
