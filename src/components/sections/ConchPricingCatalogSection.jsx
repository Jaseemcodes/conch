import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Flame, 
  Package, 
  Wrench, 
  Droplets, 
  Check, 
  ArrowRight, 
  Sparkles, 
  MessageCircle, 
  ShieldCheck, 
  Truck,
  PhoneCall
} from "lucide-react";

export const PRICING_CATALOG = [
  {
    id: "refill",
    name: "Gas Refill Prices",
    shortName: "Gas Refills",
    badge: "Most Popular",
    icon: Flame,
    tagline: "Universal cylinder refills at affordable, subsidized rates across Uganda",
    items: [
      {
        id: "refill-6kg",
        name: "6 KG Cylinder Refill",
        category: "Domestic",
        capacity: "6 KG",
        priceUGX: 48000,
        priceFormatted: "UGX 48,000",
        popular: false,
        desc: "Ideal for small households, students & backup cooking.",
        features: ["Standard 6kg LPG Fill", "Free Leak Check on Delivery", "Free Doorstep Delivery (Kampala)"]
      },
      {
        id: "refill-13kg",
        name: "13 KG Cylinder Refill",
        category: "Family Domestic",
        capacity: "13 KG",
        priceUGX: 98000,
        priceFormatted: "UGX 98,000",
        popular: true,
        desc: "Most popular choice for medium to large families.",
        features: ["Standard 13kg LPG Fill", "Universal Cylinder Exchange", "Tamper-Proof Factory Seal", "Priority 2-Hr Delivery"]
      },
      {
        id: "refill-40kg",
        name: "40 KG Commercial Refill",
        category: "Commercial",
        capacity: "40 KG",
        priceUGX: 240000,
        priceFormatted: "UGX 240,000",
        popular: false,
        desc: "Best suited for restaurants, bakeries, hotels & catering.",
        features: ["High-Volume 40kg Refill", "Bulk Safety Compliance", "Dedicated Account Manager"]
      },
      {
        id: "refill-45kg",
        name: "45 KG Industrial Refill",
        category: "Heavy Industrial",
        capacity: "45 KG",
        priceUGX: 280000,
        priceFormatted: "UGX 280,000",
        popular: false,
        desc: "Heavy industrial usage, school kitchens & large facilities.",
        features: ["Heavy Duty 45kg LPG", "Scheduled Refill Supply", "Commercial Invoicing Available"]
      }
    ]
  },
  {
    id: "new-connection",
    name: "New Gas Connection",
    shortName: "New Connections",
    badge: "Complete Kit",
    icon: Package,
    tagline: "Complete brand new cylinder + first full gas fill + safety fittings",
    items: [
      {
        id: "new-6kg",
        name: "6 KG New Connection",
        category: "Domestic Starter",
        capacity: "6 KG",
        priceUGX: 160000,
        priceFormatted: "UGX 160,000",
        popular: false,
        desc: "Brand new 6kg cylinder, gas fill & burner attachment.",
        features: ["New Conch Gas Cylinder", "First 6kg Gas Fill Included", "Safety Valve & Burner", "1 Year Shell Warranty"]
      },
      {
        id: "new-13kg",
        name: "13 KG New Connection",
        category: "Home Master",
        capacity: "13 KG",
        priceUGX: 260000,
        priceFormatted: "UGX 260,000",
        popular: true,
        desc: "Brand new 13kg cylinder with initial full gas fill.",
        features: ["New Conch 13kg Cylinder", "Full 13kg Gas Included", "Safety Inspection Certificate", "Home Installation Assist"]
      },
      {
        id: "new-40kg",
        name: "40 KG Commercial Kit",
        category: "Commercial Setup",
        capacity: "40 KG",
        priceUGX: 600000,
        priceFormatted: "UGX 600,000",
        popular: false,
        desc: "Heavy duty commercial cylinder for catering & hospitality.",
        features: ["New Heavy 40kg Cylinder", "Initial Full Commercial Fill", "High Pressure Test Certified"]
      },
      {
        id: "new-45kg",
        name: "45 KG Industrial Kit",
        category: "Heavy Commercial",
        capacity: "45 KG",
        priceUGX: 620000,
        priceFormatted: "UGX 620,000",
        popular: false,
        desc: "Industrial grade 45kg cylinder for high-demand setups.",
        features: ["New Heavy 45kg Cylinder", "Full Industrial Gas Fill", "Commercial Delivery & Setup"]
      }
    ]
  },
  {
    id: "accessories",
    name: "Gas Accessories",
    shortName: "Gas Accessories",
    badge: "Safety Regulators",
    icon: Wrench,
    tagline: "Certified high-pressure and low-pressure industrial & home regulators",
    items: [
      {
        id: "acc-low-pressure",
        name: "LPG Low Pressure Regulator",
        category: "Domestic Regulator",
        capacity: "Standard Fit",
        priceUGX: 50000,
        priceFormatted: "UGX 50,000",
        popular: true,
        desc: "Precision low-pressure safety regulator for home cookers.",
        features: ["Certified Safety Shut-off", "Fits 6kg & 13kg Cylinders", "Corrosion Resistant Brass Fitting"]
      },
      {
        id: "acc-high-pressure",
        name: "LPG High Pressure GXL Regulator",
        category: "High Pressure",
        capacity: "GXL Heavy Duty",
        priceUGX: 70000,
        priceFormatted: "UGX 70,000",
        popular: false,
        desc: "Heavy duty high pressure regulator for commercial burners.",
        features: ["Heavy Flow GXL Design", "Adjustable Flame Pressure", "Commercial Kitchen Grade"]
      },
      {
        id: "acc-argon",
        name: "Argon Gas Regulator",
        category: "Industrial Welding",
        capacity: "Dual Gauge",
        priceUGX: 550000,
        priceFormatted: "UGX 550,000",
        popular: false,
        desc: "Precision dual-gauge argon regulator for TIG/MIG welding.",
        features: ["Dual Flow-Meter Gauges", "0-25 MPa Working Pressure", "Heavy Solid Brass Body"]
      },
      {
        id: "acc-acetylene",
        name: "Acetylene Gas Regulator",
        category: "Industrial Cutting",
        capacity: "Heavy Gauge",
        priceUGX: 550000,
        priceFormatted: "UGX 550,000",
        popular: false,
        desc: "Industrial acetylene pressure gauge regulator for gas welding.",
        features: ["Precision Pressure Control", "Flashback Safety Design", "Certified Industrial Grade"]
      }
    ]
  },
  {
    id: "grease",
    name: "Grease Prices",
    shortName: "Grease & Lubricants",
    badge: "Industrial Grade",
    icon: Droplets,
    tagline: "High-grade automotive and industrial mechanical grease & lubricants",
    items: [
      {
        id: "grease-50g",
        name: "Industrial Grease 50g",
        category: "Quick Maintenance",
        capacity: "50 g",
        priceUGX: 3000,
        priceFormatted: "UGX 3,000",
        popular: false,
        desc: "Compact pack for quick household and bicycle/motor maintenance.",
        features: ["High Viscosity Formula", "Water & Heat Resistant", "Easy Application Sachet/Tub"]
      },
      {
        id: "grease-500g",
        name: "Industrial Grease 500g",
        category: "Automotive Pack",
        capacity: "500 g",
        priceUGX: 12000,
        priceFormatted: "UGX 12,000",
        popular: true,
        desc: "Standard tub for automotive repair, machinery and wheel bearings.",
        features: ["Multi-Purpose EP Grease", "Extreme Temperature Stability", "Anti-Rust & Anti-Corrosion"]
      },
      {
        id: "grease-15kg",
        name: "Heavy Grease 15 Kg Bucket",
        category: "Workshop / Fleet",
        capacity: "15 KG",
        priceUGX: 340000,
        priceFormatted: "UGX 340,000",
        popular: false,
        desc: "Commercial bucket for garages, trucking fleets & workshops.",
        features: ["Heavy Duty 15kg Tub", "High Load Bearing Capacity", "Fleet Bulk Value"]
      },
      {
        id: "grease-180kg",
        name: "Industrial Grease 180 Kg Drum",
        category: "Factory / Plant",
        capacity: "180 KG",
        priceUGX: 3400000,
        priceFormatted: "UGX 3,400,000",
        popular: false,
        desc: "Full standard industrial drum for factories, plants and heavy machinery.",
        features: ["180kg Sealed Steel Drum", "Certified ISO Lubrication", "Direct Factory Dispatch in Uganda"]
      }
    ]
  }
];

export default function ConchPricingCatalogSection({ title, subtitle }) {
  const [activeTab, setActiveTab] = useState("refill");
  const navigate = useNavigate();

  const currentCategory = PRICING_CATALOG.find(c => c.id === activeTab) || PRICING_CATALOG[0];

  const handleOrder = (item) => {
    const rawWeight = typeof item.capacity === "string" 
      ? parseFloat(item.capacity.replace(/[^0-9.]/g, "")) 
      : (typeof item.weight === "string" ? parseFloat(item.weight.replace(/[^0-9.]/g, "")) : (item.weight || 13));

    const isNew = activeTab === "new-connection" || item.name.toLowerCase().includes("new");

    const quoteObj = {
      country: "Uganda",
      countryCode: "UG",
      location: "Kampala (Kira Road Depot)",
      gasType: currentCategory.name || "LPG Cooking Gas",
      medicineType: currentCategory.name || "LPG Cooking Gas",
      gasLabel: item.name,
      mobile: "",
      prescription: "YES",
      weight: rawWeight || 13,
      provider: "CONCH EXPRESS",
      price: item.priceUGX || 48000,
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
          price: item.priceUGX || 48000,
          timeline: "Within 2 Hours"
        }
      }
    });
  };

  return (
    <section id="conch-pricing-catalog" className="py-16 md:py-24 bg-slate-50/60 font-sans border-b border-slate-200/60 relative overflow-hidden">
      
      {/* Background Ambient Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-red-500/5 via-transparent to-[#830000]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ═══════════════════════════════════════
            SECTION HEADER
        ═══════════════════════════════════════ */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-50 border border-[#BC0202]/20 mb-3 shadow-2xs">
            <Flame className="w-4 h-4 text-[#BC0202] fill-[#BC0202]" />
            <span className="text-[11px] font-black uppercase tracking-widest text-[#BC0202]">
              CONCH GAS • TRANSPARENT PRICING
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-tight mb-3 font-display">
            Official Pricing & <span className="bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] bg-clip-text text-transparent">Product Catalog</span>
          </h2>

          <p className="text-slate-500 text-xs sm:text-sm md:text-[15px] font-medium leading-relaxed">
            {subtitle || "Enjoy factory-direct affordable rates on genuine Conch Gas refills, complete new connection kits, certified gas accessories, and industrial grease across Uganda."}
          </p>
        </div>


        {/* ═══════════════════════════════════════
            INTERACTIVE CATEGORY TABS
        ═══════════════════════════════════════ */}
        <div className="flex items-center justify-center mb-10">
          <div className="inline-flex p-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-sm gap-1.5 sm:gap-2 flex-wrap justify-center">
            {PRICING_CATALOG.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] text-white shadow-md shadow-[#BC0202]/25 scale-[1.02]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <TabIcon className={`w-4 h-4 ${isActive ? "text-white fill-white" : "text-slate-400"}`} />
                  <span>{tab.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Tagline & Subheading */}
        <div className="text-center mb-8">
          <span className="text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-200 px-4 py-1.5 rounded-full shadow-2xs inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#BC0202]" />
            {currentCategory.tagline}
          </span>
        </div>


        {/* ═══════════════════════════════════════
            PRODUCT PRICING CARDS GRID
        ═══════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
          >
            {currentCategory.items.map((item, idx) => {
              const whatsappMsg = encodeURIComponent(`Hello Conch Gas! I want to order ${item.name} at ${item.priceFormatted}. Please arrange delivery to Kampala.`);
              const whatsappUrl = `https://wa.me/256776500786?text=${whatsappMsg}`;

              return (
                <div
                  key={item.id}
                  className="relative bg-white border border-slate-200/90 hover:border-[#BC0202]/50 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-2xl hover:-translate-y-1.5 group"
                >

                  <div>
                    {/* Top Capacity & Category */}
                    <div className="flex items-center justify-between mb-3 pt-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                        {item.category}
                      </span>
                      <span className="text-xs font-black text-[#BC0202] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                        {item.capacity}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug mb-2 font-display group-hover:text-[#BC0202] transition-colors">
                      {item.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4 min-h-[36px]">
                      {item.desc}
                    </p>

                    {/* Price Section */}
                    <div className="my-4 py-3.5 px-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                        Official Price
                      </span>
                      <div className="text-2xl font-black text-slate-900 tracking-tight font-display text-[#000000]">
                        {item.priceFormatted}
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 mb-6 pt-1">
                      {item.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                          <span className="w-4 h-4 rounded-full bg-red-50 text-[#BC0202] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                          <span className="leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions (Order Now + WhatsApp) */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleOrder(item)}
                      className="w-full py-3 px-4 rounded-xl bg-[#000000] hover:bg-gradient-to-r hover:from-[#830000] hover:to-[#BC0202] text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-xs group-hover:bg-gradient-to-r group-hover:from-[#830000] group-hover:via-[#BC0202] group-hover:to-[#FF0000] cursor-pointer"
                    >
                      <span>ORDER NOW</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 font-bold text-[11px] uppercase tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Order on WhatsApp</span>
                    </a>
                  </div>

                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ═══════════════════════════════════════
            BOTTOM ASSURANCE & CONTACT BANNER
        ═══════════════════════════════════════ */}
        <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-[#000000] via-[#830000] to-[#BC0202] rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
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
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-md"
            >
              <PhoneCall className="w-4 h-4 text-[#BC0202]" />
              <span>+256 776 500 786</span>
            </a>
            <Link
              to="/calculator.htm"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#BC0202] hover:bg-[#FF0000] text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-md"
            >
              <span>Instant Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
