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
    desc: "Launch harvester",
    status: "ACTIVE"
  },
  {
    title: "Forensic Report",
    icon: <FileText size={24} />,
    path: "/report-crime",
    color: "#10b981",
    desc: "Generate letter",
    status: "VERIFIED"
  },
  {
    title: "Sentinel AI",
    icon: <Shield size={24} />,
    path: "/content-sentinel",
    color: "#8b5cf6",
    desc: "Fact check scan",
    status: "STANDBY"
  },
  {
    title: "Case Archive",
    icon: <Archive size={24} />,
    path: "/my-reports",
    color: "#f59e0b",
    desc: "View investigations",
    status: "SECURE"
  },
];

const Shortcuts = () => {
  return (
    <div className="shortcuts-container fade-in">
      <div className="shortcuts-grid">
        {shortcuts.map((s, i) => (
          <Link key={i} to={s.path} className="shortcut-card glass" style={{ '--accent': s.color }}>
            <div className="card-top">
              <div className="shortcut-icon" style={{ color: s.color, background: `${s.color}15`, boxShadow: `0 0 15px ${s.color}20` }}>
                {s.icon}
              </div>
              <span className="status-badge" style={{ color: s.color }}>{s.status}</span>
            </div>
            <div className="shortcut-info">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
            <div className="card-glow" style={{ background: `radial-gradient(circle at center, ${s.color}10, transparent)` }}></div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Shortcuts;
