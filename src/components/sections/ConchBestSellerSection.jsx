import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  ShieldCheck, 
  Sparkles,
  Truck
} from "lucide-react";
import api from "../../utils/api";

export default function ConchBestSellerSection({ title, subtitle }) {
  const navigate = useNavigate();
  const [bestSellers, setBestSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.get("/products")
      .then(res => {
        if (!isMounted) return;
        if (res.data?.success && Array.isArray(res.data.data)) {
          const prods = res.data.data.filter(p => p.isActive !== false);
          // Prioritize explicitly flagged bestsellers, then active products up to 8
          const flagged = prods.filter(p => p.isBestSeller);
          const others = prods.filter(p => !p.isBestSeller);
          const combined = [...flagged, ...others].slice(0, 8);
          setBestSellers(combined);
        }
      })
      .catch(err => {
        console.debug("Bestseller fetch error:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  if (!isLoading && bestSellers.length === 0) {
    return null; // Don't render empty section if no products in database
  }

  const handleOrder = (product) => {
    const rawWeight = typeof product.weight === "string" 
      ? (parseFloat(product.weight.replace(/[^0-9.]/g, "")) || 13)
      : (product.weight || 13);

    const productName = product.title || product.name || "Gas Product";
    const productCategory = product.categoryName || "LPG Cooking Gas";
    const productPrice = Number(product.price || 48000);

    const titleLower = productName.toLowerCase();
    const catLower = productCategory.toLowerCase();

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
    } else if (catLower.includes("access") || titleLower.includes("regulator") || titleLower.includes("stove")) {
      orderMode = "Accessory / Equipment";
      serviceType = "EQUIPMENT & ACCESSORIES";
    }

    const quoteObj = {
      country: "Uganda",
      countryCode: "UG",
      location: "Kampala (Kira Road Depot)",
      productId: product._id,
      productTitle: productName,
      gasType: productName,
      gasLabel: productName,
      medicineType: productName,
      categoryName: productCategory,
      mobile: "",
      prescription: "YES",
      weight: rawWeight,
      quantity: 1,
      provider: "CONCH EXPRESS",
      price: productPrice,
      timeline: "Express Delivery",
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
          price: productPrice,
          timeline: "Express Delivery"
        }
      }
    });
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" }
    }
  };

  return (
    <section 
      id="bestseller-section" 
      className="py-8 md:py-14 bg-gradient-to-b from-white via-slate-50/60 to-white relative overflow-hidden font-sans border-b border-slate-200/70"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-[#830000]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ═══════════════════════════════════════
            SECTION HEADER
        ═══════════════════════════════════════ */}
        <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3 mb-7 md:mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-slate-900 tracking-tight leading-tight font-display">
            OUR{" "}
            <span className="bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] bg-clip-text text-transparent">
              BEST SELLER
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
            {subtitle || "High-demand domestic cooking gas refills, commercial cylinders, and certified HVAC refrigerant gases with prompt delivery across Kampala."}
          </p>
        </div>

        {/* ═══════════════════════════════════════
            DYNAMIC PRODUCTS GRID (UP TO 8)
        ═══════════════════════════════════════ */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {bestSellers.map((item) => {
            const productName = item.title || item.name;
            const productPrice = Number(item.price || 0);
            const formattedPrice = productPrice ? `UGX ${productPrice.toLocaleString()}` : "Price On Request";
            const productImg = (item.images && item.images.length > 0 && item.images[0])
              ? item.images[0]
              : (item.imageUrl || item.image || "/conch_cylinders_transparent.png");
            const tag = item.weight 
              ? `${item.weight}` 
              : (item.categoryName || "Conch Certified");

            const productPath = `/products/${item.slug || item._id}`;

            return (
              <motion.div
                key={item._id || item.slug}
                variants={cardVariants}
                whileHover={{ 
                  y: -6, 
                  boxShadow: "0 20px 30px -10px rgba(188, 2, 2, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                className="group relative bg-white border border-slate-200/90 hover:border-[#BC0202]/50 rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-xs overflow-hidden"
              >
                {/* Subtle Top-Border Hover Highlight */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#BC0202] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

                <div>
                  {/* Top Category / Tag Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {tag}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      In Stock
                    </span>
                  </div>

                  {/* Product Image Showcase Container */}
                  <Link
                    to={productPath}
                    className="w-full h-44 sm:h-48 flex items-center justify-center p-3 relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50/80 via-slate-50/40 to-white group-hover:bg-red-50/20 transition-colors duration-300 mb-4 border border-slate-100 block cursor-pointer"
                  >
                    <img 
                      src={productImg} 
                      alt={productName} 
                      width={220}
                      height={200}
                      loading="lazy"
                      className="max-h-full w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-108 drop-shadow-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/conch_cylinders_transparent.png";
                      }}
                    />
                  </Link>

                  {/* Product Name */}
                  <Link
                    to={productPath}
                    className="text-[14px] sm:text-[15px] font-black text-slate-900 tracking-tight leading-snug group-hover:text-[#BC0202] transition-colors mb-1.5 font-display line-clamp-2 block hover:underline"
                  >
                    {productName}
                  </Link>

                  {/* Product Price */}
                  <div className="mb-4">
                    <span className="text-base sm:text-lg font-black text-[#BC0202] tracking-tight">
                      {formattedPrice}
                    </span>
                  </div>
                </div>

                {/* Action Buttons: ORDER NOW & WhatsApp */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleOrder(item)}
                    className="btn-sheen w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart size={14} />
                    <span>ORDER NOW</span>
                  </button>

                  <a
                    href={`https://wa.me/256776500786?text=${encodeURIComponent(`Hello Conch Gas! I want to order ${productName} at ${formattedPrice}. Please arrange delivery to Kampala.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-[#25D366] text-slate-700 hover:text-white border border-slate-200/80 hover:border-[#25D366] font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.758.459 3.473 1.332 4.988L2 22l5.188-1.36c1.47.8 3.125 1.22 4.82 1.22 5.507 0 9.989-4.482 9.989-9.989C22 6.482 17.519 2 12.012 2zm0 1.636c4.6 0 8.353 3.753 8.353 8.353 0 4.6-3.753 8.353-8.353 8.353-1.503 0-2.981-.403-4.28-1.168l-.307-.183-3.085.808.823-3.007-.202-.32a8.312 8.312 0 0 1-1.272-4.483c0-4.6 3.753-8.353 8.353-8.353zm-2.02 2.76c-.22 0-.41.082-.572.245-.253.252-.647.76-.647 1.644s.642 1.738.736 1.862c.095.124 1.238 1.892 3.013 2.66.422.183.752.292 1.01.374.424.135.81.116 1.114.07.34-.05.992-.405 1.132-.796.14-.39.14-.725.097-.796-.042-.07-.156-.112-.328-.198-.172-.086-1.02-.503-1.178-.56-.157-.058-.27-.086-.385.086-.114.172-.44.56-.54.673-.1.112-.2.127-.37.04-.173-.085-.73-.27-1.392-.86-.514-.457-.86-.983-.962-1.155-.102-.172-.01-.265.076-.35.077-.076.172-.2.258-.3.086-.1.114-.17.172-.284.057-.114.028-.214-.014-.3-.042-.085-.385-.928-.528-1.272-.138-.335-.28-.29-.385-.295-.102-.005-.22-.005-.34-.005z"/>
                    </svg>
                    <span>Quick WhatsApp Order</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ═══════════════════════════════════════
            BOTTOM ASSURANCE BAR
        ═══════════════════════════════════════ */}
        <div className="mt-6 pt-5 border-t border-slate-200/70 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#BC0202]" />
            <span>100% Certified Safe & Factory Sealed</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#BC0202]" />
            <span>Fast Doorstep Delivery Within Kampala</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#BC0202]" />
            <span>Universal Cylinder Exchange Accepted</span>
          </div>
        </div>

      </div>
    </section>
  );
}
