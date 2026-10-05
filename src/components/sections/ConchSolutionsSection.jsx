import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { 
  Flame, 
  UtensilsCrossed, 
  ShieldCheck, 
  Wrench, 
  PhoneCall, 
  ArrowRight, 
  CheckCircle2
} from "lucide-react";

const CONCH_SERVICES = [
  {
    id: "bulk-lpg",
    title: "Bulk LPG Supply",
    desc: "LPG fuel is extremely versatile providing exceptional convenience to homes and business.",
    icon: Flame,
    color: "text-[#BC0202] bg-red-50 border-red-100",
    img: "/service_bulk_lpg.jpg",
    badge: "Commercial & Home",
    link: "/contact.htm?service=bulk-lpg"
  },
  {
    id: "kitchen-install",
    title: "Restaurant Kitchen Installation",
    desc: "We install commercial kitchen gas piping system within promised time frame.",
    icon: UtensilsCrossed,
    color: "text-[#830000] bg-slate-50 border-slate-200",
    img: "/service_kitchen_install.jpg",
    badge: "Commercial Kitchens",
    link: "/contact.htm?service=kitchen-installation"
  },
  {
    id: "tank-install",
    title: "Tank Installations",
    desc: "We at Conch gas carry out a full design and service for LPG tank installations including replacement of LPG tanks.",
    icon: ShieldCheck,
    color: "text-[#830000] bg-slate-50 border-slate-200",
    img: "/service_tank_install.jpg",
    badge: "Bulk Tanks",
    link: "/contact.htm?service=tank-installations"
  },
  {
    id: "pipeline-fitting",
    title: "LPG Pipeline Fitting",
    desc: "We provide LPG Gas Manifold Installation for Oxygen, Nitrogen, Argon, CO2, Ammonia application.",
    icon: Wrench,
    color: "text-[#BC0202] bg-red-50 border-red-100",
    img: "/service_pipeline_fitting.jpg",
    badge: "Industrial Manifolds",
    link: "/contact.htm?service=pipeline-fitting"
  }
];

export default function ConchSolutionsSection({ title, subtitle, content }) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.5
      }
    }
  };

  return (
    <section 
      id="conch-solutions-section" 
      className="py-8 md:py-14 border-b border-slate-200/70 relative overflow-hidden bg-white font-sans"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 -left-36 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -right-36 w-80 h-80 bg-[#830000]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* ═══════════════════════════════════════
              LEFT COLUMN - HEADING & CONSULTATION
          ═══════════════════════════════════════ */}
          <motion.div 
            className="lg:col-span-5 space-y-3.5 lg:sticky lg:top-24"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header Badging */}
            <div className="flex flex-col items-start gap-2">
              <span className="inline-flex items-center gap-2 text-[#BC0202] bg-red-50 border border-[#BC0202]/20 text-[11px] sm:text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#BC0202] animate-pulse" />
                COMMERCIAL & INDUSTRIAL SERVICES
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-black text-slate-900 tracking-tight leading-[1.14] font-display">
                Engineered Gas Solutions <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] bg-clip-text text-transparent">
                  For Every Business
                </span>
              </h2>
            </div>

            {/* Introductory Paragraph */}
            <p className="text-slate-600 text-xs sm:text-sm md:text-[15px] leading-relaxed font-normal">
              Conch Gas Ltd specializes in turnkey gas engineering, commercial kitchen piping, heavy storage tank installations, and certified high-purity industrial manifolds across Kampala and Uganda.
            </p>

            {/* Value Checklist */}
            <div className="space-y-2.5 pt-0.5">
              {[
                "Turnkey Commercial Kitchen Gas Piping",
                "Heavy Duty Bulk Tank Design & Replacement",
                "Oxygen, Nitrogen, Argon & CO2 Manifolds"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800 group/check">
                  <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-red-50 border border-red-200 text-[#BC0202] shrink-0 group-hover/check:bg-[#BC0202] group-hover/check:text-white transition-colors duration-200">
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Contact & Consultation Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/contact.htm"
                className="btn-sheen inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] hover:brightness-110 text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-wider shadow-md hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all whitespace-nowrap"
              >
                <span>Request Commercial Quote</span>
                <ArrowRight size={13} />
              </Link>
              <a
                href="tel:+256776500786"
                className="inline-flex items-center justify-center gap-2 px-4.5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-[11px] sm:text-xs uppercase tracking-wider border border-slate-200 hover:border-slate-300 shadow-xs hover:scale-[1.01] active:scale-[0.99] transition-all whitespace-nowrap"
              >
                <PhoneCall size={13} className="text-[#BC0202]" />
                <span>+256 776 500 786</span>
              </a>
            </div>
          </motion.div>


          {/* ═══════════════════════════════════════
              RIGHT COLUMN - 2x2 SERVICES CARDS GRID
          ═══════════════════════════════════════ */}
          <motion.div 
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {CONCH_SERVICES.map((cat) => {
              const Icon = cat.icon;

              return (
                <motion.div 
                  key={cat.id} 
                  variants={cardVariants}
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 20px 30px -10px rgba(188, 2, 2, 0.12), 0 8px 10px -4px rgba(0, 0, 0, 0.04)"
                  }}
                  className="group relative overflow-hidden border border-slate-200/90 hover:border-[#BC0202]/40 bg-white rounded-3xl shadow-xs flex flex-col justify-between transition-all duration-300"
                >
                  {/* Subtle Top-Border Hover Highlight */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#BC0202] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30" />

                  {/* Top Image Container (16:9 Aspect Ratio) */}
                  <div className="w-full aspect-[16/9] overflow-hidden relative shrink-0 bg-slate-950">
                    <img 
                      src={cat.img} 
                      alt={cat.title} 
                      width={600}
                      height={340}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108" 
                    />
                    
                    {/* Subtle gradient vignette over image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                    {/* Small Category Badge on Top-Left */}
                    <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white text-[9.5px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-white/20 shadow-xs">
                      {cat.badge}
                    </span>

                    {/* Small Icon Badge Overlay on Top-Right */}
                    <div className={`absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 ${cat.color} bg-white/95 backdrop-blur-sm shadow-xs z-20 group-hover:scale-110 group-hover:bg-[#BC0202] group-hover:text-white group-hover:border-[#BC0202]`}>
                      <Icon className="w-4 h-4 stroke-[2.2]" />
                    </div>
                  </div>

                  {/* Details Container */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h3 className="text-[15px] sm:text-base font-black text-slate-900 group-hover:text-[#BC0202] transition-colors duration-200 tracking-tight leading-snug font-display">
                        {cat.title}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-slate-500 font-medium leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 border-t border-slate-100">
                      <Link
                        to={cat.link}
                        className="btn-sheen inline-flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-slate-900 group-hover:bg-gradient-to-r group-hover:from-[#830000] group-hover:to-[#BC0202] text-white font-extrabold text-[11px] uppercase tracking-wider transition-all duration-300 shadow-xs"
                      >
                        <span>Learn More & Quote</span>
                        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
