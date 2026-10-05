import React from 'react';
import { motion } from "motion/react";
import { Banknote, Truck, HandCoins, Smartphone, ShieldCheck, Check } from "lucide-react";

const PROMISES_DATA = [
  {
    title: "AFFORDABLE",
    subtitle: "More Gas Pay Less",
    icon: Banknote,
    bgColor: "bg-red-50",
    iconColor: "text-[#BC0202]"
  },
  {
    title: "FREE DELIVERY",
    subtitle: "Home delivery free around Kampala",
    icon: Truck,
    bgColor: "bg-red-50",
    iconColor: "text-[#BC0202]"
  },
  {
    title: "PAYMENT ON DELIVERY",
    subtitle: "Pay only when your order is delivered to your doorstep.",
    icon: HandCoins,
    bgColor: "bg-red-50",
    iconColor: "text-[#BC0202]"
  },
  {
    title: "ORDER ONLINE",
    subtitle: "Order Online either by Whatsapp or Toll Free",
    icon: Smartphone,
    bgColor: "bg-red-50",
    iconColor: "text-[#BC0202]"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function StatsSection({ title, subtitle }) {
  return (
    <div id="stats-section" className="relative flex flex-col bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 py-8 md:py-12 font-sans border-y border-slate-200/70 overflow-hidden">
      
      {/* Subtle Ambient Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-red-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-[#830000]/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Top Intro Part */}
      <motion.div 
        className="pb-5 md:pb-7 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-[#BC0202]/20 mb-2.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#BC0202] animate-pulse" />
            <span className="text-[#BC0202] text-[10px] md:text-[11px] font-black uppercase tracking-widest">
              {title || "WHY CHOOSE CONCH GAS"}
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-2.5 font-display">
            Safe, Reliable & Affordable <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] bg-clip-text text-transparent">
              Gas Solutions for Every Home
            </span>
          </h2>
          
          <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl">
            {subtitle || "Conch Gas Ltd is Uganda's premier distributor of LPG cooking gas and industrial gases. Guided by safety, speed, and affordability, we deliver factory-sealed cylinders directly to your doorstep."}
          </p>
        </div>
      </motion.div>

      {/* 4 Cards Grid - 2 columns on mobile, 4 on desktop */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full relative z-10">
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {PROMISES_DATA.map((item, idx) => {
            const IconComponent = item.icon;

            return (
              <motion.div 
                key={idx} 
                variants={cardVariants}
                className="w-full h-full"
              >
                <div
                  className="relative bg-white border border-slate-200/90 hover:border-[#BC0202]/40 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 h-full min-h-[140px] sm:min-h-[170px] md:min-h-[185px] transition-all duration-300 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-xl hover:shadow-red-950/5 hover:-translate-y-1 group overflow-hidden"
                >
                  {/* Subtle Top Border Gradient on Hover */}
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#BC0202] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Compact Icon Circle with Gradient & Micro-Animation */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/70 border border-red-200/60 text-[#BC0202] flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-[#830000] group-hover:to-[#BC0202] group-hover:text-white transition-all duration-300 shadow-2xs">
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>

                  {/* Feature Title */}
                  <h3 className="text-xs sm:text-sm md:text-[15px] font-black text-slate-900 tracking-tight uppercase font-display mb-1 sm:mb-1.5 group-hover:text-[#BC0202] transition-colors">
                    {item.title}
                  </h3>

                  {/* Subtitle / Key Message */}
                  <p className="text-[10px] sm:text-xs md:text-[13px] font-bold text-slate-600 group-hover:text-[#BC0202] leading-tight sm:leading-snug max-w-[220px] transition-colors">
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

    </div>
  );
}
