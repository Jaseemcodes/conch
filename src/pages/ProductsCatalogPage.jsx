import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Flame, 
  Package, 
  ShieldCheck, 
  Truck, 
  PhoneCall, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  MessageCircle,
  Clock,
  Layers,
  Wrench,
  Droplets
} from "lucide-react";
import { PRODUCT_CATEGORIES } from "../constants/products";

const categoryIcons = {
  "lpg-gas-cylinders": Flame,
  "gas-accessories": Wrench,
  "lubricants": Droplets,
  "industrial-gas": Layers
};

export default function ProductsCatalogPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* ═══════════════════════════════════════
          BREADCRUMBS
      ═══════════════════════════════════════ */}
      <div className="bg-white border-b border-slate-200/80 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-[#BC0202] transition-colors">Home</Link>
          <ChevronRight size={13} className="text-slate-400" />
          <span className="text-[#BC0202] font-bold">Products</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          HERO BANNER
      ═══════════════════════════════════════ */}
      <section className="py-16 md:py-20 relative overflow-hidden bg-gradient-to-b from-white via-red-50/20 to-slate-50 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-[#BC0202]/20 shadow-2xs mb-5">
            <Flame className="w-4 h-4 text-[#BC0202] fill-[#BC0202]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#BC0202]">
              CONCH GAS PRODUCTS & CATALOG
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight font-display mb-5">
            Complete Gas, Lubricants <br />
            <span className="bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] bg-clip-text text-transparent">
              & Equipment Range
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
            Explore Conch Gas Uganda's full inventory of domestic LPG cylinders, certified commercial gas piping, industrial manifolds, and high-performance EP2 lubricants.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/calculator.htm"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-xl transition-all"
            >
              <span>Order Gas Online</span>
              <ArrowRight size={15} />
            </Link>
            <a
              href="https://wa.me/256776500786"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#20bd5a] transition-all"
            >
              <MessageCircle size={15} className="fill-white" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4 MAIN CATEGORIES GRID
      ═══════════════════════════════════════ */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {PRODUCT_CATEGORIES.map((cat, cIdx) => {
            const Icon = categoryIcons[cat.id] || Flame;

            return (
              <div key={cat.id} className="space-y-6">
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-[#BC0202] flex items-center justify-center shadow-xs">
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">
                        {cat.title}
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        {cat.items.length} Products Available • Kampala Delivery
                      </p>
                    </div>
                  </div>
                  <Link
                    to={cat.path}
                    className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#BC0202] hover:text-[#830000] transition-colors"
                  >
                    <span>View Category</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {cat.items.map((item, pIdx) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className="group relative bg-white border border-slate-200/90 hover:border-[#BC0202]/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#BC0202] bg-red-50 px-2.5 py-1 rounded-md">
                            {cat.title}
                          </span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500" title="In Stock" />
                        </div>

                        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#BC0202] transition-colors tracking-tight leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-500 font-normal leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-[#BC0202]">
                          View Details
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-slate-900 group-hover:bg-[#BC0202] text-white flex items-center justify-center transition-colors">
                          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
