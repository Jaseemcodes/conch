import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronLeft, ChevronRight, MessageSquareQuote } from "lucide-react";
import { TESTIMONIALS } from "../../constants";
import api from "../../utils/api";

export default function TestimonialsSection({ title, subtitle }) {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [testimonialsList, setTestimonialsList] = useState(TESTIMONIALS.list || []);

  useEffect(() => {
    api.get('/testimonials')
      .then(res => {
        if (res.data && res.data.data && res.data.data.length > 0) {
          setTestimonialsList(res.data.data);
        }
      })
      .catch(err => console.error('Error fetching testimonials from API:', err));
  }, []);

  const nextTestimonial = () => {
    if (testimonialsList.length === 0) return;
    setTestimonialIdx((prev) => (prev + 1) % testimonialsList.length);
  };

  const prevTestimonial = () => {
    if (testimonialsList.length === 0) return;
    setTestimonialIdx((prev) => (prev - 1 + testimonialsList.length) % testimonialsList.length);
  };

  const len = testimonialsList.length;
  const activeIndices = len > 0 ? [
    testimonialIdx,
    (testimonialIdx + 1) % len,
    (testimonialIdx + 2) % len
  ] : [];

  const displayTitle = title || "What Our Customers Say";
  const displayLabel = subtitle || TESTIMONIALS.sectionTitle || "Testimonials & Reviews";

  return (
    <section 
      id="testimonials-section" 
      className="py-8 md:py-14 relative overflow-hidden bg-gradient-to-b from-[#F4F6F8] via-white to-[#F4F6F8] border-t border-slate-200/70 font-sans"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-red-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-96 h-96 bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BC0202]/10 border border-[#BC0202]/20 text-[#BC0202] text-xs font-black uppercase tracking-widest mb-2 shadow-2xs">
            <MessageSquareQuote size={14} />
            <span>{displayLabel}</span>
          </div>
          <h2 id="testimonials-heading" className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight font-display">
            {displayTitle}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] mx-auto rounded-full mt-3" />
        </div>

        {/* 3-Card Carousel Display */}
        <div id="testimonials-slider" className="max-w-6xl mx-auto relative px-2 sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {activeIndices.map((idx, activePos) => {
              const item = testimonialsList[idx];
              if (!item) return null;

              // Middle card is the dark featured card
              const isDark = activePos === 1;

              // Responsive visibility: On mobile 1 card, on md+ all 3
              const displayClasses = activePos === 0 
                ? "flex" 
                : activePos === 1 
                  ? "hidden md:flex" 
                  : "hidden md:flex";

              return (
                <motion.div
                  key={`${item._id || idx}-${activePos}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className={`rounded-3xl p-5 sm:p-7 text-center flex flex-col justify-between min-h-[300px] sm:min-h-[340px] transition-all duration-300 relative overflow-hidden ${
                    isDark
                      ? "bg-gradient-to-b from-[#18181B] via-[#121214] to-[#0A0A0B] text-white shadow-2xl ring-1 ring-white/10 md:scale-105 z-10 border border-red-500/20"
                      : "bg-white/95 backdrop-blur-sm text-slate-800 shadow-md hover:shadow-xl border border-slate-200/90 hover:border-[#BC0202]/30"
                  } ${displayClasses}`}
                >
                  {/* Top: Stars & Title */}
                  <div className="flex flex-col items-center">
                    {/* 5 Stars */}
                    <div className="flex justify-center items-center gap-1.5 mb-3 sm:mb-4 text-[#F59E0B]">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star 
                          key={starIdx} 
                          size={18} 
                          className={starIdx < (item.rating || 5) ? "fill-[#F59E0B] stroke-[#F59E0B] drop-shadow-xs" : "fill-slate-300 stroke-slate-300"} 
                        />
                      ))}
                    </div>

                    {/* Review Title */}
                    <h3 className={`text-base sm:text-lg font-black uppercase tracking-wide mb-2 sm:mb-2.5 font-display ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}>
                      {item.title || "GENUINE QUALITY"}
                    </h3>

                    {/* Review Body */}
                    <p className={`text-xs sm:text-[14px] leading-relaxed font-normal px-1 sm:px-2 ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}>
                      “{item.review}”
                    </p>
                  </div>

                  {/* Bottom: Author Name & Verified Badge */}
                  <div className="pt-4 mt-3 border-t border-slate-100/10">
                    <h4 className={`text-sm sm:text-base font-black uppercase tracking-wider ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}>
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-500 tracking-wider uppercase block mt-0.5">
                      Verified Customer • Kampala
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Carousel Side Arrows */}
          <button
            id="slider-prev-btn"
            onClick={prevTestimonial}
            className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-slate-800 hover:text-[#BC0202] border border-slate-200 shadow-xl hover:shadow-2xl flex items-center justify-center p-0 cursor-pointer hover:scale-110 active:scale-95 transition-all z-20 group"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            id="slider-next-btn"
            onClick={nextTestimonial}
            className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-slate-800 hover:text-[#BC0202] border border-slate-200 shadow-xl hover:shadow-2xl flex items-center justify-center p-0 cursor-pointer hover:scale-110 active:scale-95 transition-all z-20 group"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Carousel Pagination Indicator */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {testimonialsList.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setTestimonialIdx(dotIdx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                dotIdx === testimonialIdx ? "w-8 bg-gradient-to-r from-[#830000] to-[#BC0202] shadow-xs" : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

