import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Check,
  PlaneTakeoff,
  Activity,
  Clock,
  ChevronDown
} from "lucide-react";


import { HERO, ALL_COUNTRIES } from "../../constants";
import { calculatePrice, getDefaultProvider, getProvidersForCountry, getProviderImage, getProviderUI } from "../../utils/pricing";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import api from "../../utils/api";
import CalculatorForm from "./CalculatorForm";

const heroSlides = [
  {
    heading: "Uganda's Leading & Trusted Choice",
    subheading: "Online LPG Cooking Gas & Industrial Gas Delivery"
  }
];

export default function HeroSection({ title, subtitle, content }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [prescriptionValue, setPrescriptionValue] = useState("YES");
  const [countries, setCountries] = useState(ALL_COUNTRIES || []);
  const [locations, setLocations] = useState(HERO.locationsList || []);
  const [weightIndex, setWeightIndex] = useState(0);
  const [serviceType, setServiceType] = useState("PICKUP");

  const slides = content?.slides || heroSlides;
  const bullets = content?.bullets || HERO.bullets || [];

  useEffect(() => {
    import('../../utils/pricing').then(m => m.loadPricingData());
  }, []);

  useEffect(() => {
    // Fetch locations list from API
    api.get('/locations')
      .then(res => {
        if (res.data && res.data.data) {
          const uniqueCities = [];
          const seen = new Set();
          res.data.data.forEach(l => {
            const cityName = l.city || l.name.split(" to ")[0];
            const cleanName = cityName.trim();
            const lowerKey = cleanName.toLowerCase();
            if (!seen.has(lowerKey)) {
              seen.add(lowerKey);
              uniqueCities.push({
                id: lowerKey,
                name: cleanName
              });
            }
          });
          setLocations(uniqueCities);
        }
      })
      .catch(err => console.error('Error fetching locations:', err));
  }, []);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      weight: "0.5"
    }
  });

  useEffect(() => {
    if (location.state?.prefill) {
      const prefill = location.state.prefill;
      // Map country name back to country code
      const matchedCountry = ALL_COUNTRIES.find(c => c.name.toLowerCase() === prefill.country.toLowerCase());
      if (matchedCountry) {
        setValue("country", matchedCountry.code);
      }
      
      // Map medicineType back to id
      const matchedMed = HERO.medicineTypes.find(m => m.name.toLowerCase() === prefill.medicineType.toLowerCase());
      if (matchedMed) {
        setValue("medicineType", matchedMed.id);
      }

      if (prefill.mobile) {
        setValue("mobile", prefill.mobile);
      }

      if (prefill.prescription) {
        setPrescriptionValue(prefill.prescription);
      }

      if (prefill.serviceType) {
        setServiceType(prefill.serviceType === "I WANT PICK UP" ? "PICKUP" : "BUY");
      }

      if (prefill.weight !== undefined) {
        const wVal = parseFloat(prefill.weight);
        setValue("weight", wVal.toFixed(1));
        const idx = wVal === 0.5 ? 0 : wVal === 1.0 ? 1 : 2;
        setWeightIndex(idx);
      }
    }
  }, [location.state, setValue]);

  const weightLabels = ["0.5 kg", "1.0 kg", "Above"];

  const handleSliderChange = (e) => {
    const idx = parseInt(e.target.value);
    setWeightIndex(idx);
    const val = idx === 0 ? "0.5" : idx === 1 ? "1.0" : "2.0"; // "2.0" represents "Above" for calculations
    setValue("weight", val);
  };

  const weightOptions = Array.from({ length: 40 }, (_, i) => ({
    value: (0.5 * (i + 1)).toFixed(1),
    label: `${(0.5 * (i + 1)).toFixed(1)} KG`
  }));



  const onSubmitCalculator = async (data) => {
    const defaultLocId = locations[0]?.id || "delhi";
    const defaultLocName = locations[0]?.name || "Delhi";

    if (weightIndex === 2) {
      const countryObj = countries.find(c => c.code === data.country);
      const medTypeObj = HERO.medicineTypes.find(m => m.id === data.medicineType);

      const specialQuoteObj = {
        country: countryObj?.name || "Target Destination",
        countryCode: data.country,
        location: defaultLocName,
        medicineType: medTypeObj?.name || "Allopathic",
        mobile: data.mobile,
        prescription: prescriptionValue,
        weight: "Above 1 KG",
        serviceType: serviceType === "PICKUP" ? "I WANT PICK UP" : "BUY MEDICINES ON MY BEHALF"
      };

      navigate("/special-rates.php", { state: { calculatedQuote: specialQuoteObj } });
      return;
    }

    try {
      const response = await api.post('/quotes', {
        country: data.country,
        location: defaultLocId,
        locationName: defaultLocName,
        medicineType: data.medicineType,
        mobile: data.mobile,
        hasPrescription: prescriptionValue,
        notes: serviceType === "PICKUP" ? "I WANT PICK UP" : "BUY MEDICINES ON MY BEHALF"
      });

      if (response.data && response.data.success) {
        const quote = response.data.data;
        const countryObj = countries.find(c => c.code === quote.country);
        const locationObj = locations.find(l => l.id === quote.location) || { id: defaultLocId, name: defaultLocName };
        const medTypeObj = HERO.medicineTypes.find(m => m.id === quote.medicineType);

        const weightVal = parseFloat(data.weight || 0.5);
        const defaultProvider = getDefaultProvider(countryObj?.name || quote.countryName);

        const quoteObj = {
          country: quote.countryName || countryObj?.name || quote.country,
          countryCode: quote.country,
          location: quote.locationName || locationObj?.name || quote.location,
          medicineType: medTypeObj?.name || quote.medicineType,
          mobile: quote.mobile,
          prescription: quote.hasPrescription,
          weight: weightVal,
          provider: defaultProvider ? defaultProvider.provider : "Premium Provider",
          price: quote.estimatedPrice,
          timeline: quote.estimatedTimeline,
          bookingRef: quote.bookingRef,
          serviceType: serviceType === "PICKUP" ? "I WANT PICK UP" : "BUY MEDICINES ON MY BEHALF"
        };

        navigate("/service-provider.php", { state: { calculatedQuote: quoteObj } });
        return;
      }
    } catch (err) {
      console.error('Error generating quote from API, using fallback logic:', err);
    }

    // Fallback calculation logic if API call fails
    const countryObj = countries.find(c => c.code === data.country);
    const medTypeObj = HERO.medicineTypes.find(m => m.id === data.medicineType);
    const weightVal = parseFloat(data.weight || 0.5);

    let basePrice = 2850;
    let estTimeline = "3-5 Business Days";
    let defaultProviderName = "Premium Provider";

    const defaultProvider = getDefaultProvider(countryObj?.name);
    if (defaultProvider) {
      basePrice = calculatePrice(countryObj?.name, defaultProvider.provider, weightVal);
      estTimeline = defaultProvider.timeline;
      defaultProviderName = defaultProvider.provider;
    } else {
      if (countryObj?.code === "US") basePrice = 3300;
      if (countryObj?.code === "GB") basePrice = 3100;
      if (countryObj?.code === "AU") basePrice = 3400;
      if (countryObj?.code === "CA") basePrice = 3500;
      if (countryObj?.code === "AE") basePrice = 1800;
      estTimeline = countryObj?.code === "AE" ? "2-3 Business Days" : "3-5 Business Days";
    }

    const totalEstimate = Math.round(basePrice);

    const fallbackQuoteObj = {
      country: countryObj?.name || "Target Destination",
      countryCode: data.country,
      location: defaultLocName,
      medicineType: medTypeObj?.name || "Allopathic",
      mobile: data.mobile,
      prescription: prescriptionValue,
      weight: weightVal,
      provider: defaultProviderName,
      price: totalEstimate,
      timeline: estTimeline,
      bookingRef: `CM-${Math.floor(100000 + Math.random() * 900000)}`,
      serviceType: serviceType === "PICKUP" ? "I WANT PICK UP" : "BUY MEDICINES ON MY BEHALF"
    };

    navigate("/service-provider.php", { state: { calculatedQuote: fallbackQuoteObj } });
  };

  return (
    <>
      <section id="hero-section" className="relative w-full pt-2 md:pt-3 pb-3 md:pb-6 font-sans overflow-hidden">
        
        {/* Background Ambient Layers (High-Performance Modern Mesh) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-red-500/[0.04] rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-[#830000]/[0.05] rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50" />
        </div>

        {/* Hero Content Layer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div id="hero-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch pt-0">
          
          {/* Left Hero: Picture Column with Text Overlay (Matches Screenshot) */}
          <div 
            id="hero-left-col" 
            className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-slate-900 animate-[fadeInLeft_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] min-h-[480px] lg:min-h-[540px] flex flex-col justify-between group"
          >
            {/* Background Hero Image */}
            <img 
              src="/hero.jpg" 
              alt="Conch Gas LPG Delivery in Uganda" 
              fetchPriority="high"
              loading="eager"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/hero_gas_banner.jpg";
              }}
            />

            {/* Dark Gradient Overlay for optimal readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent pointer-events-none" />

            {/* Top Badge: Conch Gas Watermark */}
            <div className="relative z-10 p-5 sm:p-6 flex items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-white/60 shadow-md">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#830000] to-[#BC0202] text-white flex items-center justify-center shadow-xs">
                  <span className="text-[10px] font-black">C</span>
                </div>
                <span className="text-xs font-black tracking-wider text-slate-900 uppercase font-display">
                  CONCH <span className="text-[#BC0202]">GAS</span>
                </span>
              </div>
            </div>

            {/* Bottom Content Layer: Title, Tag & 2-Column Bullet List */}
            <div className="relative z-10 p-5 sm:p-7 md:p-8 space-y-3">
              
              {/* Tagline */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-cyan-400">
                  CUSTOMER'S FIRST & <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md text-[10px] sm:text-[11px]">TRUSTED</span> CHOICE
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-white tracking-tight leading-tight uppercase font-display">
                For Safe & Express LPG Cooking Gas Delivery
              </h1>

              {/* 2-Column Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 pt-1 w-full max-w-xl">
                {[
                  "Factory-Sealed Cylinders & Full Weight",
                  "Free Doorstep Gas Pickup & Delivery",
                  "Cheapest Refill & Cylinder Rates",
                  "Universal Empty Cylinder Exchange",
                  "Free Safety & Leak Testing Support",
                  "24x7 Customer Support & Hotline"
                ].map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-cyan-400 text-slate-950 shrink-0 shadow-xs">
                      <Check size={10} className="stroke-[3.5]" />
                    </span>
                    <span className="text-xs font-bold text-white/95 leading-tight">
                      {bullet}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* Right Hero / Mobile Hero: Calculator Form */}
          <div 
            id="hero-right-col" 
            className="block lg:col-span-5 animate-[fadeInRight_0.8s_cubic-bezier(0.16,1,0.3,1)_0.15s_forwards] w-full mt-2 lg:mt-0"
          >
            <CalculatorForm />
          </div>

          </div>
        </div>
      </section>
    </>
  );
}
