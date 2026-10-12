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
  HelpCircle,
  Search
} from "lucide-react";
import { NAVIGATION } from "../../constants";
import Logo from "./Logo";
import { motion, AnimatePresence } from "motion/react";
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
  const [dynamicMegaMenu, setDynamicMegaMenu] = useState(null);
  const [allProductsList, setAllProductsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const searchDropdownRef = useRef(null);

  const handleDesktopMenuEnter = (label) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredMenu(label);
  };

  const handleDesktopMenuLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMenu(null);
    }, 300);
  };

  // Dynamically load categories and products to populate Products Mega-Menu and Search
  useEffect(() => {
    Promise.all([
      api.get("/categories"),
      api.get("/products")
    ]).then(([catRes, prodRes]) => {
      if (catRes.data?.success && prodRes.data?.success) {
        const cats = (catRes.data.data || []).filter(c => c.isActive !== false);
        const prods = (prodRes.data.data || []).filter(p => p.isActive !== false);
        setAllProductsList(prods);

        if (cats.length > 0) {
          const dynamicColumns = cats.map(cat => {
            const catProds = prods.filter(p => 
              (p.categorySlug === cat.slug || String(p.category) === String(cat._id) || (p.categoryName && p.categoryName.toLowerCase() === cat.name.toLowerCase()))
            );
            return {
              title: cat.name,
              slug: cat.slug,
              path: `/products?category=${cat.slug}`,
              totalCount: catProds.length,
              hasMore: catProds.length > 4,
              items: catProds.slice(0, 4).map(p => ({
                label: p.title || p.name,
                path: `/products/${p.slug}`
              }))
            };
          });
          setDynamicMegaMenu(dynamicColumns);
        } else {
          setDynamicMegaMenu([]);
        }
      }
    }).catch(err => {
      console.debug("Navbar dynamic load error:", err);
      setDynamicMegaMenu([]);
    });
  }, []);

  // Filter products for search auto-suggest
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length >= 1) {
      const matched = allProductsList.filter(p => {
        const t = (p.title || p.name || "").toLowerCase();
        const c = (p.categoryName || p.categorySlug || "").toLowerCase();
        return t.includes(q) || c.includes(q);
      }).slice(0, 5);
      setSearchResults(matched);
      setShowSuggestions(true);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, allProductsList]);

  // Click outside listener for search suggestions dropdown
  useEffect(() => {
    const handleClickOutsideSearch = (e) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => document.removeEventListener("mousedown", handleClickOutsideSearch);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/products");
    }
    setIsOpen(false);
  };

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
    setHoveredMenu(null);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  }, [location]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setOpenDropdown(null);
        setHoveredMenu(null);
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
      <div id="navbar-inner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div id="navbar-header" className="flex items-center justify-between min-h-20 py-3 relative">

          {/* Logo */}
          <Link id="navbar-logo-link" to="/" onClick={closeAll}
            className="group hover:scale-[1.02] transition-transform duration-300 flex-shrink-0 z-10">
            <Logo />
          </Link>

          {/* Desktop Links - Centered */}
          <motion.div id="navbar-desktop-menu" variants={navContainerVariants}
            initial="hidden" animate="show" className="hidden lg:flex items-center justify-center flex-1 mx-2 xl:mx-6 gap-1 xl:gap-2">
            {(NAVIGATION?.links || NAVIGATION?.main || []).map((link, idx) => {
              const hasDropdown = (link.dropdown && link.dropdown.length > 0) || link.isMegaMenu;
              const isDropdownOpen = hoveredMenu === link.label;

              return (
                <motion.div
                  key={link.path + idx}
                  variants={navItemVariants}
                  className={`group ${link.isMegaMenu ? "" : "relative"}`}
                  onMouseEnter={() => hasDropdown && handleDesktopMenuEnter(link.label)}
                  onMouseLeave={() => hasDropdown && handleDesktopMenuLeave()}
                >
                  <NavLink
                    id={`nav-link-${idx}`}
                    to={link.path}
                    className={({ isActive }) =>
                      `relative overflow-hidden group/nav flex items-center px-3 xl:px-4 py-2 rounded-xl text-[13px] xl:text-sm font-bold tracking-tight transition-colors duration-300 font-sans z-10 ${
                        isActive || isDropdownOpen ? "text-white" : "text-slate-800 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`absolute inset-x-0 bottom-0 w-full transition-all duration-300 ease-out -z-10 bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] ${
                            isActive || isDropdownOpen ? "h-full shadow-md shadow-[#BC0202]/25" : "h-0 group-hover/nav:h-full"
                          }`}
                        />
                        {link.label}
                        {hasDropdown && (
                          <ChevronDown
                            size={14}
                            className={`ml-1 opacity-70 transition-transform duration-200 ${
                              isDropdownOpen ? "rotate-180" : "group-hover/nav:rotate-180"
                            }`}
                          />
                        )}
                      </>
                    )}
                  </NavLink>

                  {/* ── Desktop Dropdown: Dynamic Mega Menu for Products ── */}
                  {link.isMegaMenu && (
                    <div
                      onMouseEnter={() => handleDesktopMenuEnter(link.label)}
                      onMouseLeave={handleDesktopMenuLeave}
                      className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 w-max max-w-[95vw] transition-all duration-200 ease-out z-50 before:absolute before:-top-6 before:inset-x-0 before:h-8 before:content-[''] before:z-50 ${
                        isDropdownOpen
                          ? "opacity-100 visible translate-y-0 scale-100 pointer-events-auto"
                          : "opacity-0 invisible translate-y-2 scale-98 pointer-events-none"
                      }`}
                    >
                      <div className="bg-white shadow-2xl rounded-2xl border border-slate-200/90 border-t-[3px] border-t-[#BC0202] p-6 max-h-[85vh] overflow-y-auto">
                        {dynamicMegaMenu && dynamicMegaMenu.length > 0 ? (
                          <div className={`grid gap-6 ${
                            dynamicMegaMenu.length === 1 ? "grid-cols-1 min-w-[260px]" :
                            dynamicMegaMenu.length === 2 ? "grid-cols-2 min-w-[520px]" :
                            dynamicMegaMenu.length === 3 ? "grid-cols-3 min-w-[750px]" :
                            dynamicMegaMenu.length === 4 ? "grid-cols-4 w-[880px] xl:w-[940px]" :
                            "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-[920px] xl:w-[1100px]"
                          }`}>
                            {dynamicMegaMenu.map((col, cIdx) => (
                              <div key={col.slug || cIdx} className="space-y-3 min-w-[170px]">
                                {/* Column Header */}
                                <Link
                                  to={col.path}
                                  onClick={() => setHoveredMenu(null)}
                                  className="flex items-center gap-1.5 pb-2 border-b border-slate-200/90 text-slate-900 hover:text-[#BC0202] transition-colors group/header"
                                >
                                  <span className="text-[#BC0202] text-[9px]">▼</span>
                                  <span className="text-[13px] font-extrabold font-display tracking-tight leading-snug uppercase">
                                    {col.title}
                                  </span>
                                </Link>

                                {/* Column Item Links (Top 4 products) */}
                                <div className="space-y-2">
                                  {col.items?.map((item, iIdx) => (
                                    <Link
                                      key={iIdx}
                                      to={item.path}
                                      onClick={() => setHoveredMenu(null)}
                                      className="flex items-center gap-2 text-[12px] font-medium text-slate-700 hover:text-[#BC0202] hover:translate-x-1 transition-all duration-150 group/item"
                                    >
                                      <span className="text-[#BC0202] text-[10px] opacity-75 group-hover/item:opacity-100">▸</span>
                                      <span className="leading-snug line-clamp-1">{item.label}</span>
                                    </Link>
                                  ))}

                                  {col.items?.length === 0 && (
                                    <p className="text-[11px] text-slate-400 italic">No products yet</p>
                                  )}

                                  {/* View More if category has more than 4 products */}
                                  {col.hasMore && (
                                    <Link
                                      to={col.path}
                                      onClick={() => setHoveredMenu(null)}
                                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#BC0202] hover:text-[#830000] pt-1 hover:translate-x-1 transition-all group/more"
                                    >
                                      <span>View More</span>
                                      <ArrowRight size={11} className="transition-transform group-hover/more:translate-x-0.5" />
                                    </Link>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-6 px-8 text-center text-xs text-slate-500 font-medium">
                            No products found
                          </div>
                        )}

                        {/* Mega Menu Footer Link */}
                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-slate-400">
                            Certified Cylinder & Industrial Supply in Uganda
                          </span>
                          <Link
                            to="/products"
                            onClick={() => setHoveredMenu(null)}
                            className="inline-flex items-center gap-1.5 text-xs font-black text-[#BC0202] hover:text-[#830000] uppercase tracking-wider transition-colors"
                          >
                            <span>View All Products</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Desktop Dropdown: Custom Premium About Dropdown (matches screenshot) ── */}
                  {link.isAboutMenu && (
                    <div
                      onMouseEnter={() => handleDesktopMenuEnter(link.label)}
                      onMouseLeave={handleDesktopMenuLeave}
                      className={`absolute top-full left-0 pt-3 w-72 transition-all duration-200 ease-out z-50 before:absolute before:-top-6 before:inset-x-0 before:h-8 before:content-[''] before:z-50 ${
                        isDropdownOpen
                          ? "opacity-100 visible translate-y-0 scale-100 pointer-events-auto"
                          : "opacity-0 invisible translate-y-2 scale-98 pointer-events-none"
                      }`}
                    >
                      <div className="bg-white shadow-2xl rounded-2xl border border-slate-200/90 border-t-[3px] border-t-[#BC0202] p-3.5">
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
                                onClick={() => { closeAll(); setHoveredMenu(null); }}
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
                    </div>
                  )}

                  {/* ── Desktop Dropdown: Standard Dropdowns ── */}
                  {!link.isMegaMenu && !link.isAboutMenu && link.dropdown && (
                    <div
                      onMouseEnter={() => handleDesktopMenuEnter(link.label)}
                      onMouseLeave={handleDesktopMenuLeave}
                      className={`absolute top-full left-0 pt-3 w-52 transition-all duration-200 ease-out z-50 before:absolute before:-top-6 before:inset-x-0 before:h-8 before:content-[''] before:z-50 ${
                        isDropdownOpen
                          ? "opacity-100 visible translate-y-0 scale-100 pointer-events-auto"
                          : "opacity-0 invisible translate-y-2 scale-98 pointer-events-none"
                      }`}
                    >
                      <div className="bg-white shadow-xl rounded-xl border border-slate-100 flex flex-col py-2">
                        {link.dropdown.map((dropItem, dIdx) => (
                          <Link
                            key={dIdx}
                            to={dropItem.path}
                            onClick={() => setHoveredMenu(null)}
                            className="px-4 py-2.5 text-sm font-semibold hover:text-white hover:bg-gradient-to-r hover:from-[#830000] hover:to-[#BC0202] transition-all duration-200 text-slate-800"
                          >
                            {dropItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right Action: Search Bar (Desktop) - Replaces Order Gas button */}
          <div id="navbar-desktop-search" ref={searchDropdownRef} className="hidden lg:flex items-center shrink-0 relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="relative w-44 xl:w-56 focus-within:w-60 xl:focus-within:w-64 transition-all duration-300">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (searchQuery.trim()) setShowSuggestions(true); }}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-7 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-[#BC0202] rounded-full text-xs font-medium text-slate-800 placeholder-slate-400 outline-none shadow-2xs transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(""); setShowSuggestions(false); }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    aria-label="Clear search"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                aria-label="Submit search"
                className="ml-2 w-8 h-8 rounded-full bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] hover:brightness-110 text-white flex items-center justify-center shadow-xs transition-all cursor-pointer shrink-0 active:scale-95"
              >
                <Search size={13} strokeWidth={2.5} />
              </button>
            </form>

            {/* Live Search Auto-suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 divide-y divide-slate-100"
                >
                  <div className="px-3.5 py-2 bg-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span>Matching Products ({searchResults.length})</span>
                    <button
                      onClick={() => setShowSuggestions(false)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {searchResults.map((item) => {
                      const imgUrl = (item.images && item.images[0]) || item.imageUrl || "/conch_cylinders_range.png";
                      return (
                        <Link
                          key={item._id || item.slug}
                          to={`/products/${item.slug}`}
                          onClick={() => { setShowSuggestions(false); setSearchQuery(""); }}
                          className="flex items-center gap-3 p-2.5 hover:bg-red-50/60 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-slate-100 p-1 flex items-center justify-center shrink-0 border border-slate-200/60">
                            <img
                              src={imgUrl}
                              alt={item.title || item.name}
                              className="w-full h-full object-contain"
                              onError={(e) => { e.currentTarget.src = "/conch_cylinders_range.png"; }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 group-hover:text-[#BC0202] truncate transition-colors">
                              {item.title || item.name}
                            </p>
                            <p className="text-[11px] font-black text-[#BC0202]">
                              UGX {Number(item.price || 0).toLocaleString()}
                            </p>
                          </div>
                          <ArrowRight size={13} className="text-slate-300 group-hover:text-[#BC0202] shrink-0 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      );
                    })}
                  </div>

                  <div className="p-2 bg-slate-50">
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full py-2 px-3 text-center text-xs font-black text-[#BC0202] hover:bg-red-50 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>View all results in Catalog</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Right Controls: Search button & Hamburger */}
          <div id="navbar-mobile-toggle" className="flex items-center gap-1.5 lg:hidden">
            <Link
              to="/products"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-700 hover:text-[#BC0202] hover:bg-red-50 transition-colors"
              aria-label="Search Products"
            >
              <Search size={18} />
            </Link>

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
            <div className="px-3 py-4 space-y-3 flex-grow">
              
              {/* Mobile Search Bar inside Drawer */}
              <form onSubmit={handleSearchSubmit} className="relative flex items-center mb-2">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gas cylinders, stoves..."
                  className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-[#BC0202] outline-none shadow-2xs"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-gradient-to-r from-[#830000] to-[#BC0202] text-white flex items-center justify-center cursor-pointer shadow-xs"
                >
                  <Search size={12} />
                </button>
              </form>
              {(NAVIGATION?.links || NAVIGATION?.main || []).map((link, idx) => {
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
                              {dynamicMegaMenu && dynamicMegaMenu.length > 0 ? (
                                dynamicMegaMenu.map((col, cIdx) => (
                                  <div key={col.slug || cIdx} className="space-y-2">
                                    <Link
                                      to={col.path}
                                      onClick={closeAll}
                                      className="flex items-center justify-between text-xs font-black text-[#BC0202] uppercase tracking-wider pb-1 border-b border-slate-200"
                                    >
                                      <div className="flex items-center gap-1.5">
                                        <span>▼</span>
                                        <span>{col.title}</span>
                                      </div>
                                      {col.totalCount > 0 && (
                                        <span className="text-[10px] text-slate-400 font-normal">({col.totalCount})</span>
                                      )}
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
                                          <span className="truncate">{item.label}</span>
                                        </Link>
                                      ))}
                                      {col.hasMore && (
                                        <Link
                                          to={col.path}
                                          onClick={closeAll}
                                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#BC0202] hover:text-[#830000] py-1 pl-4"
                                        >
                                          <span>View More →</span>
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-slate-400 italic p-2">No products found</p>
                              )}

                              <div className="pt-2 border-t border-slate-200">
                                <Link
                                  to="/products"
                                  onClick={closeAll}
                                  className="w-full py-2 px-3 bg-white rounded-xl border border-slate-200 text-center text-xs font-black text-[#BC0202] flex items-center justify-center gap-1.5 uppercase tracking-wider"
                                >
                                  <span>View All Products in Catalog</span>
                                  <ArrowRight size={12} />
                                </Link>
                              </div>
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
