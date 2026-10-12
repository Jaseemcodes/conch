import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Flame, 
  Package, 
  ArrowRight, 
  Truck, 
  PhoneCall,
  Loader2
} from "lucide-react";
import api from "../../utils/api";

// Helper to determine category badge
const getCategoryBadge = (cat) => {
  const s = (cat.slug || cat.name || "").toLowerCase();
  if (s.includes("refill") || s.includes("cylinder")) return "Doorstep Exchange";
  if (s.includes("connection")) return "Complete Set + Gas";
  if (s.includes("accessor")) return "Safety Certified";
  if (s.includes("lubricant") || s.includes("grease")) return "EP2 High Grade";
  if (s.includes("refrigerant")) return "Aircon & Cooling";
  if (s.includes("industrial")) return "Industrial Grade";
  if (s.includes("medical") || s.includes("oxygen")) return "Hospital & Home Care";
  return "Certified Supply";
};

// Helper to determine category subtitle
const getCategorySubtitle = (cat) => {
  if (cat.description && cat.description.trim().length > 0) {
    return cat.description;
  }
  const s = (cat.slug || cat.name || "").toLowerCase();
  if (s.includes("refill") || s.includes("cylinder")) {
    return "Universal cylinder refills at subsidized official rates with free safety check";
  }
  if (s.includes("connection")) {
    return "Brand new cylinder + initial full gas fill + certified safety fittings & warranty";
  }
  if (s.includes("accessor")) {
    return "High & low-pressure regulators, manifold systems, and safety fittings";
  }
  if (s.includes("lubricant") || s.includes("grease")) {
    return "Automotive, machinery, fleet maintenance and industrial grease supplies";
  }
  if (s.includes("refrigerant")) {
    return "High-purity refrigerant gases for automotive AC, cold rooms, and commercial refrigeration";
  }
  if (s.includes("industrial")) {
    return "High-purity industrial oxygen, argon, acetylene and specialty gas cylinders";
  }
  return "Official factory-direct certified supply with guaranteed delivery across Kampala & Uganda";
};

export default function ConchPricingCatalogSection({ title, subtitle }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live categories and products from backend
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
      console.debug("Pricing catalog fetch error:", err);
    }).finally(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  const handleOrder = (item, orderType = "Gas Refill") => {
    const itemName = item.title || item.name;
    const itemPrice = item.price || 48000;
    const rawWeight = typeof item.weight === "string" 
      ? (parseFloat(item.weight.replace(/[^0-9.]/g, "")) || 13)
      : (item.weight || 13);

    const isEquipment = orderType.toLowerCase().includes("accessor") || 
      orderType.toLowerCase().includes("connection") || 
      orderType.toLowerCase().includes("lubricant") ||
      itemName.toLowerCase().includes("regulator") ||
      itemName.toLowerCase().includes("stove");

    const quoteObj = {
      country: "Uganda",
      countryCode: "UG",
      location: "Kampala (Kira Road Depot)",
      productId: item._id || item.slug,
      productTitle: itemName,
      gasType: itemName,
      medicineType: itemName,
      gasLabel: itemName,
      categoryName: categoryTitle,
      mobile: "",
      prescription: "YES",
      weight: rawWeight,
      quantity: 1,
      provider: "CONCH EXPRESS",
      price: itemPrice,
      timeline: "Express Delivery",
      bookingRef: `CG-${Math.floor(100000 + Math.random() * 900000)}`,
      serviceType: isEquipment ? "EQUIPMENT & ACCESSORY ORDER" : "DOORSTEP REFILL (EXCHANGE)",
      orderMode: isEquipment ? "Equipment Order" : "Gas Refill"
    };

    navigate("/booking.php", {
      state: {
        calculatedQuote: quoteObj,
        selectedProvider: {
          name: "CONCH EXPRESS",
          keyName: "CONCH EXPRESS",
          price: itemPrice,
          timeline: "Express Delivery"
        }
      }
    });
  };

  const renderCard = (item, categoryTitle = "Gas Refill") => {
    const itemName = item.title || item.name;
    const itemPrice = item.price || 0;
    const itemPriceFormatted = itemPrice ? `UGX ${Number(itemPrice).toLocaleString()}` : "Price On Request";
    const itemImg = (item.images && item.images.length > 0 && item.images[0]) 
      ? item.images[0] 
      : (item.imageUrl || item.image || "/conch_cylinders_transparent.png");

    const productPath = `/products/${item.slug || item._id}`;
    const whatsappMsg = encodeURIComponent(`Hello Conch Gas! I want to order ${itemName} at ${itemPriceFormatted}. Please arrange delivery in Kampala.`);
    const whatsappUrl = `https://wa.me/256776500786?text=${whatsappMsg}`;

    return (
      <div
        key={item._id || item.slug}
        className="relative bg-white border border-slate-200/90 hover:border-[#BC0202]/50 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-xl hover:shadow-red-950/5 hover:-translate-y-1.5 group will-change-transform"
      >
        {/* Subtle Top-Border Hover Highlight */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#BC0202] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

        {/* Product Image Header (Clickable link to Product Page) */}
        <Link 
          to={productPath}
          className="relative w-full h-36 sm:h-52 md:h-60 bg-gradient-to-b from-slate-100/70 via-slate-50 to-white flex items-center justify-center overflow-hidden border-b border-slate-100/80 group/img block cursor-pointer"
        >
          <img
            src={itemImg}
            alt={itemName}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain p-2 sm:p-2.5 group-hover:scale-106 transition-transform duration-500 ease-out"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/conch_cylinders_transparent.png";
            }}
          />
        </Link>

        {/* Card Body with Padding */}
        <div className="p-2.5 sm:p-4 lg:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Product Name Header with WhatsApp icon on the right */}
            <div className="flex items-center justify-between gap-1.5 mb-1 sm:mb-2">
              <Link
                to={productPath}
                className="text-xs sm:text-[15px] md:text-[17px] font-black text-slate-900 tracking-tight leading-snug font-display group-hover:text-[#BC0202] transition-colors line-clamp-1 sm:line-clamp-2 flex-1 hover:underline cursor-pointer"
              >
                {itemName}
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Order ${itemName} on WhatsApp`}
                className="shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-xs hover:shadow-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                title="Order on WhatsApp"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.758.459 3.473 1.332 4.988L2 22l5.188-1.36c1.47.8 3.125 1.22 4.82 1.22 5.507 0 9.989-4.482 9.989-9.989C22 6.482 17.519 2 12.012 2zm0 1.636c4.6 0 8.353 3.753 8.353 8.353 0 4.6-3.753 8.353-8.353 8.353-1.503 0-2.981-.403-4.28-1.168l-.307-.183-3.085.808.823-3.007-.202-.32a8.312 8.312 0 0 1-1.272-4.483c0-4.6 3.753-8.353 8.353-8.353zm-2.02 2.76c-.22 0-.41.082-.572.245-.253.252-.647.76-.647 1.644s.642 1.738.736 1.862c.095.124 1.238 1.892 3.013 2.66.422.183.752.292 1.01.374.424.135.81.116 1.114.07.34-.05.992-.405 1.132-.796.14-.39.14-.725.097-.796-.042-.07-.156-.112-.328-.198-.172-.086-1.02-.503-1.178-.56-.157-.058-.27-.086-.385.086-.114.172-.44.56-.54.673-.1.112-.2.127-.37.04-.173-.085-.73-.27-1.392-.86-.514-.457-.86-.983-.962-1.155-.102-.172-.01-.265.076-.35.077-.076.172-.2.258-.3.086-.1.114-.17.172-.284.057-.114.028-.214-.014-.3-.042-.085-.385-.928-.528-1.272-.138-.335-.28-.29-.385-.295-.102-.005-.22-.005-.34-.005z"/>
                </svg>
              </a>
            </div>

            {/* Price Section */}
            <div className="my-1 sm:my-1.5 py-1 sm:py-1.5 px-1.5 sm:px-3 bg-gradient-to-b from-slate-50 to-slate-100/70 rounded-lg sm:rounded-xl border border-slate-200/60 text-center">
              <span className="text-[7px] sm:text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block leading-none mb-0.5">
                Official Price
              </span>
              <div className="text-xs sm:text-base md:text-lg font-black text-slate-900 tracking-tight font-display leading-tight">
                {itemPriceFormatted}
              </div>
            </div>
          </div>

          {/* Action (Order Now) */}
          <div className="pt-1.5 sm:pt-2 border-t border-slate-100">
            <button
              onClick={() => handleOrder(item, categoryTitle)}
              className="btn-sheen w-full py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl bg-[#000000] hover:bg-gradient-to-r hover:from-[#830000] hover:to-[#BC0202] text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 shadow-xs group-hover:bg-gradient-to-r group-hover:from-[#830000] group-hover:via-[#BC0202] group-hover:to-[#FF0000] cursor-pointer"
            >
              <span>ORDER NOW</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Build 100% dynamic categories list based on live database
  const buildDynamicSections = () => {
    if (categories.length === 0) return [];

    const sections = [];
    const sortedCats = [...categories].sort((a, b) => (a.order || 0) - (b.order || 0));

    sortedCats.forEach((cat) => {
      // Find matching products from DB
      const catProds = products.filter(p => 
        (p.categorySlug === cat.slug || String(p.category) === String(cat._id) || (p.categoryName && p.categoryName.toLowerCase() === cat.name.toLowerCase())) &&
        p.isActive !== false
      );

      // Only show category if it has products
      if (catProds.length > 0) {
        sections.push({
          id: cat._id || cat.slug,
          slug: cat.slug,
          title: cat.name,
          badge: getCategoryBadge(cat),
          subtitle: getCategorySubtitle(cat),
          viewAllPath: `/products?category=${cat.slug}`,
          totalCount: catProds.length,
          items: catProds.slice(0, 4) // Show top 4 products
        });
      }
    });

    return sections;
  };

  const dynamicSections = buildDynamicSections();

  if (!isLoading && dynamicSections.length === 0) {
    return null;
  }

  return (
    <section id="conch-pricing-catalog" className="py-8 md:py-14 bg-slate-50/60 font-sans border-b border-slate-200/60 relative overflow-hidden">
      
      {/* Background Ambient Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-red-500/5 via-transparent to-[#830000]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* ═══════════════════════════════════════
            SECTION HEADER
        ═══════════════════════════════════════ */}
        <div className="text-center max-w-3xl mx-auto mb-7 md:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-[#BC0202]/20 mb-2.5 shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-[#BC0202] fill-[#BC0202]" />
            <span className="text-[10.5px] font-black uppercase tracking-widest text-[#BC0202]">
              CONCH GAS • TRANSPARENT PRICING
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-black text-slate-900 tracking-tight leading-tight mb-2 font-display">
            Official Pricing & <span className="bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] bg-clip-text text-transparent">Product Catalog</span>
          </h2>

          <p className="text-slate-500 text-xs sm:text-sm md:text-[14.5px] font-medium leading-relaxed">
            {subtitle || "Enjoy factory-direct affordable rates on genuine Conch Gas cylinder refills, new connection kits, certified safety accessories, and industrial lubricants across Uganda."}
          </p>
        </div>

        {/* ═══════════════════════════════════════
            LOADING SKELETON
        ═══════════════════════════════════════ */}
        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#BC0202] animate-spin" />
            <span className="text-xs font-semibold text-slate-500">Loading catalog...</span>
          </div>
        )}

        {/* ═══════════════════════════════════════
            EMPTY STATE
        ═══════════════════════════════════════ */}
        {!isLoading && dynamicSections.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No products listed yet</h3>
            <p className="text-xs text-slate-500 mt-1">Products added from the Admin Dashboard will appear here automatically.</p>
          </div>
        )}

        {/* ═══════════════════════════════════════
            DYNAMIC CATEGORY ROWS (UP TO 4 PRODUCTS EACH)
        ═══════════════════════════════════════ */}
        {!isLoading && dynamicSections.map((section) => (
          <div key={section.id || section.slug} className="space-y-3 sm:space-y-4 mb-7 sm:mb-9">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 border-b border-slate-200/80 pb-2.5 sm:pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#BC0202]" />
                  <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight font-display uppercase">
                    {section.title}
                  </h3>
                  {section.badge && (
                    <span className="text-[9px] sm:text-[10px] font-black bg-red-50 text-[#BC0202] border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {section.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  {section.subtitle}
                </p>
              </div>
              <Link
                to={section.viewAllPath}
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#BC0202] hover:text-[#830000] uppercase tracking-wider transition-colors shrink-0"
              >
                <span>View All {section.title}</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-6">
              {section.items.map((item) => renderCard(item, section.title))}
            </div>
          </div>
        ))}


        {/* ═══════════════════════════════════════
            BOTTOM ASSURANCE & CONTACT BANNER
        ═══════════════════════════════════════ */}
        <div className="mt-8 p-5 sm:p-7 bg-gradient-to-r from-[#000000] via-[#830000] to-[#BC0202] rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold text-amber-300 uppercase tracking-wider">
              <Truck className="w-4 h-4" />
              <span>Free Delivery Around Kampala & Environs</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Need Custom Commercial Quotes or Bulk Industrial Cylinders?
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm font-medium">
              Talk directly with our gas distribution managers for bulk supply agreements.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
            <a
              href="tel:+256776500786"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <PhoneCall className="w-4 h-4 text-[#BC0202]" />
              <span>+256 776 500 786</span>
            </a>
            <Link
              to="/booking.php"
              className="btn-sheen inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#BC0202] hover:bg-[#FF0000] text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Book Doorstep Refill</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
