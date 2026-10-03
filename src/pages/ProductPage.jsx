import React from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Flame, 
  Package, 
  ShieldCheck, 
  Truck, 
  PhoneCall, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  MessageCircle,
  Clock,
  ArrowLeft
} from "lucide-react";
import { PRODUCT_CATEGORIES, ALL_PRODUCTS } from "../constants/products";

export default function ProductPage({ defaultTitle, defaultCategory, defaultDesc }) {
  const { slug, categorySlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Find product by slug from URL or params
  const currentPath = location.pathname.toLowerCase();
  
  // Try matching direct item
  const product = ALL_PRODUCTS.find(p => 
    p.path.toLowerCase() === currentPath || 
    p.id === slug ||
    p.id === categorySlug
  );

  // Try matching category
  const category = PRODUCT_CATEGORIES.find(c => 
    c.path.toLowerCase() === currentPath || 
    c.id === slug ||
    c.id === categorySlug
  );

  // Fallback title / details
  const pageTitle = defaultTitle || product?.title || category?.title || (
    slug 
      ? slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
      : "Conch Gas Products"
  );

  const pageCategory = defaultCategory || product?.category || category?.title || "LPG & Industrial Gases";
  const pageDesc = defaultDesc || product?.desc || category?.items?.map(i => i.title).join(", ") || "Premium certified gas products & equipment supplied across Kampala and Uganda by Conch Gas Ltd.";

  const whatsappMsg = encodeURIComponent(`Hello Conch Gas! I am interested in inquiring about ${pageTitle}. Please share details and pricing.`);
  const whatsappUrl = `https://wa.me/256776500786?text=${whatsappMsg}`;

  // Find other products in same category or overall
  const handleOrderNow = () => {
    const rawWeight = product?.weight 
      ? (typeof product.weight === "string" ? parseFloat(product.weight.replace(/[^0-9.]/g, "")) : product.weight)
      : (pageTitle.includes("6KG") || pageTitle.includes("6kg") ? 6 : (pageTitle.includes("13KG") || pageTitle.includes("13kg") ? 13 : (pageTitle.includes("45KG") || pageTitle.includes("45kg") ? 45 : 13)));

    const priceNum = product?.priceNum || (rawWeight === 6 ? 48000 : (rawWeight === 13 ? 98000 : (rawWeight === 45 ? 280000 : 98000)));
    const isNew = pageTitle.toLowerCase().includes("new");

    const quoteObj = {
      country: "Uganda",
      countryCode: "UG",
      location: "Kampala (Kira Road Depot)",
      gasType: pageCategory || "LPG Cooking Gas",
      medicineType: pageCategory || "LPG Cooking Gas",
      gasLabel: pageTitle,
      mobile: "",
      prescription: "YES",
      weight: rawWeight || 13,
      provider: "CONCH EXPRESS",
      price: priceNum,
      timeline: "Within 2 Hours",
      bookingRef: `CG-${Math.floor(100000 + Math.random() * 900000)}`,
      serviceType: isNew ? "NEW CYLINDER CONNECTION" : "DOORSTEP REFILL (EXCHANGE)",
      orderMode: isNew ? "New Connection" : "Gas Refill"
    };

    navigate("/booking.php", {
      state: {
        calculatedQuote: quoteObj,
        selectedProvider: {
          name: "CONCH EXPRESS",
          keyName: "CONCH EXPRESS",
          price: priceNum,
          timeline: "Within 2 Hours"
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
      
      {/* ═══════════════════════════════════════
          BREADCRUMBS
      ═══════════════════════════════════════ */}
      <div className="bg-white border-b border-slate-200/80 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-semibold text-slate-500 flex-wrap">
          <Link to="/" className="hover:text-[#BC0202] transition-colors">Home</Link>
          <ChevronRight size={13} className="text-slate-400" />
          <Link to="/products" className="hover:text-[#BC0202] transition-colors">Products</Link>
          {pageCategory && (
            <>
              <ChevronRight size={13} className="text-slate-400" />
              <span className="text-slate-600">{pageCategory}</span>
            </>
          )}
          <ChevronRight size={13} className="text-slate-400" />
          <span className="text-[#BC0202] font-bold">{pageTitle}</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          CENTER HERO SHOWCASE (NAME IN CENTER)
      ═══════════════════════════════════════ */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-white via-red-50/20 to-slate-50 flex-1 flex items-center justify-center">
        
        {/* Background glow accents */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#830000]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 w-full">
          
          {/* Top Eyebrow Pill */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-[#BC0202]/20 shadow-2xs mb-6"
          >
            <Flame className="w-4 h-4 text-[#BC0202] fill-[#BC0202]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#BC0202]">
              {pageCategory}
            </span>
          </motion.div>

          {/* PAGE NAME IN CENTER (BOLD & PROMINENT) */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight font-display mb-6"
          >
            <span className="bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] bg-clip-text text-transparent">
              {pageTitle}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-600 text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-10"
          >
            {pageDesc}
          </motion.p>

          {/* Key Value Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10"
          >
            <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-xl px-4 py-2 shadow-xs text-xs font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-[#BC0202]" />
              <span>100% Certified Genuine</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-xl px-4 py-2 shadow-xs text-xs font-bold text-slate-800">
              <Truck className="w-4 h-4 text-[#BC0202]" />
              <span>Express Kampala Delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-xl px-4 py-2 shadow-xs text-xs font-bold text-slate-800">
              <Clock className="w-4 h-4 text-[#BC0202]" />
              <span>24/7 Hotline Support</span>
            </div>
          </motion.div>

          {/* Action CTAs in Center */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3.5"
          >
            <button
              onClick={handleOrderNow}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] hover:brightness-110 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>ORDER NOW</span>
              <ArrowRight size={16} />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <MessageCircle size={16} className="fill-white stroke-none" />
              <span>WhatsApp Inquiry</span>
            </a>

            <a
              href="tel:+256776500786"
              className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm uppercase tracking-wider border border-slate-200 hover:border-slate-300 shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <PhoneCall size={16} className="text-[#BC0202]" />
              <span>+256 776 500 786</span>
            </a>
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          MORE PRODUCTS IN THIS CATEGORY
      ═══════════════════════════════════════ */}
      <section className="py-12 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display tracking-tight">
              Explore Related Conch Gas Products
            </h2>
            <Link to="/products" className="text-xs font-bold text-[#BC0202] hover:text-[#830000] flex items-center gap-1">
              <span>View All Products</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="p-5 rounded-2xl border border-slate-200 hover:border-[#BC0202]/50 bg-slate-50/60 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.category || relatedCategory.title}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#BC0202] transition-colors mt-1 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#BC0202]">
                  <span>View Product</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
