import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Branches from './pages/Branches';
import Products from './pages/Products';
import Intro from './pages/Intro';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Custom Scroll Restoration so routing transitions scroll cleanly to top
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
  }, [pathname, hash]);
  return null;
}

// Custom scroll-into-view behavior for hash anchors
function ScrollToAnchor() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Wait slightly for DOM to settle (important on mount/routing)
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname, hash]);

  return null;
}

// Premium Scroll Progress Bar Component
function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-55 pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-[#173B8C] via-[#FFC107] to-cyan-500 transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

// Inner wrapper component to support useLocation for navbar/footer conditional visibility checking
function LayoutWrapper() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginRoute = location.pathname === '/login';

  const isAdminTheme = isAdminRoute || isLoginRoute;

  useEffect(() => {
    if (isAdminTheme) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [isAdminTheme]);

  return (
    <div className={`flex flex-col min-h-screen font-sans relative overflow-x-hidden ${isAdminTheme ? 'admin-light-theme bg-[#FFFDF0] text-[#0B1B3D]' : 'site-light-theme bg-[#f7f8f3] text-slate-900'}`} id="application-layout">
      {!isAdminTheme && <ScrollProgressBar />}
      {/* Immersive UI Background 3D Simulation Elements */}
      <div className={`fixed top-[-10%] right-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full blur-[120px] pointer-events-none z-0 ${isAdminTheme ? 'bg-[#C5A043]/10' : 'bg-sky-300/25'}`}></div>
      <div className={`fixed bottom-[-10%] left-[-10%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] rounded-full blur-[100px] pointer-events-none z-0 ${isAdminTheme ? 'bg-[#0B1B3D]/5' : 'bg-amber-200/25'}`}></div>

      {/* We conditionally hide navbar on full-screen admin workspaces */}
      {!isAdminTheme && <Navbar />}
      
      <main className="flex-grow relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/products" element={<Products />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          {/* Legacy fallbacks for safety */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          {/* Default catch-all redirect */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* We conditionally hide footer on administrative dashboards */}
      {!isAdminTheme && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ScrollToAnchor />
      <LayoutWrapper />
    </BrowserRouter>
  );
}
