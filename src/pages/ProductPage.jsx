import { useState, useEffect } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Flame, 
  Package, 
  ShieldCheck, 
  Truck, 
  PhoneCall, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  MessageCircle, 
  Clock, 
  ArrowLeft,
  Star,
  Check,
  Share2,
  ShoppingBag,
  MessageSquare,
  Lock,
  Zap,
  Award,
  Send,
  ThumbsUp,
  Loader2
} from "lucide-react";
import { useForm } from "react-hook-form";
import { COUNTRY_CALLING_CODES } from "../constants/countryCodes";
import Input from "../components/ui/Input";
import api from "../utils/api";

export default function ProductPage({ defaultTitle, defaultCategory, defaultDesc }) {
  const { slug, categorySlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Active lookup slug
  const targetSlug = (slug || categorySlug || "").toLowerCase();

  // Dynamic fetched state
  const [dbProduct, setDbProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [cartToast, setCartToast] = useState(false);

  // Fetch live product and related products from API
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      api.get(`/products/${targetSlug}`).catch(() => null),
      api.get("/products").catch(() => null)
    ]).then(([singleRes, allRes]) => {
      if (!isMounted) return;

      const allList = (allRes?.data?.success && Array.isArray(allRes.data.data)) 
        ? allRes.data.data.filter(p => p.isActive !== false) 
        : [];

      let current = singleRes?.data?.success ? singleRes.data.data : null;

      // If single endpoint didn't resolve directly, find in all products list
      if (!current && allList.length > 0) {
        current = allList.find(p => 
          (p.slug && p.slug.toLowerCase() === targetSlug) ||
          String(p._id).toLowerCase() === targetSlug
        ) || null;
      }

      setDbProduct(current);
      setActiveImageIdx(0);

      // Compute dynamic related products (excluding current, prioritizing same category)
      if (allList.length > 0) {
        const others = allList.filter(p => 
          p.slug?.toLowerCase() !== targetSlug && 
          String(p._id).toLowerCase() !== targetSlug
        );
        const currentCat = current?.categorySlug || current?.category;
        const sameCategory = others.filter(p => (p.categorySlug === currentCat || String(p.category) === String(currentCat)));
        const differentCategory = others.filter(p => !(p.categorySlug === currentCat || String(p.category) === String(currentCat)));
        const finalRelated = [...sameCategory, ...differentCategory].slice(0, 4);
        setRelatedProducts(finalRelated);
      } else {
        setRelatedProducts([]);
      }
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [targetSlug]);

  // Resolved Product Properties
  const product = dbProduct;

  const pageTitle = defaultTitle || product?.title || product?.name || (
    targetSlug ? targetSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Conch Gas Product"
  );

  const pageCategory = defaultCategory || product?.categoryName || product?.category || "LPG Cooking Gas";
  const pageDesc = defaultDesc || product?.desc || product?.description || "Official certified LPG cooking gas & accessories supplied with express doorstep delivery across Kampala and Uganda by Conch Gas Ltd.";

  // Images gallery (only exact uploaded images, max 5, minimum whatever was uploaded)
  const images = (product?.images && product.images.length > 0)
    ? product.images.filter(Boolean).slice(0, 5)
    : (product?.imageUrl ? [product.imageUrl] : ["/conch_cylinders_range.png"]);

  const currentImage = images[activeImageIdx] || images[0];

  const priceNum = Number(product?.price || 0);

  const originalPrice = (product?.originalPrice && Number(product.originalPrice) > priceNum)
    ? Number(product.originalPrice)
    : (priceNum > 0 ? Math.round(priceNum * 1.18 / 1000) * 1000 : 0);

  const discountPercent = originalPrice > priceNum ? Math.round(((originalPrice - priceNum) / originalPrice) * 100) : 15;

  const inStock = product?.inStock !== undefined ? product.inStock : true;
  const isBestSeller = Boolean(product?.isBestSeller);
  const weightGuarantee = product?.weightGuarantee !== undefined ? product.weightGuarantee : true;
  const unbsCertified = product?.unbsCertified !== undefined ? product.unbsCertified : true;
  const customBadges = Array.isArray(product?.customBadges)
    ? product.customBadges
    : (product?.customBadge ? [product.customBadge] : []);
  const specs = product?.specifications || [];

  const whatsappMsg = encodeURIComponent(`Hello Conch Gas! I want to order ${pageTitle} (Qty: ${quantity}, Total: UGX ${(priceNum * quantity).toLocaleString()}). Please confirm delivery.`);
  const whatsappUrl = `https://wa.me/256776500786?text=${whatsappMsg}`;

  const handleAddToCart = () => {
    setCartToast(true);
    setTimeout(() => setCartToast(false), 2500);
  };

  const handleOrderNow = () => {
    // 1. Resolve weight / package display
    let detectedWeight = product?.weight;
    if (!detectedWeight) {
      const match = pageTitle.match(/(\d+(?:\.\d+)?)\s*(?:kg|g|litre|liter|l)\b/i);
      if (match) {
        detectedWeight = match[0].toUpperCase();
      } else {
        detectedWeight = "Standard Unit";
      }
    }

    // 2. Resolve orderMode & serviceType based on title & category
    const titleLower = pageTitle.toLowerCase();
    const catLower = (pageCategory || "").toLowerCase();

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

    const calculatedPrice = (priceNum || 0) * quantity;

    const quoteObj = {
      country: "Uganda",
      countryCode: "UG",
      location: "Kampala (Kira Road Depot)",
      productId: product?._id,
      productTitle: pageTitle,
      gasType: pageTitle,
      gasLabel: `${pageTitle}${quantity > 1 ? ` (Qty: ${quantity})` : ""}`,
      medicineType: pageTitle,
      categoryName: pageCategory || "Conch Products",
      mobile: "",
      prescription: "YES",
      weight: detectedWeight,
      quantity: quantity,
      provider: "CONCH EXPRESS",
      price: calculatedPrice,
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
          price: calculatedPrice,
          timeline: "Express Doorstep Delivery"
        }
      }
    });
  };

  const nextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  // Contact Us Form State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);
  const [countryCode, setCountryCode] = useState("+256");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsSubmitted(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  const onSubmitContact = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/contacts', {
        fullName: data.name,
        email: data.email,
        phone: `${countryCode} ${data.phone}`,
        subject: `Product Inquiry: ${pageTitle}`,
        message: data.message
      });

      if (response.data && response.data.success) {
        setSubmissionData(data);
        setIsSubmitted(true);
        reset();
      }
    } catch (err) {
      console.error('Error submitting contact form:', err);
      // Fallback local UI success
      setSubmissionData(data);
      setIsSubmitted(true);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 bg-[#FAF9F5]">
        <Loader2 className="w-10 h-10 text-[#BC0202] animate-spin" />
        <span className="text-sm font-bold text-slate-600">Loading product details...</span>
      </div>
    );
  }

  if (!product && !defaultTitle) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-[#FAF9F5] px-4 text-center">
        <Package className="w-16 h-16 text-slate-300" />
        <h2 className="text-xl font-black text-slate-800">Product Not Found</h2>
        <p className="text-xs text-slate-500 max-w-md">The product you are looking for does not exist or has been removed from the catalog.</p>
        <Link
          to="/products"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
        >
          Browse Product Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] font-sans flex flex-col justify-between">
      
      {/* ── Toast notification for Add to Cart ── */}
      <AnimatePresence>
        {cartToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <Check size={16} strokeWidth={3} />
            </div>
            <div>
              <p className="text-xs font-bold">{pageTitle}</p>
              <p className="text-[11px] text-slate-300">Added to Cart ({quantity} item{quantity > 1 ? "s" : ""})</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════
          BREADCRUMBS
      ═══════════════════════════════════════ */}
      <div className="bg-transparent py-3 px-4 sm:px-6 lg:px-8 border-b border-slate-200/60">
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
          PRODUCT DETAILS SHOWCASE (SCREENSHOT MATCH)
      ═══════════════════════════════════════ */}
      <section className="py-6 sm:py-10 md:py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            
            {/* ── LEFT: THUMBNAIL STRIP + MAIN PREVIEW (DYNAMIC FOR 1 TO 5 IMAGES) ── */}
            <div className={`lg:col-span-6 flex flex-col-reverse ${images.length > 1 ? "sm:grid sm:grid-cols-[72px_1fr] md:grid-cols-[80px_1fr] lg:grid-cols-[88px_1fr]" : ""} gap-3 sm:gap-4 items-stretch`}>
              
              {/* Vertical Thumbnail Strip (Only rendered when more than 1 image exists) */}
              {images.length > 1 && (
                <div className="flex sm:flex-col gap-2 sm:gap-2.5 overflow-x-auto sm:overflow-y-auto max-w-full sm:w-full shrink-0 scrollbar-none py-1 sm:py-0">
                  {images.map((imgUrl, idx) => {
                    const isActive = activeImageIdx === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        aria-label={`View thumbnail ${idx + 1}`}
                        className={`relative w-16 sm:w-full aspect-square rounded-2xl p-1.5 bg-[#F0F2F4] border-2 overflow-hidden flex items-center justify-center transition-all cursor-pointer ${
                          isActive 
                            ? "border-slate-900 shadow-sm" 
                            : "border-transparent hover:border-slate-300 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`${pageTitle} Thumbnail ${idx + 1}`}
                          className="w-full h-full object-contain filter drop-shadow-xs"
                          onError={(e) => { e.currentTarget.src = "/conch_cylinders_range.png"; }}
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Main Image Box */}
              <div className="relative w-full aspect-square bg-[#ECEEF1] rounded-3xl p-6 sm:p-10 flex items-center justify-center overflow-hidden border border-slate-200/80 group">
                
                {/* Counter Badge (Only rendered when more than 1 image exists) */}
                {images.length > 1 && (
                  <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-xs font-black tracking-wider shadow-xs">
                    {activeImageIdx + 1}/{images.length}
                  </div>
                )}

                {/* Optional Best Seller Pill (Top Left) */}
                {isBestSeller && (
                  <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                    <Star size={11} className="fill-white" />
                    <span>Best Seller</span>
                  </div>
                )}

                {/* Left / Right Nav Arrows on Hover */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      aria-label="Previous Image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-slate-700 hover:text-[#BC0202] hover:bg-white shadow-md border border-slate-200 flex items-center justify-center transition-all opacity-0 group-hover:opacity-90 hover:opacity-100 cursor-pointer z-10"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={nextImage}
                      aria-label="Next Image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-slate-700 hover:text-[#BC0202] hover:bg-white shadow-md border border-slate-200 flex items-center justify-center transition-all opacity-0 group-hover:opacity-90 hover:opacity-100 cursor-pointer z-10"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}

                {/* Centered Main Image */}
                <motion.img
                  key={currentImage}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.22 }}
                  src={currentImage}
                  alt={pageTitle}
                  className="w-full h-full object-contain filter drop-shadow-xl select-none"
                  onError={(e) => { e.currentTarget.src = "/conch_cylinders_range.png"; }}
                />
              </div>
            </div>

            {/* ── RIGHT: DETAILS & ACTIONS (EXACT SCREENSHOT STRUCTURE) ── */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-5">
              
              {/* Category Tag with Dash Prefix (e.g. — TALBINA in Screenshot) */}
              <div className="flex items-center gap-2">
                <span className="w-5 h-0.5 bg-[#830000]" />
                <span className="text-xs font-black uppercase tracking-widest text-[#830000] font-mono">
                  {pageCategory}
                </span>
              </div>

              {/* Product Title (Bold Uppercase Heading) */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase leading-tight font-display">
                {pageTitle}
              </h1>

              {/* Price Row (Big Price + Strikethrough + SAVE 22% Badge) */}
              <div className="flex flex-wrap items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-mono tracking-tight">
                  UGX {Number(priceNum).toLocaleString()}
                </span>
                {originalPrice > priceNum && (
                  <>
                    <span className="text-base sm:text-lg text-slate-400 line-through font-semibold font-mono">
                      UGX {Number(originalPrice).toLocaleString()}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200 text-xs font-black uppercase tracking-wider">
                      SAVE {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* ── Highlights (100% Weight Guarantee, UNBS Certified Safety & Custom Badges) ── */}
              {(weightGuarantee || unbsCertified || (customBadges && customBadges.length > 0)) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 pb-3 border-y border-slate-200/90 text-xs font-bold text-slate-800">
                  {weightGuarantee && (
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#BC0202] shrink-0" strokeWidth={2.2} />
                      <span>100% Weight Guarantee</span>
                    </div>
                  )}
                  {unbsCertified && (
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-[#BC0202] shrink-0" strokeWidth={2.2} />
                      <span>UNBS Certified Safety</span>
                    </div>
                  )}
                  {customBadges && customBadges.map((cb, idx) => (
                    <div key={idx} className="flex items-center text-slate-800">
                      <span>{cb}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Technical Specifications (Positioned Above Description) */}
              {specs && specs.length > 0 && (
                <div className="rounded-2xl border border-slate-200/90 overflow-hidden divide-y divide-slate-100 text-xs bg-white shadow-2xs">
                  {specs.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 sm:p-3.5 bg-white hover:bg-slate-50/50 transition-colors">
                      <span className="font-semibold text-slate-700">{s.key}</span>
                      <span className="font-bold text-slate-900">{s.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Description Paragraph with preserved whitespace and READ MORE Toggle */}
              <div className="space-y-1.5 pt-1">
                <div className={`text-slate-600 text-xs sm:text-sm leading-relaxed font-normal whitespace-pre-line ${!showFullDesc ? "line-clamp-4" : ""}`}>
                  {pageDesc}
                </div>
                {pageDesc && pageDesc.length > 180 && (
                  <button
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-slate-800 hover:text-[#BC0202] transition-colors cursor-pointer pt-0.5"
                  >
                    <span>{showFullDesc ? "SHOW LESS" : "READ MORE"}</span>
                    <ChevronDown size={13} className={`transition-transform duration-200 ${showFullDesc ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>

              {/* ── QUANTITY Stepper & ORDER VIA WHATSAPP Row ── */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                    QUANTITY:
                  </span>
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white px-2 py-1 shadow-2xs">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-black text-sm cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-black text-xs sm:text-sm text-slate-900 font-mono">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-black text-sm cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 sm:py-3.5 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white border-2 border-[#1EBE5D] rounded-2xl font-black text-xs sm:text-[13px] uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>ORDER VIA WHATSAPP</span>
                </a>
              </div>

              {/* ── Primary 1-Click Buy Now Button (Screenshot Full-Width) ── */}
              <div className="pt-1">
                <button
                  onClick={handleOrderNow}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] hover:brightness-110 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer active:scale-[0.99]"
                >
                  <Zap size={15} className="fill-amber-300 text-amber-300" />
                  <span>INSTANT 1-CLICK BUY NOW</span>
                  <ArrowRight size={15} />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MORE PRODUCTS IN CATALOG (2 PER ROW ON MOBILE)
      ═══════════════════════════════════════ */}
      <section className="py-10 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 font-display tracking-tight">
              Explore More Conch Gas Products
            </h2>
            <Link to="/products" className="text-xs font-bold text-[#BC0202] hover:text-[#830000] flex items-center gap-1">
              <span>View All Products</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-6">
            {relatedProducts.map((item, idx) => {
              const primaryImg = (item.images && item.images.length > 0) ? item.images[0] : (item.imageUrl || "/conch_cylinders_range.png");
              const price = Number(item.price || 0);
              const originalPrice = price > 0 ? Math.round(price * 1.15 / 1000) * 1000 : 0;
              const badgeLabel = item.weight 
                ? (typeof item.weight === "number" ? `${item.weight} KG` : String(item.weight)) 
                : (item.categoryName || "CONCH");
              const itemPath = `/products/${item.slug || item._id}`;

              return (
                <div
                  key={item._id || item.slug || idx}
                  className="group relative bg-white border border-slate-200/90 hover:border-[#BC0202]/40 rounded-[20px] sm:rounded-[28px] p-2.5 sm:p-4 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1"
                >
                  <div>
                    {/* Top White Box for Image */}
                    <Link 
                      to={itemPath} 
                      className="block relative w-full aspect-square bg-slate-50/70 rounded-[14px] sm:rounded-[22px] p-2 sm:p-4 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:border-red-100 transition-colors"
                    >
                      <span className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-10 bg-red-50 text-[#BC0202] border border-red-200/80 font-black text-[8px] sm:text-[10px] tracking-wider uppercase px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md shadow-2xs">
                        {badgeLabel}
                      </span>

                      <img
                        src={primaryImg}
                        alt={item.title || item.name}
                        className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300 select-none"
                        onError={(e) => { e.currentTarget.src = "/conch_cylinders_range.png"; }}
                      />
                    </Link>

                    {/* Brand */}
                    <div className="flex items-center justify-between text-xs mt-2 sm:mt-3 mb-0.5 sm:mb-1 px-0.5 sm:px-1">
                      <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 font-mono">
                        CONCH-GAS
                      </span>
                    </div>

                    {/* Title */}
                    <Link to={itemPath} className="block mt-0.5 px-0.5 sm:px-1">
                      <h3 className="text-xs sm:text-base md:text-lg font-black text-slate-900 group-hover:text-[#BC0202] transition-colors tracking-tight leading-snug line-clamp-1">
                        {item.title || item.name}
                      </h3>
                    </Link>

                    {/* Price Row */}
                    <div className="flex flex-wrap items-baseline gap-1 sm:gap-2 mt-1 sm:mt-2 mb-2 sm:mb-3.5 px-0.5 sm:px-1">
                      {price > 0 ? (
                        <>
                          <span className="text-xs sm:text-lg md:text-xl font-black text-[#BC0202] font-mono tracking-tight">
                            UGX {Number(price).toLocaleString()}
                          </span>
                          <span className="text-[9px] sm:text-xs text-slate-400 line-through font-semibold font-mono">
                            UGX {Number(originalPrice).toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs sm:text-base font-black text-[#BC0202]">
                          Quote on Request
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom BUY NOW Button */}
                  <Link
                    to={itemPath}
                    className="w-full py-2 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] hover:brightness-110 text-white flex items-center justify-center gap-1.5 sm:gap-2 font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-md shadow-[#BC0202]/20 transition-all duration-200 cursor-pointer active:scale-[0.98]"
                  >
                    <span>BUY NOW</span>
                    <ShoppingBag size={13} strokeWidth={2.4} className="shrink-0" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CONTACT US / PRODUCT INQUIRY FORM (AT THE VERY BOTTOM)
      ═══════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-[#FAF9F5] border-t border-slate-200/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-10 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-[#BC0202] bg-red-50 px-3.5 py-1.5 rounded-full mb-3 border border-red-100">
              Contact Us
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-display">
              Have Any Questions About {pageTitle}?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 leading-relaxed">
              Write your query below. Our Conch Gas customer support team will contact you immediately.
            </p>
          </div>

          {/* Interactive Contact Form Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg shadow-slate-200/40">
            {isSubmitted ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-10 space-y-5"
              >
                <div className="w-20 h-20 bg-red-50 text-[#BC0202] rounded-full flex items-center justify-center mx-auto shadow-2xs">
                  <ThumbsUp size={36} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none font-display">
                  Inquiry Received Successfully!
                </h3>
                <p className="max-w-md mx-auto text-sm text-slate-500 font-sans leading-relaxed font-medium">
                  Thank you, <span className="font-extrabold text-slate-800">{submissionData?.name}</span>. Our Conch Gas customer support team has received your query regarding <span className="font-extrabold text-slate-800">{pageTitle}</span>. We will follow up with you promptly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#BC0202] border border-[#BC0202]/30 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <span>Send Another Inquiry</span>
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmitContact)} className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-base font-black text-slate-900 tracking-wider uppercase font-display">
                    HAVE ANY QUESTIONS
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Write your query, our Conch Gas team will contact you immediately
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    id="product-contact-name"
                    label="Your Complete Name"
                    placeholder="e.g. John Doe / Business Name"
                    required
                    error={errors.name?.message}
                    {...register("name", { required: "Name is required" })}
                  />
                  <Input
                    id="product-contact-email"
                    label="Your Email ID"
                    placeholder="e.g. info@conchgas.com"
                    type="email"
                    required
                    error={errors.email?.message}
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format"
                      }
                    })}
                  />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="product-contact-phone" className="text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
                    Contact Mobile No. <span className="text-red-500">*</span>
                  </label>
                  <div className={`flex h-11 relative shadow-2xs rounded-xl border ${errors.phone ? "border-red-400 focus-within:ring-2 focus-within:ring-red-200 focus-within:border-red-500 bg-red-50/50" : "border-slate-200 focus-within:ring-2 focus-within:ring-[#BC0202]/20 focus-within:border-[#BC0202] bg-white"} transition-all overflow-hidden`}>
                    <select 
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-[85px] px-2 bg-slate-100/50 text-xs font-semibold text-slate-800 focus:outline-none border-r border-slate-200 cursor-pointer"
                    >
                      {COUNTRY_CALLING_CODES.map((c, idx) => (
                        <option key={`${c.iso}-${idx}`} value={c.code}>{c.iso} {c.code}</option>
                      ))}
                    </select>
                    <input
                      id="product-contact-phone"
                      type="tel"
                      placeholder="e.g. 776500786"
                      {...register("phone", { 
                        required: "Mobile digits are required",
                        pattern: {
                          value: /^\+?[0-9]{7,15}$/,
                          message: "Invalid phone numbers format"
                        }
                      })}
                      className="w-full px-4 bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                  {errors.phone && <span className="text-[10px] text-red-500 font-bold ml-1">{errors.phone.message}</span>}
                </div>

                <Input
                  id="product-contact-message"
                  label="Inquiry / Message Details"
                  placeholder={`Provide details or inquiries about ${pageTitle}...`}
                  componentType="textarea"
                  required
                  error={errors.message?.message}
                  {...register("message", { required: "Message details is required" })}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 py-4 text-xs sm:text-sm font-black tracking-wider uppercase text-white bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] hover:brightness-110 rounded-xl shadow-lg shadow-red-600/25 active:scale-[0.99] hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2.5 font-display select-none disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Submitting Support Request...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} className="stroke-[2.5]" />
                      <span>Submit Support Request</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
