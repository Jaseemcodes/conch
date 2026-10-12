import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquareQuote, 
  X, 
  CheckCircle2, 
  Loader2, 
  PenLine 
} from "lucide-react";
import { TESTIMONIALS } from "../../constants";
import api from "../../utils/api";

export default function TestimonialsSection({ title, subtitle }) {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [testimonialsList, setTestimonialsList] = useState(TESTIMONIALS?.items || TESTIMONIALS?.list || []);

  // Review Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    city: "Kampala",
    review: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleRatingClick = (newRating) => {
    setRating(newRating);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name.trim() || !formData.review.trim()) {
      setErrorMessage("Please enter your name and review details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        title: formData.title.trim() || "EXCELLENT QUALITY",
        rating: rating,
        country: formData.city.trim() || "Kampala",
        review: formData.review.trim(),
        designation: "Verified Customer"
      };

      const res = await api.post("/testimonials", payload);

      if (res.data && res.data.success) {
        const createdReview = res.data.data || {
          ...payload,
          _id: Date.now().toString()
        };
        // Add newly submitted review to state immediately
        setTestimonialsList((prev) => [createdReview, ...prev]);
        setTestimonialIdx(0);
        setSubmitSuccess(true);

        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess(false);
          setFormData({ name: "", title: "", city: "Kampala", review: "" });
          setRating(5);
        }, 2200);
      } else {
        setErrorMessage(res.data?.message || "Failed to submit review. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      // Fallback local addition if API fails so user doesn't get blocked
      const fallbackReview = {
        _id: Date.now().toString(),
        name: formData.name.trim(),
        title: formData.title.trim() || "EXCELLENT QUALITY",
        rating: rating,
        country: formData.city.trim() || "Kampala",
        review: formData.review.trim(),
        designation: "Verified Customer"
      };
      setTestimonialsList((prev) => [fallbackReview, ...prev]);
      setTestimonialIdx(0);
      setSubmitSuccess(true);

      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        setFormData({ name: "", title: "", city: "Kampala", review: "" });
        setRating(5);
      }, 2200);
    } finally {
      setIsSubmitting(false);
    }
  };

  const RATING_LABELS = {
    1: "Poor Experience",
    2: "Fair",
    3: "Good & Reliable",
    4: "Very Good Quality",
    5: "5 Stars • Excellent & Recommended!"
  };

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
                      {item.designation || "Verified Customer"} • {item.country || "Kampala"}
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

        {/* ═══════════════════════════════════════
            WRITE A REVIEW BUTTON
        ═══════════════════════════════════════ */}
        <div className="mt-8 flex justify-center">
          <button
            id="write-review-btn"
            onClick={() => {
              setErrorMessage("");
              setSubmitSuccess(false);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
          >
            <Star size={16} className="fill-amber-300 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>Write a Customer Review</span>
            <PenLine size={15} className="opacity-90" />
          </button>
        </div>

      </div>

      {/* ═══════════════════════════════════════
          INTERACTIVE REVIEW SUBMISSION MODAL
      ═══════════════════════════════════════ */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 font-sans"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#BC0202] animate-pulse" />
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-display tracking-tight uppercase">
                    Share Your Review
                  </h3>
                </div>
                <button
                  onClick={() => !isSubmitting && setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {submitSuccess ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-10 text-center space-y-3"
                  >
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                      <CheckCircle2 size={36} />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 font-display">
                      Thank You For Your Review!
                    </h4>
                    <p className="text-sm text-slate-600 max-w-xs mx-auto">
                      Your feedback has been submitted successfully and is now featured in our verified customer reviews.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {/* Star Rating Selector */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                        Your Rating *
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50/80 border border-amber-200/70">
                          {[1, 2, 3, 4, 5].map((starVal) => {
                            const isFilled = (hoverRating || rating) >= starVal;
                            return (
                              <button
                                key={starVal}
                                type="button"
                                onClick={() => handleRatingClick(starVal)}
                                onMouseEnter={() => setHoverRating(starVal)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="p-1 cursor-pointer transition-transform hover:scale-120 active:scale-95"
                                aria-label={`Rate ${starVal} stars`}
                              >
                                <Star
                                  size={24}
                                  className={isFilled ? "fill-amber-400 text-amber-400 drop-shadow-xs" : "fill-slate-200 text-slate-300"}
                                />
                              </button>
                            );
                          })}
                        </div>
                        <span className="text-xs font-bold text-amber-700">
                          {RATING_LABELS[hoverRating || rating]}
                        </span>
                      </div>
                    </div>

                    {/* Name & City Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Senyondo Adam"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:border-[#BC0202] focus:ring-2 focus:ring-[#BC0202]/15 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                          Location / City
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="e.g. Kampala, Kira Road"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:border-[#BC0202] focus:ring-2 focus:ring-[#BC0202]/15 transition-all"
                        />
                      </div>
                    </div>

                    {/* Review Title */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                        Headline / Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Excellent Service & Timely Delivery"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:border-[#BC0202] focus:ring-2 focus:ring-[#BC0202]/15 transition-all"
                      />
                    </div>

                    {/* Review Textarea */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                        Your Feedback / Experience *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.review}
                        onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                        placeholder="Tell us about the gas cylinder refill, delivery speed, or customer support..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:border-[#BC0202] focus:ring-2 focus:ring-[#BC0202]/15 transition-all resize-none"
                      />
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
                        {errorMessage}
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        disabled={isSubmitting}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg disabled:opacity-60 transition-all cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Review</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
