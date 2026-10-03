import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Headphones, 
  Truck, 
  Flame, 
  Award, 
  PhoneCall, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Clock
} from "lucide-react";

export default function AboutConchSection({ title, subtitle, content }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const features = [
    {
      id: "quality",
      title: "Quality First",
      description: "Good quality products at competitive prices.",
      icon: Award,
      badge: "ISO Standard",
      accent: "from-[#830000] to-[#BC0202]"
    },
    {
      id: "support",
      title: "24/7 Customer Support",
      description: "We have an excellent customer service for 24 hours a day through phone and email that will promote customer loyalty.",
      icon: Headphones,
      badge: "Always Online",
      accent: "from-[#BC0202] to-[#FF0000]"
    },
    {
      id: "delivery",
      title: "Safe Delivery",
      description: "We have an ever-ready delivery team for deliveries to ensure timely and safe deliveries within Kampala.",
      icon: Truck,
      badge: "Kampala Wide",
      accent: "from-[#830000] to-[#BC0202]"
    }
  ];

  const CylindersShowcaseCard = () => (
    <div className="relative bg-gradient-to-b from-slate-50 via-white to-red-50/40 border border-slate-200/90 rounded-3xl p-5 sm:p-8 shadow-xl overflow-hidden flex flex-col items-center group">
      
      {/* Top Card Badge */}
      <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#BC0202] animate-ping" />
          <span className="text-[11px] font-black tracking-wider text-slate-800 uppercase font-display">
            Conch Gas Complete Range
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#BC0202] bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-full">
          100% Certified Safe
        </span>
      </div>

      {/* Floating Stat Pills */}
      <div className="w-full flex justify-between gap-2 mb-2 z-10">
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-xl px-2.5 py-1 shadow-xs text-[10px] font-bold text-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-[#BC0202]" />
          <span>15 Yrs Experience</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-xl px-2.5 py-1 shadow-xs text-[10px] font-bold text-slate-700">
          <Clock className="w-3.5 h-3.5 text-[#BC0202]" />
          <span>24/7 Delivery</span>
        </div>
      </div>

      {/* High-res Cylinders Lineup Image */}
      <div className="relative my-2 py-2 flex items-center justify-center w-full min-h-[260px] sm:min-h-[320px]">
        <div className="absolute inset-0 bg-radial from-red-500/10 via-transparent to-transparent blur-2xl rounded-full -z-10" />
        <img 
          src="/conch_cylinders_transparent.png" 
          alt="Conch Gas 40Kg, 6Kg, 13Kg, 45Kg Cylinders Range"
          width={480}
          height={470}
          loading="lazy"
          className="w-full max-w-[340px] sm:max-w-[380px] h-auto object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/conch_cylinders_range.png";
          }}
        />
      </div>

      {/* Cylinder Capacities Tags */}
      <div className="w-full pt-4 border-t border-slate-100 flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap">
        <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black tracking-wide">
          6 KG Compact
        </span>
        <span className="px-3 py-1 bg-[#BC0202] text-white rounded-lg text-[10px] font-black tracking-wide shadow-xs">
          13 KG Standard
        </span>
        <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-[10px] font-bold tracking-wide border border-slate-200">
          40 KG Commercial
        </span>
        <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-[10px] font-bold tracking-wide border border-slate-200">
          45 KG Bulk
        </span>
      </div>

      {/* Bottom Assurance Text */}
      <div className="mt-3 text-center">
        <p className="text-[11px] font-semibold text-slate-400">
          Doorstep Delivery Available Across Kampala & Suburbs
        </p>
      </div>

    </div>
  );

  return (
    <section id="about-conch-section" className="relative py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/70 to-white overflow-hidden font-sans border-b border-slate-200/60">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -right-48 w-96 h-96 bg-[#830000]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ═══════════════════════════════════════
              LEFT COLUMN: CONTENT & FEATURES
          ═══════════════════════════════════════ */}
          <motion.div 
            className="lg:col-span-7 space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {/* Top Eyebrow Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-[#BC0202]/20 shadow-2xs">
              <Flame className="w-4 h-4 text-[#BC0202] fill-[#BC0202]" />
              <span className="text-[11px] font-black uppercase tracking-widest text-[#BC0202]">
                CONCH GAS • 15 YEARS OF EXCELLENCE
              </span>
            </motion.div>

            {/* Main Headline & Subheading */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-slate-900 tracking-tight leading-[1.12] font-display">
                AFFORDABLE GAS <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] bg-clip-text text-transparent">
                  NOW IN UGANDA
                </span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-[15px] md:text-base font-medium leading-relaxed max-w-2xl">
                Conch Gas Ltd is a part of <span className="text-slate-900 font-bold">Conch Group Limited</span> and it is based on long-term experience and historical achievements in the fields of construction and contracting for a period of <span className="text-[#BC0202] font-bold">15 years</span>.
              </p>
            </motion.div>

            {/* Mobile View Only: Cylinders Showcase Card rendered right after heading/subheading */}
            <motion.div variants={itemVariants} className="block lg:hidden my-6">
              <CylindersShowcaseCard />
            </motion.div>

            {/* 3 Modern Feature Cards */}
            <motion.div variants={itemVariants} className="space-y-3.5 pt-2">
              {features.map((item) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={item.id}
                    className="group relative bg-white border border-slate-200/80 hover:border-[#BC0202]/40 rounded-2xl p-4 sm:p-5 transition-all duration-300 shadow-xs hover:shadow-lg hover:-translate-y-0.5 flex items-start gap-4"
                  >
                    {/* Icon Box */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-red-100/70 border border-red-200/60 flex items-center justify-center text-[#BC0202] group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-[#830000] group-hover:to-[#BC0202] group-hover:text-white transition-all duration-300 shadow-2xs">
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    {/* Text Details */}
                    <div className="flex-grow">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#BC0202] transition-colors font-display tracking-tight">
                          {item.title}
                        </h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13px] text-slate-500 font-medium leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Action CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3.5 pt-3">
              <Link 
                to="/calculator.htm"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>Order Gas Online Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <a 
                href="tel:+256776500786"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs uppercase tracking-wider border border-slate-200 hover:border-slate-300 shadow-xs transition-all duration-200"
              >
                <PhoneCall className="w-4 h-4 text-[#BC0202]" />
                <span>Call: +256 776 500 786</span>
              </a>
            </motion.div>

          </motion.div>


          {/* ═══════════════════════════════════════
              DESKTOP RIGHT COLUMN: CYLINDERS SHOWCASE (Hidden on mobile)
          ═══════════════════════════════════════ */}
          <motion.div 
            className="hidden lg:block lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <CylindersShowcaseCard />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
