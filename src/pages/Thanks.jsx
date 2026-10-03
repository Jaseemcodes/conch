import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";

export default function Thanks() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // Retrieve success details from routing state, or use high-fidelity preview defaults
  const successData = location.state?.successData || {
    bookingRef: "CG-849102",
    customerPhone: "0700000000",
    destinationAddress: "Plot 42 Kira Road, Kampala",
    gasType: "LPG Domestic Gas",
    cylinderSize: "13 KG"
  };

  const selectedProvider = location.state?.selectedProvider || {
    name: "CONCH EXPRESS",
    timeline: "Within 2 Hours"
  };

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
            Your Cylinder is Being Dispatched!
          </h1>
        </div>

        {/* Reference details Box */}
        <div 
          ref={detailsBoxRef}
          className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center space-y-3 font-sans text-xs font-semibold text-slate-700"
        >
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Booking Reference Number
            </p>
            <p className="text-red-600 font-black text-xl tracking-tight mt-0.5 whitespace-nowrap">
              {successData.bookingRef}
            </p>
            <p className="text-slate-600 font-medium text-[11px] mt-1">
              Dispatch Depot: <span className="font-bold text-slate-800">Conch Gas Kira Road</span>
            </p>
          </div>

          <div className="border-t border-slate-200/60 pt-2 flex justify-between items-center text-xs">
            <span className="text-slate-500">Amount Payable:</span>
            <span className="font-black text-slate-900">UGX {Number(totalAmount).toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-center gap-2 my-1 text-[10px] text-slate-400 font-black uppercase tracking-widest">
            <div className="h-px bg-slate-200 w-12" />
            <span>Need Quick Status?</span>
            <div className="h-px bg-slate-200 w-12" />
          </div>

          <div>
            <a 
              href={`https://wa.me/256700000000?text=Hello%20Conch%20Gas!%20My%20Booking%20ID%20is%20${successData.bookingRef}.%20Please%20confirm%20my%20cylinder%20delivery%20status.`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 font-black text-xs block py-1"
            >
              💬 WhatsApp Us: Conch Gas Support
            </a>
            <p className="text-[10px] text-slate-400 font-semibold">
              Mention your Booking ID: {successData.bookingRef}
            </p>
          </div>
        </div>

        <p 
          ref={descRef}
          className="text-[11px] text-slate-500 leading-relaxed font-semibold px-2"
        >
          Thank you for choosing Conch Gas Ltd. Our delivery driver will call you shortly before arriving at your doorstep.
        </p>

        {/* Buttons Actions */}
        <div ref={buttonsRef} className="flex flex-col gap-2 pt-1">
          {isLoggedIn ? (
            <button
              onClick={() => navigate("/my-account")}
              className="w-full text-center py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs select-none shadow-sm transition-all hover:scale-[1.01] duration-200 cursor-pointer"
            >
              📦 View Order in My Account
            </button>
          ) : (
            <a
              href={`https://wa.me/256700000000?text=Hello%20Conch%20Gas!%20I%20have%20booked%20order%20${successData.bookingRef}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs select-none shadow-sm transition-all hover:scale-[1.01] duration-200 cursor-pointer"
            >
              💬 Instant WhatsApp Tracking
            </a>
          )}

          <button
            onClick={() => navigate("/")}
            className="w-full text-center py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs select-none shadow-3xs transition-all hover:scale-[1.01] duration-200 cursor-pointer"
          >
            🏠 Return to Homepage
          </button>
        </div>

      </div>

    </div>
  );
}
