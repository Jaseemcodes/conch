import { Check } from "lucide-react";
import { HERO } from "../../constants";
import CalculatorForm from "./CalculatorForm";

const heroSlides = [
  {
    heading: "Uganda's Leading & Trusted Choice",
    subheading: "Online LPG Cooking Gas & Industrial Gas Delivery"
  }
];

export default function HeroSection({ content }) {
  const slides = content?.slides || heroSlides;
  const bullets = content?.bullets || HERO?.bullets || [];

  return (
    <>
      <section id="hero-section" className="relative w-full pt-2 md:pt-3 pb-3 md:pb-6 font-sans overflow-hidden">
        
        {/* Background Ambient Layers (High-Performance Modern Mesh) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-red-500/[0.04] rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-[#830000]/[0.05] rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50" />
        </div>

        {/* Hero Content Layer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div id="hero-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch pt-0">
          
          {/* Left Hero: Picture Column with Text Overlay */}
          <div 
            id="hero-left-col" 
            className="lg:col-span-7 relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-slate-700/40 bg-slate-900 animate-[fadeInLeft_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] min-h-[380px] sm:min-h-[440px] lg:min-h-[540px] flex flex-col justify-between group"
          >
            {/* Background Hero Image with Smooth Vignette Gradient (High readability, doesn't overpower image) */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <img 
                src="/hero_fitted.jpg" 
                alt="Conch Gas LPG Delivery in Uganda" 
                fetchPriority="high"
                loading="eager"
                className="w-full h-full object-cover object-center group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/hero.jpg";
                }}
              />
              {/* Smooth cinematic vignette - Rich dark tone behind text on bottom-left, transparent on top-right */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/85 via-slate-900/50 to-slate-900/15 pointer-events-none" />
            </div>

            {/* Top Badge: Conch Gas Watermark */}
            <div className="relative z-10 p-4 sm:p-5 flex items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-white/60 shadow-md">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#830000] to-[#BC0202] text-white flex items-center justify-center shadow-xs">
                  <span className="text-[10px] font-black">C</span>
                </div>
                <span className="text-xs font-black tracking-wider text-slate-900 uppercase font-display">
                  CONCH <span className="text-[#BC0202]">GAS</span>
                </span>
              </div>
            </div>

            {/* Bottom Content Layer: Title, Tag & Bullet List (100% Readable, High-Contrast) */}
            <div className="relative z-10 p-4 sm:p-6 md:p-7 space-y-2 sm:space-y-2.5">
              
              {/* Tagline / Conch Red Pill Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] text-white border border-red-400/30 shadow-md shadow-red-950/40 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10.5px] sm:text-xs font-black uppercase tracking-wider text-white">
                  CUSTOMER'S FIRST & TRUSTED CHOICE
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black text-white drop-shadow-md tracking-tight leading-tight uppercase font-display max-w-xl">
                For Safe & Express LPG Cooking Gas Delivery
              </h1>

              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 sm:gap-y-2.5 pt-1.5 w-full max-w-xl">
                {[
                  "Factory-Sealed Cylinders & Full Weight",
                  "Free Doorstep Gas Pickup & Delivery",
                  "Cheapest Refill & Cylinder Rates",
                  "Free Safety & Leak Testing Support",
                  "24x7 Customer Support & Hotline"
                ].map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-white">
                    <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-gradient-to-br from-[#830000] via-[#BC0202] to-[#FF0000] text-white shrink-0 font-black shadow-xs border border-red-400/40">
                      <Check size={11} className="stroke-[3.5]" />
                    </span>
                    <span className="text-[11px] sm:text-xs md:text-[13px] font-semibold text-white drop-shadow-sm leading-tight">
                      {bullet}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* Right Hero / Calculator Form: Visible on Mobile & Desktop */}
          <div 
            id="hero-right-col" 
            className="block lg:col-span-5 animate-[fadeInRight_0.8s_cubic-bezier(0.16,1,0.3,1)_0.15s_forwards] w-full"
          >
            <CalculatorForm />
          </div>

          </div>
        </div>
      </section>
    </>
  );
}
