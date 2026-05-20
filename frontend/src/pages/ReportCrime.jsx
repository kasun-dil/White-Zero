import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Shield, FileText, AlertTriangle, CheckCircle, Download,
  ChevronRight, ChevronLeft, User, Mail, Link as LinkIcon,
  Copy, Sparkles, Info, ExternalLink, Globe, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
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
  const navigate = useNavigate();
  const [reportType, setReportType] = useState(null); // 'social' or 'police'
  const [step, setStep] = useState(1);

  // Social Platform Data
  const [formData, setFormData] = useState({
    victimName: '',
    victimEmail: '',
    targetAccount: '',
    incidentType: '',
    platform: '',
    otherPlatform: '',
    incidentDate: new Date().toISOString().split('T')[0],
    description: '',
    suspectInfo: '',
    impact: ''
  });

  // Police Report Data
  const [policeData, setPoliceData] = useState({
    victimName: '',
    victimEmail: '',
    title: '',
    description: '',
    platform: '',
    otherPlatform: '',
    incidentDate: '',
    platformDetails: '',
    evidenceLinks: ''
  });

  const [generatedReport, setGeneratedReport] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [reportRefId] = useState(`WZ-INC-${Math.floor(Math.random() * 900000) + 100000}`);

  // OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (reportType === 'social') {
      if (step === 1) {
        if (!formData.victimName || !formData.victimEmail || !formData.platform || !formData.targetAccount) {
          toast.error('MANDATORY DATA: Victim profile and platform targets must be fully documented.');
          return;
        }
        if (formData.platform === 'Others' && !formData.otherPlatform) {
          toast.error('FIELD REQUIRED: Please specify the platform name.');
          return;
        }
      }
      if (step === 2 && (!formData.incidentType || !formData.description)) {
        toast.error('ANALYSIS REQUIRED: Classification and incident narrative are mandatory.');
        return;
      }
      if (step === 3 && !formData.impact) {
        toast.error('IMPACT ASSESSMENT: Please document the forensic impact of this event.');
        return;
      }
      setStep(s => Math.min(s + 1, 4));
    } else {
      if (step === 1 && (!policeData.victimName || !policeData.victimEmail)) {
        toast.error('All contact fields are required for police submission.');
        return;
      }
      if (step === 2 && !otpVerified) {
        toast.error('Please verify your contact information via OTP first.');
        return;
      }
      if (step === 3) {
        if (!policeData.title || !policeData.description || !policeData.platform || !policeData.incidentDate || !policeData.platformDetails) {
          toast.error('MANDATORY DATA MISSING: All intelligence fields must be filled for forensic archiving.');
          return;
        }
        if (policeData.platform === 'Others' && !policeData.otherPlatform) {
          toast.error('FIELD REQUIRED: Please specify the platform name.');
          return;
        }
      }
      setStep(s => Math.min(s + 1, 4));
    }
  };

  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleChange = (e) => {
    if (reportType === 'social') {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    } else {
      setPoliceData({ ...policeData, [e.target.name]: e.target.value });
    }
  };

  const sendOtp = async () => {
    if (!policeData.victimEmail) {
      toast.error('CRITICAL: Email address required for identity verification.');
      return;
    }
    setSendingOtp(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: policeData.victimEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        toast.success('SUCCESS: Verification OTP has been dispatched.');
      } else {
        toast.error('ERROR: ' + (data.message || 'Failed to dispatch OTP.'));
      }
    } catch (error) {
      toast.error('NETWORK ERROR: Could not reach the security server.');
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (!otpCode) {
      toast.error('Please enter the 6-digit code.');
      return;
    }
    setVerifyingOtp(true);
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: policeData.victimEmail, otp: otpCode })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpVerified(true);
        toast.success('IDENTITY VERIFIED: Protocol authorized.');
      } else {
        toast.error('INVALID CODE: ' + (data.message || 'The OTP entered is incorrect.'));
      }
    } catch (error) {
      toast.error('VERIFICATION FAILED: Network issues detected.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const submitPoliceReport = async () => {
    setIsSubmitting(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;

      const res = await fetch('/api/police-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(policeData)
      });

      if (res.ok) {
        window.dispatchEvent(new Event('reportSubmitted'));
        toast.success('Report Submitted Successfully.');
        setStep(5); // Success step
      } else {
        const data = await res.json();
        toast.error('ERROR: ' + (data.message || 'Submission failed'));
      }
    } catch (error) {
      toast.error('Submission failed: Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-generate report preview for Social Platform
  useEffect(() => {
    if (reportType !== 'social') return;
    const guide = SUBMISSION_GUIDES[formData.platform] || SUBMISSION_GUIDES.Facebook;

    const report = `CYBER INCIDENT DOCUMENTATION
DATE: ${formData.date}
PLATFORM: ${formData.platform}
SUPPORT EMAIL: ${guide.email}

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
  }, [formData, reportType]);

  const downloadDoc = (content, filename) => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Forensic Report</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + content.replace(/\n/g, '<br>') + footer;

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${filename}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const handleDownloadDoc = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
      "xmlns:w='urn:schemas-microsoft-com:office:word' " +
      "xmlns='http://www.w3.org/TR/REC-html40'>" +
      "<head><meta charset='utf-8'><title>Forensic Report</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + `<pre style="font-family: 'Courier New', Courier, monospace; font-size: 10pt;">${generatedReport}</pre>` + footer;

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileLink = document.createElement("a");
    document.body.appendChild(fileLink);
    fileLink.href = source;
    fileLink.download = `Forensic_Report_${reportRefId}.doc`;
    fileLink.click();
    document.body.removeChild(fileLink);
    toast.success('Dossier exported as editable .DOC');
  };

  const saveReport = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;

      if (!token) {
        toast.error('Security Alert: You must be logged in.');
        return;
      }

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

      if (response.ok) {
        toast.success('SUCCESS: Report archived.');
      }
    } catch (error) {
      toast.error('ARCHIVE FAILED');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReport);
    toast.success('Report copied!');
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

TO THE TRUST AND SAFETY COMPLIANCE DIVISION,

This formal communication serves as a verified forensic record and legal declaration regarding a sophisticated security breach targeting the user profile ${formData.targetAccount || 'identified nodes'} on the ${formData.platform} platform. 

Our initial heuristic analysis and network telemetry have categorized this event as a high-velocity ${formData.incidentType} incident. Based on the observed adversarial vectors, we strongly recommend that your security response team initiate immediate administrative countermeasures.

INVESTIGATION PROFILE
Subject Identity: ${formData.victimName || 'Classified User'}
Validated Contact: ${formData.victimEmail || 'N/A'}
Target Vector: ${formData.targetAccount || 'Platform Core Node'}

FORENSIC ANALYSIS SUMMARY
Heuristic indicators highlight the following unauthorized activity:
${formData.description || 'Adversarial data exfiltration detected.'}

Impact Assessment: ${formData.impact || 'Critical compromise of account integrity.'}

We demand a priority investigation into this breach.

Respectfully Submitted,
${formData.victimName || 'Forensic Intelligence Specialist'}

-----------------------------------------------------------------------------
Official Documentation by White Zero Intelligence Framework
`;
      setGeneratedReport(polishedContent);
      setIsPolishing(false);
    }, 1500);
  };

  const handleSendEmail = () => {
    const guide = SUBMISSION_GUIDES[formData.platform] || SUBMISSION_GUIDES.Facebook;
    const subject = encodeURIComponent(`INCIDENT REPORT - ${formData.platform}: ${formData.incidentType.toUpperCase() || 'URGENT SECURITY MATTER'}`);
    const body = encodeURIComponent(generatedReport);
    window.location.href = `mailto:${guide.email}?subject=${subject}&body=${body}`;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>White Zero Forensic Report - ${reportRefId}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; padding: 40px; background: #fff; color: #000; }
            h1 { border-bottom: 2px solid #000; padding-bottom: 10px; }
            pre { white-space: pre-wrap; word-wrap: break-word; }
          </style>
        </head>
        <body>
          <h1>WHITE ZERO FORENSIC INTELLIGENCE</h1>
          <p>REFERENCE ID: ${reportRefId}</p>
          <hr />
          <pre>${generatedReport}</pre>
          <hr />
          <p style="font-size: 10px; color: #666;">Generated via White Zero Intelligence Framework</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const currentGuide = SUBMISSION_GUIDES[formData.platform] || SUBMISSION_GUIDES.Facebook;

  // RENDER SELECTION SCREEN
  if (!reportType) {
    return (
      <div className="report-crime-page">
        <div className="report-overlay-bg"></div>
        <FadeInSection direction="down">
          <div className="report-page-header">
            <Shield size={64} className="text-[#00d2ff]" style={{ margin: '0 auto 2rem' }} />
            <h1>Intelligence <span className="text-gradient">Countermeasure Selection</span></h1>
            <p>Select the appropriate escalation path for your forensic report.</p>
          </div>
        </FadeInSection>

        <div className="selection-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
          <div className="selection-card glass" onClick={() => { setReportType('police'); setStep(1); }} style={{ padding: '3rem', borderRadius: '30px', cursor: 'pointer', textAlign: 'center', transition: 'transform 0.3s' }}>
            <Shield size={48} color="#10b981" style={{ marginBottom: '1.5rem' }} />
            <h3>Law Enforcement</h3>
            <p>Report your case directly to the Police to get legal help and start an investigation.</p>
          </div>
          <div className="selection-card glass" onClick={() => { setReportType('social'); setStep(1); }} style={{ padding: '3rem', borderRadius: '30px', cursor: 'pointer', textAlign: 'center', transition: 'transform 0.3s' }}>
            <Globe size={48} color="#00d2ff" style={{ marginBottom: '1.5rem' }} />
            <h3>Social Platform</h3>
            <p>Create a formal report to send to apps like Facebook or Instagram to help recover your account.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="report-crime-page fade-in">
      <div className="report-overlay-bg"></div>

      <FadeInSection direction="down">
        <div className="report-page-header">
          <div className="header-icon">
            {reportType === 'social' ? <Globe size={32} /> : <Shield size={32} />}
          </div>
          <h1>{reportType === 'social' ? 'Platform' : 'Police'} <span className="text-gradient">Intelligence Report</span></h1>
        </div>
      </FadeInSection>

      <div className="report-wizard-container">
        <div className="step-tracker">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className={`step-node ${step >= num ? 'active' : ''} ${step > num ? 'completed' : ''}`}>
              <div className="node-circle">{step > num ? <CheckCircle size={18} /> : num}</div>
              <span className="node-label">
                {reportType === 'social'
                  ? (num === 1 ? 'Profile' : num === 2 ? 'Details' : num === 3 ? 'Evidence' : 'Workplace')
                  : (num === 1 ? 'Contact' : num === 2 ? 'Verify' : num === 3 ? 'Details' : 'Confirm')
                }
              </span>
            </div>
          ))}
          <div className="step-line">
            <div className="step-line-progress" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
          </div>
        </div>

        <div className="wizard-card glass">
          {/* SOCIAL PATH */}
          {reportType === 'social' && (
            <>
              {step === 1 && (
                <div className="wizard-step-content">
                  <div className="step-title"><User color="#00d2ff" /><h2>Victim & Platform Profile</h2></div>
                  <div className="form-grid">
                    <div className="input-group"><label>Full Name <span style={{ color: '#ef4444' }}>*</span></label><input type="text" name="victimName" value={formData.victimName} onChange={handleChange} placeholder="Legal Name" required /></div>
                    <div className="input-group"><label>Email <span style={{ color: '#ef4444' }}>*</span></label><input type="email" name="victimEmail" value={formData.victimEmail} onChange={handleChange} placeholder="Contact Email" required /></div>

                    <div className="input-group">
                      <label>Platform <span style={{ color: '#ef4444' }}>*</span></label>
                      <select name="platform" value={formData.platform} onChange={handleChange} required>
                        <option value="">Select Platform...</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Instagram">Instagram</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="X">X (Twitter)</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Telegram">Telegram</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Account Target <span style={{ color: '#ef4444' }}>*</span></label>
                      <input type="text" name="targetAccount" value={formData.targetAccount} onChange={handleChange} placeholder="e.g. @username or Profile URL" required />
                    </div>
                  </div>

                  {formData.platform === 'Others' && (
                    <div className="form-group" style={{ marginTop: '1.2rem' }}>
                      <label>Specify Platform <span style={{ color: '#ef4444' }}>*</span></label>
                      <input type="text" name="otherPlatform" value={formData.otherPlatform} onChange={handleChange} placeholder="e.g. Discord, Snapchat" required />
                    </div>
                  )}
                </div>
              )}
              {step === 2 && (
                <div className="wizard-step-content">
                  <div className="step-title"><AlertTriangle color="#f59e0b" /><h2>Incident Analysis</h2></div>
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label>Intelligence Classification <span style={{ color: '#ef4444' }}>*</span></label>
                    <select name="incidentType" value={formData.incidentType} onChange={handleChange} required>
                      <option value="">Select Classification...</option>
                      <option value="Account Breach / Hacking">Account Breach / Hacking</option>
                      <option value="Cyberbullying / Harassment">Cyberbullying / Harassment</option>
                      <option value="Identity Theft">Identity Theft</option>
                      <option value="Misinformation / Fake News">Misinformation / Fake News</option>
                      <option value="Financial Scam / Phishing">Financial Scam / Phishing</option>
                      <option value="Unauthorized Surveillance">Unauthorized Surveillance</option>
                    </select>
                  </div>
                  <div className="form-group"><label>Incident Narrative <span style={{ color: '#ef4444' }}>*</span></label><textarea name="description" rows="6" value={formData.description} onChange={handleChange} placeholder="Document the adversarial activity in detail..." required /></div>
                </div>
              )}
              {step === 3 && (
                <div className="wizard-step-content">
                  <div className="step-title"><Shield color="#10b981" /><h2>Evidence & Impact</h2></div>
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label>Adversarial Intel (Suspect Handles/Links)</label>
                    <input type="text" name="suspectInfo" value={formData.suspectInfo} onChange={handleChange} placeholder="e.g. @suspect_user, suspicious links" />
                  </div>
                  <div className="form-group">
                    <label>Operational Impact <span style={{ color: '#ef4444' }}>*</span></label>
                    <textarea name="impact" rows="4" value={formData.impact} onChange={handleChange} placeholder="Describe how this event has affected your safety or operations..." required />
                  </div>
                </div>
              )}
              {step === 4 && (
                <div className="wizard-step-content workplace-view">
                  <div className="workplace-header">
                    <div className="step-title"><FileText color="#00d2ff" /><h2>Intelligence Workplace</h2></div>
                    <div className="workplace-actions">
                      <button className="btn-polish" onClick={handleAIPolish} disabled={isPolishing}>{isPolishing ? 'Polishing...' : 'AI Polish'}</button>
                      <button className="btn-copy" onClick={handleCopy}>Copy</button>
                    </div>
                  </div>
                  <textarea className="report-editor" value={generatedReport} onChange={(e) => setGeneratedReport(e.target.value)} />
                  <div className="submission-guide-section glass">
                    <div className="guide-header"><Info size={18} /><h3>How to Report via {formData.platform}</h3></div>
                    <div className="official-channels">
                      <div className="channel"><span>Direct Email:</span><div className="email-actions"><code>{currentGuide.email}</code><button className="btn-mail-app" onClick={handleSendEmail}><Mail size={14} /> Open Mail App</button></div></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* POLICE PATH */}
          {reportType === 'police' && (
            <>
              {step === 1 && (
                <div className="wizard-step-content">
                  <div className="step-title"><User color="#10b981" /><h2>Official Contact Information</h2></div>
                  <div className="form-grid">
                    <div className="input-group"><label>Legal Full Name</label><input type="text" name="victimName" value={policeData.victimName} onChange={handleChange} /></div>
                    <div className="input-group"><label>Direct Email</label><input type="email" name="victimEmail" value={policeData.victimEmail} onChange={handleChange} /></div>
                  </div>
                  <p style={{ marginTop: '1.5rem', color: '#f59e0b', fontSize: '0.85rem' }}>* Police officers will use these details to contact you regarding the investigation.</p>
                </div>
              )}
              {step === 2 && (
                <div className="wizard-step-content">
                  <div className="step-title"><Shield color="#00d2ff" /><h2>Identity Verification</h2></div>

                  <div className="verification-container glass">
                    {!otpSent ? (
                      <div className="verification-prompt">
                        <div className="verify-icon-wrapper">
                          <Mail size={40} className="text-[#00d2ff] animate-pulse" />
                        </div>
                        <h3>Establish Secure Connection</h3>
                        <p>To ensure report integrity, we need to verify your contact address: <strong>{policeData.victimEmail}</strong></p>
                        <button className="btn-primary" onClick={sendOtp} disabled={sendingOtp} style={{ marginTop: '1.5rem', minWidth: '240px' }}>
                          {sendingOtp ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Sparkles size={16} className="spinning" /> Initiating Protocol...
                            </span>
                          ) : 'Authorize Email Dispatch'}
                        </button>
                      </div>
                    ) : (
                      <div className="verification-entry">
                        <div className="verify-icon-wrapper success">
                          {otpVerified ? <CheckCircle size={40} color="#10b981" /> : <Shield size={40} className="text-[#00d2ff]" />}
                        </div>
                        <h3>{otpVerified ? 'Identity Confirmed' : 'Enter Forensic Token'}</h3>
                        <p>A 6-digit verification code has been transmitted to your email.</p>

                        <div className="otp-input-wrapper">
                          <input
                            type="text"
                            maxLength="6"
                            placeholder="000000"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                            disabled={otpVerified}
                            className={`otp-main-input ${otpVerified ? 'verified' : ''}`}
                          />
                        </div>

                        {!otpVerified ? (
                          <button className="btn-primary" onClick={verifyOtp} disabled={verifyingOtp} style={{ marginTop: '1.5rem', width: '100%' }}>
                            {verifyingOtp ? 'Decrypting...' : 'Validate Token'}
                          </button>
                        ) : (
                          <div className="verification-success-badge">
                            <Sparkles size={16} /> Access Granted: Forensic Session Active
                          </div>
                        )}

                        {!otpVerified && (
                          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <button className="btn-link" onClick={() => setOtpSent(false)} style={{ fontSize: '0.8rem' }}>
                              Didn't receive code? Resend
                            </button>
                            <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                              <p style={{ fontSize: '0.75rem', color: '#f59e0b', margin: 0 }}>
                                <Info size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                Check your <strong>Spam or Junk</strong> folder if the code doesn't arrive.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="wizard-step-content">
                  <div className="step-title"><FileText color="#f59e0b" /><h2>Incident Details</h2></div>
                  <div className="form-group"><label>Report Title / Case Subject <span style={{ color: '#ef4444' }}>*</span></label><input type="text" name="title" value={policeData.title} onChange={handleChange} placeholder="e.g. Identity Theft via Social Media" required /></div>

                  <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
                    <div className="input-group">
                      <label>Platform Affected <span style={{ color: '#ef4444' }}>*</span></label>
                      <select name="platform" value={policeData.platform} onChange={handleChange} required>
                        <option value="">Select Platform...</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Instagram">Instagram</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="X">X (Twitter)</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Telegram">Telegram</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Incident Date <span style={{ color: '#ef4444' }}>*</span></label>
                      <input
                        type="date"
                        name="incidentDate"
                        value={policeData.incidentDate}
                        onChange={handleChange}
                        required
                        onClick={(e) => e.target.showPicker?.()}
                        onFocus={(e) => e.target.showPicker?.()}
                      />
                    </div>
                  </div>

                  {policeData.platform === 'Others' && (
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label>Please Specify Platform <span style={{ color: '#ef4444' }}>*</span></label>
                      <input type="text" name="otherPlatform" value={policeData.otherPlatform} onChange={handleChange} placeholder="e.g. Discord, Reddit, etc." required />
                    </div>
                  )}

                  {policeData.platform && (
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label>Platform-Specific Information (Handle/Link) <span style={{ color: '#ef4444' }}>*</span></label>
                      <input type="text" name="platformDetails" value={policeData.platformDetails} onChange={handleChange} placeholder={`e.g. ${policeData.platform === 'WhatsApp' ? 'Phone Number' : 'Profile URL or Username'}`} required />
                    </div>
                  )}

                  <div className="form-group"><label>Full Incident Description <span style={{ color: '#ef4444' }}>*</span></label><textarea name="description" rows="6" value={policeData.description} onChange={handleChange} placeholder="Provide a detailed chronological account..." required /></div>
                </div>
              )}
              {step === 4 && (
                <div className="wizard-step-content">
                  <div className="step-title"><Shield color="#ef4444" /><h2>Final Submission</h2></div>
                  <div className="glass" style={{ padding: '2rem', borderRadius: '15px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <p>By submitting this report, you confirm that all provided information is accurate and that you are the legal owner of the affected assets.</p>
                    <div style={{ marginTop: '1.5rem' }}>
                      <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>Target:</strong> Local Law Enforcement Agency</div>
                      <div style={{ fontSize: '0.9rem' }}><strong>Status:</strong> Awaiting Verified Submission</div>
                    </div>
                  </div>
                  <button
                    className="btn-nav-next"
                    style={{
                      width: '100%',
                      marginTop: '2rem',
                      background: isSubmitting ? '#555' : '#ef4444',
                      color: 'white',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                    onClick={submitPoliceReport}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Transmitting Forensic Data...' : 'Submit Official Police Report'}
                  </button>
                </div>
              )}
              {step === 5 && (
                <div className="wizard-step-content" style={{ textAlign: 'center', padding: '3rem' }}>
                  <CheckCircle size={64} color="#10b981" style={{ marginBottom: '2rem' }} />
                  <h2>Report Successfully Filed</h2>
                  <p>Your intelligence record has been transmitted to the Cyber-Intelligence Division.</p>
                  <button className="btn-primary" onClick={() => navigate('/my-reports')} style={{ marginTop: '2rem' }}>View My Reports</button>
                </div>
              )}
            </>
          )}

          {/* Navigation */}
          {step < 5 && (
            <div className="wizard-footer">
              <div className="wizard-footer-left">
                {step === 1 ? (
                  <button onClick={() => setReportType(null)} className="btn-link-danger">
                    <X size={16} /> Cancel & Change Type
                  </button>
                ) : (
                  <button onClick={handlePrev} className="btn-nav-prev"><ChevronLeft size={18} /> Previous</button>
                )}
              </div>
              <div className="wizard-footer-right">
                {step < 4 && <button onClick={handleNext} className="btn-nav-next">Continue <ChevronRight size={18} /></button>}
                {step === 4 && reportType === 'social' && (
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-nav-next" style={{ background: '#004e92', color: 'white' }} onClick={saveReport}><Shield size={18} /> Save</button>
                    <button className="btn-nav-next success" onClick={handleDownloadDoc}><Download size={18} /> Download .DOC</button>
                    <button className="btn-nav-next" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }} onClick={handlePrint}><FileText size={18} /> Print</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCrime;
