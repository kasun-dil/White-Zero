import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Mail, ExternalLink, Shield } from 'lucide-react';
import { chatWithAI } from '../services/api';
import './ReportAssistant.css';

const ReportAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your White Zero Reporting Assistant. Please tell me about the post or profile you want to report, and paste the link if you have it.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const data = await chatWithAI(input, 'Reporting Assistant Focus: Help user report harmful posts/profiles.');
      const aiResponse = { 
        role: 'assistant', 
        content: data.content,
        // Optional: Keep simulation for specific project features if AI doesn't return them
        reportGuide: [
          'Go to the profile/post and click the three dots (...)',
          'Select "Find Support or Report"',
          'Choose the appropriate category as guided above.',
        ],
        emailTemplate: {
          to: 'case-support@facebook.com',
          subject: 'Report: Malicious Content',
          body: `Dear Support Team,\n\nI am reporting a violation. Details: ${input}\n\nRegards,\nWhite Zero User`
        }
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-container fade-in">
      <div className="report-header">
        <Shield className="text-[#00d2ff]" size={32} />
        <h1>AI Report Assistant</h1>
        <p>Chat with our AI to get step-by-step help with reporting harmful content.</p>
      </div>

      <div className="chat-window glass">
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message-wrapper ${msg.role}`}>
              <div className="avatar">
                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className="message-content">
                <p>{msg.content}</p>
                
                {msg.reportGuide && (
                  <div className="report-guide glass">
                    <h4>Step-by-Step Guide</h4>
                    <ol>
                      {msg.reportGuide.map((step, sIdx) => <li key={sIdx}>{step}</li>)}
                    </ol>
                  </div>
                )}

                {msg.emailTemplate && (
                  <div className="email-generator glass">
                    <div className="email-header">
                      <Mail size={16} />
                      <h4>Generated Email Template</h4>
                    </div>
                    <pre>{msg.emailTemplate.body}</pre>
                    <button className="btn-primary" onClick={() => window.location.href = `mailto:${msg.emailTemplate.to}?subject=${encodeURIComponent(msg.emailTemplate.subject)}&body=${encodeURIComponent(msg.emailTemplate.body)}`}>
                      Open in Mail App
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message-wrapper assistant">
              <div className="avatar"><Bot size={20} /></div>
              <div className="message-content">
                <Loader2 className="animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <input 
            type="text" 
            placeholder="Type your problem here..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="btn-primary" onClick={handleSend} disabled={loading}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportAssistant;
