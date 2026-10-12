import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function Thanks() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve success details from routing state, or use high-fidelity preview defaults
  const successData = location.state?.successData || {
    bookingRef: "CG-849102",
    customerPhone: "0700000000",
    destinationAddress: "Plot 42 Kira Road, Kampala",
    gasType: "LPG Domestic Gas",
    cylinderSize: "13 KG"
  };

  const calculatedQuote = location.state?.calculatedQuote;

  const bookedProduct = successData.productTitle || successData.gasType || calculatedQuote?.productTitle || calculatedQuote?.gasLabel || "Conch Gas Product";
  const bookedQty = successData.quantity || calculatedQuote?.quantity || 1;

  const totalAmount = location.state?.totalAmount || 115000;

  // Refs for GSAP animations
  const cardRef = useRef(null);
  const iconRef = useRef(null);
  const titleGroupRef = useRef(null);
  const detailsBoxRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Initial state setup to prevent FOUC
    gsap.set(cardRef.current, { y: 40, opacity: 0 });
    gsap.set(iconRef.current, { scale: 0.5, opacity: 0 });
    if (titleGroupRef.current) {
      gsap.set(titleGroupRef.current.children, { y: 20, opacity: 0 });
    }
    gsap.set(detailsBoxRef.current, { scale: 0.95, opacity: 0 });
    gsap.set(descRef.current, { y: 15, opacity: 0 });
    if (buttonsRef.current) {
      gsap.set(buttonsRef.current.children, { y: 15, opacity: 0 });
    }

    // Timeline animations
    tl.to(cardRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      clearProps: "transform,opacity"
    })
    .to(iconRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
      clearProps: "transform,opacity"
    }, "-=0.3")
    .to(titleGroupRef.current.children, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.1,
      clearProps: "transform,opacity"
    }, "-=0.2")
    .to(detailsBoxRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, "-=0.2")
    .to(descRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      clearProps: "transform,opacity"
    }, "-=0.3")
    .to(buttonsRef.current.children, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.08,
      clearProps: "transform,opacity"
    }, "-=0.25");

  }, []);

  return (
    <div id="thanks-page-wrapper" className="min-h-[calc(100vh-140px)] bg-slate-50/50 flex items-center justify-center p-4 font-sans">
      
      {/* Centered Success Card Container */}
      <div 
        ref={cardRef}
        className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-xl border border-slate-200/80 text-center space-y-5"
      >
        
        {/* Compact Checkmark Icon */}
        <div 
          ref={iconRef}
          className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100 shadow-xs"
        >
          <svg className="w-8 h-8 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Heading & Subheading */}
        <div ref={titleGroupRef} className="space-y-1">
          <span className="text-[10px] font-black uppercase text-red-600 tracking-widest block font-display bg-red-50 py-0.5 px-3 rounded-full mx-auto w-fit">
            Gas Order Confirmed
          </span>
          <h1 className="text-xl font-black text-slate-900 tracking-tight font-display">
            Your Order Has Been Booked!
          </h1>
        </div>

        {/* Reference details Box */}
        <div 
          ref={detailsBoxRef}
          className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-center space-y-4 font-sans text-xs font-semibold text-slate-700"
        >
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Booking Reference Number
            </p>
            <p className="text-red-600 font-black text-2xl tracking-tight mt-1 whitespace-nowrap">
              {successData.bookingRef}
            </p>
          </div>

          <div className="border-t border-slate-200/60 pt-3 flex justify-between items-start text-xs text-left gap-2">
            <span className="text-slate-500 font-bold shrink-0">Product Booked:</span>
            <span className="font-black text-slate-900 text-xs text-right break-words">
              {bookedProduct} {bookedQty > 1 ? `(Qty: ${bookedQty})` : ""}
            </span>
          </div>

          <div className="border-t border-slate-200/60 pt-3 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-bold">Amount Payable:</span>
            <span className="font-black text-slate-900 text-sm">UGX {Number(totalAmount).toLocaleString()}</span>
          </div>
        </div>

        <p 
          ref={descRef}
          className="text-[11px] text-slate-500 leading-relaxed font-semibold px-2"
        >
          Thank you for choosing Conch Gas Ltd. Our delivery driver will call you shortly before arriving at your doorstep.
        </p>

        {/* Buttons Actions */}
        <div ref={buttonsRef} className="pt-2">
          <button
            onClick={() => navigate("/")}
            className="w-full text-center py-3 rounded-xl bg-[#BC0202] hover:bg-[#9e0202] text-white font-extrabold text-xs select-none shadow-md transition-all hover:scale-[1.01] duration-200 cursor-pointer"
          >
            🏠 Return to Homepage
          </button>
        </div>

      </div>

    </div>
  );
}
