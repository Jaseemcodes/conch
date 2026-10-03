import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function SpecialRates() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve calculated quote from routing state, or use default fallback for preview
  const calculatedQuote = location.state?.calculatedQuote || {
    country: "Uganda",
    countryCode: "UG",
    location: "Kampala (Kira Road Depot)",
    gasType: "LPG Commercial & Industrial",
    medicineType: "LPG Commercial Gas",
    mobile: "0700000000",
    prescription: "YES",
    weight: "45 KG (Bulk)",
    serviceType: "DOORSTEP REFILL (EXCHANGE)"
  };

  // GSAP animation refs
  const summaryRef = useRef(null);
  const cardRef = useRef(null);
  const pointsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Reset initial values to prevent FOUC
    gsap.set(summaryRef.current, { y: -30, opacity: 0 });
    gsap.set(cardRef.current, { scale: 0.95, opacity: 0 });
    gsap.set(pointsRef.current, { y: 30, opacity: 0 });

    // Timeline animations
    tl.to(summaryRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.75,
      clearProps: "transform,opacity"
    })
    .to(cardRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: "back.out(1.1)",
      clearProps: "transform,opacity"
    }, "-=0.3")
    .to(pointsRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      clearProps: "transform,opacity"
    }, "-=0.3");

  }, []);

  return (
    <div id="special-rates-page" className="pb-16 bg-slate-50/50 font-sans text-slate-700 min-h-[85vh]">
      
      {/* 1. Top Search Summary Bar */}
      <div 
        ref={summaryRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8"
      >
        <div className="bg-slate-100/80 border border-slate-200/50 rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 md:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-red-600 shadow-2xs">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Delivery Region</span>
                <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{calculatedQuote.location || calculatedQuote.country || "Uganda"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-red-600 shadow-2xs">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Cylinder / Gas Volume</span>
                <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                  {calculatedQuote.weight} KG (Commercial & Bulk)
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate("/calculator.htm", { state: { calculatedQuote } })}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs shadow-3xs hover:scale-[1.01] active:scale-[0.99] transition-all select-none cursor-pointer"
          >
            Modify Selection
          </button>
        </div>
      </div>

      {/* 2. Special Rates Center Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12">
        <div 
          ref={cardRef}
          className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-12 shadow-lg text-center space-y-6 flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shadow-xs">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full">
              Commercial & Bulk Supply Desk
            </span>
            <h2 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight leading-relaxed font-display">
              For 45 KG Cylinders, Manifold Systems & Bulk Industrial Gas, Contact Conch Gas For Exclusive Corporate Rates
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              We provide tailored pricing, dedicated fleet dispatch, scheduled refilling, and safety compliance for hotels, restaurants, bakeries, factories, and schools across Uganda.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 w-full max-w-xs pt-4">
            <a 
              href="tel:+256700000000"
              className="w-full text-center py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-600/20 transition-all hover:scale-[1.01] duration-200 cursor-pointer"
            >
              📞 Call Conch Gas Kira Road
            </a>
            
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest my-1">
              OR
            </div>
            
            <a 
              href={`https://wa.me/256700000000?text=Hello%20Conch%20Gas!%20I%20am%20inquiring%20about%20bulk%20commercial%20gas%20supply%20(${calculatedQuote.weight}%20KG)%20in%20${calculatedQuote.location || "Kampala"}.%20Please%20share%20contract%20pricing.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.01] duration-200 cursor-pointer"
            >
              💬 WhatsApp Commercial Desk
            </a>
          </div>

        </div>
      </div>

      {/* 3. Important Points Section */}
      <div 
        ref={pointsRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16"
      >
        <div className="border-t border-slate-200/60 pt-6">
          <h3 className="text-base font-black text-slate-800 tracking-tight uppercase mb-4 font-display">
            Commercial & Bulk Gas Services Included:-
          </h3>
          <ol className="list-decimal list-inside space-y-3.5 text-xs text-slate-500 font-semibold leading-relaxed">
            <li>
              <strong>Dedicated Account Manager:</strong> Commercial clients get priority scheduling, customized billing, and monthly consumption reports.
            </li>
            <li>
              <strong>On-Site Safety Inspection & Manifold Installation:</strong> Certified gas engineers inspect pipelines, high-pressure regulators, and safety valves at zero extra audit cost.
            </li>
            <li>
              <strong>Emergency 24/7 Bulk Delivery:</strong> Industrial bakeries, restaurant kitchens, and hospitals receive guaranteed backup supply within 90 minutes.
            </li>
          </ol>
        </div>
      </div>

    </div>
  );
}
