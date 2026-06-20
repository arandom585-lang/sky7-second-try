import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
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
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
  }, [pathname]);
  return null;
}

// Inner wrapper component to support useLocation for navbar/footer conditional visibility checking
function LayoutWrapper() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginRoute = location.pathname === '/login';
  const isDashboardLayout = isAdminRoute && location.pathname !== '/admin/login'; // support both in case

  const isAdminTheme = isAdminRoute || isLoginRoute;

  return (
    <div className={`flex flex-col min-h-screen font-sans relative overflow-x-hidden ${isAdminTheme ? 'admin-light-theme bg-[#FFFDF0] text-[#0B1B3D]' : 'site-light-theme bg-[#f7f8f3] text-slate-900'}`} id="application-layout">
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
      <LayoutWrapper />
    </BrowserRouter>
  );
}
