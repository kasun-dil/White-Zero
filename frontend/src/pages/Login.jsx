import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Hexagon, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import FadeInSection from '../components/FadeInSection';
import './PageStyles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = await login(email, password);
    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } else {
      setErrorMsg(res.error);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <FadeInSection direction="up">
        <div className="glass auth-card" style={{ width: '100%', maxWidth: '900px', padding: 'var(--auth-padding, 4rem 5rem)', borderRadius: '30px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Hexagon size={64} className="text-[#00d2ff]" style={{ position: 'absolute' }} />
              <Shield size={32} color="white" style={{ position: 'absolute', zIndex: 1 }} />
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)' }}>Login to access your OSINT dashboard.</p>
          </div>

          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={20} style={{ position: 'absolute', left: '15px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  placeholder="admin@whitezero.com"
                  style={{ paddingLeft: '45px', width: '100%', padding: '0.75rem 0.75rem 0.75rem 45px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={20} style={{ position: 'absolute', left: '15px', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  style={{ paddingLeft: '45px', paddingRight: '45px', width: '100%', padding: '0.75rem 45px 0.75rem 45px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '15px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                marginTop: '1.5rem',
                padding: '1.1rem',
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #004e92, #002f6c)',
                boxShadow: '0 10px 20px rgba(0, 78, 146, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              Sign In
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
            Don't have an account? <Link to="/signup" style={{ color: '#00d2ff', textDecoration: 'none', fontWeight: '600' }}>Create one</Link>
          </p>
        </div>
      </FadeInSection>
    </div>
  );
};

export default Login;
