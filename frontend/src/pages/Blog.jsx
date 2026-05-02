import React, { useState } from 'react';
import FadeInSection from '../components/FadeInSection';
import './PageStyles.css';
import { ExternalLink, Shield, Globe, Lock, AlertTriangle, FileText, Cpu, Server, Activity, Terminal, Eye, Database } from 'lucide-react';

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSlide, setActiveSlide] = useState(0);
  const postsPerPage = 12;

  // Slideshow Data - Recent Cyber Attacks
  const slides = [
    {
      title: "Snowflake Cloud Breach",
      subtitle: "MASSIVE DATA EXFILTRATION",
      description: "Over 100 corporate clients targeted in one of the largest cloud security incidents of 2024.",
      image: "https://e0.pxfuel.com/wallpapers/181/417/desktop-wallpaper-cybersecurity-cylanda-the-leader-in-cybersecurity-compliance-and-it-infrastructure-management-cyber-attack.jpg",
      accent: "#00d2ff"
    },
    {
      title: "Supply Chain Alert",
      subtitle: "POLYFILL.IO COMPROMISE",
      description: "Malicious code injected into popular JS library affecting millions of websites globally.",
      image: "https://files.cyberriskalliance.com/wp-content/uploads/2024/04/040324_cyberattack.jpg",
      accent: "#ef4444"
    },
    {
      title: "SolarWinds Reckoning",
      subtitle: "LEGAL PRECEDENT SET",
      description: "SEC lawsuits over cyber disclosures reshape how enterprises report major intrusions.",
      image: "https://www.charlotteitsolutions.com/wp-content/uploads/2026/01/ai-and-cybersecurity-1024x683.jpg",
      accent: "#f59e0b"
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Custom animations for the threat banner
  const bannerStyles = `
    @keyframes ticker {
      0% { transform: translate3d(0, 0, 0); }
      100% { transform: translate3d(-100%, 0, 0); }
    }
    @keyframes pulse-red {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
      70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    .threat-ticker {
      display: inline-block;
      padding-left: 100%;
      animation: ticker 40s linear infinite;
    }
    .threat-banner:hover .threat-ticker {
      animation-play-state: paused;
    }
    .live-dot {
      width: 8px;
      height: 8px;
      background: #ef4444;
      border-radius: 50%;
      display: inline-block;
      margin-right: 8px;
      animation: pulse-red 2s infinite;
    }
    .slide-enter {
      opacity: 0;
      transform: scale(1.1);
    }
    .slide-active {
      opacity: 1;
      transform: scale(1);
      transition: all 1.5s ease-out;
    }
  `;

  const externalBlogs = [
    { title: 'Krebs on Security', category: 'Investigative', excerpt: 'Award-winning investigative journalism on cybercrime, security, and digital privacy.', link: 'https://krebsonsecurity.com/', icon: <Shield size={20} /> },
    { title: 'The Hacker News', category: 'News', excerpt: 'Leading source for the latest cybersecurity news, hacking updates, and vulnerabilities.', link: 'https://thehackernews.com/', icon: <Globe size={20} /> },
    { title: 'Dark Reading', category: 'Enterprise', excerpt: 'Cyber security news and information for IT security professionals focusing on threats.', link: 'https://www.darkreading.com/', icon: <Lock size={20} /> },
    { title: 'Threatpost', category: 'Threat Intel', excerpt: 'Independent news source for IT and business security professionals on vulnerabilities.', link: 'https://threatpost.com/', icon: <AlertTriangle size={20} /> },
    { title: 'Schneier on Security', category: 'Opinion', excerpt: 'Bruce Schneier on security technology, policy, and how they interact with the world.', link: 'https://www.schneier.com/', icon: <FileText size={20} /> },
    { title: 'Unit 42 - Palo Alto', category: 'Research', excerpt: 'Deep-dive threat intelligence research and analysis from leading security firms.', link: 'https://unit42.paloaltonetworks.com/', icon: <Cpu size={20} /> },
    { title: 'Naked Security', category: 'Advice', excerpt: 'Computer security news, advice, and research from the experts at Sophos.', link: 'https://nakedsecurity.sophos.com/', icon: <Activity size={20} /> },
    { title: 'Graham Cluley', category: 'Commentary', excerpt: 'Security news, advice, and opinion from independent security veteran Graham Cluley.', link: 'https://www.grahamcluley.com/', icon: <Terminal size={20} /> },
    { title: 'WeLiveSecurity', category: 'Discovery', excerpt: 'Security news, views, and insight from ESET experts around the world.', link: 'https://www.welivesecurity.com/', icon: <Eye size={20} /> },
    { title: 'SANS ISC', category: 'Analysis', excerpt: 'The SANS Internet Storm Center provides daily analysis of internet threats.', link: 'https://isc.sans.edu/', icon: <Database size={20} /> },
    { title: 'Cybersecurity Insiders', category: 'Community', excerpt: 'A comprehensive source for everything related to cyber security in the enterprise.', link: 'https://www.cybersecurity-insiders.com/', icon: <Server size={20} /> },
    { title: 'SecurityWeek', category: 'Insight', excerpt: 'Providing cyber security news, insights, and analysis for security professionals.', link: 'https://www.securityweek.com/', icon: <Shield size={20} /> },
    { title: 'InfoSecurity Mag', category: 'Trends', excerpt: 'The latest news, trends, and strategy for information security professionals.', link: 'https://www.infosecurity-magazine.com/', icon: <Globe size={20} /> },
    { title: 'Help Net Security', category: 'Technical', excerpt: 'Focusing on information security since 1998, covering technical and policy news.', link: 'https://www.helpnetsecurity.com/', icon: <Lock size={20} /> },
    { title: 'CSO Online', category: 'Strategy', excerpt: 'News, analysis, and strategy on security, business continuity, and risk management.', link: 'https://www.csoonline.com/', icon: <AlertTriangle size={20} /> },
    { title: 'BleepingComputer', category: 'Tech Support', excerpt: 'A premier destination for computer support and the latest technology news.', link: 'https://www.bleepingcomputer.com/', icon: <FileText size={20} /> },
    { title: 'Rapid7 Blog', category: 'Tools', excerpt: 'Security research, data science, and security operations insights from Rapid7.', link: 'https://blog.rapid7.com/', icon: <Cpu size={20} /> },
    { title: 'Mandiant Blog', category: 'Response', excerpt: 'Front-line insights into the latest threat actors and incident response tactics.', link: 'https://www.mandiant.com/resources/blog', icon: <Activity size={20} /> },
    { title: 'Securelist', category: 'Malware', excerpt: 'Kaspersky research into malware, cyber-attacks, and advanced persistent threats.', link: 'https://securelist.com/', icon: <Terminal size={20} /> },
    { title: 'Cisco Talos', category: 'Intelligence', excerpt: 'World-class threat intelligence from the Cisco Talos Security Intelligence Group.', link: 'https://blog.talosintelligence.com/', icon: <Eye size={20} /> },
    { title: 'Google Project Zero', category: 'Exploits', excerpt: 'Team at Google dedicated to finding and patching zero-day vulnerabilities.', link: 'https://googleprojectzero.blogspot.com/', icon: <Database size={20} /> },
    { title: 'Microsoft Security', category: 'Platform', excerpt: 'The latest security news, research, and insights for the Microsoft ecosystem.', link: 'https://www.microsoft.com/en-us/security/blog/', icon: <Server size={20} /> },
    { title: 'AWS Security', category: 'Cloud', excerpt: 'News and updates on cloud security, compliance, and identity from Amazon.', link: 'https://aws.amazon.com/blogs/security/', icon: <Shield size={20} /> },
    { title: 'Cloudflare Blog', category: 'Network', excerpt: 'Exploring the future of a faster, more secure internet and edge computing.', link: 'https://blog.cloudflare.com/', icon: <Globe size={20} /> },
    { title: 'Check Point Res', category: 'Global', excerpt: 'Comprehensive threat intelligence and analysis of global cyber attacks.', link: 'https://research.checkpoint.com/', icon: <Lock size={20} /> },
    { title: 'Trend Micro News', category: 'Defense', excerpt: 'Global cybersecurity research and defense insights from Trend Micro.', link: 'https://www.trendmicro.com/vinfo/us/security/news/', icon: <AlertTriangle size={20} /> },
    { title: 'Fortinet Blog', category: 'Infrastructure', excerpt: 'Insights on the evolving threat landscape and network security strategies.', link: 'https://www.fortinet.com/blog', icon: <FileText size={20} /> },
    { title: 'CrowdStrike Blog', category: 'Endpoint', excerpt: 'Adversary hunting and endpoint protection research from CrowdStrike.', link: 'https://www.crowdstrike.com/blog/', icon: <Cpu size={20} /> },
    { title: 'SentinelOne Blog', category: 'AI Security', excerpt: 'AI-powered autonomous security research and platform updates.', link: 'https://www.sentinelone.com/blog/', icon: <Activity size={20} /> },
    { title: 'Zscaler Blog', category: 'Zero Trust', excerpt: 'Accelerating digital transformation and Zero Trust security adoption.', link: 'https://www.zscaler.com/blogs', icon: <Terminal size={20} /> },
    { title: 'Okta Security', category: 'Identity', excerpt: 'The latest in identity-centric security, IAM, and access management.', link: 'https://www.okta.com/blog/security/', icon: <Eye size={20} /> },
    { title: 'Snyk Blog', category: 'DevSecOps', excerpt: 'Developer-focused security research and secure coding best practices.', link: 'https://snyk.io/blog/', icon: <Database size={20} /> },
    { title: 'Tripwire State', category: 'Compliance', excerpt: 'Security and compliance insights from the State of Security blog.', link: 'https://www.tripwire.com/state-of-security', icon: <Server size={20} /> },
    { title: 'CISA News', category: 'Government', excerpt: 'Official cybersecurity and infrastructure security news from the US Government.', link: 'https://www.cisa.gov/news-events/news', icon: <Shield size={20} /> },
    { title: 'NCSC UK', category: 'National', excerpt: 'National Cyber Security Centre news and guidance from the United Kingdom.', link: 'https://www.ncsc.gov.uk/section/news/news', icon: <Globe size={20} /> },
    { title: 'KnowBe4 Blog', category: 'Awareness', excerpt: 'Security awareness training and social engineering defense research.', link: 'https://blog.knowbe4.com/', icon: <Lock size={20} /> },
    { title: 'Proofpoint Blog', category: 'Email Sec', excerpt: 'Information protection and email security research from Proofpoint.', link: 'https://www.proofpoint.com/us/blog', icon: <AlertTriangle size={20} /> },
    { title: 'Varonis Blog', category: 'Data First', excerpt: 'Data security, insider threat detection, and classification research.', link: 'https://www.varonis.com/blog', icon: <FileText size={20} /> },
    { title: 'Tenable Blog', category: 'Exposure', excerpt: 'Cyber exposure management and vulnerability research from Tenable.', link: 'https://www.tenable.com/blog', icon: <Cpu size={20} /> },
    { title: 'Qualys Blog', category: 'Inventory', excerpt: 'Global IT asset management and vulnerability mitigation research.', link: 'https://blog.qualys.com/', icon: <Activity size={20} /> },
    { title: 'Splunk Security', category: 'Operations', excerpt: 'Security analytics, automation, and orchestration research from Splunk.', link: 'https://www.splunk.com/en_us/blog/security.html', icon: <Terminal size={20} /> },
    { title: 'AlienVault Blog', category: 'OSINT', excerpt: 'Open threat exchange and threat detection insights from AlienVault.', link: 'https://cybersecurity.att.com/blogs/security-essentials', icon: <Eye size={20} /> },
    { title: 'Mimecast Blog', category: 'Resilience', excerpt: 'Cyber resilience and email security strategies from Mimecast.', link: 'https://www.mimecast.com/blog/', icon: <Database size={20} /> },
    { title: 'Netwrix Blog', category: 'Governance', excerpt: 'IT governance and change auditing insights for security professionals.', link: 'https://blog.netwrix.com/', icon: <Server size={20} /> },
    { title: 'Veracode Blog', category: 'AppSec', excerpt: 'Application security testing and static analysis research.', link: 'https://www.veracode.com/blog', icon: <Shield size={20} /> },
    { title: 'Synopsys Blog', category: 'Integrity', excerpt: 'Building trust in software through advanced security analysis.', link: 'https://www.synopsys.com/blogs/software-integrity.html', icon: <Globe size={20} /> },
    { title: 'Sonatype Blog', category: 'Supply Chain', excerpt: 'Software supply chain security and open source governance research.', link: 'https://www.sonatype.com/blog', icon: <Lock size={20} /> },
    { title: 'OWASP Blog', category: 'Standards', excerpt: 'Updates on web application security standards and community projects.', link: 'https://owasp.org/blog/', icon: <AlertTriangle size={20} /> },
    { title: 'Cylance Blog', category: 'Predictive', excerpt: 'Predictive AI-based malware prevention and security research.', link: 'https://blogs.blackberry.com/en/cylance', icon: <FileText size={20} /> },
    { title: 'FireMon Blog', category: 'Network Ops', excerpt: 'Network security policy management and hybrid cloud orchestration.', link: 'https://www.firemon.com/blog/', icon: <Cpu size={20} /> },
    { title: 'LogRhythm Blog', category: 'SIEM', excerpt: 'Log management and SIEM insights for security operation centers.', link: 'https://logrhythm.com/blog/', icon: <Activity size={20} /> },
    { title: 'Exabeam Blog', category: 'Behavioral', excerpt: 'User and entity behavior analytics for threat detection.', link: 'https://www.exabeam.com/blog/', icon: <Terminal size={20} /> }
  ];

  const blogImage = 'https://img.freepik.com/free-photo/abstract-techno-background-with-connecting-dots-lines-circuit-board-texture_1048-5829.jpg?semt=ais_hybrid&w=740&q=80';

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = externalBlogs.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(externalBlogs.length / postsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const recentAttacks = [
    { id: 1, title: 'Change Healthcare Ransomware', impact: 'US Pharmacy Disruption', group: 'BlackCat/ALPHV', severity: 'CRITICAL' },
    { id: 2, title: 'AT&T Data Breach', impact: '73 Million Records Leaked', group: 'Unknown', severity: 'HIGH' },
    { id: 3, title: 'Midnight Blizzard Intrusion', impact: 'Microsoft Corporate Email Breach', group: 'APT29 (Russia)', severity: 'HIGH' },
    { id: 4, title: 'NIST CVE Backlog', impact: 'Record Vulnerability Queue', group: 'N/A', severity: 'MEDIUM' }
  ];

  return (
    <div className="page-container fade-in">
      <style>{bannerStyles}</style>

      <FadeInSection direction="down">
        <div className="page-header" style={{ marginBottom: '4rem' }}>
          <h1>Security <span className="text-gradient">Blog Hub</span></h1>
          <p>Curated insights from {externalBlogs.length} premium global cybersecurity resources.</p>
        </div>
      </FadeInSection>


      <div className="blog-grid" style={{ marginBottom: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {currentPosts.map((post, idx) => {
          const articleNumber = String(indexOfFirstPost + idx + 1).padStart(2, '0');
          return (
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              key={idx}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <FadeInSection direction="up">
                <article className="blog-card glass premium-blog-card" style={{ height: '420px', cursor: 'pointer', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                    <img src={blogImage} alt={post.title} className="blog-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                    {/* Bottom Article Number Overlay */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0, left: 0, right: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(5px)',
                      zIndex: 1,
                      padding: '0.4rem 0',
                      borderTop: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <div style={{
                        fontSize: '1.2rem',
                        fontWeight: '900',
                        color: 'white',
                        textShadow: '0 0 15px rgba(0, 210, 255, 0.6)',
                        letterSpacing: '3px'
                      }}>
                        ARTICLE {articleNumber}
                      </div>
                    </div>

                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.7)', padding: '0.6rem', borderRadius: '12px', color: '#00d2ff', border: '1px solid rgba(0, 210, 255, 0.2)', zIndex: 2 }}>
                      {post.icon}
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '1rem', zIndex: 2 }}>
                      <span className="blog-category" style={{ margin: 0, fontSize: '0.7rem' }}>{post.category}</span>
                    </div>
                  </div>
                  <div className="blog-content" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.2rem', margin: '0 0 1rem 0', color: '#00d2ff', lineHeight: '1.4', fontWeight: '700' }}>{post.title}</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                      {post.excerpt}
                    </p>
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="read-more" style={{ color: '#00d2ff', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Read Article <ExternalLink size={14} />
                      </span>
                    </div>
                  </div>
                </article>
              </FadeInSection>
            </a>
          );
        })}
      </div>

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '5rem' }}>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn-outline"
            style={{ opacity: currentPage === 1 ? 0.3 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', padding: '0.7rem 1.2rem' }}
          >
            Prev
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: currentPage === i + 1 ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: currentPage === i + 1 ? 'black' : 'white',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn-outline"
            style={{ opacity: currentPage === totalPages ? 0.3 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', padding: '0.7rem 1.2rem' }}
          >
            Next
          </button>
        </div>
      )}

      {/* PREMIUM SLIDESHOW BANNER (Moved to bottom) */}
      <FadeInSection direction="up">
        <div style={{
          position: 'relative',
          height: '450px',
          width: '100%',
          borderRadius: '35px',
          overflow: 'hidden',
          marginBottom: '4rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          {slides.map((slide, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: activeSlide === index ? 1 : 0,
                transform: activeSlide === index ? 'scale(1)' : 'scale(1.1)',
                transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: activeSlide === index ? 1 : 0
              }}
            >
              {/* Image Overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to right, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.3) 100%)',
                zIndex: 2
              }}></div>

              <img
                src={slide.image}
                alt={slide.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Slide Content */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '8%',
                transform: 'translateY(-50%)',
                zIndex: 3,
                maxWidth: '600px'
              }}>
                <span style={{
                  color: slide.accent,
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  letterSpacing: '5px',
                  display: 'block',
                  marginBottom: '1rem',
                  opacity: activeSlide === index ? 1 : 0,
                  transform: activeSlide === index ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s ease-out 0.3s'
                }}>
                  {slide.subtitle}
                </span>
                <h1 style={{
                  fontSize: '3.5rem',
                  marginBottom: '1.5rem',
                  lineHeight: '1.1',
                  opacity: activeSlide === index ? 1 : 0,
                  transform: activeSlide === index ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s ease-out 0.5s'
                }}>
                  {slide.title}
                </h1>
                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  marginBottom: '2rem',
                  opacity: activeSlide === index ? 1 : 0,
                  transform: activeSlide === index ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s ease-out 0.7s'
                }}>
                  {slide.description}
                </p>
                <div style={{
                  opacity: activeSlide === index ? 1 : 0,
                  transform: activeSlide === index ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s ease-out 0.9s'
                }}>
                  <button className="btn-primary" style={{ padding: '1rem 2rem', borderRadius: '12px' }}>Check Recent Attacks</button>
                </div>
              </div>
            </div>
          ))}

          {/* Slide Indicators */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            right: '50px',
            display: 'flex',
            gap: '12px',
            zIndex: 4
          }}>
            {slides.map((_, i) => (
              <div
                key={i}
                onClick={() => setActiveSlide(i)}
                style={{
                  width: activeSlide === i ? '40px' : '12px',
                  height: '12px',
                  borderRadius: '10px',
                  background: activeSlide === i ? 'white' : 'rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.5s ease'
                }}
              ></div>
            ))}
          </div>
        </div>
      </FadeInSection>

      <FadeInSection direction="up">
        <div className="glass" style={{ padding: '3rem', borderRadius: '30px', textAlign: 'center', marginBottom: '4rem', border: '1px solid rgba(0, 210, 255, 0.1)' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>Suggest a Security Resource</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Help us expand our hub by suggesting high-quality cybersecurity blogs, research portals, or threat intelligence feeds.
          </p>
          <a href="/contact" className="btn-primary" style={{ textDecoration: 'none', padding: '1rem 2.5rem' }}>Get in Touch</a>
        </div>
      </FadeInSection>
    </div>
  );
};

export default Blog;


