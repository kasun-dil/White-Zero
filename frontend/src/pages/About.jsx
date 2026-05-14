import React, { useState } from 'react';
import { Shield, Target, Users, Search, Cpu, FileText, Layout, CheckCircle, Zap, Globe, MessageSquare, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeInSection from '../components/FadeInSection';
import './PageStyles.css';

const FeatureDetailSection = ({ title, desc, image, color, reverse = false, link }) => (
  <section style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
    gap: '4rem',
    alignItems: 'center',
    marginBottom: '10rem'
  }}>
    {!reverse ? (
      <>
        <FadeInSection direction="right">
          <div style={{ position: 'relative' }}>
            <div className="image-glow-under" style={{ background: color, opacity: 0.1 }}></div>
            <img src={image} alt={title} style={{ width: '100%', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', objectFit: 'cover', height: '400px' }} />
          </div>
        </FadeInSection>
        <FadeInSection direction="left">
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontWeight: '900' }}>{title}</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem' }}>{desc}</p>
          <Link to={link} className="btn-glass" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 2rem' }}>
            EXPLORE MODULE <ArrowRight size={18} />
          </Link>
        </FadeInSection>
      </>
    ) : (
      <>
        <FadeInSection direction="right">
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontWeight: '900' }}>{title}</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem' }}>{desc}</p>
          <Link to={link} className="btn-glass" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 2rem' }}>
            EXPLORE MODULE <ArrowRight size={18} />
          </Link>
        </FadeInSection>
        <FadeInSection direction="left">
          <div style={{ position: 'relative' }}>
            <div className="image-glow-under" style={{ background: color, opacity: 0.1 }}></div>
            <img src={image} alt={title} style={{ width: '100%', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', objectFit: 'cover', height: '400px' }} />
          </div>
        </FadeInSection>
      </>
    )}
  </section>
);

const About = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#05050a', width: '100%', position: 'relative', paddingTop: 0 }}>
      {/* Hero Section */}
      <div className="page-hero" style={{ marginTop: 0 }}>
        <img
          src="https://i.pinimg.com/736x/d6/fd/c8/d6fdc83f651e1c1460625cd25da61cd0.jpg"
          alt="About Hero"
          className="hero-bg-image"
          style={{ opacity: 0.4 }}
        />
        <div className="hero-overlay"></div>
        <div className="hero-content-inner">
          <FadeInSection direction="down">
            <h1>White Zero Framework</h1>
            <p style={{ fontSize: '1.4rem' }}>Architecting the digital frontline of forensic intelligence and OSINT excellence.</p>
          </FadeInSection>
        </div>
      </div>

      <div className="page-container fade-in" style={{ paddingBottom: '120px', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

        {/* Website Description Section */}
        <div style={{
          position: 'relative',
          maxWidth: '1200px',
          margin: '0 auto 8rem',
          borderRadius: '40px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}>
          <img
            src="https://www.shutterstock.com/shutterstock/videos/1097502881/thumb/1.jpg?ip=x480"
            alt="Intelligence Protocol"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }}
          />
          <div style={{
            position: 'relative',
            zIndex: 2,
            padding: '5rem 4rem',
            textAlign: 'center'
          }}>
            <FadeInSection>
              <h2 style={{ fontSize: '1rem', color: '#00d2ff', letterSpacing: '4px', fontWeight: '800', marginBottom: '2rem', textTransform: 'uppercase' }}>The Core Intelligence Protocol</h2>
              <p style={{ fontSize: '1.8rem', lineHeight: '1.6', color: 'white', fontWeight: '300', fontStyle: 'italic' }}>
                "White Zero is a specialized, high-fidelity intelligence framework designed for the modern investigator. We bridge the gap between fragmented digital footprints and actionable forensic evidence, providing a secure, professional environment for OSINT analysis, automated case reporting, and comprehensive security auditing."
              </p>
              <br></br><br></br>

              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.8', fontSize: '1.15rem', maxWidth: '850px', margin: '0 auto' }}>
                Our mission is to foster transparency and digital truth. By combining advanced neural diagnostic tools with courtroom-ready documentation standards, White Zero empowers both independent researchers and official law enforcement agencies to navigate the complexities of the digital landscape with absolute precision and security.
              </p>
            </FadeInSection>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Feature 1: OSINT */}
          <FeatureDetailSection
            title="OSINT Intelligence Search"
            desc="Our primary data harvesting engine. It identifies and tracks digital identities across 20+ social nodes using a signature-verified neural scanner to reveal hidden footprints."
            image="https://cyesec.com/wp-content/uploads/2022/06/social-tips-min.jpg"
            color="#00d2ff"
            link="/osint-trial"
          />

          {/* Feature 2: Forensic Reporting */}
          <FeatureDetailSection
            title="Forensic Case Reporting"
            desc="Transform raw incident data into official, forensic-grade documentation. Our system is engineered for law enforcement standards, ensuring evidence integrity and professional clarity."
            image="https://gendermatters.in/wp-content/uploads/2018/07/Police-Surveillance-Social-Media-Monitoring.jpg"
            color="#10b981"
            reverse={true}
            link="/report-crime"
          />

          {/* Feature 3: AI Security Auditor */}
          <FeatureDetailSection
            title="AI Security Auditor"
            desc="The final layer of defense. A high-fidelity neural diagnostic tool that audits social media security postures with real-time vulnerability mapping and automated hardening recommendations."
            image="https://www.socialchamp.com/blog/wp-content/uploads/2024/03/Content-Blog-Banner_Q1-2024_1125x600_063_Social-Media-Security.png"
            color="#3a7bd5"
            link="/security-auditor"
          />



          {/* Final Tech Blog Section - Last before Footer */}
          <section style={{
            position: 'relative',
            borderRadius: '40px',
            overflow: 'hidden',
            marginBottom: '4rem',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <img
              src="https://fatstacksblog.com/wp-content/uploads/2019/11/Person-writing-article-nov26.jpg"
              alt="Tech Blog Background"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2 }}
            />
            <div style={{
              position: 'relative',
              zIndex: 2,
              padding: '6rem 4rem',
              textAlign: 'center'
            }}>
              <FadeInSection>

                <h2 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.5rem', color: 'white' }}>White Zero Tech Blog</h2>
                <p style={{ maxWidth: '800px', margin: '0 auto 3rem', fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.7' }}>
                  Explore the frontier of digital forensics. Our tech blog features deep-dives into the OSINT methodologies, cybersecurity trends, and neural intelligence research driving the White Zero framework.
                </p>
                <Link to="/articles" className="btn-primary" style={{ padding: '1.2rem 3.5rem', fontSize: '1rem', letterSpacing: '1px' }}>
                  ACCESS TECH ARTICLES <ArrowRight size={20} style={{ marginLeft: '10px' }} />
                </Link>
              </FadeInSection>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default About;
