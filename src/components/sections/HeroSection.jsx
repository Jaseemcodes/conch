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
      <section id="hero-section" className="relative w-full pt-2 md:pt-3 pb-3 md:pb-8 font-sans">
        
        {/* Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-white">
          <img 
            src="https://res.cloudinary.com/dib6l7ocv/image/upload/f_auto,q_auto/v1781865141/courier-medicine-static/bright-bg.jpg" 
            alt="Medical Abstract Background" 
            width={1920}
            height={1080}
            loading="lazy"
            className="w-full h-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-white"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
        </div>

        {/* Hero Content Layer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div id="hero-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-0">
          
          {/* Left Hero: Picture Column with Text Overlay */}
          <div 
            id="hero-left-col" 
            className="lg:col-span-7 flex flex-col justify-between relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-gradient-to-b from-white via-slate-50 to-[#E2E8F0] animate-[fadeInLeft_0.8s_ease-out_forwards] min-h-0 lg:min-h-[540px] gap-4 sm:gap-6 lg:gap-0"
          >
            
            {/* Top Text Content Layer */}
            <div className="relative z-10 p-5 sm:p-7 md:p-8 pb-1 sm:pb-2 flex flex-col items-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-900 tracking-tight leading-tight max-w-xl font-display">
                Online LPG Cooking Gas & <span className="bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] bg-clip-text text-transparent">Industrial Gas</span> Delivery
              </h1>

              {/* Features Bullet List */}
              {bullets && bullets.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 w-full max-w-xl">
                  {bullets.slice(0, 4).map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white/90 border border-slate-200/70 py-1.5 px-3 rounded-xl shadow-2xs">
                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-r from-[#830000] to-[#BC0202] text-white shrink-0 shadow-xs">
                        <Check size={9} className="stroke-[3.5]" />
                      </span>
                      <span className="text-[11px] sm:text-xs font-bold tracking-tight text-slate-800 leading-tight">
                        {bullet}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom: Full-Width Product Showcase (100% Uncropped & Seamless Fit) */}
            <div className="relative z-10 w-full mt-2 sm:mt-auto px-3 sm:px-4 pb-3 sm:pb-4 pt-0 flex items-end justify-center">
              <img 
                src="/hero_gas_banner.jpg" 
                alt="Conch Gas Products, Cylinders, Cookers & Industrial Tank" 
                width={1200}
                height={500}
                fetchPriority="high"
                loading="eager"
                className="w-full h-auto max-h-[220px] sm:max-h-[260px] lg:max-h-[280px] object-contain object-bottom drop-shadow-sm transition-transform duration-300 hover:scale-[1.01]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/conch_hero_banner.jpg";
                }}
              />
            </div>

          </div>

          {/* Right Hero / Mobile Hero: Calculator Form */}
          <div 
            id="hero-right-col" 
            className="block lg:col-span-5 animate-[fadeInRight_0.8s_ease-out_0.2s_forwards] w-full mt-2 lg:mt-0"
          >
            <CalculatorForm />
          </div>

          </div>
        </div>
      </section>
    </>
  );
}
