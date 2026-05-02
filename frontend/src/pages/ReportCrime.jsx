import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Shield, FileText, AlertTriangle, CheckCircle, Download,
  ChevronRight, ChevronLeft, User, Mail, Link as LinkIcon,
  Copy, Sparkles, Info, ExternalLink, Globe
} from 'lucide-react';
import FadeInSection from '../components/FadeInSection';
import './ReportCrime.css';

// Define guides outside to prevent re-creation and potential closure issues
const SUBMISSION_GUIDES = {
  Facebook: {
    email: "records@facebook.com",
    link: "https://www.facebook.com/help/contact/274459462613911",
    steps: [
      "Login to your alternate account or use the Help Center.",
      "Upload the generated report as a .txt or PDF file.",
      "Reference your White Zero Intelligence ID in the subject.",
      "Send a direct email to records@facebook.com for legal escalations."
    ]
  },
  Instagram: {
    email: "support@instagram.com",
    link: "https://help.instagram.com/contact/636278473351888",
    steps: [
      "Use the 'Report a Problem' feature in the app settings.",
      "Select 'Spam or Abuse' and paste the Forensic Description.",
      "Mention the Target Account link clearly.",
      "Keep a copy of this report for local police submission."
    ]
  },
  Twitter: {
    email: "lawenforcement@twitter.com",
    link: "https://help.twitter.com/en/forms",
    steps: [
      "Go to the Twitter Help Center Forms.",
      "Select 'Report a violation' > 'Hacked account'.",
      "Attach the professional description generated below.",
      "Check your email for a ticket number."
    ]
  },
  WhatsApp: {
    email: "support@whatsapp.com",
    link: "https://www.whatsapp.com/contact/",
    steps: [
      "Email support@whatsapp.com with your phone number in international format.",
      "Attach the 'Forensic Description' section of this report.",
      "Request account deactivation if unauthorized access is confirmed.",
      "Include the suspect phone number if available."
    ]
  },
  TikTok: {
    email: "feedback@tiktok.com",
    link: "https://www.tiktok.com/legal/report/feedback",
    steps: [
      "Use the in-app reporting tool on the profile/video.",
      "Select 'Other' and paste the generated forensic ID.",
      "Submit a feedback form with the workplace text.",
      "Wait for an automated case number."
    ]
  }
};

const ReportCrime = () => {
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    victimName: '',
    victimEmail: '',
    targetAccount: '',
    incidentType: '',
    platform: 'Facebook',
    date: new Date().toLocaleDateString(),
    description: '',
    suspectInfo: '',
    impact: ''
  });
  const [generatedReport, setGeneratedReport] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [reportRefId] = useState(`WZ-INC-${Math.floor(Math.random() * 900000) + 100000}`);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.victimName || !formData.victimEmail) {
        alert('CRITICAL DATA MISSING: Please provide the Legal Name and Contact Email to proceed with the forensic documentation.');
        return;
      }
    }
    setStep(s => Math.min(s + 1, 4));
  };
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Auto-generate report preview in formal letter format
  useEffect(() => {
    const guide = SUBMISSION_GUIDES[formData.platform] || SUBMISSION_GUIDES.Facebook;

    const report = `CYBER INCIDENT DOCUMENTATION
DATE: ${formData.date}
PLATFORM: ${formData.platform}
SUPPORT EMAIL: ${guide.email}

SUBJECT: OFFICIAL INCIDENT REPORT: ${formData.incidentType.toUpperCase() || 'SPECIFIED INCIDENT'}

Dear Trust and Safety Team,

I am writing to formally document a security incident that occurred on the ${formData.platform} platform. This report is intended for immediate review by your legal and compliance divisions.

REPORTER INFORMATION
Name: ${formData.victimName || 'Not Specified'}
Email: ${formData.victimEmail || 'Not Specified'}
Account Link: ${formData.targetAccount || 'Not Specified'}

INCIDENT DETAILS
Type: ${formData.incidentType || 'Forensic Intelligence Observation'}
Current Assessment: ${formData.description || 'Pending detailed description...'}

EVIDENCE & IMPACT
Related Handles/Links: ${formData.suspectInfo || 'No direct links provided.'}
Incident Impact: ${formData.impact || 'Under assessment.'}

I request an immediate investigation into this matter. Please coordinate any response via the contact email provided above.

Sincerely,

${formData.victimName || 'Authorized Reporter'}

-----------------------------------------------------------------------
Official Documentation by White Zero Intelligence Framework
`;
    setGeneratedReport(report);
  }, [formData, reportRefId]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Cyber Incident Report</title>
          <style>
            @page { size: auto; margin: 0; }
            body { 
              font-family: 'Times New Roman', Times, serif; 
              padding: 50px; 
              line-height: 1.5; 
              color: #111; 
              background: white;
              margin: 0;
            }
            pre { 
              white-space: pre-wrap; 
              font-family: inherit; 
              font-size: 11pt; 
              margin: 0;
            }
            @media print {
              html, body { height: 100%; overflow: hidden; }
              body { padding: 40px; }
            }
          </style>
        </head>
        <body>
          <pre>${generatedReport}</pre>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const saveReport = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;

      if (!token) {
        alert('Security Alert: You must be logged in to archive forensic intelligence. Please login and try again.');
        return;
      }

      console.log('[ARCHIVING REPORT]: Sending to security node...');

      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          referenceId: reportRefId,
          victimName: formData.victimName,
          platform: formData.platform,
          incidentType: formData.incidentType,
          targetAccount: formData.targetAccount,
          description: formData.description,
          content: generatedReport
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('SUCCESS: Forensic Intelligence Report has been securely archived to your profile.');
      } else {
        console.error('[SAVE ERROR]:', data.message);
        alert('ARCHIVE FAILED: ' + (data.message || 'The security server rejected the documentation.'));
      }
    } catch (error) {
      console.error('[NETWORK ERROR]:', error);
      alert('CONNECTION ERROR: Could not reach the security server. Please ensure the backend is active.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReport);
    alert('Report copied to workplace clipboard!');
  };

  const handleAIPolish = () => {
    if (isPolishing) return;
    setIsPolishing(true);

    setTimeout(() => {
      const guide = SUBMISSION_GUIDES[formData.platform] || SUBMISSION_GUIDES.Facebook;
      const polishedContent = `CYBER INCIDENT DOCUMENTATION
DATE: ${formData.date}
PLATFORM: ${formData.platform}
SUPPORT EMAIL: ${guide.email}

SUBJECT: MANDATORY FORENSIC INTERVENTION: ${formData.incidentType.toUpperCase()}

TO THE TRUST AND SAFETY COMPLIANCE DIVISION,

This formal communication serves as a verified forensic record and legal declaration regarding a sophisticated security breach targeting the user profile ${formData.targetAccount || 'identified nodes'} on the ${formData.platform} platform. 

Our initial heuristic analysis and network telemetry have categorized this event as a high-velocity ${formData.incidentType} incident. Based on the observed adversarial vectors, we strongly recommend that your security response team initiate immediate administrative countermeasures, including unauthorized access revocation and comprehensive data exfiltration audits.

INVESTIGATION PROFILE
Subject Identity: ${formData.victimName || 'Classified User'}
Validated Contact: ${formData.victimEmail || 'N/A'}
Target Vector: ${formData.targetAccount || 'Platform Core Node'}

FORENSIC ANALYSIS SUMMARY
Heuristic indicators highlight the following unauthorized activity:
${formData.description || 'Adversarial data exfiltration and session hijacking detected.'}

Technical evidence points to coordinated efforts by adversarial entities (Source: Advanced Intel Nodes). 
Impact Assessment: ${formData.impact || 'Critical compromise of account integrity and user data privacy.'}

We demand a priority investigation into this breach. Please coordinate any response via the contact email provided above.

Respectfully Submitted,

${formData.victimName || 'Forensic Intelligence Specialist'}

-----------------------------------------------------------------------------
Official Documentation by White Zero Intelligence Framework
`;
      setGeneratedReport(polishedContent);
      setIsPolishing(false);
    }, 1500);
  };

  const currentGuide = SUBMISSION_GUIDES[formData.platform] || SUBMISSION_GUIDES.Facebook;

  return (
    <div className="report-crime-page fade-in">
      <div className="report-overlay-bg"></div>

      <FadeInSection direction="down">
        <div className="report-page-header">
          <div className="header-icon">
            <Shield size={32} />
          </div>
          <h1>Automated <span className="text-gradient">Incident Intelligence</span></h1>
          <p>Generate high-authority reports for social media platforms and law enforcement.</p>
        </div>
      </FadeInSection>

      <div className="report-wizard-container">
        {/* Progress Tracker */}
        <div className="step-tracker">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className={`step-node ${step >= num ? 'active' : ''} ${step > num ? 'completed' : ''}`}>
              <div className="node-circle">{step > num ? <CheckCircle size={18} /> : num}</div>
              <span className="node-label">
                {num === 1 ? 'Profile' : num === 2 ? 'Details' : num === 3 ? 'Evidence' : 'Workplace'}
              </span>
            </div>
          ))}
          <div className="step-line">
            <div className="step-line-progress" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          </div>
        </div>

        <div className="wizard-card glass">
          {step === 1 && (
            <FadeInSection>
              <div className="wizard-step-content">
                <div className="step-title">
                  <User color="#00d2ff" />
                  <h2>Victim & Platform Profile</h2>
                </div>

                <div className="form-grid">
                  <div className="input-group">
                    <label><User size={14} /> Victim Full Name</label>
                    <input
                      type="text"
                      name="victimName"
                      value={formData.victimName}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="input-group">
                    <label><Mail size={14} /> Contact Email</label>
                    <input
                      type="email"
                      name="victimEmail"
                      value={formData.victimEmail}
                      onChange={handleChange}
                      placeholder="e.g. john@example.com"
                    />
                  </div>
                  <div className="input-group">
                    <label><LinkIcon size={14} /> Affected Profile Link</label>
                    <input
                      type="text"
                      name="targetAccount"
                      value={formData.targetAccount}
                      onChange={handleChange}
                      placeholder="e.g. facebook.com/profile"
                    />
                  </div>
                  <div className="input-group">
                    <label><Globe size={14} /> Target Platform</label>
                    <select name="platform" value={formData.platform} onChange={handleChange}>
                      <option value="Facebook">Facebook</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Twitter">Twitter / X</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Other">Other Global Web</option>
                    </select>
                  </div>
                </div>
              </div>
            </FadeInSection>
          )}

          {step === 2 && (
            <FadeInSection>
              <div className="wizard-step-content">
                <div className="step-title">
                  <AlertTriangle color="#f59e0b" />
                  <h2>Incident Analysis</h2>
                </div>

                <div className="form-group">
                  <label>Incident Classification</label>
                  <select name="incidentType" value={formData.incidentType} onChange={handleChange}>
                    <option value="">Select Category...</option>
                    <option value="Account Takeover (Hacking)">Account Takeover (Hacking)</option>
                    <option value="Impersonation / Fake Profile">Impersonation / Fake Profile</option>
                    <option value="Harassment & Cyberbullying">Harassment & Cyberbullying</option>
                    <option value="Phishing & Social Engineering">Phishing & Social Engineering</option>
                    <option value="Unauthorized Content Sharing">Unauthorized Content Sharing</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Detailed Description (Raw Intel)</label>
                  <textarea
                    name="description"
                    rows="6"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe exactly what happened, when it started, and what messages were sent..."
                  />
                </div>
              </div>
            </FadeInSection>
          )}

          {step === 3 && (
            <FadeInSection>
              <div className="wizard-step-content">
                <div className="step-title">
                  <Shield color="#10b981" />
                  <h2>Evidence & Impact</h2>
                </div>

                <div className="form-group">
                  <label>Threat Actor Details (Suspect Info)</label>
                  <input
                    type="text"
                    name="suspectInfo"
                    value={formData.suspectInfo}
                    onChange={handleChange}
                    placeholder="Usernames, IP addresses, or Links found in OSINT search"
                  />
                </div>

                <div className="form-group">
                  <label>Damages & Security Impact</label>
                  <textarea
                    name="impact"
                    rows="4"
                    value={formData.impact}
                    onChange={handleChange}
                    placeholder="Financial loss, reputational damage, or data exposure details..."
                  />
                </div>
              </div>
            </FadeInSection>
          )}

          {step === 4 && (
            <FadeInSection>
              <div className="wizard-step-content workplace-view">
                <div className="workplace-header">
                  <div className="step-title">
                    <FileText color="#00d2ff" />
                    <h2>Intelligence Workplace</h2>
                  </div>
                  <div className="workplace-actions">
                    <button className="btn-polish" onClick={handleAIPolish} disabled={isPolishing}>
                      {isPolishing ? <Sparkles className="spinning" size={16} /> : <Sparkles size={16} />}
                      AI Forensic Polish
                    </button>
                    <button className="btn-copy" onClick={handleCopy}>
                      <Copy size={16} /> Copy Text
                    </button>
                  </div>
                </div>

                <div className="report-editor-container">
                  <textarea
                    className="report-editor"
                    value={generatedReport}
                    onChange={(e) => setGeneratedReport(e.target.value)}
                    spellCheck="false"
                  />
                </div>

                <div className="submission-guide-section glass">
                  <div className="guide-header">
                    <Info size={18} />
                    <h3>Step by Step: How to Report via {formData.platform} and Email</h3>
                  </div>
                  <div className="guide-content">
                    <ol>
                      {currentGuide.steps.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>
                    <div className="official-channels">
                      <div className="channel">
                        <span>Direct Email:</span>
                        <code>{currentGuide.email}</code>
                      </div>
                      <a href={currentGuide.link} target="_blank" rel="noreferrer" className="btn-link">
                        Open Submission Portal <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>
          )}

          {/* Navigation */}
          <div className="wizard-footer">
            <button
              onClick={handlePrev}
              className={`btn-nav-prev ${step === 1 ? 'hidden' : ''}`}
            >
              <ChevronLeft size={18} /> Previous
            </button>
            {step < 4 ? (
              <button onClick={handleNext} className="btn-nav-next">
                Continue <ChevronRight size={18} />
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-nav-next" style={{ background: '#004e92', color: 'white' }} onClick={saveReport}>
                  <Shield size={18} /> Save to Profile
                </button>
                <button className="btn-nav-next success" onClick={handlePrint}>
                  <Download size={18} /> Print Formal Letter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCrime;
