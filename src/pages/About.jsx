import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Flame, 
  Truck, 
  Users, 
  Award, 
  HeartHandshake, 
  CheckCircle2, 
  ChevronDown, 
  Phone, 
  MapPin, 
  Clock, 
  Check, 
  ArrowRight, 
  Droplets,
  Zap,
  Building2,
  Quote,
  Activity,
  HelpCircle,
  Globe
} from "lucide-react";
import { TOP_BAR } from "../constants";
import { applyPageSEO } from "../utils/seo";

/* ─── Section number badge (Lightweight / Pure CSS) ─── */
const SectionBadge = ({ number, icon: Icon, title = "" }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="relative">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#830000] to-[#BC0202] text-white flex items-center justify-center text-xs font-black shadow-md shadow-red-600/20">
        {number}
      </div>
      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-md bg-white border-2 border-[#BC0202] flex items-center justify-center">
        <Icon size={8} className="text-[#BC0202]" />
      </div>
    </div>
    {title && (
      <span className="text-xs font-black uppercase tracking-widest text-[#BC0202]">
        {title}
      </span>
    )}
    <div className="h-px flex-1 bg-gradient-to-r from-[#BC0202]/20 to-transparent" />
  </div>
);

/* ─── Reusable CONCH GAS LTD Sidebar Navigation & Quick Inquiries Widget ─── */
const AboutSidebar = ({ activeTab, setActiveTab, tabList }) => (
  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
      <div className="w-3.5 h-3.5 rounded-full bg-[#BC0202]" />
      <h3 className="text-sm font-black tracking-wider uppercase text-slate-900 font-display">
        CONCH GAS LTD
      </h3>
    </div>

    <div className="space-y-1.5">
      {tabList.map((tabItem) => {
        const TabIcon = tabItem.icon;
        const isSelected = activeTab === tabItem.id;
        return (
          <button
            key={tabItem.id}
            onClick={() => {
              setActiveTab(tabItem.id);
              window.scrollTo({ top: 320, behavior: "smooth" });
            }}
            className={`w-full text-left flex items-center justify-between p-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isSelected
                ? "bg-red-50 text-[#BC0202] font-black pl-4 border-l-4 border-[#BC0202] shadow-xs"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:pl-4"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span className="text-[#BC0202] text-sm">›</span>
              <TabIcon size={15} className={isSelected ? "text-[#BC0202]" : "text-slate-400"} />
              <span>{tabItem.label}</span>
            </span>
            <ArrowRight size={13} className={isSelected ? "text-[#BC0202] opacity-100" : "opacity-30"} />
          </button>
        );
      })}
    </div>

    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-red-950 text-white space-y-2.5 mt-4 shadow-md border border-red-950">
      <div className="flex items-center gap-2 text-red-400 text-xs font-black uppercase tracking-wider">
        <Phone size={14} /> QUICK INQUIRIES
      </div>
      <p className="text-xs text-slate-300 font-medium leading-relaxed">
        Need instant gas delivery or technical assistance?
      </p>
      <a 
        href="tel:+256200900010" 
        className="inline-block text-xs font-black text-white bg-gradient-to-r from-[#830000] to-[#BC0202] px-3.5 py-2 rounded-xl hover:brightness-110 transition-all mt-1 shadow-md shadow-red-900/40"
      >
        +256 200 900 010
      </a>
    </div>
  </div>
);

export default function About() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);
  const [openDeliveryReasonIndex, setOpenDeliveryReasonIndex] = useState(-1);

  useEffect(() => {
    applyPageSEO(
      "About Us - Conch Gas Uganda | Premium LPG & Industrial Gas Supplier",
      "Discover Conch Gas Ltd (part of Conch Group Limited with 15+ years experience) — Uganda's leading LPG, cooking gas, and industrial gas delivery company.",
      "about conch gas, conch group uganda, lpg supplier kampala, raj monga director, cooking gas safety, industrial gas delivery"
    );
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get("tab") || (location.hash ? location.hash.replace("#", "") : null);
    if (tabParam && ["overview", "director", "benefits", "safety", "delivery", "csr", "guide"].includes(tabParam)) {
      setActiveTab(tabParam);
      setTimeout(() => {
        const targetElement = document.getElementById("about-tabs-container");
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } else if (!tabParam) {
      window.scrollTo(0, 0);
    }
  }, [searchParams, location.hash, location.search]);

  const tabList = [
    { id: "overview", label: "Company Overview", icon: Building2 },
    { id: "director", label: "Director's Desk", icon: Users },
    { id: "benefits", label: "Product Benefits", icon: Zap },
    { id: "safety", label: "Safety & Health", icon: ShieldCheck },
    { id: "delivery", label: "Home Delivery", icon: Truck },
    { id: "csr", label: "CSR & Community", icon: HeartHandshake },
    { id: "guide", label: "Safety Guide & FAQs", icon: HelpCircle },
  ];

  const safetyFaqs = [
    {
      q: "What are the points to remember about Rubber Tubing?",
      points: [
        "It must be of approved quality.",
        "It should be as short as possible.",
        "It should be easily accessible for inspection.",
        "Keep it away from heat and fire.",
        "Push it so as to cover the full length of the nozzle.",
        "Make sure it does not get heated by the burner, or is looped/twisted.",
        "Clean it with wet cloth only. Don’t use soap to ease the tube over the nozzle.",
        "Check it regularly for cracks, holes, softness, and porosity especially at the ends.",
        "Replace tubing every 2 years if not earlier.",
        "Do not cover rubber tubing by any other object or sleeve."
      ]
    },
    {
      q: "The Pressure Regulator is Very Important Too",
      description: "It is connected to the outlet of the cylinder valve. Its function is to regulate the pressure of the gas coming out of the cylinder and supply it at a constant pressure to the hot plate."
    },
    {
      q: "To Light The Burners",
      description: "Turn the switch knob of the regulator anti-clockwise till it is in ON position. Hold a lighted matchstick near the burner head of the stove and turn the knob of the stove to ON position."
    },
    {
      q: "If You Smell Gas?",
      points: [
        "Do not operate electrical switches.",
        "Ensure that stove knobs are in OFF position.",
        "Do not light a matchstick even to detect the leakage of LPG.",
        "Switch OFF the pressure regulator by turning the knob clockwise to the OFF position.",
        "Open all doors and windows.",
        "If the smell persists, call your C-Gas distributor.",
        "An experienced person can detach the regulator. Fix the safety cap on the valve."
      ]
    },
    {
      q: "Connecting the Filled Cylinder",
      points: [
        "To remove the safety cap, press it down, PULL the cord and keeping it pulled, LIFT the cap off the valve of the cylinder.",
        "Check whether sealing ring is in place inside the cylinder valve by feeling the same with the help of your little finger. Do not use the cylinder if the ring is missing, put back the safety cap and contact your distributor for replacement of cylinder.",
        "To mount the regulator on the filled cylinder, carry out the following steps:",
        "Ensure the switch knob of the regulator is in the OFF position.",
        "Grip the regulator and pull up the plastic bush.",
        "Place the regulator vertically on the valve and press it down till its edge touches the hexagon of the valve on the cylinder with a gentle swivel. Release the black plastic bush and then press it down (you may hear click sound).",
        "The pressure regulator is now locked on the cylinder."
      ]
    },
    {
      q: "Disconnecting The Empty Cylinder",
      points: [
        "Put out all the flames and fires including incense sticks, candle, lamp in the kitchen and adjoining rooms.",
        "Close all the taps on the cooking stove.",
        "Turn the switch knob of the regulator from ON position to OFF position.",
        "Grip the regulator and pull the bush (black plastic locking ring) up and lift the regulator by giving a gentle swivel. Regulator will thus get detached from the valve on the cylinder.",
        "Place the delrin (plastic) safety cap on the valve of the cylinder. Press the cap firmly down until a distinct click is heard. Now the empty cylinder can be removed."
      ]
    },
    {
      q: "Safety Goes a Long Way (Good Habits for Your Safety)",
      points: [
        "Do not wear nylon garments or similar fabric when cooking.",
        "Never leave the cooking appliance unattended when in use.",
        "Never try to Repair, Adjust or inspect any part of the C-Gas Installation or allow fake mechanics to do so. Allow authorized engineers to inspect the installation once in two years.",
        "Do not use long curtains on windows if your cooking appliance is near it. They can blow over the burner and catch fire.",
        "Insist on redelivery check of the refill cylinder at the time of its delivery.",
        "Do not install the cooking appliance on the floor. Do not use a wooden table without asbestos sheet over it.",
        "C-Gas should never be used in a poorly ventilated room.",
        "Never install a C-Gas cylinder below ground level or in cellars or basements.",
        "No other heating device (Like an electric oven or a kerosene stove) should be placed within one meter of a C-Gas appliance.",
        "Do not use any cover on the rubber tube.",
        "Never leave the regulator in ON position after cooking is over or during night.",
        "Always smell for leakage of LPG before lighting the stove.",
        "Never use the rubber tube if it has cracks or is more than 2 years old."
      ]
    },
    {
      q: "General Safety Health And Environment",
      paragraphs: [
        "In C-GAS SAFETY, HEALTH & ENVIRONMENT is most important, and rightly so, in view of the ecological imbalance that the world is facing at large. C-Gas as a responsible Corporate Citizen is striving to strike a right balance between operating its business and maintaining a sense of harmony with its surroundings.",
        "It is the PEOPLE who make their working environment safe by adopting safe work practices and it is these work practices that form a part of any Environment, Health & Safety (SH&E) Policy. The Objective of SH&E Policy is not only to bring about awareness, but to also promote a pollution free environment; and create a healthy surrounding and safe working conditions by constantly guiding all our actions within a consciously recognized and adopted set of standards.",
        "The SAFETY, HEALTH & ENVIRONMENT Policy is a testimony to C-GAS’s Commitment towards protection of environment as we have a great responsibility to not only protect the health safety of our colleagues but also hand over a safe world to the future generation to come. We follow the SH&E Policy, not only in word but also in spirit, and actively contribute towards achieving its objectives."
      ]
    }
  ];

  const csrDonations = [
    {
      title: "HAND SANITIZER KIRA ROAD POLICE STATION",
      location: "Kira Road Police",
      desc: "Hand sanitizer contribution to Kira Road Police Station.",
      image: "/Hand-Sanitizer-Kira-Road-Police-Station.webp",
      fallback: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "DONATING LIQUID SOAP TO KIRA POLICE",
      location: "Kira Police",
      desc: "Liquid soap contribution to Kira Police Headquarters.",
      image: "/Donating-Liquid-Soap-To-Kira-Police.webp",
      fallback: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "DONATING MILK TO UWEC",
      location: "UWEC Entebbe",
      desc: "Fresh milk contribution to UWEC for animal welfare.",
      image: "/Donating-Milk-To-UWEC.webp",
      fallback: "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "UWEC FOOD ITEMS",
      location: "UWEC Animals",
      desc: "Essential bulk food items and feeds for UWEC animals.",
      image: "/UWEC-Food-Items.webp",
      fallback: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="bg-[#FAFDFD] font-sans text-slate-700 min-h-screen">
      
      {/* ═══════════ 1. HERO BANNER ═══════════ */}
      <div 
        id="about-hero" 
        className="relative h-[260px] md:h-[340px] overflow-hidden flex items-end pb-8 md:pb-12 bg-slate-950"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('/hero_gas_banner.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white z-10">
          <div className="space-y-2.5 max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight font-display uppercase text-white drop-shadow-md">
              About Conch Gas
            </h1>
            <nav className="text-xs md:text-sm font-semibold tracking-wide flex items-center gap-2 text-white/80">
              <Link to="/" className="hover:text-[#BC0202] transition-colors text-white/90">Home</Link>
              <span className="text-white/40">»</span>
              <span className="text-[#BC0202] font-bold">About Us</span>
            </nav>
          </div>
        </div>
      </div>

      {/* ═══════════ 2. STATS BAR ═══════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xl shadow-slate-200/50">
          {[
            { icon: Award, value: "15+ Years", label: "Industry Heritage" },
            { icon: ShieldCheck, value: "100% Full", label: "Weight Guarantee" },
            { icon: CheckCircle2, value: "UNBS Certified", label: "Highest Standards" }
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3.5 p-2">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#BC0202] flex items-center justify-center shrink-0 border border-red-100 shadow-sm">
                <stat.icon size={24} className="stroke-[2.2]" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-display">{stat.value}</div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════ 3. INTERACTIVE CATEGORY QUICK TABS ═══════════ */}
      <div id="about-tabs-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12 scroll-mt-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5 pb-4 border-b border-slate-200/80">
          {tabList.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2 py-3 rounded-2xl text-[11px] sm:text-xs xl:text-[12.5px] font-bold text-center transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] text-white shadow-md shadow-red-600/25 scale-[1.02]"
                    : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200/80 shadow-xs hover:border-slate-300"
                }`}
              >
                <Icon size={15} className={`shrink-0 ${isActive ? "text-white" : "text-[#BC0202]"}`} />
                <span className="leading-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════ 4. MAIN DYNAMIC TAB CONTENT ═══════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 md:my-14">
        
        {/* ─── TAB 1: COMPANY OVERVIEW ─── */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="space-y-10 md:space-y-12"
          >
            {/* SECTION 1: OUR SERVICES */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
              <SectionBadge number="01" icon={Building2} title="Company Overview" />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
                <div className="lg:col-span-7 space-y-5">
                  <div className="space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#BC0202] block">
                      CONCH GAS
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-display uppercase">
                      OUR SERVICES
                    </h2>
                    <div className="w-14 h-1 bg-[#BC0202] rounded-full" />
                  </div>

                  <div className="space-y-4 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                    <p className="font-semibold text-slate-800 text-base sm:text-lg">
                      Conch Gas Ltd is a part of Conch Group with 15+ years of experience and achievements in the fields of construction and contracting.
                    </p>
                    <p>
                      The company first established in New Delhi India with operations extended toward trading and commerce of Oil and petroleum products and mechanical equipments. In 1996, the company further extended its operations to include mechanical works and installations, especially in the field of civil construction, oil pipelines, steel sheeting for warehouses, steel structures for civil use, and other related civil and construction works.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {["Oil & Petroleum Trading", "Mechanical Installations", "Oil Pipelines", "Civil Construction & Steel Structures"].map((tag, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                        <CheckCircle2 size={13} className="text-[#BC0202]" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Media / Video Card */}
                <div className="lg:col-span-5">
                  <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-950 aspect-[4/3]">
                    <iframe
                      src="https://www.youtube.com/embed/6C-ec1P4aCQ?rel=0&autoplay=0"
                      title="Conch Gas Products Video"
                      loading="lazy"
                      className="w-full h-full border-0"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: OUR VISION */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
              <SectionBadge number="02" icon={Globe} title="Conch Group Heritage" />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
                {/* Left Media Card */}
                <div className="lg:col-span-5 order-2 lg:order-1">
                  <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-950 aspect-[4/3]">
                    <iframe
                      src="https://www.youtube.com/embed/zvJeb1kX5ck?rel=0&autoplay=0"
                      title="Don't Run Out of Cooking Gas"
                      loading="lazy"
                      className="w-full h-full border-0"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>

                {/* Right Text Column */}
                <div className="lg:col-span-7 space-y-5 order-1 lg:order-2">
                  <div className="space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#BC0202] block">
                      CONCH GROUP HERITAGE
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-display uppercase">
                      OUR VISION
                    </h2>
                    <div className="w-14 h-1 bg-[#BC0202] rounded-full" />
                  </div>

                  <div className="space-y-4 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                    <p>
                      In 1997, the company built the first residential compound of 12 houses and one swimming pool in New Delhi India for the Indian Railways Authority. The works of the company further extended in 1999 to 2005 in different construction and mechanical works. Different road bridges built and completed in India, roundabouts and buildings.
                    </p>
                    <p>
                      Since that time many offices and specialities were created and the group was first unified under the name <strong>conch group of companies</strong> with head quarters in <strong>Dubai, UAE</strong>, and with regional offices in <strong>South Sudan, India, Bangladesh, Turkey, and Uganda</strong>.
                    </p>
                  </div>

                  {/* Global Badges */}
                  <div className="pt-2">
                    <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <Globe size={14} className="text-[#BC0202]" /> Regional Presence & Offices
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { flag: "🇦🇪", name: "Dubai, UAE (HQ)" },
                        { flag: "🇺🇬", name: "Uganda (Conch Gas)" },
                        { flag: "🇮🇳", name: "India (Origins)" },
                        { flag: "🇸🇸", name: "South Sudan" },
                        { flag: "🇧🇩", name: "Bangladesh" },
                        { flag: "🇹🇷", name: "Turkey" }
                      ].map((loc, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50/80 border border-red-100 text-slate-800 text-xs font-bold">
                          <span>{loc.flag}</span>
                          <span>{loc.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: CONCH GAS LTD SUCCESS & NAVIGATION SIDEBAR */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (8 cols): Success Details */}
              <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
                <SectionBadge number="03" icon={Award} title="Market Leadership" />
                <div className="space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#BC0202] block">
                    MARKET LEADERSHIP
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-display uppercase">
                    CONCH GAS LTD SUCCESS
                  </h2>
                  <div className="w-14 h-1 bg-[#BC0202] rounded-full" />
                </div>

                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                  We offer various C-Gas products to help enhance your cooking. Our Products range from various C-Gas cylinders which include <strong>6 kg gas cylinder</strong>, <strong>13 kg gas cylinder</strong>, <strong>40 kg gas cylinder</strong>. These gas cylinders are refilled with gas to ease cooking at home or from anywhere. We employ various techniques in the use operations to ensure efficiency and continue to be a market serving everyone with gas products dominating the entire globe.
                </p>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 font-display">
                    Our approaches to succeed include:
                  </h4>
                  
                  <div className="space-y-3">
                    {[
                      {
                        title: "Good quality products at competitive prices.",
                        desc: "Delivering UNBS-certified cylinders with 100% full weight guarantee at highly competitive prices in Uganda."
                      },
                      {
                        title: "Excellent customer service that will promote customer loyalty.",
                        desc: "Fast doorstep delivery, trained safety technicians, and dedicated support across Kampala."
                      },
                      {
                        title: "A strategic location for everyone to have access to.",
                        desc: "Centrally positioned at Plot 155, Kira Road near Kira Road Police Station, Kampala for swift regional reach."
                      }
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-200 hover:bg-red-50/30 transition-all duration-200"
                      >
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-100 to-red-50 text-[#BC0202] flex items-center justify-center shrink-0 mt-0.5 font-black text-xs border border-red-200">
                          <Check size={14} className="stroke-[3]" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-xs sm:text-sm font-black text-slate-900 font-display">
                            {item.title}
                          </h5>
                          <p className="text-xs text-slate-500 font-medium">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
                  <Link
                    to="/products/gas-refills.htm"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] text-white text-xs font-black uppercase tracking-wider hover:brightness-110 shadow-md shadow-red-600/20 active:scale-98 transition-all"
                  >
                    <Flame size={16} />
                    <span>Order LPG Refill</span>
                  </Link>
                  <Link
                    to="/contact.htm"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold hover:border-slate-300 transition-all"
                  >
                    <span>Contact Kira Road Hub</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Right Column (4 cols): CONCH GAS LTD Sidebar Menu */}
              <div className="lg:col-span-4">
                <AboutSidebar activeTab={activeTab} setActiveTab={setActiveTab} tabList={tabList} />
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── TAB 2: DIRECTOR'S DESK ─── */}
        {activeTab === "director" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="space-y-10"
          >
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                {/* Director Portrait */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 aspect-[4/5] max-w-md mx-auto group">
                    <img 
                      src="/raj_monga_director.webp" 
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80";
                      }}
                      alt="Raj Monga - Managing Director Conch Gas" 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <span className="text-[11px] font-black uppercase tracking-widest text-[#FF8080] block mb-1">
                        Managing Director
                      </span>
                      <h3 className="text-2xl font-black font-display uppercase tracking-wide">
                        Raj Monga
                      </h3>
                      <p className="text-xs text-white/80 font-medium">Conch Group Limited</p>
                    </div>
                  </div>
                </div>

                {/* Message from Managing Director */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-3 text-[#BC0202]">
                    <Quote size={40} className="opacity-30" />
                    <span className="text-xs font-black uppercase tracking-widest bg-red-50 text-[#BC0202] px-3.5 py-1.5 rounded-full border border-red-100">
                      Director's Vision
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight font-display">
                    "Driven by character, personal integrity, and long-term customer relationships."
                  </h2>

                  <div className="space-y-4 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                    <p>
                      "We at <strong>Conch Group</strong> believe that we are a curated group of people, proud of our past and excited about our future. We are a group defined by the character and integrity of our people as we work to serve our customers and build strong relationships and products."
                    </p>
                    <p>
                      "We always keep in mind the importance of advancing our outstanding reputation through our personal integrity, values, and our consistent ethical and honest business conduct."
                    </p>
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-50/80 to-transparent border-l-4 border-[#BC0202] text-[#BC0202] font-bold text-base">
                      "We look forward to adding maximum potential clients to our portfolio and continuing to energize Uganda safely."
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h4 className="text-base font-black text-slate-900 font-display">RAJ MONGA</h4>
                      <p className="text-xs text-slate-500 font-semibold">Managing Director · Conch Gas Ltd.</p>
                    </div>
                    <Link
                      to="/contact.htm"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#830000] to-[#BC0202] text-white text-xs font-black uppercase tracking-wider hover:brightness-110 shadow-md shadow-red-600/20 active:scale-98 transition-all"
                    >
                      <span>Connect With Our Team</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Sidebar Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#BC0202] block">
                  EXECUTIVE LEADERSHIP
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase font-display">
                  Partnering for Growth & Energy Independence
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  Under Raj Monga's leadership, Conch Gas has expanded from regional operations to becoming Uganda's trusted energy partner, ensuring clean, affordable, and safe LPG solutions for both homes and businesses.
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  {["15+ Years Track Record", "Ethical Governance", "Customer First Approach", "Global Supply Chain"].map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                      <CheckCircle2 size={13} className="text-[#BC0202]" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-4">
                <AboutSidebar activeTab={activeTab} setActiveTab={setActiveTab} tabList={tabList} />
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── TAB 3: PRODUCT BENEFITS ─── */}
        {activeTab === "benefits" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="space-y-10"
          >
            {/* Header intro */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm space-y-6">
              <span className="inline-block text-xs font-black uppercase tracking-widest text-[#BC0202] bg-red-50 px-3.5 py-1.5 rounded-full border border-red-100">
                LPG Performance & Properties
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
                Benefits of Conch Gas Products
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                LP Gas is a propane / butane mixture liquefied under normal ambient temperature and moderate pressures. It is a safe, clean-burning, reliable, high calorific value fuel. In addition to domestic cooking, it is widely used in industries requiring low sulfur content and precision temperature controls. LP Gas conforms strictly to <strong>UNBS standards</strong>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-gradient-to-br from-slate-50 to-red-50/30 p-6 rounded-2xl border border-slate-200/70 space-y-2.5">
                  <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider font-display flex items-center gap-2">
                    <Droplets size={18} className="text-[#BC0202]" /> 1:250 Compressibility Ratio
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    LPG is remarkably compressible, allowing 250 liters of gas to be condensed into 1 liter of liquid for safe, compact storage and portable handling.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-red-50/30 p-6 rounded-2xl border border-slate-200/70 space-y-2.5">
                  <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider font-display flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#BC0202]" /> 2% to 9% Safe Flammability Limit
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    LPG ignites only within a specific 2% to 9% gas-to-air ratio range, making it exceptionally safe and dependable in household kitchens and plants.
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist Grid & Sidebar Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight uppercase font-display">
                  Advantages of LPG Compared to Other Fuels
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Clean Burning & Zero Soot", desc: "Burners stay clean and have a longer operating life, minimizing ongoing appliance maintenance costs." },
                    { title: "Zero Spillage Hazard", desc: "Vaporises immediately at atmospheric temperature and pressure, leaving no liquid spills or greasy residues." },
                    { title: "Instant High Heat Flame", desc: "Provides high efficiency direct firing with instant heat for faster culinary warm-up and precise cool-down." },
                    { title: "Eco-Friendly Emissions", desc: "Minimal sulfur content and clean exhaust fumes protect both your kitchen air and the global environment." },
                    { title: "Round-the-Clock Flat Rate", desc: "Free from peak-time electricity premium tariffs — consistent, affordable pricing 24 hours a day." },
                    { title: "Appliance & Parts Protection", desc: "Avoids scaling, soot fouling, and decarbonising of pots, pans, commercial ovens, kilns, and machinery." }
                  ].map((adv, idx) => (
                    <div key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-red-50/40 hover:border-red-200 transition-all duration-200">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#830000] to-[#BC0202] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Check size={13} className="stroke-[3.5]" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide font-display">{adv.title}</h4>
                        <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">{adv.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4">
                <AboutSidebar activeTab={activeTab} setActiveTab={setActiveTab} tabList={tabList} />
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── TAB 4: SAFETY & HEALTH ─── */}
        {activeTab === "safety" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="space-y-10"
          >
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm space-y-6">
              <span className="inline-block text-xs font-black uppercase tracking-widest text-[#BC0202] bg-red-50 px-3.5 py-1.5 rounded-full border border-red-100">
                Environment, Health & Safety (EHS)
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
                General Safety, Health & Environment Policy
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                At <strong>C-GAS</strong>, SAFETY, HEALTH & ENVIRONMENT is of paramount importance in view of global ecological balance. As a responsible corporate citizen, we strike a perfect harmony between operating our business and maintaining safety standards.
              </p>

              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-red-50/90 via-orange-50/40 to-slate-50 border border-red-200/80 space-y-4">
                <div className="flex items-center gap-2.5 text-[#BC0202]">
                  <ShieldCheck size={22} className="stroke-[2.5]" />
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-wider font-display">
                    Our Goal: 100% Accident-Free Operations
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  We are committed to conducting business in a manner that protects the safety of personnel, customers, and the public. To achieve 100% accident-free operation, we:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-slate-700 pt-2">
                  {[
                    "Design and maintain safety risk control facilities",
                    "Train staff on safety behavior & emergency equipment",
                    "Install state-of-the-art gas leakage detection systems",
                    "Full compliance with Ministry of Energy, Kampala, Uganda"
                  ].map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/80 border border-red-100">
                      <Check size={14} className="text-[#BC0202] stroke-[3] shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fire Fighting & Sidebar Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-200 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 text-[#BC0202] flex items-center justify-center border border-red-100 shadow-sm">
                      <Flame size={24} />
                    </div>
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-wider font-display">
                      Major Fire Fighting Facilities
                    </h3>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                      <li className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#BC0202] mt-1.5 shrink-0" />
                        <span>High-pressure fire fighting hydrants and monitors.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#BC0202] mt-1.5 shrink-0" />
                        <span>Automatic gas leakage detectors with alarm triggers.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#BC0202] mt-1.5 shrink-0" />
                        <span>Dedicated emergency water storage tanks always filled.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-200 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 text-[#BC0202] flex items-center justify-center border border-red-100 shadow-sm">
                      <Activity size={24} />
                    </div>
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-wider font-display">
                      Monthly Safety Mock Drills
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                      Every technician and driver undergoes structured emergency training. C-GAS carries out <strong>mandatory monthly mock drills</strong> to ensure every team member is fully prepared for any emergency situation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4">
                <AboutSidebar activeTab={activeTab} setActiveTab={setActiveTab} tabList={tabList} />
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── TAB 5: HOME DELIVERY ─── */}
        {activeTab === "delivery" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="space-y-10"
          >
            {/* 1. Header & Intro */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#BC0202] block">
                  CONCH GAS
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-display uppercase">
                  LPG GAS HOME DELIVERY
                </h2>
                <div className="w-16 h-1.5 bg-gradient-to-r from-[#830000] to-[#BC0202] rounded-full" />
                <p className="text-xs sm:text-sm font-bold text-slate-500 italic pt-1">
                  "We understand your need and deliver to your doorstep, at any time, anywhere."
                </p>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                <p>
                  At Conch Gas Ltd, we understand the importance of a safe and convenient cooking experience for your home. With our top-notch home delivery service, we are committed to providing you with a seamless solution for all your cooking needs. Say goodbye to the hassle of carrying heavy gas cylinders or worrying about running out of cooking fuel at the wrong moment. Our reliable and efficient home delivery service ensures that <strong>your kitchen never stops cooking</strong>.
                </p>
              </div>

              {/* Our Commitment Box */}
              <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-red-50/80 via-red-50/40 to-slate-50 border border-red-100 flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-[#830000] to-[#BC0202] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <ShieldCheck size={22} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider font-display">
                    Our Commitment:
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    At the heart of Conch Gas lies a dedication to delivering not just LPG cylinders, but also peace of mind. We prioritize safety, convenience, and quality in every aspect of our service.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. WHY CHOOSE OUR HOME DELIVERY SERVICE */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#BC0202] block">
                  VALUE & TRUST
                </span>
                <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight font-display uppercase">
                  Why Choose Our Home Delivery Service
                </h3>
                <div className="w-14 h-1.5 bg-gradient-to-r from-[#830000] to-[#BC0202] rounded-full" />
              </div>

              <div className="space-y-3 pt-2">
                {[
                  {
                    id: 1,
                    title: "SAFETY FIRST",
                    icon: ShieldCheck,
                    ans: "We adhere to the highest safety standards to ensure the secure delivery and use of LPG in your home. Your safety is our priority."
                  },
                  {
                    id: 2,
                    title: "CONVENIENCE REDEFINED",
                    icon: Zap,
                    ans: "Say goodbye to long waits and manual booking processes. With our user-friendly online platform, you can easily place orders, schedule deliveries, and track your gas in real-time."
                  },
                  {
                    id: 3,
                    title: "TIMELY DELIVERIES",
                    icon: Clock,
                    ans: "Never run out of cooking gas again. Our efficient delivery team ensures that your gas cylinders are delivered on time, every time."
                  },
                  {
                    id: 4,
                    title: "QUALITY ASSURANCE",
                    icon: Award,
                    ans: "We provide premium quality LPG gas that burns clean and efficiently, giving you the best cooking experience and preserving the flavors of your food."
                  },
                  {
                    id: 5,
                    title: "EXPERTISE",
                    icon: Users,
                    ans: "With years of experience in the LPG industry, we have the knowledge and expertise to cater to your unique needs and answer your queries."
                  }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  const isOpen = openDeliveryReasonIndex === idx;
                  return (
                    <div 
                      key={idx} 
                      className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-200 shadow-xs"
                    >
                      <button
                        onClick={() => setOpenDeliveryReasonIndex(isOpen ? -1 : idx)}
                        className={`w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                          isOpen ? "bg-red-50/60" : "bg-white hover:bg-slate-50/80"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="w-8 h-8 rounded-xl bg-red-100/80 text-[#BC0202] flex items-center justify-center shrink-0 text-xs font-black font-display">
                            {idx + 1}
                          </span>
                          <Icon size={18} className="text-[#BC0202] shrink-0" />
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide font-display">
                            {item.title}
                          </h4>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                            isOpen ? "rotate-180 text-[#BC0202]" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-t border-slate-100 bg-slate-50/60"
                          >
                            <div className="p-4 sm:p-6 pt-3 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                              {item.ans}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. HOW IT WORKS & Sidebar Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-6">
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#BC0202] block">
                    FAST 4-STEP PROCESS
                  </span>
                  <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight font-display uppercase">
                    How It Works
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { step: "STEP 01", title: "ORDER PLACEMENT", desc: "Select your cylinder size (6kg, 13kg, 40kg, 45kg) on our website or via WhatsApp." },
                    { step: "STEP 02", title: "INSTANT SCHEDULING", desc: "Our logistics hub dispatches the nearest delivery rider to your doorstep." },
                    { step: "STEP 03", title: "SAFE HANDOVER", desc: "We deliver sealed cylinders with intact tare weight seals and universal exchange." },
                    { step: "STEP 04", title: "FREE INSTALLATION", desc: "Our driver assists with regulator connection and performs soapy water leak tests." }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm space-y-2 relative overflow-hidden hover:border-red-200 hover:shadow-md transition-all duration-200">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#BC0202] bg-red-50 px-2.5 py-1 rounded-md inline-block border border-red-100">
                        {item.step}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider font-display">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA Box */}
                <div className="bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] text-white p-7 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-black font-display uppercase text-white">
                      Need a Cylinder Refill Today?
                    </h3>
                    <p className="text-xs text-white/90 font-medium">
                      Order online or call our direct helpline for prompt delivery.
                    </p>
                  </div>
                  <Link
                    to="/booking.php"
                    className="px-6 py-3 rounded-xl bg-white text-[#830000] text-xs font-black uppercase tracking-wider hover:bg-slate-100 shadow-md hover:scale-105 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
                  >
                    Order Gas Now
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4">
                <AboutSidebar activeTab={activeTab} setActiveTab={setActiveTab} tabList={tabList} />
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── TAB 6: CSR & COMMUNITY ─── */}
        {activeTab === "csr" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="space-y-10"
          >
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#BC0202] block">
                  CORPORATE SOCIAL RESPONSIBILITY
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-display uppercase">
                  DONATIONS
                </h2>
                <div className="w-16 h-1.5 bg-gradient-to-r from-[#830000] to-[#BC0202] rounded-full" />
              </div>

              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                We consider the interests of society by taking responsibility for the impact of our activities on our customers, employees, shareholders and communities. We offer donations to the community such as;
              </p>

              <div className="space-y-3 pt-1">
                {[
                  "Hand Sanitizer to kira Road Police Station.",
                  "Food items and milk to Entebbe Zoo (UWEC) for Animals."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-50 border border-red-200 text-[#BC0202] flex items-center justify-center shrink-0">
                      <Check size={12} className="stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {csrDonations.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-red-200 transition-all duration-300 group flex flex-col">
                  <div className="aspect-[4/3] overflow-hidden bg-slate-950 relative">
                    <img 
                      src={item.image} 
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = item.fallback;
                      }}
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-[#830000] to-[#BC0202] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                      CONCH CSR INITIATIVE
                    </div>
                  </div>
                  <div className="p-5 text-center bg-white border-t border-slate-50 flex-1 flex items-center justify-center">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide font-display leading-snug">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CSR Sidebar Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#BC0202] block">
                  COMMUNITY IMPACT
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase font-display">
                  Empowering Ugandan Communities & Wildlife
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  At Conch Gas, corporate citizenship is deeply embedded into our core business culture. We actively partner with community stations, education centres, and wildlife preservation foundations across Uganda to build a healthier, safer tomorrow.
                </p>
              </div>
              <div className="lg:col-span-4">
                <AboutSidebar activeTab={activeTab} setActiveTab={setActiveTab} tabList={tabList} />
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── TAB 7: SAFETY GUIDE & FAQS ─── */}
        {activeTab === "guide" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="space-y-10"
          >
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm space-y-4">
              <span className="inline-block text-xs font-black uppercase tracking-widest text-[#BC0202] bg-red-50 px-3.5 py-1.5 rounded-full border border-red-100">
                Safety Guidelines
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
                Safety Guide & Points To Remember
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                LP Gas is one of the safest modern household fuels when handled with proper guidelines. Click any section below for detailed instructions on rubber tubing, regulators, burner lighting, and gas leak emergency steps.
              </p>
            </div>

            {/* Accordion List & Sidebar Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-4">
                {safetyFaqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:border-red-200 transition-all duration-200"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                        className={`w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                          isOpen ? "bg-red-50/50" : "hover:bg-slate-50/80"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-100 to-red-50 text-[#BC0202] flex items-center justify-center shrink-0 text-xs font-black font-display border border-red-200">
                            {idx + 1}
                          </span>
                          <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide font-display">
                            {faq.q}
                          </h3>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                            isOpen ? "rotate-180 text-[#BC0202]" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-t border-slate-100"
                          >
                            <div className="p-5 sm:p-6 pt-4 bg-slate-50/50 space-y-3">
                              {faq.description && (
                                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                                  {faq.description}
                                </p>
                              )}

                              {faq.paragraphs && faq.paragraphs.map((p, pIdx) => (
                                <p key={pIdx} className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                                  {p}
                                </p>
                              ))}

                              {faq.points && faq.points.map((point, pIdx) => (
                                <div key={pIdx} className="flex items-start gap-3">
                                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#BC0202] flex items-center justify-center shrink-0 mt-0.5">
                                    <Check size={11} className="stroke-[3]" />
                                  </div>
                                  <span className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                                    {point}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              <div className="lg:col-span-4">
                <AboutSidebar activeTab={activeTab} setActiveTab={setActiveTab} tabList={tabList} />
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* ═══════════ 5. BOTTOM CTA BANNER ═══════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative rounded-3xl p-8 sm:p-10 lg:p-12 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-red-950 text-white shadow-xl border border-red-950">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center lg:text-left max-w-2xl">
              <span className="text-xs font-black uppercase tracking-widest text-red-400">
                Ready to switch to Conch Gas?
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display uppercase tracking-tight text-white">
                Safe, Clean & Express Gas Delivery Across Uganda
              </h3>
              <p className="text-sm text-white/70 font-medium leading-relaxed">
                Visit Plot 155, Kira Road near Kira Road Police Station, Kampala or book online with instant delivery.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
              <Link
                to="/booking.php"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-700/30 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>Order Cylinder Refill</span>
                <ArrowRight size={16} />
              </Link>
              <a
                href={`tel:${TOP_BAR.phone.number.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={15} className="text-red-400" />
                <span>Call Hotline</span>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
