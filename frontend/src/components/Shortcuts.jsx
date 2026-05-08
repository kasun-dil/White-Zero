import React from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, Shield, Archive, Globe, Terminal } from 'lucide-react';
import './Shortcuts.css';

const shortcuts = [
  {
    title: "OSINT Terminal",
    icon: <Terminal size={24} />,
    path: "/osint-trial",
    color: "#00d2ff",
    desc: "Launch harvester"
  },
  {
    title: "Forensic Report",
    icon: <FileText size={24} />,
    path: "/report-crime",
    color: "#10b981",
    desc: "Generate letter"
  },
  {
    title: "Sentinel AI",
    icon: <Shield size={24} />,
    path: "/content-sentinel",
    color: "#8b5cf6",
    desc: "Fact check scan"
  },
  {
    title: "Case Archive",
    icon: <Archive size={24} />,
    path: "/my-reports",
    color: "#f59e0b",
    desc: "View investigations"
  },
  {
    title: "Intelligence Feed",
    icon: <Globe size={24} />,
    path: "/articles",
    color: "#3b82f6",
    desc: "Read latest intel"
  }
];

const Shortcuts = () => {
  return (
    <div className="shortcuts-container fade-in">
      <div className="shortcuts-grid">
        {shortcuts.map((s, i) => (
          <Link key={i} to={s.path} className="shortcut-card glass">
            <div className="shortcut-icon" style={{ color: s.color, background: `${s.color}15` }}>
              {s.icon}
            </div>
            <div className="shortcut-info">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Shortcuts;
