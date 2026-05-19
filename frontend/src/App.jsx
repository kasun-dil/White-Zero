import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import FeaturesPage from './pages/FeaturesPage';
import Contact from './pages/Contact';
import SecurityAuditor from './pages/SecurityAuditor';
import OSINTDashboard from './pages/OSINTDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import ScrollToTop from './components/ScrollToTop';
import FloatingAI from './components/FloatingAI';
import ReportCrime from './pages/ReportCrime';
import PoliceDashboard from './pages/PoliceDashboard';
import MyReports from './pages/MyReports';
import { AuthProvider } from './context/AuthContext';
import { useLocation } from 'react-router-dom';
import './index.css';
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin' || location.pathname === '/police-dashboard';
  const hideLayout = isAdminPage || location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      <ScrollToTop />
      {!isAdminPage && <Navbar />}
      {!isAdminPage && <FloatingAI />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/osint-trial" element={<OSINTDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/security-auditor" element={<SecurityAuditor />} />
        <Route path="/report-crime" element={<ReportCrime />} />
        <Route path="/police-dashboard" element={<PoliceDashboard />} />
        <Route path="/my-reports" element={<MyReports />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}


function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: 90,
        }}
        toastOptions={{
          style: {
            background: 'rgba(10, 10, 15, 0.95)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 210, 255, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            maxWidth: '450px'
          },
          success: {
            iconTheme: {
              primary: '#00d2ff',
              secondary: '#fff',
            },
            style: {
              border: '1px solid rgba(0, 210, 255, 0.5)',
              boxShadow: '0 0 15px rgba(0, 210, 255, 0.2)'
            }
          },
          error: {
            iconTheme: {
              primary: '#ff3d71',
              secondary: '#fff',
            },
            style: {
              border: '1px solid rgba(255, 61, 113, 0.5)',
              boxShadow: '0 0 15px rgba(255, 61, 113, 0.2)'
            }
          }
        }}
      />
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
