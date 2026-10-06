import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  ChevronDown, 
  Menu, 
  X, 
  User, 
  Flame, 
  ArrowRight,
  Building2,
  Users,
  Zap,
  ShieldCheck,
  Truck,
  HeartHandshake,
  HelpCircle,
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TOP_BAR, NAVIGATION } from "../../constants";
import { useAuth } from "../../context/AuthContext";

const ABOUT_ICON_MAP = {
  overview: Building2,
  director: Users,
  benefits: Zap,
  safety: ShieldCheck,
  delivery: Truck,
  csr: HeartHandshake,
  guide: HelpCircle,
};

export default function Header({ settings }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const headerRef = useRef(null);
  const { user, isLoggedIn, isAdmin, openAuthModal } = useAuth();

  // Dynamic values with fallbacks
  const phoneVal = settings?.phone || TOP_BAR.phone.number;
  const phoneHref = settings?.phone 
    ? `tel:${settings.phone.replace(/[^0-9+]/g, "")}` 
    : TOP_BAR.phone.href;

  const whatsappVal = settings?.whatsapp || TOP_BAR.whatsapp.number;
  const whatsappHref = settings?.whatsapp 
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}` 
    : TOP_BAR.whatsapp.href;

  const emailVal = settings?.email || TOP_BAR.email.address;
  const emailHref = settings?.email 
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${settings.email}` 
    : TOP_BAR.email.href;

  const workingHoursVal = settings?.workingHours || "Mon - Sat: 8:00 AM - 8:00 PM";

  // Handle scroll to add elevation and backdrop adjustment
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setMobileExpandedSection(null);
  }, [location]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Extract navigation links
  const aboutLink = NAVIGATION.links.find(l => l.isAboutMenu);
  const productsLink = NAVIGATION.links.find(l => l.isMegaMenu);

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-3 sm:px-6 lg:px-8 pt-2.5 sm:pt-3.5 pointer-events-none transition-all duration-300">
      
      {/* Floating Glassmorphic Container */}
      <div 
        ref={headerRef}
        className={`mx-auto max-w-7xl rounded-2xl md:rounded-3xl border border-white/70 bg-white/85 backdrop-blur-xl pointer-events-auto transition-all duration-300 ${
          isScrolled 
            ? "shadow-xl shadow-slate-900/10 bg-white/95 border-slate-200/90" 
            : "shadow-[0_8px_32px_0_rgba(188,2,2,0.09)] hover:shadow-[0_12px_36px_0_rgba(188,2,2,0.13)]"
        }`}
      >
        
        {/* ════════════════════ 1. TOPBAR (Desktop Slim Info Row) ════════════════════ */}
        <div className="hidden md:flex items-center justify-between px-6 py-2 border-b border-slate-200/50 text-[11.5px] font-semibold text-slate-600 font-sans">
          
          {/* Left Contacts */}
          <div className="flex items-center space-x-5">
            <a 
              href={phoneHref} 
              className="flex items-center space-x-1.5 hover:text-[#BC0202] transition-colors group"
            >
              <Phone className="w-3.5 h-3.5 text-[#BC0202] group-hover:scale-110 transition-transform" />
              <span>{phoneVal}</span>
            </a>
            
            <a 
              href={emailHref} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 hover:text-[#BC0202] transition-colors group"
            >
              <Mail className="w-3.5 h-3.5 text-[#BC0202] group-hover:scale-110 transition-transform" />
              <span>{emailVal}</span>
            </a>

            <a 
              href={whatsappHref} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 hover:text-[#BC0202] transition-colors group"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#BC0202] group-hover:scale-110 transition-transform" />
              <span className="hidden xl:inline">{whatsappVal}</span>
              <span className="xl:hidden">WhatsApp</span>
            </a>
          </div>

          {/* Right Hours & Location */}
          <div className="flex items-center space-x-5">
            <div className="flex items-center space-x-1.5 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-[#BC0202]" />
              <span>{workingHoursVal}</span>
            </div>
            
            <div className="flex items-center space-x-1.5 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-[#BC0202]" />
              <span>Plot 155, Kira Road, Kampala, Uganda</span>
            </div>
          </div>
        </div>

        {/* ════════════════════ 2. MAIN NAVBAR (Centered Logo Layout) ════════════════════ */}
        <nav className="relative flex items-center justify-between px-4 sm:px-6 py-3 md:py-2.5">
          
          {/* ── Left Wing Navigation (Desktop Only) ── */}
          <div className="hidden lg:flex items-center justify-end space-x-6 xl:space-x-7 flex-1 pr-6 xl:pr-10">
            
            {/* 1. About Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenDropdown("about")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button 
                onClick={() => setOpenDropdown(openDropdown === "about" ? null : "about")}
                className="flex items-center space-x-1.5 py-2 text-sm font-bold text-slate-800 hover:text-[#BC0202] transition-colors cursor-pointer group"
              >
                <span>About</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-[#BC0202] transition-transform duration-200 ${openDropdown === "about" ? "rotate-180 text-[#BC0202]" : ""}`} />
              </button>
              
              <AnimatePresence>
                {openDropdown === "about" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-full right-0 mt-1 w-72 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200/90 border-t-[3px] border-t-[#BC0202] p-3 z-50"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-100 px-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#BC0202]" />
                      <span className="text-[11px] font-black tracking-wider uppercase text-slate-900 font-display">
                        CONCH GAS LTD
                      </span>
                    </div>

                    {/* Links */}
                    <div className="space-y-1">
                      {aboutLink?.dropdown?.map((item, idx) => {
                        const IconComp = ABOUT_ICON_MAP[item.id] || Building2;
                        return (
                          <Link
                            key={idx}
                            to={item.path}
                            onClick={() => setOpenDropdown(null)}
                            className="group/item flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#BC0202] hover:bg-red-50/70 hover:border-l-4 hover:border-l-[#BC0202] transition-all duration-150 border-l-4 border-l-transparent"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-[#BC0202] text-[11px] font-black opacity-75 group-hover/item:opacity-100">
                                ›
                              </span>
                              <IconComp size={15} className="text-slate-500 group-hover/item:text-[#BC0202] transition-colors" />
                              <span className="tracking-tight">{item.label}</span>
                            </div>
                            <ArrowRight size={12} className="opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 text-[#BC0202] transition-all" />
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Products Mega Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenDropdown("products")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button 
                onClick={() => setOpenDropdown(openDropdown === "products" ? null : "products")}
                className="flex items-center space-x-1.5 py-2 text-sm font-bold text-slate-800 hover:text-[#BC0202] transition-colors cursor-pointer group"
              >
                <span>Products</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-[#BC0202] transition-transform duration-200 ${openDropdown === "products" ? "rotate-180 text-[#BC0202]" : ""}`} />
              </button>

              <AnimatePresence>
                {openDropdown === "products" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-full -left-20 xl:-left-12 mt-1 w-[800px] xl:w-[880px] rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200/90 border-t-[3px] border-t-[#BC0202] p-6 z-50"
                  >
                    <div className="grid grid-cols-4 gap-6">
                      {productsLink?.columns?.map((col, cIdx) => (
                        <div key={cIdx} className="space-y-3">
                          {/* Column Header */}
                          <Link
                            to={col.path}
                            onClick={() => setOpenDropdown(null)}
                            className="flex items-center gap-1.5 pb-2 border-b border-slate-200/90 text-slate-900 hover:text-[#BC0202] transition-colors group/header"
                          >
                            <span className="text-[#BC0202] text-[9px]">▼</span>
                            <span className="text-xs font-black uppercase font-display tracking-tight leading-snug">
                              {col.title}
                            </span>
                          </Link>

                          {/* Column Items */}
                          <div className="space-y-2">
                            {col.items?.map((item, iIdx) => (
                              <Link
                                key={iIdx}
                                to={item.path}
                                onClick={() => setOpenDropdown(null)}
                                className="flex items-center gap-2 text-[12px] font-semibold text-slate-600 hover:text-[#BC0202] hover:translate-x-1 transition-all duration-150 group/item"
                              >
                                <span className="text-[#BC0202] text-[10px] opacity-75 group-hover/item:opacity-100">▸</span>
                                <span className="leading-snug">{item.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Gas Refills Link */}
            <NavLink 
              to="/gas-refills" 
              className={({ isActive }) =>
                `text-sm font-bold tracking-tight transition-colors relative py-2 ${
                  isActive ? "text-[#BC0202]" : "text-slate-800 hover:text-[#BC0202]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>Gas Refills</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#BC0202] shadow-xs shadow-red-500" />
                  )}
                </>
              )}
            </NavLink>

          </div>

          {/* ── Centered Logo (Desktop & Mobile Absolute Layout) ── */}
          <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2 z-20 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group select-none">
              
              {/* Glowing Flame Badge */}
              <div className="relative bg-gradient-to-br from-[#830000] via-[#BC0202] to-[#FF0000] p-2 sm:p-2.5 rounded-2xl shadow-md shadow-red-600/30 transform group-hover:scale-105 transition-transform duration-300">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                <div className="absolute inset-0 rounded-2xl border border-white/40 pointer-events-none" />
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col text-left">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 font-display leading-tight uppercase">
                  CONCH <span className="text-[#BC0202]">GAS</span>
                </span>
                <span className="text-[8.5px] sm:text-[9.5px] font-extrabold tracking-widest text-slate-500 uppercase leading-none">
                  LPG & Industrial Gases
                </span>
              </div>
            </Link>
          </div>

          {/* ── Right Wing Navigation (Desktop Only) ── */}
          <div className="hidden lg:flex items-center justify-start space-x-6 xl:space-x-7 flex-1 pl-6 xl:pl-10">
            
            {/* 1. New Connections */}
            <NavLink 
              to="/new-connections" 
              className={({ isActive }) =>
                `text-sm font-bold tracking-tight transition-colors relative py-2 ${
                  isActive ? "text-[#BC0202]" : "text-slate-800 hover:text-[#BC0202]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>New Connections</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#BC0202] shadow-xs shadow-red-500" />
                  )}
                </>
              )}
            </NavLink>

            {/* 2. Services */}
            <NavLink 
              to="/services" 
              className={({ isActive }) =>
                `text-sm font-bold tracking-tight transition-colors relative py-2 ${
                  isActive ? "text-[#BC0202]" : "text-slate-800 hover:text-[#BC0202]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>Services</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#BC0202] shadow-xs shadow-red-500" />
                  )}
                </>
              )}
            </NavLink>

            {/* 3. Contact Us */}
            <NavLink 
              to="/contact.htm" 
              className={({ isActive }) =>
                `text-sm font-bold tracking-tight transition-colors relative py-2 ${
                  isActive ? "text-[#BC0202]" : "text-slate-800 hover:text-[#BC0202]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>Contact</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#BC0202] shadow-xs shadow-red-500" />
                  )}
                </>
              )}
            </NavLink>

            {/* 4. Glowing Customer Auth CTA Button */}
            {isLoggedIn ? (
              <Link
                to={isAdmin ? "/admin/dashboard" : "/my-account"}
                className="relative inline-flex items-center justify-center px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider text-white overflow-hidden group shadow-[0_4px_16px_rgba(188,2,2,0.25)] hover:shadow-[0_4px_22px_rgba(255,0,0,0.4)] hover:scale-102 active:scale-98 transition-all"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000]" />
                <User className="w-3.5 h-3.5 mr-1.5 relative z-10" />
                <span className="relative z-10">{user?.name?.split(" ")[0] || "My Account"}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="relative inline-flex items-center justify-center px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider text-white overflow-hidden group shadow-[0_4px_16px_rgba(188,2,2,0.25)] hover:shadow-[0_4px_22px_rgba(255,0,0,0.4)] hover:scale-102 active:scale-98 transition-all cursor-pointer"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000]" />
                <User className="w-3.5 h-3.5 mr-1.5 relative z-10" />
                <span className="relative z-10">Login / Register</span>
              </button>
            )}

          </div>

          {/* ── Mobile Hamburger Toggle Button ── */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-800 hover:text-[#BC0202] hover:bg-red-50 transition-colors cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-[#BC0202]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </nav>
      </div>

      {/* ════════════════════ 3. MOBILE SLIDE-OVER DRAWER ════════════════════ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 pointer-events-auto flex justify-end">
            
            {/* Backdrop Blur Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Drawer Body */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative w-80 max-w-[85vw] bg-white/95 backdrop-blur-2xl h-full shadow-2xl p-6 flex flex-col justify-between border-l border-white/20 overflow-y-auto"
            >
              <div>
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#830000] to-[#BC0202] flex items-center justify-center text-white shadow-xs">
                      <Flame size={16} />
                    </div>
                    <span className="text-base font-black tracking-tight text-slate-900 uppercase font-display">
                      CONCH <span className="text-[#BC0202]">GAS</span>
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="p-1.5 text-slate-500 hover:text-[#BC0202] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="mt-5 space-y-2 font-sans">
                  
                  {/* Home */}
                  <NavLink
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive ? "bg-red-50 text-[#BC0202]" : "text-slate-800 hover:bg-slate-50"
                      }`
                    }
                  >
                    Home
                  </NavLink>

                  {/* About Accordion */}
                  <div className="space-y-1">
                    <button
                      onClick={() => setMobileExpandedSection(mobileExpandedSection === "about" ? null : "about")}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <span>About Us</span>
                      <ChevronDown size={16} className={`transition-transform duration-200 ${mobileExpandedSection === "about" ? "rotate-180 text-[#BC0202]" : "text-slate-400"}`} />
                    </button>
                    <AnimatePresence>
                      {mobileExpandedSection === "about" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-3 pr-1 space-y-1 border-l-2 border-red-200 ml-3.5 my-1"
                        >
                          {aboutLink?.dropdown?.map((item, idx) => (
                            <Link
                              key={idx}
                              to={item.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block py-1.5 px-2 text-xs font-semibold text-slate-600 hover:text-[#BC0202]"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Products Accordion */}
                  <div className="space-y-1">
                    <button
                      onClick={() => setMobileExpandedSection(mobileExpandedSection === "products" ? null : "products")}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <span>Products</span>
                      <ChevronDown size={16} className={`transition-transform duration-200 ${mobileExpandedSection === "products" ? "rotate-180 text-[#BC0202]" : "text-slate-400"}`} />
                    </button>
                    <AnimatePresence>
                      {mobileExpandedSection === "products" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-3 pr-1 space-y-1 border-l-2 border-red-200 ml-3.5 my-1"
                        >
                          {productsLink?.columns?.map((col, cIdx) => (
                            <div key={cIdx} className="py-1">
                              <Link
                                to={col.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-[11px] font-black uppercase text-[#BC0202] py-0.5"
                              >
                                {col.title}
                              </Link>
                              <div className="pl-2 space-y-1 mt-0.5">
                                {col.items?.map((subItem, sIdx) => (
                                  <Link
                                    key={sIdx}
                                    to={subItem.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-xs font-medium text-slate-600 hover:text-[#BC0202]"
                                  >
                                    {subItem.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Gas Refills */}
                  <NavLink
                    to="/gas-refills"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive ? "bg-red-50 text-[#BC0202]" : "text-slate-800 hover:bg-slate-50"
                      }`
                    }
                  >
                    Gas Refills
                  </NavLink>

                  {/* New Connections */}
                  <NavLink
                    to="/new-connections"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive ? "bg-red-50 text-[#BC0202]" : "text-slate-800 hover:bg-slate-50"
                      }`
                    }
                  >
                    New Connection
                  </NavLink>

                  {/* Services */}
                  <NavLink
                    to="/services"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive ? "bg-red-50 text-[#BC0202]" : "text-slate-800 hover:bg-slate-50"
                      }`
                    }
                  >
                    Services
                  </NavLink>

                  {/* Contact Us */}
                  <NavLink
                    to="/contact.htm"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive ? "bg-red-50 text-[#BC0202]" : "text-slate-800 hover:bg-slate-50"
                      }`
                    }
                  >
                    Contact Us
                  </NavLink>

                </div>
              </div>

              {/* Bottom Section inside Drawer */}
              <div className="pt-6 border-t border-slate-200/80 space-y-3">
                <a
                  href={phoneHref}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-red-200 text-xs font-bold text-[#BC0202] hover:bg-red-50 transition-colors"
                >
                  <Phone size={14} />
                  <span>{phoneVal}</span>
                </a>

                {isLoggedIn ? (
                  <Link
                    to={isAdmin ? "/admin/dashboard" : "/my-account"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-600/30"
                  >
                    <User size={15} />
                    <span>{user?.name?.split(" ")[0] || "My Account"}</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); openAuthModal("login"); }}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-600/30 cursor-pointer"
                  >
                    <User size={15} />
                    <span>Login / Register</span>
                  </button>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </header>
  );
}
