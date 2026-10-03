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
    image: "/bestseller_6kg.png",
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
    image: "/bestseller_13kg.png",
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
    image: "/bestseller_45kg.png",
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
      className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/60 to-white relative overflow-hidden font-sans border-b border-slate-200/70"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-[#830000]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ═══════════════════════════════════════
            SECTION HEADER
        ═══════════════════════════════════════ */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-[#BC0202]/20 shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-[#BC0202] fill-[#BC0202]" />
            <span className="text-[11px] font-black uppercase tracking-widest text-[#BC0202]">
              CONCH GAS
            </span>
          </div>

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
              className="group relative bg-white border border-slate-200/90 hover:border-[#BC0202]/60 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xs"
            >
              <div>
                {/* Top Category / Tag Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                    {item.tag}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock
                  </span>
                </div>

                {/* Product Image Showcase Container */}
                <div className="w-full h-44 sm:h-48 flex items-center justify-center p-3 relative overflow-hidden rounded-2xl bg-slate-50/60 group-hover:bg-red-50/20 transition-colors duration-300 mb-4">
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
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart size={14} />
                  <span>ORDER NOW</span>
                </button>

                <a
                  href={`https://wa.me/256776500786?text=${encodeURIComponent(`Hello Conch Gas! I want to order ${item.name} at ${item.price}. Please arrange delivery to Kampala.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-[#25D366] text-slate-600 hover:text-white border border-slate-200/80 hover:border-[#25D366] font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={13} className="fill-current" />
                  <span>Quick WhatsApp Order</span>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ═══════════════════════════════════════
            BOTTOM ASSURANCE BAR
        ═══════════════════════════════════════ */}
        <div className="mt-12 pt-8 border-t border-slate-200/70 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-bold text-slate-600">
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
