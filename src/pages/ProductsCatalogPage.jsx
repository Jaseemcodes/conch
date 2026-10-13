import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { 
  Flame, 
  Package, 
  ChevronRight,
  ShoppingBag,
  MessageSquare,
  Search,
  SlidersHorizontal,
  Loader2
} from "lucide-react";
import { usePageSEO } from "../utils/seo";
import api from "../utils/api";

export default function ProductsCatalogPage() {
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    const q = searchParams.get("search") || "";
    setSearchQuery(q);
    const cat = searchParams.get("category");
    setSelectedCategory(cat || "all");
  }, [searchParams]);

  usePageSEO("products", {
    title: "LPG Gas Cylinders & Accessories Catalog | Conch Gas",
    description: "Explore genuine Conch Gas LPG cylinders (6kg, 12kg, 15kg, 38kg, 45kg), regulators, stoves, hoses, and high-performance lubricants.",
    keywords: "buy LPG cylinder, gas accessories, gas regulator, Conch Gas products, industrial cylinders"
  });

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.get("/categories"),
      api.get("/products")
    ]).then(([catRes, prodRes]) => {
      if (!isMounted) return;
      if (catRes.data?.success && catRes.data.data) {
        setCategories(catRes.data.data.filter(c => c.isActive !== false));
      }
      if (prodRes.data?.success && prodRes.data.data) {
        setProducts(prodRes.data.data.filter(p => p.isActive !== false));
      }
    }).catch(err => {
      console.debug("Catalog fetch error:", err);
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  // Helper to accurately classify category for products using live database categories
  const getProductCategory = (p) => {
    if (p.categorySlug) {
      const matched = categories.find(c => c.slug === p.categorySlug);
      if (matched) return { slug: matched.slug, name: matched.name };
      return { slug: p.categorySlug, name: p.categoryName || p.categorySlug };
    }
    if (p.category) {
      const matched = categories.find(c => String(c._id) === String(p.category) || c.slug === p.category);
      if (matched) return { slug: matched.slug, name: matched.name };
    }
    if (p.categoryName) {
      const matched = categories.find(c => c.name.toLowerCase() === p.categoryName.toLowerCase());
      if (matched) return { slug: matched.slug, name: matched.name };
    }
    return { slug: "general", name: "General" };
  };

  // Build 100% dynamic allProducts list from backend
  const allProducts = useMemo(() => {
    if (products.length === 0) return [];
    return products.map(p => {
      const catInfo = getProductCategory(p);
      return {
        id: p.slug || p._id,
        slug: p.slug || p._id,
        title: p.title || p.name,
        path: `/products/${p.slug || p._id}`,
        category: catInfo.name,
        categorySlug: catInfo.slug,
        desc: p.desc || p.description || "",
        price: Number(p.price || 0),
        images: p.images || [],
        inStock: p.inStock !== false,
        isBestSeller: Boolean(p.isBestSeller),
        customBadge: p.customBadge || (Array.isArray(p.customBadges) && p.customBadges[0]) || "",
        customBadges: Array.isArray(p.customBadges) ? p.customBadges : [],
        weight: p.weight
      };
    });
  }, [products, categories]);

  // Distinct category tabs (dynamically built from live categories in database)
  const categoryTabs = useMemo(() => {
    const tabs = [{ id: "all", label: "All Products", count: allProducts.length }];

    if (categories.length > 0) {
      categories.forEach(cat => {
        const count = allProducts.filter(p => p.categorySlug === cat.slug).length;
        tabs.push({ id: cat.slug, label: cat.name, count });
      });
    }

    return tabs;
  }, [allProducts, categories]);

  // Filtered & Sorted products list
  const filteredProducts = useMemo(() => {
    let result = allProducts.filter(item => {
      const matchesCategory = selectedCategory === "all" || item.categorySlug === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || 
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.desc && item.desc.toLowerCase().includes(q));
      const matchesInStock = sortBy === "instock" ? item.inStock : true;
      return matchesCategory && matchesSearch && matchesInStock;
    });

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === "bestseller") {
      result = [...result].sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    return result;
  }, [allProducts, selectedCategory, searchQuery, sortBy]);

  const navigate = useNavigate();

  const handleDirectBuyNow = (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    if (!item.price || Number(item.price) <= 0) {
      navigate(item.path);
      return;
    }

    // Resolve weight / package display
    let detectedWeight = item.weight;
    if (!detectedWeight) {
      const match = (item.title || "").match(/(\d+(?:\.\d+)?)\s*(?:kg|g|litre|liter|l)\b/i);
      if (match) {
        detectedWeight = match[0].toUpperCase();
      } else {
        detectedWeight = "Standard Unit";
      }
    }

    const titleLower = (item.title || "").toLowerCase();
    const catLower = (item.category || "").toLowerCase();

    let orderMode = "Direct Purchase";
    let serviceType = "PRODUCT ORDER";

    if (titleLower.includes("refill")) {
      orderMode = "Gas Refill";
      serviceType = "DOORSTEP REFILL (EXCHANGE)";
    } else if (titleLower.includes("new connection") || titleLower.includes("complete")) {
      orderMode = "New Connection Kit";
      serviceType = "NEW COMPLETE CYLINDER KIT";
    } else if (titleLower.includes("empty")) {
      orderMode = "Empty Cylinder Purchase";
      serviceType = "EMPTY CYLINDER";
    } else if (catLower.includes("access") || titleLower.includes("regulator") || titleLower.includes("stove") || titleLower.includes("cooker") || titleLower.includes("hose")) {
      orderMode = "Accessory / Equipment";
      serviceType = "EQUIPMENT & ACCESSORIES";
    } else if (catLower.includes("lubricant") || catLower.includes("grease") || titleLower.includes("oil") || titleLower.includes("grease")) {
      orderMode = "Lubricant Purchase";
      serviceType = "LUBRICANTS & GREASE";
    } else if (catLower.includes("industrial")) {
      orderMode = "Industrial Gas Order";
      serviceType = "INDUSTRIAL GAS SUPPLY";
    } else if (catLower.includes("refrigerant")) {
      orderMode = "Refrigerant Gas Order";
      serviceType = "REFRIGERANT GAS SUPPLY";
    }

    const price = Number(item.price) || 0;

    const quoteObj = {
      country: "Uganda",
      countryCode: "UG",
      location: "Kampala (Kira Road Depot)",
      productId: item.id || item.slug,
      productTitle: item.title,
      gasType: item.title,
      gasLabel: item.title,
      medicineType: item.title,
      categoryName: item.category || "Conch Products",
      mobile: "",
      prescription: "YES",
      weight: detectedWeight,
      quantity: 1,
      provider: "CONCH EXPRESS",
      price: price,
      timeline: "Express Doorstep Delivery",
      bookingRef: `CG-${Math.floor(100000 + Math.random() * 900000)}`,
      serviceType: serviceType,
      orderMode: orderMode
    };

    navigate("/booking.php", {
      state: {
        calculatedQuote: quoteObj,
        selectedProvider: {
          name: "CONCH EXPRESS",
          keyName: "CONCH EXPRESS",
          price: price,
          timeline: "Express Doorstep Delivery"
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* ═══════════ FULL CLEAR BANNER IMAGE WITH BOTTOM-LEFT BREADCRUMB ═══════════ */}
      <div id="products-hero" className="w-full bg-[#EAEAEA] border-b border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto relative">
          <img 
            src="/new_hero.jpg" 
            alt="Conch Gas Uganda - Complete Range of LPG Cylinders, Stoves, Lubricants & Equipment"
            className="w-full h-auto block mx-auto select-none"
          />

          {/* Breadcrumbs shifted to Left Bottom on top of banner image */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-5 md:bottom-5 md:left-6 z-10">
            <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md border border-white/80 shadow-md px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600">
              <Link to="/" className="hover:text-[#BC0202] transition-colors">Home</Link>
              <ChevronRight size={13} className="text-slate-400" />
              <span className="text-[#BC0202] font-black">Products & Catalog</span>
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000]" />
      </div>

      {/* ═══════════════════════════════════════
          UNIFIED PRODUCTS CATALOG
      ═══════════════════════════════════════ */}
      <section className="py-6 sm:py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-5 sm:space-y-7">
          
          {/* ── 1. Big Centered Search Bar (Before Categories & Filter) ── */}
          <div className="max-w-2xl mx-auto w-full pt-1">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-[#BC0202] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search products, cylinders, cookers, industrial gases, lubricants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-4 bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl text-xs sm:text-base font-medium text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:border-[#BC0202] focus:ring-4 focus:ring-red-500/10 transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 text-xs sm:text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* ── 2. Categories Filter Pills (Left) + Filter Option (Right - where search was) ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-200">
            {/* Category Filter Pills (Left) */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {categoryTabs.map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3.5 py-1.5 sm:px-4.5 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-[#BC0202] text-white shadow-md shadow-red-600/20"
                        : "bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-2xs"
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Filter Option (Right - where search bar was) */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white border border-slate-200/90 rounded-lg sm:rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 shadow-2xs hover:border-slate-300 transition-colors">
                <SlidersHorizontal size={13} className="text-[#BC0202] shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Filter:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-[11px] sm:text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
                >
                  <option value="featured">All / Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="bestseller">Best Sellers</option>
                  <option value="instock">In Stock Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Unified Products Grid (2 Cards per row on Mobile: grid-cols-2) */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-6">
              {filteredProducts.map((item) => {
                const primaryImg = item.images && item.images.length > 0 ? item.images[0] : null;
                const originalPrice = item.price > 0 ? Math.round(item.price * 1.15 / 1000) * 1000 : 0;
                const rawBadge = item.customBadge || (item.weight 
                  ? (typeof item.weight === "number" ? `${item.weight} KG` : String(item.weight)) 
                  : (item.category || "CONCH"));
                const badgeLabel = String(rawBadge)
                  .replace(/LPG Gas Cylinders/i, "CYLINDER")
                  .replace(/Gas Accessories/i, "ACCESSORY")
                  .replace(/Industrial Gas/i, "INDUSTRIAL")
                  .replace(/Lubricants & Grease/i, "LUBRICANT")
                  .replace(/Lubricants/i, "LUBRICANT");

                return (
                  <div
                    key={item.id}
                    className="group relative bg-white border border-slate-200/90 hover:border-[#BC0202]/40 rounded-[20px] sm:rounded-[28px] p-2.5 sm:p-4 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1"
                  >
                    <div>
                      {/* ── Top White Box for Image ── */}
                      <Link 
                        to={item.path} 
                        className="block relative w-full aspect-square bg-slate-50/70 rounded-[14px] sm:rounded-[22px] p-2 sm:p-4 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:border-red-100 transition-colors"
                      >
                        {/* Top-Right Category Pill (Conch Gas Red Pill) */}
                        <span className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-10 bg-red-50 text-[#BC0202] border border-red-200/80 font-black text-[8px] sm:text-[10px] tracking-wider uppercase px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md shadow-2xs">
                          {badgeLabel}
                        </span>

                        {/* Centered Product Image */}
                        <img
                          src={primaryImg || "/conch_cylinders_range.png"}
                          alt={item.title}
                          className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300 select-none"
                          onError={(e) => { e.currentTarget.src = "/conch_cylinders_range.png"; }}
                        />
                      </Link>

                      {/* ── Brand Row ── */}
                      <div className="flex items-center justify-between text-xs mt-2 sm:mt-3 mb-0.5 sm:mb-1 px-0.5 sm:px-1">
                        {/* Brand */}
                        <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 font-mono">
                          CONCH-GAS
                        </span>
                      </div>

                      {/* ── Title ── */}
                      <Link to={item.path} className="block mt-0.5 px-0.5 sm:px-1">
                        <h3 className="text-xs sm:text-base md:text-lg font-black text-slate-900 group-hover:text-[#BC0202] transition-colors tracking-tight leading-snug line-clamp-1">
                          {item.title}
                        </h3>
                      </Link>

                      {/* ── Price Row (Conch Gas Red Price + Strikethrough) ── */}
                      <div className="flex flex-wrap items-baseline gap-1 sm:gap-2 mt-1 sm:mt-2.5 mb-2 sm:mb-3.5 px-0.5 sm:px-1">
                        {item.price > 0 ? (
                          <>
                            <span className="text-xs sm:text-lg md:text-xl font-black text-[#BC0202] font-mono tracking-tight">
                              UGX {Number(item.price).toLocaleString()}
                            </span>
                            <span className="text-[9px] sm:text-xs text-slate-400 line-through font-semibold font-mono">
                              UGX {Number(originalPrice).toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-[11px] sm:text-sm font-black text-[#BC0202]">
                            Quote on Request
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ── Bottom "BUY NOW" Button (Conch Gas Signature Gradient) ── */}
                    <button
                      onClick={(e) => handleDirectBuyNow(e, item)}
                      className="w-full py-2 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] hover:brightness-110 text-white flex items-center justify-center gap-1.5 sm:gap-2 font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-md shadow-[#BC0202]/20 transition-all duration-200 cursor-pointer active:scale-[0.98]"
                    >
                      <span>BUY NOW</span>
                      <ShoppingBag size={13} strokeWidth={2.4} className="shrink-0" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No products found</h3>
              <p className="text-xs text-slate-500 mt-1">Try resetting your search query or category filter.</p>
              <button
                onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
                className="mt-4 px-5 py-2.5 bg-[#BC0202] hover:bg-[#830000] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
