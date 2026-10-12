import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import api from "./utils/api";

// Layout components
import Topbar from "./components/layout/Topbar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTopButton from "./components/layout/ScrollToTopButton";

// Auth Context (for Admin CMS)
import { AuthProvider } from "./context/AuthContext";

// Pages (Lazy Loaded)
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const ServiceProvider = lazy(() => import("./pages/ServiceProvider"));
const Booking = lazy(() => import("./pages/Booking"));
const Thanks = lazy(() => import("./pages/Thanks"));
const SpecialRates = lazy(() => import("./pages/SpecialRates"));
const ProductsCatalogPage = lazy(() => import("./pages/ProductsCatalogPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const GasRefillsPage = lazy(() => import("./pages/GasRefillsPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));

// Admin Pages (Lazy Loaded)
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminQuotes = lazy(() => import("./pages/admin/AdminQuotes"));
const AdminContacts = lazy(() => import("./pages/admin/AdminContacts"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));

// Expanded Admin Pages
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminSEO = lazy(() => import("./pages/admin/AdminSEO"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));

// Helper component to scroll window to top on route navigation change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function AppContent() {
  const [showHeader, setShowHeader] = useState(true);
  const [settings, setSettings] = useState(null);
  const lastScrollY = useRef(0);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    // Load pricing data globally when the application boots
    import("./utils/pricing").then((m) => m.loadPricingData());

    // Fetch site settings from backend API
    api.get("/settings")
      .then(res => {
        if (res.data && res.data.success) {
          setSettings(res.data.data);
        }
      })
      .catch(err => console.error("Error loading site settings globally:", err));
  }, []);

  useEffect(() => {
    if (isAdminRoute) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show header at the very top
      if (currentScrollY <= 10) {
        setShowHeader(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Check if scroll difference is significant to avoid jitter
      if (Math.abs(currentScrollY - lastScrollY.current) < 8) {
        return;
      }

      if (currentScrollY > lastScrollY.current) {
        // Scrolling down -> slide header out of view
        setShowHeader(false);
      } else {
        // Scrolling up -> slide header back into view
        showHeader === false && setShowHeader(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showHeader, isAdminRoute]);

  return (
    <>
      <ScrollToTop />
      <div id="app-root-wrapper" className="min-h-screen flex flex-col justify-between bg-white text-slate-800">
        {!isAdminRoute && (
          <div 
            id="app-header-block" 
            className={`sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm transition-transform duration-300 ease-in-out ${
              showHeader ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            {/* Information bar */}
            <Topbar settings={settings} />
            {/* Desktop/Mobile Navigation */}
            <Navbar />
          </div>
        )}

        {/* Main interactive router canvas */}
        <main id="app-main-content" className={`grow ${!isAdminRoute ? 'pb-24 md:pb-0' : ''}`}>
          <Suspense fallback={
            <div className="min-h-[50vh] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/index.htm" element={<Home />} />
              <Route path="/index.html" element={<Home />} />
              <Route path="/index.php" element={<Home />} />
              <Route path="/about.htm" element={<About />} />
              <Route path="/about" element={<About />} />
              
              {/* Product Routes */}
              <Route path="/products" element={<ProductsCatalogPage />} />
              <Route path="/products/:slug" element={<ProductPage />} />
              <Route path="/products/:categorySlug/:slug" element={<ProductPage />} />
              <Route path="/gas-refills" element={<GasRefillsPage />} />

              {/* Service Routes */}
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services.htm" element={<ServicesPage />} />
              <Route path="/services.html" element={<ServicesPage />} />
              <Route path="/bulk-lpg-supply" element={<Navigate to="/services?service=bulk-lpg" replace />} />
              <Route path="/tank-installation" element={<Navigate to="/services?service=tank-install" replace />} />
              <Route path="/lpg-pipeline-fitting" element={<Navigate to="/services?service=pipeline-fitting" replace />} />
              <Route path="/restaurant-kitchen-installation" element={<Navigate to="/services?service=kitchen-install" replace />} />

              <Route path="/contact.htm" element={<Contact />} />
              <Route path="/service-provider.php" element={<ServiceProvider />} />
              <Route path="/booking.php" element={<Booking />} />
              <Route path="/thanks.php" element={<Thanks />} />
              <Route path="/special-rates.php" element={<SpecialRates />} />
              <Route path="/calculator.htm" element={<Navigate to="/products" replace />} />
              <Route path="/calculator.php" element={<Navigate to="/products" replace />} />
              
              {/* Customer Account Routes (Disabled - Direct Guest Checkout) */}
              <Route path="/my-account" element={<Navigate to="/products" replace />} />
              <Route path="/customer/dashboard" element={<Navigate to="/products" replace />} />
              <Route path="/customer/login" element={<Navigate to="/" replace />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
              <Route path="/admin/quotes" element={<AdminLayout><AdminQuotes /></AdminLayout>} />
              <Route path="/admin/contacts" element={<AdminLayout><AdminContacts /></AdminLayout>} />
              <Route path="/admin/testimonials" element={<AdminLayout><AdminTestimonials /></AdminLayout>} />
              <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
              <Route path="/admin/seo" element={<AdminLayout><AdminSEO /></AdminLayout>} />
              <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
              <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />

              {/* Catch all fallback redirects to Home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </main>

        {/* Shared footer section */}
        {!isAdminRoute && <Footer settings={settings} />}
        {!isAdminRoute && <ScrollToTopButton />}
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
