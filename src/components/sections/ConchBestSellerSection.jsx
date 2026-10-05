import React from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Flame, 
  ShoppingCart, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Sparkles,
  MessageCircle,
  Truck
} from "lucide-react";

export const BEST_SELLER_PRODUCTS = [
  {
    id: "best-6kg",
    name: "6KG CYLINDER REFILL",
    price: "UGX 48,000.00",
    priceNum: 48000,
    weight: "6 KG",
    category: "LPG Cooking Gas",
    image: "/6kg.jpg",
    link: "/products/6kg-gas",
    tag: "Compact Domestic"
  },
  {
    id: "best-13kg",
    name: "13KG CYLINDER REFILL",
    price: "UGX 98,000.00",
    priceNum: 98000,
    weight: "13 KG",
    category: "LPG Cooking Gas",
    image: "/13kg.jpg",
    link: "/products/13kg-gas",
    tag: "Family Standard"
  },
  {
    id: "best-45kg",
    name: "45 KG CYLINDER REFILL",
    price: "UGX 280,000.00",
    priceNum: 280000,
    weight: "45 KG",
    category: "Commercial LPG",
    image: "/45kg.jpg",
    link: "/products/45kg-gas",
    tag: "Commercial Heavy"
  },
  {
    id: "best-r134a",
    name: "R134A REFRIGERANT GAS",
    price: "UGX 700,000.00",
    priceNum: 700000,
    weight: "13.6 KG",
    category: "Refrigerant Gas",
    image: "/bestseller_r134a.png",
    link: "/products/industrial-gas",
    tag: "A/C & Automotive"
  },
  {
    id: "best-r404a",
    name: "R404A REFRIGERANT GAS",
    price: "UGX 650,000.00",
    priceNum: 650000,
    weight: "10.9 KG",
    category: "Refrigerant Gas",
    image: "/bestseller_r404a.png",
    link: "/products/industrial-gas",
    tag: "Commercial Cold"
  },
  {
    id: "best-r507a",
    name: "R507A REFRIGERANT GAS",
    price: "UGX 800,000.00",
    priceNum: 800000,
    weight: "11.3 KG",
    category: "Refrigerant Gas",
    image: "/bestseller_r507a.png",
    link: "/products/industrial-gas",
    tag: "Industrial Chilling"
  },
  {
    id: "best-r407c",
    name: "R407C REFRIGERANT GAS",
    price: "UGX 650,000.00",
    priceNum: 650000,
    weight: "11.3 KG",
    category: "Refrigerant Gas",
    image: "/bestseller_r407c.png",
    link: "/products/industrial-gas",
    tag: "HVAC Systems"
  },
  {
    id: "best-r410a",
    name: "R410A REFRIGERANT GAS",
    price: "UGX 650,000.00",
    priceNum: 650000,
    weight: "11.3 KG",
    category: "Refrigerant Gas",
    image: "/bestseller_r410a.png",
    link: "/products/industrial-gas",
    tag: "Inverter Cooling"
  }
];

export default function ConchBestSellerSection({ title, subtitle, content }) {
  const navigate = useNavigate();

  const handleOrder = (product) => {
    const rawWeight = typeof product.weight === "string" 
      ? parseFloat(product.weight.replace(/[^0-9.]/g, "")) 
      : (product.weight || 13);

    const isNew = product.name.toLowerCase().includes("new") || product.category?.toLowerCase().includes("new");

    const quoteObj = {
      country: "Uganda",
      countryCode: "UG",
      location: "Kampala (Kira Road Depot)",
      gasType: product.category || "LPG Cooking Gas",
      medicineType: product.category || "LPG Cooking Gas",
      gasLabel: product.name,
      mobile: "",
      prescription: "YES",
      weight: rawWeight || 13,
      provider: "CONCH EXPRESS",
      price: product.priceNum || 48000,
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
          price: product.priceNum || 48000,
          timeline: "Within 2 Hours"
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
            High-demand domestic cooking gas refills, commercial cylinders, and certified HVAC refrigerant gases with prompt delivery across Kampala.
          </p>
        </div>

        {/* ═══════════════════════════════════════
            8 PRODUCTS (4x2 RESPONSIVE GRID)
        ═══════════════════════════════════════ */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {BEST_SELLER_PRODUCTS.map((item) => (
            <motion.div
              key={item.id}
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
                    {item.tag}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock
                  </span>
                </div>

                {/* Product Image Showcase Container */}
                <div className="w-full h-44 sm:h-48 flex items-center justify-center p-3 relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50/80 via-slate-50/40 to-white group-hover:bg-red-50/20 transition-colors duration-300 mb-4 border border-slate-100">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    width={220}
                    height={200}
                    loading="lazy"
                    className="max-h-full w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-108 drop-shadow-md"
                  />
                </div>

                {/* Product Name */}
                <h3 className="text-[14px] sm:text-[15px] font-black text-slate-900 tracking-tight leading-snug group-hover:text-[#BC0202] transition-colors mb-1.5 font-display">
                  {item.name}
                </h3>

                {/* Product Price */}
                <div className="mb-4">
                  <span className="text-base sm:text-lg font-black text-[#BC0202] tracking-tight">
                    {item.price}
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
                  href={`https://wa.me/256776500786?text=${encodeURIComponent(`Hello Conch Gas! I want to order ${item.name} at ${item.price}. Please arrange delivery to Kampala.`)}`}
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
          ))}
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
