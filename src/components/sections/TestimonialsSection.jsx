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
      className="py-16 md:py-24 relative overflow-hidden bg-[#F4F6F8] border-t border-slate-200/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#BC0202]/10 border border-[#BC0202]/20 text-[#BC0202] text-xs font-black uppercase tracking-widest mb-3">
            <MessageSquareQuote size={14} />
            <span>{displayLabel}</span>
          </div>
          <h2 id="testimonials-heading" className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {displayTitle}
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] mx-auto rounded-full mt-4" />
        </div>

        {/* 3-Card Carousel Display */}
        <div id="testimonials-slider" className="max-w-6xl mx-auto relative px-2 sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {activeIndices.map((idx, activePos) => {
              const item = testimonialsList[idx];
              if (!item) return null;

              // Middle card is the dark featured card matching screenshot
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
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`rounded-2xl p-7 sm:p-9 text-center flex flex-col justify-between min-h-[380px] sm:min-h-[420px] transition-all duration-300 ${
                    isDark
                      ? "bg-[#181818] text-white shadow-2xl ring-1 ring-white/10 md:scale-105 z-10"
                      : "bg-white text-slate-800 shadow-lg shadow-slate-200/50 border border-slate-100"
                  } ${displayClasses}`}
                >
                  {/* Top: Stars & Title */}
                  <div className="flex flex-col items-center">
                    {/* 5 Stars */}
                    <div className="flex justify-center items-center gap-1.5 mb-5 text-[#F59E0B]">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star 
                          key={starIdx} 
                          size={22} 
                          className={starIdx < (item.rating || 5) ? "fill-[#F59E0B] stroke-[#F59E0B]" : "fill-slate-300 stroke-slate-300"} 
                        />
                      ))}
                    </div>

                    {/* Review Title */}
                    <h3 className={`text-base sm:text-lg font-black uppercase tracking-wide mb-4 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}>
                      {item.title || "GENUINE QUALITY"}
                    </h3>

                    {/* Review Body */}
                    <p className={`text-sm sm:text-[14.5px] leading-relaxed font-normal px-1 sm:px-2 ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}>
                      {item.review}
                    </p>
                  </div>

                  {/* Bottom: Author Name */}
                  <div className="pt-6 mt-4 border-t border-transparent">
                    <h4 className={`text-sm sm:text-base font-extrabold uppercase tracking-wider ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}>
                      {item.name}
                    </h4>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Carousel Side Arrows */}
          <button
            id="slider-prev-btn"
            onClick={prevTestimonial}
            className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-slate-800 hover:text-[#BC0202] border border-slate-200 shadow-xl hover:shadow-2xl flex items-center justify-center p-0 cursor-pointer hover:scale-110 active:scale-95 transition-all z-20 group"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            id="slider-next-btn"
            onClick={nextTestimonial}
            className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-slate-800 hover:text-[#BC0202] border border-slate-200 shadow-xl hover:shadow-2xl flex items-center justify-center p-0 cursor-pointer hover:scale-110 active:scale-95 transition-all z-20 group"
            aria-label="Next testimonial"
          >
            <ChevronRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Carousel Pagination Indicator */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonialsList.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setTestimonialIdx(dotIdx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                dotIdx === testimonialIdx ? "w-8 bg-[#BC0202]" : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

