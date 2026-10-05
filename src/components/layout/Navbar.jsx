import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, 
  X, 
  ChevronDown, 
  ArrowUpRight, 
  Globe, 
  MapPin,
  ArrowRight,
  Building2,
  Users,
  Zap,
  ShieldCheck,
  Truck,
  HeartHandshake,
  HelpCircle
} from "lucide-react";
import { NAVIGATION } from "../../constants";
import Logo from "./Logo";
import { motion, AnimatePresence } from "motion/react";
import { ALL_COUNTRIES } from "../../constants";
import api from "../../utils/api";

const ABOUT_ICON_MAP = {
  overview: Building2,
  director: Users,
  benefits: Zap,
  safety: ShieldCheck,
  delivery: Truck,
  csr: HeartHandshake,
  guide: HelpCircle,
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [locationItems, setLocationItems] = useState([]);
  const [uniqueCityItems, setUniqueCityItems] = useState([]);
  const [countryItems, setCountryItems] = useState(ALL_COUNTRIES.slice(0, 9));
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    api.get('/countries')
      .then(res => {
        if (res.data && res.data.data) {
          setCountryItems(res.data.data.slice(0, 9));
        }
      })
      .catch(err => console.error("Error fetching countries in navbar:", err));

    api.get('/locations')
      .then(res => {
        if (res.data && res.data.data) {
          const locs = res.data.data;
          setLocationItems(locs.slice(0, 8)); // Top 8 locations
          
          const seen = new Set();
          const items = [];
          for (const l of locs) {
            if (!seen.has(l.city) && items.length < 8) {
              seen.add(l.city);
              items.push({ city: l.city, slug: l.slug, name: l.name });
            }
          }
          setUniqueCityItems(items);
        }
      })
      .catch(err => console.error("Error fetching locations in navbar:", err));
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [location]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setOpenDropdown(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
        setOpenDropdown(null);
      }
    };
    if (isOpen || openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, openDropdown]);

  const toggleMobileDropdown = (label) => {
    setOpenDropdown(prev => (prev === label ? null : label));
  };

  const closeAll = () => {
    setIsOpen(false);
    setOpenDropdown(null);
  };

  // Nav item animation variants
  const navContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -6 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } }
  };

  return (
    <nav id="navbar-container" ref={navRef} className="bg-white relative z-50 shadow-xs border-b border-slate-100">
      <div id="navbar-inner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="navbar-header" className="flex justify-between items-center min-h-20 py-3">

          {/* Logo */}
          <Link id="navbar-logo-link" to="/" onClick={closeAll}
            className="group hover:scale-[1.02] transition-transform duration-300 flex-shrink-0">
            <Logo />
          </Link>

          {/* Desktop Links */}
          <motion.div id="navbar-desktop-menu" variants={navContainerVariants}
            initial="hidden" animate="show" className="hidden lg:flex items-center gap-1.5">
            {NAVIGATION.links.map((link, idx) => {
              const hasDropdown = (link.dropdown && link.dropdown.length > 0) || link.isMegaMenu;

              return (
                <motion.div key={link.path + idx} variants={navItemVariants} className="relative group">
                  <NavLink id={`nav-link-${idx}`} to={link.path}
                    className={({ isActive }) =>
                      `relative overflow-hidden group/nav flex items-center px-4 py-2 rounded-xl text-sm font-bold tracking-tight transition-colors duration-300 font-sans z-10 ${
                        isActive ? "text-white" : "text-slate-800 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className={`absolute inset-x-0 bottom-0 w-full transition-all duration-300 ease-out -z-10 bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] ${isActive ? "h-full shadow-md shadow-[#BC0202]/25" : "h-0 group-hover/nav:h-full"}`} />
                        {link.label}
                        {hasDropdown && <ChevronDown size={14} className="ml-1 opacity-70 group-hover/nav:rotate-180 transition-transform duration-200" />}
                      </>
                    )}
                  </NavLink>

                  {/* ── Desktop Dropdown: Exact 4-Column Mega Menu for Products ── */}
                  {link.isMegaMenu && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[840px] xl:w-[920px] bg-white shadow-2xl rounded-2xl border border-slate-200/90 border-t-[3px] border-t-[#BC0202] opacity-0 invisible translate-y-2 scale-98 origin-top group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 transition-all duration-200 ease-out z-50 p-6">
                      <div className="grid grid-cols-4 gap-6">
                        {link.columns?.map((col, cIdx) => (
                          <div key={cIdx} className="space-y-3.5">
                            {/* Column Header */}
                            <Link
                              to={col.path}
                              className="flex items-center gap-1.5 pb-2.5 border-b border-slate-200/90 text-slate-900 hover:text-[#BC0202] transition-colors group/header"
                            >
                              <span className="text-[#BC0202] text-[9px]">▼</span>
                              <span className="text-[13px] font-extrabold font-display tracking-tight leading-snug">
                                {col.title}
                              </span>
                            </Link>

                            {/* Column Item Links */}
                            <div className="space-y-2.5">
                              {col.items?.map((item, iIdx) => (
                                <Link
                                  key={iIdx}
                                  to={item.path}
                                  className="flex items-center gap-2 text-[12px] font-medium text-slate-700 hover:text-[#BC0202] hover:translate-x-1 transition-all duration-150 group/item"
                                >
                                  <span className="text-[#BC0202] text-[10px] opacity-75 group-hover/item:opacity-100">▸</span>
                                  <span className="leading-snug">{item.label}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Desktop Dropdown: Custom Premium About Dropdown (matches screenshot) ── */}
                  {link.isAboutMenu && (
                    <div className="absolute top-full left-0 mt-2.5 w-72 bg-white shadow-2xl rounded-2xl border border-slate-200/90 border-t-[3px] border-t-[#BC0202] opacity-0 invisible translate-y-2 scale-98 origin-top group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 transition-all duration-200 ease-out z-50 p-3.5">
                      {/* Dropdown Header */}
                      <div className="flex items-center gap-2 pb-2.5 mb-2 border-b border-slate-100 px-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#BC0202]" />
                        <span className="text-xs font-black tracking-wider uppercase text-slate-900 font-display">
                          CONCH GAS LTD
                        </span>
                      </div>

                      {/* Dropdown Items */}
                      <div className="space-y-1">
                        {link.dropdown?.map((dropItem, dIdx) => {
                          const IconComp = ABOUT_ICON_MAP[dropItem.id] || Building2;
                          return (
                            <Link
                              key={dIdx}
                              to={dropItem.path}
                              onClick={closeAll}
                              className="group/item flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#BC0202] hover:bg-red-50/70 hover:border-l-4 hover:border-l-[#BC0202] transition-all duration-150 border-l-4 border-l-transparent"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-[#BC0202] text-[11px] font-black opacity-75 group-hover/item:opacity-100">
                                  ›
                                </span>
                                <IconComp size={15} className="text-slate-500 group-hover/item:text-[#BC0202] transition-colors" />
                                <span className="tracking-tight">{dropItem.label}</span>
                              </div>
                              <ArrowRight size={12} className="opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 text-[#BC0202] transition-all" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── Desktop Dropdown: Standard Dropdowns ── */}
                  {!link.isMegaMenu && !link.isAboutMenu && link.dropdown && (
                    <div className="absolute top-full left-0 mt-2 w-52 bg-white shadow-xl rounded-xl border border-slate-100 opacity-0 invisible translate-y-2 scale-95 origin-top group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 transition-all duration-300 ease-out z-50 flex flex-col py-2">
                      {link.dropdown.map((dropItem, dIdx) => (
                        <Link key={dIdx} to={dropItem.path}
                          className="px-4 py-2.5 text-sm font-semibold hover:text-white hover:bg-gradient-to-r hover:from-[#830000] hover:to-[#BC0202] transition-all duration-200 text-slate-800">
                          {dropItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Mobile Hamburger Button */}
          <div id="navbar-mobile-toggle" className="flex items-center lg:hidden">
            <motion.button
              id="navbar-mobile-button"
              onClick={() => { setIsOpen(o => !o); setOpenDropdown(null); }}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl text-[#BC0202] hover:bg-red-50 transition-colors duration-200 cursor-pointer"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.92 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.35 }}>
                    <X size={22} />
                  </motion.span>
                ) : (
                  <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.35 }}>
                    <Menu size={22} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          Mobile Menu Panel
      ═══════════════════════════════════════ */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="navbar-mobile-panel"
            key="mobile-menu"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden fixed inset-x-0 top-[80px] bottom-0 bg-white border-t border-slate-100 z-40 flex flex-col"
            style={{ height: "calc(100vh - 80px)", overflowY: "auto" }}
          >
            <div className="px-3 py-4 space-y-2 flex-grow">
              {NAVIGATION.links.map((link, idx) => {
                const isDropOpen = openDropdown === link.label;
                const hasDropdown = (link.dropdown && link.dropdown.length > 0) || link.isMegaMenu;

                return (
                  <div key={link.path + idx}>
                    {/* Main nav row */}
                    {hasDropdown ? (
                      <button
                        id={`mobile-nav-link-${idx}`}
                        onClick={() => toggleMobileDropdown(link.label)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                          isDropOpen
                            ? "bg-gradient-to-r from-[#830000]/10 to-[#FF0000]/10 text-[#BC0202] border border-red-200"
                            : "text-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {link.label}
                        </span>
                        <motion.span animate={{ rotate: isDropOpen ? 180 : 0 }} transition={{ duration: 0.22 }}>
                          <ChevronDown size={16} className="opacity-70" />
                        </motion.span>
                      </button>
                    ) : (
                      <NavLink
                        id={`mobile-nav-link-${idx}`}
                        to={link.path}
                        onClick={closeAll}
                        className={({ isActive }) =>
                          `flex items-center w-full px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] text-white shadow-md shadow-[#BC0202]/25"
                              : "text-slate-800 hover:bg-slate-50"
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    )}

                    {/* ── Mobile Mega Menu for Products ── */}
                    {link.isMegaMenu && (
                      <AnimatePresence initial={false}>
                        {isDropOpen && (
                          <motion.div
                            key={`mobile-mega-${idx}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="mt-1.5 ml-2 mr-1 mb-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                              {link.columns?.map((col, cIdx) => (
                                <div key={cIdx} className="space-y-2">
                                  <Link
                                    to={col.path}
                                    onClick={closeAll}
                                    className="flex items-center gap-1.5 text-xs font-black text-[#BC0202] uppercase tracking-wider pb-1 border-b border-slate-200"
                                  >
                                    <span>▼</span>
                                    <span>{col.title}</span>
                                  </Link>
                                  <div className="grid grid-cols-1 gap-1.5 pl-2">
                                    {col.items?.map((item, iIdx) => (
                                      <Link
                                        key={iIdx}
                                        to={item.path}
                                        onClick={closeAll}
                                        className="flex items-center gap-2 py-1 text-xs font-semibold text-slate-700 hover:text-[#BC0202]"
                                      >
                                        <span className="text-[#BC0202] text-[10px]">▸</span>
                                        <span>{item.label}</span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}

                    {/* ── Mobile About Menu ── */}
                    {link.isAboutMenu && (
                      <AnimatePresence initial={false}>
                        {isDropOpen && (
                          <motion.div
                            key={`mobile-about-${idx}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="mt-1.5 ml-2 mr-1 mb-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                              <div className="flex items-center gap-2 pb-2 mb-1 border-b border-slate-200/80 px-1">
                                <span className="w-2 h-2 rounded-full bg-[#BC0202]" />
                                <span className="text-[11px] font-black tracking-wider uppercase text-slate-800">
                                  CONCH GAS LTD
                                </span>
                              </div>
                              {link.dropdown?.map((item, dIdx) => {
                                const IconComp = ABOUT_ICON_MAP[item.id] || Building2;
                                return (
                                  <Link
                                    key={dIdx}
                                    to={item.path}
                                    onClick={closeAll}
                                    className="flex items-center justify-between px-3 py-2.5 bg-white hover:bg-red-50 rounded-xl border border-slate-200/70 transition-colors shadow-2xs"
                                  >
                                    <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                                      <span className="text-[#BC0202] text-[10px] font-black">›</span>
                                      <IconComp size={14} className="text-[#BC0202]" />
                                      <span>{item.label}</span>
                                    </div>
                                    <ArrowRight size={12} className="text-slate-400" />
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}

                    {/* ── Mobile Standard Dropdown Menu ── */}
                    {!link.isMegaMenu && !link.isAboutMenu && link.dropdown && (
                      <AnimatePresence initial={false}>
                        {isDropOpen && (
                          <motion.div
                            key={`mobile-drop-${idx}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="mt-1.5 ml-3 mr-1 mb-1">
                              <div className="grid grid-cols-1 gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                {link.dropdown.map((item, dIdx) => (
                                  <Link
                                    key={dIdx}
                                    to={item.path}
                                    onClick={closeAll}
                                    className="flex items-center justify-between px-3 py-2.5 bg-white hover:bg-gradient-to-r hover:from-[#830000] hover:to-[#BC0202] border border-slate-100 hover:border-transparent rounded-lg group/card transition-all duration-200"
                                  >
                                    <span className="text-[11px] font-bold text-slate-800 group-hover/card:text-white transition-colors leading-snug">
                                      {item.label}
                                    </span>
                                    <ArrowUpRight size={12} className="text-slate-300 group-hover/card:text-white flex-shrink-0 ml-1 transition-colors" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeAll}
            className="lg:hidden fixed inset-0 top-[80px] bg-slate-900/30 z-30 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>
    </nav>
  );
}
