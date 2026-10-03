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
    <div id="stats-section" className="flex flex-col bg-slate-50/60 pt-10 pb-12 md:py-16 font-sans border-y border-slate-200/60">
      
      {/* Top Intro Part */}
      <motion.div 
        className="pb-8 md:pb-12"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <span className="text-[#BC0202] bg-red-50 border border-[#BC0202]/20 text-[10px] md:text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
            {title || "WHY CHOOSE CONCH GAS"}
          </span>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-3 font-display">
            Safe, Reliable & Affordable <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] bg-clip-text text-transparent">Gas Solutions for Every Home</span>
          </h2>
          
          <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl">
            {subtitle || "Conch Gas Ltd is Uganda's premier distributor of LPG cooking gas and industrial gases. Guided by safety, speed, and affordability, we deliver factory-sealed cylinders directly to your doorstep."}
          </p>
        </div>
      </motion.div>

      {/* 4 Cards Grid - 2 columns on mobile, 4 on desktop */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
          variants={containerVariants}
          initial="visible"
          animate="visible"
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
                  className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 md:p-8 h-full min-h-[150px] sm:min-h-[190px] md:min-h-[210px] transition-all duration-300 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-xl hover:-translate-y-1.5 hover:border-[#BC0202]/30 group"
                >
                  {/* Smaller compact Icon Circle */}
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl ${item.bgColor} ${item.iconColor} flex items-center justify-center mb-2.5 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-2xs`}>
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>

                  {/* Feature Title */}
                  <h3 className="text-xs sm:text-sm md:text-[15px] font-black text-slate-900 tracking-tight uppercase font-display mb-1 sm:mb-1.5">
                    {item.title}
                  </h3>

                  {/* Subtitle / Key Message */}
                  <p className="text-[10px] sm:text-xs md:text-[13px] font-bold text-[#BC0202] leading-tight sm:leading-snug max-w-[220px]">
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
