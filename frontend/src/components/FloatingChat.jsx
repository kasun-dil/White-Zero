import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import './FloatingChat.css';

const FloatingChat = () => {
  return (
    <Link to="/qa-bot" className="floating-chat" aria-label="AI QA Bot">
      <div className="floating-chat-bubble">
        <MessageSquare className="floating-chat-icon" size={28} strokeWidth={2} />
      </div>
      <div className="floating-chat-tooltip">AI Assistant</div>
    </Link>
  );
};

export default FloatingChat;
