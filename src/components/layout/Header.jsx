import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  Phone, 
  Mail, 
  Clock, 
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
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const { user, isLoggedIn, isAdmin, openAuthModal } = useAuth();

  // Dynamic values
  const phoneHref = settings?.phone 
    ? `tel:${settings.phone.replace(/[^0-9+]/g, "")}` 
    : TOP_BAR.phone.href;
  const phoneDisplay = settings?.phone || TOP_BAR.phone.number;

  const whatsappHref = settings?.whatsapp 
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}` 
    : TOP_BAR.whatsapp.href;

  const emailHref = settings?.email 
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${settings.email}` 
    : TOP_BAR.email.href;
  const emailDisplay = settings?.email || TOP_BAR.email.address;

  const workingHoursVal = settings?.workingHours || "Mon - Sat 08:00 - 20:00";

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setMobileExpandedSection(null);
  }, [location]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const aboutLink = NAVIGATION.links.find(l => l.isAboutMenu);
  const productsLink = NAVIGATION.links.find(l => l.isMegaMenu);

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-3 sm:px-6 lg:px-8 pt-2.5 sm:pt-3 pointer-events-none transition-all duration-300">
      <div ref={headerRef} className="mx-auto max-w-6xl pointer-events-auto">
        
        {/* ════════════════════ 1. TOP CIRCULAR ICONS ROW (Exact Match Image 1) ════════════════════ */}
        <div className="hidden md:flex items-center justify-between px-3 pb-2 text-xs font-sans">
          
          {/* Top Left: Phone & Message Circular Pills */}
          <div className="flex items-center gap-2">
            <a
              href={phoneHref}
              className="w-8 h-8 rounded-full bg-white/70 hover:bg-white border border-white/80 shadow-xs flex items-center justify-center text-[#BC0202] hover:scale-105 transition-all"
              title={`Call Us: ${phoneDisplay}`}
            >
              <Phone size={13} className="text-[#BC0202]" />
            </a>
            
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/70 hover:bg-white border border-white/80 shadow-xs flex items-center justify-center text-[#BC0202] hover:scale-105 transition-all"
              title="Chat on WhatsApp"
            >
              <MessageCircle size={13} className="text-[#BC0202]" />
            </a>
          </div>

          {/* Top Right: Email, Clock, and 'Login in' Pill */}
          <div className="flex items-center gap-2">
            <a
              href={emailHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/70 hover:bg-white border border-white/80 shadow-xs flex items-center justify-center text-[#BC0202] hover:scale-105 transition-all"
              title={`Email: ${emailDisplay}`}
            >
              <Mail size={13} className="text-[#BC0202]" />
            </a>

            <div
              className="w-8 h-8 rounded-full bg-white/70 border border-white/80 shadow-xs flex items-center justify-center text-[#BC0202]"
              title={`Working Hours: ${workingHoursVal}`}
            >
              <Clock size={13} className="text-[#BC0202]" />
            </div>

            {isLoggedIn ? (
              <Link
                to={isAdmin ? "/admin/dashboard" : "/my-account"}
                className="flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-white/80 hover:bg-white border border-white/90 shadow-xs text-xs font-bold text-slate-700 hover:text-[#BC0202] hover:scale-102 transition-all"
              >
                <User size={13} className="text-slate-600" />
                <span>{user?.name?.split(" ")[0] || "Account"}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-white/80 hover:bg-white border border-white/90 shadow-xs text-xs font-bold text-slate-700 hover:text-[#BC0202] hover:scale-102 transition-all cursor-pointer"
              >
                <User size={13} className="text-slate-600" />
                <span>Login in</span>
              </button>
            )}
          </div>
        </div>

        {/* ════════════════════ 2. MAIN GLASSMORPHIC CAPSULE (Exact Match Image 1) ════════════════════ */}
        <div className="relative rounded-2xl md:rounded-3xl bg-white/55 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.09)] transition-all duration-300">
          
          {/* Desktop Navigation */}
          <div className="hidden lg:grid grid-cols-12 items-center px-6 py-2.5 min-h-[64px]">
            
            {/* ── Left Wing (5 cols) ── */}
            <div className="col-span-5 flex items-center justify-end gap-8 pr-8 font-sans text-sm font-semibold text-slate-800">
              
              {/* About Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setOpenDropdown("about")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  onClick={() => setOpenDropdown(openDropdown === "about" ? null : "about")}
                  className="flex items-center gap-1 py-1 hover:text-[#BC0202] transition-colors cursor-pointer"
                >
                  <span>About</span>
                </button>

                <AnimatePresence>
                  {openDropdown === "about" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-72 rounded-2xl bg-white/95 backdrop-blur-2xl shadow-2xl border border-slate-200/90 border-t-[3px] border-t-[#BC0202] p-3 z-50 text-left"
                    >
                      <div className="flex items-center gap-2 pb-2 mb-1.5 border-b border-slate-100 px-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#BC0202]" />
                        <span className="text-[11px] font-black tracking-wider uppercase text-slate-900 font-display">
                          CONCH GAS LTD
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        {aboutLink?.dropdown?.map((item, idx) => {
                          const IconComp = ABOUT_ICON_MAP[item.id] || Building2;
                          return (
                            <Link
                              key={idx}
                              to={item.path}
                              onClick={() => setOpenDropdown(null)}
                              className="group/item flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#BC0202] hover:bg-red-50/70 transition-all"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-[#BC0202] text-[10px] font-black opacity-75">›</span>
                                <IconComp size={14} className="text-slate-500 group-hover/item:text-[#BC0202]" />
                                <span className="tracking-tight">{item.label}</span>
                              </div>
                              <ArrowRight size={11} className="opacity-0 group-hover/item:opacity-100 text-[#BC0202] transition-all" />
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Products Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setOpenDropdown("products")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  onClick={() => setOpenDropdown(openDropdown === "products" ? null : "products")}
                  className="flex items-center gap-1 py-1 hover:text-[#BC0202] transition-colors cursor-pointer group"
                >
                  <span>Products</span>
                  <ChevronDown size={13} className={`text-slate-400 group-hover:text-[#BC0202] transition-transform duration-200 ${openDropdown === "products" ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === "products" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full -left-12 mt-2 w-[820px] rounded-2xl bg-white/95 backdrop-blur-2xl shadow-2xl border border-slate-200/90 border-t-[3px] border-t-[#BC0202] p-6 z-50 text-left"
                    >
                      <div className="grid grid-cols-4 gap-6">
                        {productsLink?.columns?.map((col, cIdx) => (
                          <div key={cIdx} className="space-y-3">
                            <Link
                              to={col.path}
                              onClick={() => setOpenDropdown(null)}
                              className="flex items-center gap-1.5 pb-2 border-b border-slate-200/90 text-slate-900 hover:text-[#BC0202] transition-colors"
                            >
                              <span className="text-[#BC0202] text-[9px]">▼</span>
                              <span className="text-xs font-black uppercase font-display tracking-tight leading-snug">
                                {col.title}
                              </span>
                            </Link>

                            <div className="space-y-2">
                              {col.items?.map((item, iIdx) => (
                                <Link
                                  key={iIdx}
                                  to={item.path}
                                  onClick={() => setOpenDropdown(null)}
                                  className="flex items-center gap-2 text-[12px] font-semibold text-slate-600 hover:text-[#BC0202] hover:translate-x-0.5 transition-all"
                                >
                                  <span className="text-[#BC0202] text-[10px] opacity-75">▸</span>
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

              {/* Gas Refills */}
              <NavLink
                to="/gas-refills"
                className={({ isActive }) =>
                  `py-1 transition-colors ${isActive ? "text-[#BC0202]" : "hover:text-[#BC0202]"}`
                }
              >
                Gas Refills
              </NavLink>

            </div>

            {/* ── Center Logo Badge (2 cols - Cutout Circle style with C GAS) ── */}
            <div className="col-span-2 flex items-center justify-center relative">
              <Link to="/" className="flex flex-col items-center justify-center group -my-4 z-20 select-none">
                <div className="w-[66px] h-[66px] rounded-full bg-white/95 backdrop-blur-md shadow-lg shadow-black/8 border-2 border-white/90 flex flex-col items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <img
                    src="/logo.webp"
                    alt="C GAS Logo"
                    className="w-7 h-7 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/logo.png";
                    }}
                  />
                  <span className="text-[10px] font-black text-[#BC0202] tracking-wider uppercase leading-none mt-1 font-display">
                    C GAS
                  </span>
                </div>
              </Link>
            </div>

            {/* ── Right Wing (5 cols) ── */}
            <div className="col-span-5 flex items-center justify-start gap-8 pl-8 font-sans text-sm font-semibold text-slate-800">
              
              {/* New Connections */}
              <NavLink
                to="/new-connections"
                className={({ isActive }) =>
                  `py-1 transition-colors ${isActive ? "text-[#BC0202]" : "hover:text-[#BC0202]"}`
                }
              >
                New Connections
              </NavLink>

              {/* Services */}
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  `py-1 transition-colors ${isActive ? "text-[#BC0202]" : "hover:text-[#BC0202]"}`
                }
              >
                Services
              </NavLink>

              {/* Mint/Green Bordered 'Login' Pill Button (Exact Match Image 1) */}
              <button
                type="button"
                onClick={() => {
                  if (isLoggedIn) {
                    navigate(isAdmin ? "/admin/dashboard" : "/my-account");
                  } else {
                    openAuthModal("login");
                  }
                }}
                className="ml-auto px-5 py-1.5 rounded-full bg-white/70 hover:bg-white text-slate-800 hover:text-[#BC0202] font-semibold text-xs border border-emerald-400/80 hover:border-emerald-500 shadow-xs hover:shadow-[0_0_12px_rgba(52,211,153,0.35)] transition-all cursor-pointer"
              >
                {isLoggedIn ? (user?.name?.split(" ")[0] || "Account") : "Login"}
              </button>

            </div>

          </div>

          {/* ── Mobile Header Bar ── */}
          <div className="flex lg:hidden items-center justify-between px-4 py-2.5">
            
            {/* Mobile Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-white flex items-center justify-center">
                <img src="/logo.webp" alt="C GAS" className="w-5 h-5 object-contain" />
              </div>
              <span className="text-sm font-black tracking-wider text-slate-900 font-display">
                C <span className="text-[#BC0202]">GAS</span>
              </span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-800 hover:text-[#BC0202] hover:bg-white/50 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#BC0202]" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* ════════════════════ 3. MOBILE SLIDE-OVER DRAWER ════════════════════ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 pointer-events-auto flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative w-80 max-w-[85vw] bg-white/95 backdrop-blur-2xl h-full shadow-2xl p-6 flex flex-col justify-between border-l border-white/20 overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <img src="/logo.webp" alt="C GAS" className="w-6 h-6 object-contain" />
                    <span className="text-sm font-black tracking-tight text-slate-900 font-display uppercase">
                      CONCH <span className="text-[#BC0202]">GAS</span>
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="p-1.5 text-slate-500 hover:text-[#BC0202] hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-4 space-y-2 font-sans">
                  <NavLink
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-3.5 py-2.5 rounded-xl text-sm font-bold ${
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
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 cursor-pointer"
                    >
                      <span>About</span>
                      <ChevronDown size={15} className={`transition-transform duration-200 ${mobileExpandedSection === "about" ? "rotate-180 text-[#BC0202]" : "text-slate-400"}`} />
                    </button>
                    <AnimatePresence>
                      {mobileExpandedSection === "about" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-3 space-y-1 border-l-2 border-red-200 ml-3.5 my-1"
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
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 cursor-pointer"
                    >
                      <span>Products</span>
                      <ChevronDown size={15} className={`transition-transform duration-200 ${mobileExpandedSection === "products" ? "rotate-180 text-[#BC0202]" : "text-slate-400"}`} />
                    </button>
                    <AnimatePresence>
                      {mobileExpandedSection === "products" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-3 space-y-1 border-l-2 border-red-200 ml-3.5 my-1"
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
                      `block px-3.5 py-2.5 rounded-xl text-sm font-bold ${
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
                      `block px-3.5 py-2.5 rounded-xl text-sm font-bold ${
                        isActive ? "bg-red-50 text-[#BC0202]" : "text-slate-800 hover:bg-slate-50"
                      }`
                    }
                  >
                    New Connections
                  </NavLink>

                  {/* Services */}
                  <NavLink
                    to="/services"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-3.5 py-2.5 rounded-xl text-sm font-bold ${
                        isActive ? "bg-red-50 text-[#BC0202]" : "text-slate-800 hover:bg-slate-50"
                      }`
                    }
                  >
                    Services
                  </NavLink>
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="pt-5 border-t border-slate-200/80 space-y-3">
                <a
                  href={phoneHref}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-red-200 text-xs font-bold text-[#BC0202] hover:bg-red-50 transition-colors"
                >
                  <Phone size={13} />
                  <span>{phoneDisplay}</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (isLoggedIn) {
                      navigate(isAdmin ? "/admin/dashboard" : "/my-account");
                    } else {
                      openAuthModal("login");
                    }
                  }}
                  className="w-full py-2.5 rounded-full bg-white text-slate-800 font-semibold text-xs border border-emerald-400 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <User size={14} />
                  <span>{isLoggedIn ? (user?.name?.split(" ")[0] || "Account") : "Login"}</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </header>
  );
}
