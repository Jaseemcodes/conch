import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  X, 
  Flame, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  Tv,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Curated demo video items with valid YouTube IDs & Conch Gas themed thumbnails
export const DEMO_VIDEOS = [
  {
    id: "featured-1",
    title: "Conch Gas Quality & Certified Cylinder Refill Process",
    subtitle: "A complete walkthrough of our automated UNBS-certified LPG refilling and leak-testing procedures.",
    duration: "2:45",
    badge: "Facility & Safety",
    youtubeId: "aqz-KE-bpKQ", // demo clean energy clip
    thumbnail: "/Why-Choose-Us-Conch-Gas-Ltd.webp",
    isFeatured: true
  },
  {
    id: "clip-1",
    title: "Doorstep Express Cylinder Delivery in Kampala",
    subtitle: "Fast and safe doorstep delivery across Kampala and suburbs in under 60 minutes.",
    duration: "0:45",
    badge: "Express Delivery",
    youtubeId: "jNQXAC9IVRw",
    thumbnail: "/service_bulk_lpg.jpg",
    isFeatured: false
  },
  {
    id: "clip-2",
    title: "Commercial Kitchen Piping & Manifold Fitting",
    subtitle: "Turnkey commercial gas installation for restaurants, bakeries, and hotel kitchens.",
    duration: "1:15",
    badge: "Commercial Kitchen",
    youtubeId: "ScMzIvxBSi4",
    thumbnail: "/service_kitchen_install.jpg",
    isFeatured: false
  },
  {
    id: "clip-3",
    title: "Heavy-Duty Bulk LPG Storage Tank Installation",
    subtitle: "Pressure-tested industrial tanks and high-pressure regulator fittings.",
    duration: "1:30",
    badge: "Bulk Storage",
    youtubeId: "ysz5S6PUM-U",
    thumbnail: "/service_tank_install.jpg",
    isFeatured: false
  },
  {
    id: "clip-4",
    title: "Safe Cylinder Swap & Seal Verification Guide",
    subtitle: "How to check safety tamper seals and swap empty cylinders without hassle.",
    duration: "0:50",
    badge: "Safety Tips",
    youtubeId: "L_LUpnjgPso",
    thumbnail: "/service_pipeline_fitting.jpg",
    isFeatured: false
  }
];

export default function VideoShowcaseSection({ title, subtitle }) {
  const [activeVideo, setActiveVideo] = useState(null);
  const [mobileSlideIdx, setMobileSlideIdx] = useState(0);
  const mobileSliderRef = useRef(null);

  const featuredVideo = DEMO_VIDEOS.find(v => v.isFeatured) || DEMO_VIDEOS[0];
  const compactVideos = DEMO_VIDEOS.filter(v => !v.isFeatured);

  const scrollToSlide = (idx) => {
    if (!mobileSliderRef.current) return;
    const container = mobileSliderRef.current;
    const cards = container.children;
    if (cards[idx]) {
      cards[idx].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      setMobileSlideIdx(idx);
    }
  };

  const handlePrev = () => {
    const newIdx = Math.max(0, mobileSlideIdx - 1);
    scrollToSlide(newIdx);
  };

  const handleNext = () => {
    const newIdx = Math.min(DEMO_VIDEOS.length - 1, mobileSlideIdx + 1);
    scrollToSlide(newIdx);
  };

  const handleMobileScroll = () => {
    if (!mobileSliderRef.current) return;
    const container = mobileSliderRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.children[0]?.offsetWidth || 300;
    const idx = Math.round(scrollLeft / (cardWidth + 16));
    setMobileSlideIdx(Math.min(DEMO_VIDEOS.length - 1, Math.max(0, idx)));
  };

  return (
    <section 
      id="video-showcase-section" 
      className="relative py-12 md:py-20 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/40 font-sans border-b border-slate-200/60 overflow-hidden"
    >
      {/* Decorative Ambient Background Glows */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-[#830000]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── Header ─── */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-[#BC0202]/20 text-[#BC0202] text-xs font-black uppercase tracking-wider shadow-2xs">
            <Flame className="w-3.5 h-3.5 fill-[#BC0202]" />
            <span>CONCH GAS SPOTLIGHT • STORIES & HIGHLIGHTS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight font-display">
            {title || "Explore Conch Gas in Action"}
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm md:text-base font-medium leading-relaxed">
            {subtitle || "Discover what makes Conch Gas Uganda's trusted energy partner — from customer stories and helpful guides to live operations and behind-the-scenes highlights."}
          </p>
        </div>

        {/* ─── Desktop View: 2-Column Grid (Visible only on lg screens >= 1024px) ─── */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* ══════════════════════════════════════════════
              LEFT: FEATURED HORIZONTAL VIDEO (16:9 CARD)
          ══════════════════════════════════════════════ */}
          <motion.div 
            className="lg:col-span-7 flex flex-col justify-between bg-white border border-slate-200/90 hover:border-[#BC0202]/40 rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Big Video Thumbnail & Play Trigger */}
            <div 
              onClick={() => setActiveVideo(featuredVideo)}
              className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 cursor-pointer shadow-md group/thumb"
            >
              <img 
                src={featuredVideo.thumbnail} 
                alt={featuredVideo.title}
                className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-700 ease-out brightness-[0.92]"
              />
              
              {/* Dark subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Badges on Top */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#BC0202] text-white text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Featured Video
                </span>
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10.5px] font-bold tracking-wide flex items-center gap-1 border border-white/10">
                  <Clock className="w-3 h-3 text-red-400" />
                  {featuredVideo.duration}
                </span>
              </div>

              {/* Big Glowing Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-20 h-20 bg-red-600/30 rounded-full animate-ping" />
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#830000] via-[#BC0202] to-[#FF0000] text-white flex items-center justify-center shadow-2xl group-hover/thumb:scale-110 transition-transform duration-300">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Bottom Quick Tag inside thumbnail */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 right-4 flex items-center justify-between text-white text-xs">
                <span className="font-bold tracking-wide flex items-center gap-1.5 text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {featuredVideo.tag || "Official Conch Gas Video"}
                </span>
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-widest hidden sm:inline-block">
                  Click To Watch
                </span>
              </div>
            </div>

            {/* Featured Video Details Below Thumbnail */}
            <div className="mt-4 sm:mt-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#BC0202] uppercase tracking-wider">
                <Tv className="w-3.5 h-3.5" />
                <span>{featuredVideo.badge}</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 group-hover:text-[#BC0202] transition-colors leading-snug">
                {featuredVideo.title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                {featuredVideo.subtitle}
              </p>
            </div>
          </motion.div>


          {/* ══════════════════════════════════════════════
              RIGHT: 4 COMPACT VERTICAL VIDEO CARDS (2x2 GRID)
          ══════════════════════════════════════════════ */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {compactVideos.map((video, idx) => (
              <motion.div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="group relative bg-white border border-slate-200/90 hover:border-[#BC0202]/40 rounded-2xl p-3 sm:p-3.5 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                {/* Compact Thumbnail Container */}
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 shadow-2xs">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out brightness-[0.9]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Duration Pill */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1 border border-white/10">
                    <Clock className="w-2.5 h-2.5 text-red-400" />
                    {video.duration}
                  </div>

                  {/* Compact Center Play Icon Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#830000] to-[#BC0202] text-white flex items-center justify-center shadow-lg group-hover:scale-115 transition-transform duration-300">
                      <Play className="w-4 h-4 fill-white translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Text Details */}
                <div className="mt-2.5 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#BC0202] block">
                    {video.badge}
                  </span>
                  <h4 className="text-xs sm:text-[13px] font-extrabold text-slate-900 line-clamp-2 group-hover:text-[#BC0202] transition-colors leading-snug">
                    {video.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* ─── Mobile / Tablet View: Touch-Swipeable Horizontal Slider (< lg) ─── */}
        <div className="block lg:hidden">
          {/* Swipeable Horizontal Track */}
          <div 
            ref={mobileSliderRef}
            onScroll={handleMobileScroll}
            className="flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory py-2 px-1 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 sm:-mx-6 px-4 sm:px-6"
          >
            {DEMO_VIDEOS.map((video) => (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="w-[84vw] max-w-[340px] shrink-0 snap-center bg-white border border-slate-200/90 hover:border-[#BC0202]/40 rounded-3xl p-4 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer group"
              >
                {/* Thumbnail Container */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.92]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Badges on Top */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-[#BC0202] text-white text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                      {video.isFeatured ? <Sparkles className="w-3 h-3" /> : null}
                      {video.badge}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 border border-white/10">
                      <Clock className="w-2.5 h-2.5 text-red-400" />
                      {video.duration}
                    </span>
                  </div>

                  {/* Center Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#830000] via-[#BC0202] to-[#FF0000] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white translate-x-0.5" />
                    </div>
                  </div>

                  {/* Bottom Tap to Play bar */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[10.5px]">
                    <span className="font-semibold text-slate-200 truncate max-w-[170px]">
                      {video.tag || "Official Video"}
                    </span>
                    <span className="text-slate-300 font-bold uppercase tracking-wider text-[9.5px]">
                      Tap To Play
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-[#BC0202] transition-colors line-clamp-2 leading-snug">
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1 leading-relaxed">
                      {video.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-[#BC0202] font-bold border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Tv className="w-3.5 h-3.5" />
                      Watch Video
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls: Dots + Slide Counter + Prev/Next Buttons */}
          <div className="flex items-center justify-between mt-4 px-2">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {DEMO_VIDEOS.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => scrollToSlide(dotIdx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    mobileSlideIdx === dotIdx ? "w-6 bg-[#BC0202]" : "w-2 bg-slate-300"
                  }`}
                  aria-label={`Slide ${dotIdx + 1}`}
                />
              ))}
            </div>

            {/* Slide arrows & Counter */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 mr-1">
                {mobileSlideIdx + 1} / {DEMO_VIDEOS.length}
              </span>
              <button
                onClick={handlePrev}
                disabled={mobileSlideIdx === 0}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
                aria-label="Previous video"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={mobileSlideIdx === DEMO_VIDEOS.length - 1}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-[#830000] to-[#BC0202] disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
                aria-label="Next video"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ─── Lightbox Video Modal Popup ─── */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
          >
            <motion.div 
              className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 text-white">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#BC0202] animate-pulse" />
                  <span className="text-xs sm:text-sm font-bold truncate max-w-md sm:max-w-xl">
                    {activeVideo.title}
                  </span>
                </div>
                <button 
                  onClick={() => setActiveVideo(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close video"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Responsive Video Iframe */}
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Modal Footer info */}
              <div className="px-5 py-3 bg-slate-900 text-slate-400 text-xs flex items-center justify-between">
                <span>Duration: {activeVideo.duration} • Conch Gas Official</span>
                <span className="text-slate-500">Press ESC or click outside to close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
