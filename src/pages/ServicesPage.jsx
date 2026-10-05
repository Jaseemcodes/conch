import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Wrench, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Award,
  Flame,
  Truck,
  UtensilsCrossed
} from "lucide-react";
import { TOP_BAR } from "../constants";
import { applyPageSEO } from "../utils/seo";

/* ─── Section number badge (Pure CSS / Lightweight) ─── */
const SectionBadge = ({ number, icon: Icon }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="relative">
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#830000] to-[#BC0202] text-white flex items-center justify-center text-xs sm:text-sm font-black shadow-md shadow-red-600/20">
        {number}
      </div>
      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-md bg-white border-2 border-[#BC0202] flex items-center justify-center">
        <Icon size={9} className="text-[#BC0202]" />
      </div>
    </div>
    <div className="h-px flex-1 bg-gradient-to-r from-[#BC0202]/20 to-transparent" />
  </div>
);

/* ─── Hardware-Accelerated 60fps Project Card ─── */
const ProjectCard = ({ imgItem, label = "CONCH GAS PROJECT", footerLeft = "Conch Technical Team", footerRight = "Certified Installation" }) => (
  <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col will-change-transform">
    <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
      <img 
        src={imgItem.src}
        alt={imgItem.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = imgItem.fallback;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
      
      <div className="absolute top-3 left-3">
        <div className="bg-gradient-to-r from-[#830000] to-[#BC0202] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
          {label}
        </div>
      </div>

      <div className="absolute bottom-3 left-3 right-3 text-white">
        <h3 className="text-sm sm:text-base font-black tracking-wide font-display uppercase drop-shadow-md leading-tight">
          {imgItem.title}
        </h3>
      </div>
    </div>

    {imgItem.caption ? (
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white">
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          {imgItem.caption}
        </p>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
          <span className="uppercase tracking-wider text-[#BC0202]">{footerLeft}</span>
          <span className="inline-flex items-center gap-1 text-slate-500">
            <CheckCircle2 size={13} className="text-[#BC0202]" /> {footerRight}
          </span>
        </div>
      </div>
    ) : (
      <div className="p-4 sm:p-5 flex items-center justify-between text-[11px] font-bold bg-white">
        <span className="uppercase tracking-wider text-[#BC0202]">{footerLeft}</span>
        <span className="inline-flex items-center gap-1 text-slate-500">
          <CheckCircle2 size={13} className="text-[#BC0202]" /> {footerRight}
        </span>
      </div>
    )}
  </div>
);

export default function ServicesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    applyPageSEO(
      "Our Services - Bulk LPG, Tank & Restaurant Kitchen Installation | Conch Gas Uganda",
      "Conch Gas Ltd offers Bulk LPG supply, turnkey storage tank installations, gas pipeline fitting, and restaurant/commercial kitchen gas installations across Uganda.",
      "bulk lpg uganda, tank installation kampala, restaurant kitchen gas piping, commercial kitchen installation, lpg pipeline fitting uganda"
    );
  }, []);

  const tankImages = [
    {
      title: "INSTALLING OF LPG TANK",
      caption: "Professional on-site lifting and precision positioning of heavy-duty LPG storage tanks by certified engineers.",
      src: "/installing of lpg tank.webp",
      fallback: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "INSTALLED LPG TANK",
      caption: "Fully completed, pressure-tested and certified industrial bulk LPG tank installation with manifold connection.",
      src: "/installed lpg tank.webp",
      fallback: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const pipelineImages = [
    {
      title: "LPG PIPE INSTALLATION",
      caption: "Precision industrial pipe fitting and testing for commercial kitchens, institutions, and industrial reticulation networks.",
      src: "/lpg pipe installation.webp",
      fallback: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "MANIFOLD WITH PRESSURE GAUGE",
      caption: "Calibrated high-precision gas manifold system with digital & analog pressure gauges and safety shut-off mechanisms.",
      src: "/Manifold with pressure gauge.webp",
      fallback: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "MANIFOLD FOR GAS CYLINDERS",
      caption: "Multi-cylinder high-pressure gas manifold bank ensuring 24/7 continuous uninterrupted gas flow with auto-changeover.",
      src: "/Manifold for gas cylinders.webp",
      fallback: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const kitchenImages = [
    { title: "COMMERCIAL KITCHEN GAS PIPING", src: "/a.webp", fallback: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80" },
    { title: "HOTEL & RESTAURANT BURNER SETUP", src: "/b.webp", fallback: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80" },
    { title: "SAFETY MANIFOLD & SHUT-OFF VALVES", src: "/c.webp", fallback: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80" },
    { title: "HEAVY-DUTY COMMERCIAL RANGE CONNECTION", src: "/d.webp", fallback: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80" },
    { title: "CUSTOM KITCHEN RETICULATION SYSTEM", src: "/e.webp", fallback: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80" },
    { title: "COMMISSIONED KITCHEN GAS SYSTEM", src: "/f.webp", fallback: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80" }
  ];

  return (
    <div className="bg-[#FAFDFD] font-sans text-slate-700 min-h-screen">
      
      {/* ═══════════ 1. HERO BANNER ═══════════ */}
      <div 
        id="services-hero" 
        className="relative h-[260px] md:h-[340px] overflow-hidden flex items-end pb-8 md:pb-12 bg-slate-950"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{ backgroundImage: `url('/hero_gas_banner.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white z-10">
          <div className="space-y-2.5 max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight font-display uppercase text-white drop-shadow-md">
              Our Services
            </h1>
            <nav className="text-xs md:text-sm font-semibold tracking-wide flex items-center gap-2 text-white/80">
              <Link to="/" className="hover:text-[#BC0202] transition-colors text-white/90">Home</Link>
              <span className="text-white/40">»</span>
              <span className="text-[#BC0202] font-bold">Services</span>
            </nav>
          </div>
        </div>
      </div>

      {/* ═══════════ 2. STATS BAR ═══════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xl shadow-slate-200/50">
          {[
            { icon: Award, value: "15+ Years", label: "Engineering Heritage" },
            { icon: ShieldCheck, value: "100% Safe", label: "Turnkey Standards" },
            { icon: CheckCircle2, value: "UNBS Certified", label: "Quality Compliant" }
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3.5 p-2">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#BC0202] flex items-center justify-center shrink-0 border border-red-100 shadow-sm">
                <stat.icon size={24} className="stroke-[2.2]" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-display">{stat.value}</div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════ 3. MAIN SERVICES CONTENT ═══════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
        
        {/* ─── SECTION 1: BULK LPG SUPPLY ─── */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm space-y-8">
          <SectionBadge number="01" icon={Truck} />
          <div className="space-y-6 max-w-4xl">
            <div className="space-y-2">
              <span className="text-[12px] font-black uppercase tracking-widest text-[#BC0202] block">
                CONCH GAS
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-display uppercase">
                BULK LPG SUPPLY SERVICES
              </h2>
              <div className="w-16 h-1.5 bg-gradient-to-r from-[#830000] to-[#BC0202] rounded-full" />
            </div>

            <div className="space-y-5 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              <p>
                Our reliable bulk LPG supply service ensures a steady and uninterrupted flow of LPG to meet the energy demands of industries, commercial establishments, and residential complexes. Whether you require LPG for manufacturing, heating, or other applications, we guarantee timely and cost-effective deliveries to keep your operations running smoothly.
              </p>

              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-50/90 via-slate-50 to-transparent border-l-4 border-[#BC0202] text-slate-900 font-bold text-lg sm:text-xl">
                The industrial LPG cylinders also come in two types: vapour withdrawal and liquid withdrawal, depending on the application.
              </div>

              <p>
                LPG gas, provided in an industrial LPG cylinder, is the energy of choice for many industrial applications because of its portability, high energy content and clean burning. LPG fuel is extremely versatile providing exceptional convenience to homes and business. It is very portable, being stored and transported in LPG tanks, as a liquid, and used as a gas when needed. It is the same LPG used for home heating and cooking. An industrial LPG cylinder is generally larger and tanker filled.
              </p>
            </div>
          </div>
        </div>

        {/* ─── SECTION 2: TANK INSTALLATION ─── */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm space-y-10">
          <SectionBadge number="02" icon={Wrench} />
          <div className="space-y-6 max-w-4xl">
            <div className="space-y-2">
              <span className="text-[12px] font-black uppercase tracking-widest text-[#BC0202] block">
                CONCH GAS
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-display uppercase">
                OUR TANK INSTALLATION SERVICES
              </h2>
              <div className="w-16 h-1.5 bg-gradient-to-r from-[#830000] to-[#BC0202] rounded-full" />
            </div>

            <div className="space-y-5 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              <p>
                As pioneers in the LPG industry, we offer expert LPG tank installation services that adhere to the highest safety standards. Our skilled technicians assess your specific needs and environment to recommend and install the most suitable LPG tanks, be it for residential, commercial, or industrial use.
              </p>

              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-50/90 via-slate-50 to-transparent border-l-4 border-[#BC0202] text-slate-900 font-bold text-lg sm:text-xl">
                We do full design and service for LPG tank installations including replacement and pipework
              </div>

              <p>
                We offer replacement and installation for oil tanks complete with necessary filters and gauges, along with pipework alterations. We offer an extensive range of plastic and steel bundled tanks which are built and installed to meet all kinds of applications. We can even produce oil tanks to your specific requirements if necessary. We can provide whatever you need and professionally install it for you whilst adhering to strict health and safety guidelines.
              </p>
            </div>
          </div>

          {/* 2 Image Grid */}
          <div className="pt-6 border-t border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {tankImages.map((imgItem, idx) => (
                <ProjectCard key={idx} imgItem={imgItem} footerLeft="Conch Technical Team" />
              ))}
            </div>
          </div>
        </div>

        {/* ─── SECTION 3: PIPELINE FITTING ─── */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm space-y-10">
          <SectionBadge number="03" icon={Flame} />
          <div className="space-y-6 max-w-4xl">
            <div className="space-y-2">
              <span className="text-[12px] font-black uppercase tracking-widest text-[#BC0202] block">
                CONCH GAS
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-display uppercase">
                LPG PIPELINE FITTING SERVICES
              </h2>
              <div className="w-16 h-1.5 bg-gradient-to-r from-[#830000] to-[#BC0202] rounded-full" />
            </div>

            <div className="space-y-5 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              <p>
                Streamline your LPG distribution system with our cutting-edge LPG pipeline fitting services. We design, install, and maintain LPG pipelines that facilitate the seamless transfer of gas between storage tanks and end-use points, ensuring minimal wastage and maximum efficiency.
              </p>

              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-50/90 via-slate-50 to-transparent border-l-4 border-[#BC0202] text-slate-900 font-bold text-lg sm:text-xl">
                We provide Gas Manifold Installation for Oxygen, Nitrogen, Argon, CO2, and Ammonia.
              </div>

              <p>
                The system installation comprises fitting and testing of the piping system, measurement gadgets, component fittings and safety instrumentation. We use our highly creative skills to produce and supply an exclusive range of premium quality gas appliances and LPG equipment like: LPG Pipeline Installation. We are one of the leading Distributors, Manufacturers, Traders, Suppliers of premium quality. Each of our products is designed with the process in mind with all the innovations to maximize profit and efficiency.
              </p>
            </div>
          </div>

          {/* 3 Image Grid */}
          <div className="pt-6 border-t border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {pipelineImages.map((imgItem, idx) => (
                <ProjectCard key={idx} imgItem={imgItem} footerLeft="Pipeline & Manifold" footerRight="Certified Engineering" />
              ))}
            </div>
          </div>
        </div>

        {/* ─── SECTION 4: RESTAURANT KITCHEN ─── */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm space-y-10">
          <SectionBadge number="04" icon={UtensilsCrossed} />
          <div className="space-y-6 max-w-4xl">
            <div className="space-y-2">
              <span className="text-[12px] font-black uppercase tracking-widest text-[#BC0202] block">
                CONCH GAS
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-display uppercase">
                RESTAURANT KITCHEN INSTALLATION SERVICES
              </h2>
              <div className="w-16 h-1.5 bg-gradient-to-r from-[#830000] to-[#BC0202] rounded-full" />
            </div>

            <div className="space-y-5 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              <p>
                Transform your restaurant kitchen into a modern, energy-efficient culinary workspace with our professional LPG solutions. Our team of experts specializes in designing and installing LPG systems that cater to the unique requirements of restaurant kitchens, ensuring precise control, enhanced safety, and reduced operating costs.
              </p>

              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-50/90 via-slate-50 to-transparent border-l-4 border-[#BC0202] text-slate-900 font-bold text-lg sm:text-xl">
                We provide Commercial Kitchen Gas Piping Services
              </div>

              <p>
                We install commercial kitchen gas piping system within promised time frame. The installation can used in kitchens of hotels and those of restaurants. If you are running a café, restaurant with a commercial kitchen, then the kitchen is the heart of your business. Conch Gas provides a full installation and regular maintenance service for all commercial kitchen gas appliances
              </p>
            </div>
          </div>

          {/* 6 Image Grid */}
          <div className="pt-6 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {kitchenImages.map((imgItem, idx) => (
                <ProjectCard key={idx} imgItem={imgItem} label="CONCH KITCHEN PROJECT" footerLeft="Commercial Grade" />
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════ 5. CTA BANNER ═══════════ */}
        <div className="relative rounded-3xl p-8 sm:p-10 lg:p-12 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-red-950 text-white shadow-xl border border-red-950">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center lg:text-left max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-red-400">
                <Wrench size={14} />
                Need Kitchen Piping, Pipeline Fitting or Tank Assessment?
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white">
                Get a Free Technical Site Inspection & Quote
              </h3>
              <p className="text-sm text-white/70 max-w-xl leading-relaxed">
                Our certified gas engineers will evaluate your property, calculate required capacity, and provide turnkey commercial kitchen piping, bulk supply, and installation with full compliance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
              <a 
                href={TOP_BAR.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] text-white font-bold text-sm text-center shadow-lg shadow-red-700/30 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>WhatsApp Us</span>
                <ArrowRight size={16} />
              </a>
              <a 
                href={TOP_BAR.phone.href}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm text-center border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Phone size={15} className="text-red-400" />
                <span>Call +256 200 900 010</span>
              </a>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
