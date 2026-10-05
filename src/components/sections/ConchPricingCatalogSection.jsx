import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Flame, 
  Package, 
  Wrench, 
  Droplets,
  ArrowRight, 
  MessageCircle, 
  Truck,
  PhoneCall
} from "lucide-react";

export const REFILL_ITEMS = [
  {
    id: "refill-6kg",
    name: "6 KG Cylinder Refill",
    category: "Domestic",
    capacity: "6 KG",
    image: "/6kg.jpg",
    priceUGX: 48000,
    priceFormatted: "UGX 48,000",
    popular: false
  },
  {
    id: "refill-13kg",
    name: "13 KG Cylinder Refill",
    category: "Family Domestic",
    capacity: "13 KG",
    image: "/13kg.jpg",
    priceUGX: 98000,
    priceFormatted: "UGX 98,000",
    popular: true
  },
  {
    id: "refill-40kg",
    name: "40 KG Commercial Refill",
    category: "Commercial",
    capacity: "40 KG",
    image: "/40kg.jpg",
    priceUGX: 240000,
    priceFormatted: "UGX 240,000",
    popular: false
  },
  {
    id: "refill-45kg",
    name: "45 KG Industrial Refill",
    category: "Heavy Industrial",
    capacity: "45 KG",
    image: "/45kg.jpg",
    priceUGX: 280000,
    priceFormatted: "UGX 280,000",
    popular: false
  }
];

export const NEW_CONNECTION_ITEMS = [
  {
    id: "new-6kg",
    name: "6 KG New Connection",
    category: "Domestic Starter",
    capacity: "6 KG",
    image: "/6kg.jpg",
    priceUGX: 160000,
    priceFormatted: "UGX 160,000",
    popular: false
  },
  {
    id: "new-13kg",
    name: "13 KG New Connection",
    category: "Home Master",
    capacity: "13 KG",
    image: "/13kg.jpg",
    priceUGX: 260000,
    priceFormatted: "UGX 260,000",
    popular: true
  },
  {
    id: "new-40kg",
    name: "40 KG Commercial Kit",
    category: "Commercial Setup",
    capacity: "40 KG",
    image: "/40kg.jpg",
    priceUGX: 600000,
    priceFormatted: "UGX 600,000",
    popular: false
  },
  {
    id: "new-45kg",
    name: "45 KG Industrial Kit",
    category: "Heavy Commercial",
    capacity: "45 KG",
    image: "/45kg.jpg",
    priceUGX: 620000,
    priceFormatted: "UGX 620,000",
    popular: false
  }
];

export const ACCESSORY_ITEMS = [
  {
    id: "acc-low-pressure",
    name: "LPG Low Pressure Regulator",
    category: "Domestic Regulator",
    capacity: "Standard Fit",
    image: "/LPG Low pressure regulator side.webp",
    fallback: "/Manifold with pressure gauge.webp",
    priceUGX: 50000,
    priceFormatted: "UGX 50,000",
    popular: true
  },
  {
    id: "acc-high-pressure",
    name: "LPG High Pressure GXL Regulator",
    category: "High Pressure",
    capacity: "GXL Heavy Duty",
    image: "/LPG High pressure GXL Regulator.webp",
    fallback: "/Manifold for gas cylinders.webp",
    priceUGX: 70000,
    priceFormatted: "UGX 70,000",
    popular: false
  },
  {
    id: "acc-argon",
    name: "Argon Regulator",
    category: "Industrial Welding",
    capacity: "Dual Gauge",
    image: "/Argon Regulator.webp",
    fallback: "/Manifold with pressure gauge.webp",
    priceUGX: 550000,
    priceFormatted: "UGX 550,000",
    popular: false
  },
  {
    id: "acc-acetylene",
    name: "Acetylene Regulator",
    category: "Industrial Cutting",
    capacity: "Heavy Gauge",
    image: "/Acetylene Regulator.webp",
    fallback: "/Manifold for gas cylinders.webp",
    priceUGX: 550000,
    priceFormatted: "UGX 550,000",
    popular: false
  }
];

export const GREASE_ITEMS = [
  {
    id: "grease-50g",
    name: "Multipurpose Grease Sachet (50g)",
    category: "Quick Maintenance",
    capacity: "50 g",
    image: "/Multipurpose Grease Sachet (50g).webp",
    fallback: "/conch_cylinders_transparent.png",
    priceUGX: 3000,
    priceFormatted: "UGX 3,000",
    popular: false
  },
  {
    id: "grease-500g",
    name: "EP2 LITHIUM GREASE (500g)",
    category: "Automotive Pack",
    capacity: "500 g",
    image: "/EP2 LITHIUM GREASE (500 g).webp",
    fallback: "/conch_cylinders_transparent.png",
    priceUGX: 12000,
    priceFormatted: "UGX 12,000",
    popular: true
  },
  {
    id: "grease-15kg",
    name: "EP2 LITHIUM GREASE (15kg)",
    category: "Workshop / Fleet",
    capacity: "15 KG",
    image: "/EP2 LITHIUM GREASE (15 kg).webp",
    fallback: "/conch_cylinders_transparent.png",
    priceUGX: 340000,
    priceFormatted: "UGX 340,000",
    popular: false
  },
  {
    id: "grease-180kg",
    name: "EP2 LITHIUM GREASE (180kg)",
    category: "Factory / Plant",
    capacity: "180 KG",
    image: "/EP2 LITHIUM GREASE (180 kg).webp",
    fallback: "/conch_cylinders_transparent.png",
    priceUGX: 3400000,
    priceFormatted: "UGX 3,400,000",
    popular: false
  }
];

export default function ConchPricingCatalogSection({ title, subtitle }) {
  const navigate = useNavigate();

  const handleOrder = (item, orderType = "Gas Refill") => {
    const rawWeight = typeof item.capacity === "string" 
      ? (parseFloat(item.capacity.replace(/[^0-9.]/g, "")) || 13)
      : 13;

    const quoteObj = {
      country: "Uganda",
      countryCode: "UG",
      location: "Kampala (Kira Road Depot)",
      gasType: item.name,
      medicineType: item.name,
      gasLabel: item.name,
      mobile: "",
      prescription: "YES",
      weight: rawWeight,
      provider: "CONCH EXPRESS",
      price: item.priceUGX || 48000,
      timeline: "Within 2 Hours",
      bookingRef: `CG-${Math.floor(100000 + Math.random() * 900000)}`,
      serviceType: orderType.toUpperCase(),
      orderMode: orderType
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

  const renderCard = (item, orderType = "Gas Refill") => {
    const whatsappMsg = encodeURIComponent(`Hello Conch Gas! I want to order ${item.name} at ${item.priceFormatted}. Please arrange delivery in Kampala.`);
    const whatsappUrl = `https://wa.me/256776500786?text=${whatsappMsg}`;

    return (
      <div
        key={item.id}
        className="relative bg-white border border-slate-200/90 hover:border-[#BC0202]/50 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-xl hover:shadow-red-950/5 hover:-translate-y-1.5 group will-change-transform"
      >
        {/* Subtle Top-Border Hover Highlight */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#BC0202] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

        {/* Full-Bleed Product Image Header */}
        <div className="relative w-full h-36 sm:h-52 md:h-60 bg-gradient-to-b from-slate-100/70 via-slate-50 to-white flex items-center justify-center overflow-hidden border-b border-slate-100/80 group/img">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain p-2 sm:p-2.5 group-hover:scale-106 transition-transform duration-500 ease-out"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = item.fallback || "/conch_cylinders_transparent.png";
            }}
          />
        </div>

        {/* Card Body with Padding */}
        <div className="p-2.5 sm:p-4 lg:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Product Name Header with WhatsApp icon on the right */}
            <div className="flex items-center justify-between gap-1.5 mb-1 sm:mb-2">
              <h3 className="text-xs sm:text-[15px] md:text-[17px] font-black text-slate-900 tracking-tight leading-snug font-display group-hover:text-[#BC0202] transition-colors line-clamp-1 sm:line-clamp-2 flex-1">
                {item.name}
              </h3>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Order ${item.name} on WhatsApp`}
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
                {item.priceFormatted}
              </div>
            </div>
          </div>

          {/* Action (Order Now) */}
          <div className="pt-1.5 sm:pt-2 border-t border-slate-100">
            <button
              onClick={() => handleOrder(item, orderType)}
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
            1. GAS REFILLS ROW (4 CARDS)
        ═══════════════════════════════════════ */}
        <div className="space-y-3 sm:space-y-4 mb-7 sm:mb-9">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 border-b border-slate-200/80 pb-2.5 sm:pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#BC0202]" />
                <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight font-display uppercase">
                  LPG Cylinder Refills
                </h3>
                <span className="text-[9px] sm:text-[10px] font-black bg-red-50 text-[#BC0202] border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Doorstep Exchange
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Universal cylinder refills at subsidized official rates with free safety check
              </p>
            </div>
            <Link
              to="/products/gas-refills.htm"
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#BC0202] hover:text-[#830000] uppercase tracking-wider transition-colors shrink-0"
            >
              <span>View All Refills</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-6">
            {REFILL_ITEMS.map((item) => renderCard(item, "Gas Refill"))}
          </div>
        </div>


        {/* ═══════════════════════════════════════
            2. NEW CONNECTIONS ROW (4 CARDS)
        ═══════════════════════════════════════ */}
        <div className="space-y-3 sm:space-y-4 mb-7 sm:mb-9">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 border-b border-slate-200/80 pb-2.5 sm:pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#BC0202]" />
                <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight font-display uppercase">
                  New Gas Connections
                </h3>
                <span className="text-[9px] sm:text-[10px] font-black bg-slate-900 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Complete Set + Gas
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Brand new cylinder + initial full gas fill + certified safety fittings & warranty
              </p>
            </div>
            <Link
              to="/products/new-connections.htm"
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#BC0202] hover:text-[#830000] uppercase tracking-wider transition-colors shrink-0"
            >
              <span>View New Sets</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-6">
            {NEW_CONNECTION_ITEMS.map((item) => renderCard(item, "New Connection"))}
          </div>
        </div>


        {/* ═══════════════════════════════════════
            3. GAS ACCESSORIES ROW (4 CARDS)
        ═══════════════════════════════════════ */}
        <div className="space-y-3 sm:space-y-4 mb-7 sm:mb-9">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 border-b border-slate-200/80 pb-2.5 sm:pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#BC0202]" />
                <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight font-display uppercase">
                  Gas Accessories & Regulators
                </h3>
                <span className="text-[9px] sm:text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Safety Certified
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                High & low-pressure regulators, manifold systems, and safety fittings
              </p>
            </div>
            <Link
              to="/products/gas-accessories.htm"
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#BC0202] hover:text-[#830000] uppercase tracking-wider transition-colors shrink-0"
            >
              <span>View Accessories</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-6">
            {ACCESSORY_ITEMS.map((item) => renderCard(item, "Gas Accessory"))}
          </div>
        </div>


        {/* ═══════════════════════════════════════
            4. GREASE & LUBRICANTS ROW (4 CARDS)
        ═══════════════════════════════════════ */}
        <div className="space-y-3 sm:space-y-4 mb-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 border-b border-slate-200/80 pb-2.5 sm:pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#BC0202]" />
                <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight font-display uppercase">
                  Industrial Grease & Lubricants
                </h3>
                <span className="text-[9px] sm:text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  EP2 High Grade
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Automotive, machinery, fleet maintenance and industrial grease supplies
              </p>
            </div>
            <Link
              to="/products/lubricants.htm"
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#BC0202] hover:text-[#830000] uppercase tracking-wider transition-colors shrink-0"
            >
              <span>View Lubricants</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-6">
            {GREASE_ITEMS.map((item) => renderCard(item, "Lubricants"))}
          </div>
        </div>


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
              to="/calculator.htm"
              className="btn-sheen inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#BC0202] hover:bg-[#FF0000] text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98]"
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
