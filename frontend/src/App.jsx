import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import FeaturesPage from './pages/FeaturesPage';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import ContentSentinel from './pages/ContentSentinel';
import ReportAssistant from './pages/ReportAssistant';
import QABot from './pages/QABot';
import OSINTDashboard from './pages/OSINTDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import ScrollToTop from './components/ScrollToTop';
import FloatingAI from './components/FloatingAI';
import IntelligenceLab from './pages/IntelligenceLab';
import ReportCrime from './pages/ReportCrime';
import PoliceDashboard from './pages/PoliceDashboard';
import MyReports from './pages/MyReports';
import { AuthProvider } from './context/AuthContext';
import { useLocation } from 'react-router-dom';
import './index.css';

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin' || location.pathname === '/police-dashboard';
  const hideLayout = isAdminPage || location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      <ScrollToTop />
      {!isAdminPage && <Navbar />}
      {!isAdminPage && <FloatingAI />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/osint-trial" element={<OSINTDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/content-sentinel" element={<ContentSentinel />} />
        <Route path="/report-assistant" element={<ReportAssistant />} />
        <Route path="/qa-bot" element={<QABot />} />
        <Route path="/intelligence-lab" element={<IntelligenceLab />} />
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
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
