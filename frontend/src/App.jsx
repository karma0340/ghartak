import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/landing/Hero';
import { Services } from './components/landing/Services';
import { HowItWorks } from './components/landing/HowItWorks';
import { InteractivePreview } from './components/landing/InteractivePreview';
import { TrustStats } from './components/landing/TrustStats';
import { PopularItems } from './components/landing/PopularItems';
import { Testimonials } from './components/landing/Testimonials';
import { FinalCTA } from './components/landing/FinalCTA';
import { FoodPage } from './components/landing/FoodPage';
import { GroceryPage } from './components/landing/GroceryPage';
import { RidePage } from './components/landing/RidePage';
import { LoginPage } from './components/landing/LoginPage';
import { CartPage } from './components/landing/CartPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { LiveRideProvider } from './context/LiveRideContext';
import { GlobalRideNotifications } from './components/ride/GlobalRideNotifications';
import { RoleGuard } from './components/auth/RoleGuard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DriverRegistration } from './components/driver/DriverRegistration';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { ToastProvider } from './context/ToastContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const HomePage = () => (
  <>
    <div id="home">
      <Hero />
    </div>
    <div id="services">
      <Services />
    </div>
    <HowItWorks />
    <div id="preview" className="relative z-10">
      <InteractivePreview />
    </div>
    <TrustStats />
    <div className="relative z-10">
      <PopularItems />
    </div>
    <Testimonials />
    <FinalCTA />
  </>
);

function App() {
  return (
    <AuthProvider>
      <LiveRideProvider>
        <CartProvider>
          <ToastProvider>
            <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen bg-brand-light font-sans text-gray-900 overflow-x-hidden w-full selection:bg-brand-orange selection:text-white">
              <Header />
              <GlobalRideNotifications />
              <main className="flex-grow">
              <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/food" element={<FoodPage />} />
              <Route path="/grocery" element={<GroceryPage />} />
              <Route path="/ride" element={<RidePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/register-driver" element={<DriverRegistration />} />
              
              <Route element={<RoleGuard allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              <Route element={<RoleGuard allowedRoles={['driver']} />}>
                <Route path="/driver" element={<DriverDashboard />} />
              </Route>
            </Routes>
            </main>

            <Footer />
          </div>
            </Router>
          </ToastProvider>
        </CartProvider>
      </LiveRideProvider>
    </AuthProvider>
  );
}

export default App;
