import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { calculateGasPrice, getDefaultProvider } from "../../utils/pricing";
import { COUNTRY_CALLING_CODES } from "../../constants/countryCodes";
import Input from "../ui/Input";
import api from "../../utils/api";
import { Flame, Package, Check, RefreshCw } from "lucide-react";

const weightLabels = ["6.0 kg", "13.0 kg", "45 kg+ (Commercial)"];
const weightNumericValues = [6, 13, 45];

const GAS_TYPES = [
  { value: "lpg_domestic", label: "LPG Cooking Gas (Domestic & Commercial)" },
  { value: "medical_oxygen", label: "Medical Oxygen (Hospital / Home Care)" },
  { value: "industrial_oxygen", label: "Industrial Oxygen Refill" },
  { value: "argon_gas", label: "Argon Gas 99.99% (Welding)" },
  { value: "acetylene_gas", label: "Acetylene Gas 99.9%" },
  { value: "co2_nitrogen", label: "Nitrogen / CO2 Gas" }
];

const DELIVERY_LOCATIONS = [
  { value: "kira_road", label: "Kira Road, Kampala (Main Hub)" },
  { value: "kampala_central", label: "Kampala Central / City" },
  { value: "entebbe", label: "Entebbe & Airport Environs" },
  { value: "wakiso", label: "Wakiso District" },
  { value: "mukono", label: "Mukono Town & Environs" },
  { value: "jinja", label: "Jinja Highway" },
  { value: "other_uganda", label: "Other Location (Express Dispatch)" }
];

export default function CalculatorForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [exchangeValue, setExchangeValue] = useState("YES");
  const [weightIndex, setWeightIndex] = useState(0);
  const [serviceType, setServiceType] = useState("REFILL"); // 'REFILL' | 'NEW_CONNECTION'
  const [serviceTypeError, setServiceTypeError] = useState(false);
  const [countryCode, setCountryCode] = useState("+256"); // Default Uganda

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      gasType: "lpg_domestic",
      location: "kira_road",
      weight: "6.0",
      mobile: ""
    }
  });

  useEffect(() => {
    // Prefill form values from location state if coming back from service provider page (Modify Search)
    const prefill = location.state?.calculatedQuote;
    if (prefill) {
      if (prefill.gasType) setValue("gasType", prefill.gasType);
      if (prefill.location) setValue("location", prefill.location);
      if (prefill.mobile) {
        const parts = prefill.mobile.split(' ');
        if (parts.length > 1 && parts[0].startsWith('+')) {
          setCountryCode(parts[0]);
          setValue("mobile", parts.slice(1).join(' '));
        } else {
          setValue("mobile", prefill.mobile);
        }
      }
      if (prefill.hasExchange) setExchangeValue(prefill.hasExchange);
      if (prefill.serviceType) {
        setServiceType(prefill.serviceType.includes("NEW") ? "NEW_CONNECTION" : "REFILL");
      }

      if (prefill.weight !== undefined) {
        const wVal = parseFloat(prefill.weight);
        const idx = wVal <= 6 ? 0 : wVal <= 13 ? 1 : 2;
        setWeightIndex(idx);
        setValue("weight", `${wVal}.0`);
      }
    }
  }, [location.state, setValue]);

  const handleIndexChange = (newIndex) => {
    setWeightIndex(newIndex);
    const val = weightNumericValues[newIndex];
    setValue("weight", val.toFixed(1));
  };

  const onSubmitCalculator = async (data) => {
    if (!serviceType) {
      setServiceTypeError(true);
      return;
    }

    const selectedGas = GAS_TYPES.find(g => g.value === data.gasType) || GAS_TYPES[0];
    const selectedLoc = DELIVERY_LOCATIONS.find(l => l.value === data.location) || DELIVERY_LOCATIONS[0];
    const weightVal = weightNumericValues[weightIndex];

    // Heavy Commercial 45kg+ or Bulk Commercial Gas
    if (weightIndex === 2) {
      const specialQuoteObj = {
        country: "Uganda",
        countryCode: "UG",
        location: selectedLoc.label,
        gasType: selectedGas.value,
        medicineType: selectedGas.label,
        mobile: `${countryCode} ${data.mobile}`,
        prescription: exchangeValue,
        hasExchange: exchangeValue,
        weight: "45 Kg+ Commercial Supply",
        serviceType: serviceType === "REFILL" ? "GAS REFILL (EXCHANGE)" : "NEW COMMERCIAL CONNECTION",
        price: 380000,
        timeline: "Same Day Tank / Cylinder Dispatch"
      };

      navigate("/special-rates.php", { state: { calculatedQuote: specialQuoteObj } });
      return;
    }

    // Standard 6kg, 13kg, 40kg or 45kg Cylinder Calculation
    const calculatedAmount = calculateGasPrice(selectedGas.value, weightVal, serviceType, exchangeValue);

    const quoteObj = {
      country: "Uganda",
      countryCode: countryCode,
      location: selectedLoc.label,
      locationValue: data.location,
      gasType: selectedGas.value,
      gasLabel: selectedGas.label,
      medicineType: selectedGas.label,
      mobile: `${countryCode} ${data.mobile}`,
      mobileRaw: data.mobile,
      prescription: exchangeValue,
      hasExchange: exchangeValue,
      weight: weightVal,
      provider: "Conch Express Delivery",
      price: calculatedAmount,
      timeline: "Under 2 Hours Doorstep Delivery",
      bookingRef: `CG-${Math.floor(100000 + Math.random() * 900000)}`,
      serviceType: serviceType === "REFILL" ? "GAS REFILL (CYLINDER EXCHANGE)" : "NEW COMPLETE CYLINDER CONNECTION",
      orderMode: serviceType === "REFILL" ? "Gas Refill" : "New Connection Kit"
    };

    // Capture quote lead in background
    try {
      api.post('/quotes', {
        country: "UG",
        countryName: "Uganda",
        location: data.location,
        locationName: selectedLoc.label,
        medicineType: selectedGas.label,
        mobile: `${countryCode} ${data.mobile}`,
        hasPrescription: exchangeValue,
        estimatedPrice: calculatedAmount,
        estimatedTimeline: "Under 2 Hours",
        notes: `Gas: ${selectedGas.label} | Size: ${weightVal}kg | Order Mode: ${serviceType === "REFILL" ? "Refill" : "New Connection"} | Exchange: ${exchangeValue}`
      }).catch(() => {});
    } catch (err) {}

    navigate("/booking.php", { state: { calculatedQuote: quoteObj } });
  };

  return (
    <div id="hero-form-card" className="bg-white border-2 border-[#BC0202]/50 shadow-2xl rounded-2xl relative overflow-hidden h-full flex flex-col justify-between font-sans">
      
      {/* Solid Bottom Border highlight */}
      <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000]" />
      
      <div className="flex flex-col h-full justify-between">
        <div>
          <h2 id="calculator-form-title" className="bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] text-white text-center py-3.5 px-4 font-extrabold text-[13px] md:text-sm uppercase tracking-wide w-full flex items-center justify-center shrink-0 shadow-xs">
            <span>CHOOSE GAS SERVICE FROM BELOW OPTION</span>
          </h2>

          <div className="p-5">
            <form id="calculator-form" onSubmit={handleSubmit(onSubmitCalculator)} className="space-y-3.5 font-sans">
              
              {/* Service Option Buttons */}
              <div className="flex flex-col gap-1.5 mb-3 w-full">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                  Select Order Mode <span className="text-[#BC0202]">*</span>
                </label>
                <div className={`grid grid-cols-2 gap-3 p-1 rounded-2xl transition-all duration-200 ${
                  serviceTypeError ? "ring-2 ring-[#BC0202]/50 bg-red-50/50 p-2" : ""
                }`}>
                  <button
                    type="button"
                    onClick={() => {
                      setServiceType("REFILL");
                      setServiceTypeError(false);
                    }}
                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border-2 text-center transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer group active:scale-97 select-none relative overflow-hidden ${
                      serviceType === "REFILL"
                        ? "bg-gradient-to-r from-[#830000] to-[#BC0202] border-[#830000] text-white font-black scale-[1.01] shadow-xs"
                        : "bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 font-extrabold"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Flame className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${serviceType === "REFILL" ? "text-white fill-white" : "text-slate-500 group-hover:text-[#BC0202]"}`} />
                      <span className="text-[9.5px] sm:text-[11px] uppercase tracking-wide">I Want Gas Refill</span>
                    </div>
                    {serviceType === "REFILL" && (
                      <div className="absolute top-0.5 right-0.5 bg-white text-[#BC0202] rounded-full p-0.5 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setServiceType("NEW_CONNECTION");
                      setServiceTypeError(false);
                    }}
                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border-2 text-center transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer group active:scale-97 select-none relative overflow-hidden ${
                      serviceType === "NEW_CONNECTION"
                        ? "bg-gradient-to-r from-[#830000] to-[#BC0202] border-[#830000] text-white font-black scale-[1.01] shadow-xs"
                        : "bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 font-extrabold"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Package className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${serviceType === "NEW_CONNECTION" ? "text-white" : "text-slate-500 group-hover:text-[#BC0202]"}`} />
                      <span className="text-[9px] sm:text-[11px] uppercase tracking-wide">New Connection Kit</span>
                    </div>
                    {serviceType === "NEW_CONNECTION" && (
                      <div className="absolute top-0.5 right-0.5 bg-white text-[#BC0202] rounded-full p-0.5 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                </div>
                {serviceTypeError && (
                  <span className="text-[10px] text-[#BC0202] font-bold ml-1 animate-in fade-in duration-200">
                    Please select an order mode (Gas Refill or New Connection)
                  </span>
                )}
              </div>

              {/* Gas Type & Cylinder Size Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <Input
                  id="form-gas-type"
                  label="SELECT GAS TYPE"
                  placeholder="Choose Gas Type"
                  componentType="select"
                  required
                  options={GAS_TYPES}
                  error={errors.gasType?.message}
                  {...register("gasType", { required: "Gas category is required" })}
                />
                
                {/* Custom Weight / Cylinder Slider */}
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      CYLINDER SIZE
                    </span>
                    <span className="text-[17px] font-black text-[#BC0202] leading-none">
                      {weightLabels[weightIndex]}
                    </span>
                  </div>
                  
                  <div className="relative mt-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={weightIndex * 50}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        const currentVal = weightIndex * 50;
                        let newIdx = weightIndex;
                        if (val > currentVal) {
                          if (val > 75 && weightIndex === 0) newIdx = 2;
                          else newIdx = Math.min(2, weightIndex + 1);
                        } else if (val < currentVal) {
                          if (val < 25 && weightIndex === 2) newIdx = 0;
                          else newIdx = Math.max(0, weightIndex - 1);
                        }
                        handleIndexChange(newIdx);
                      }}
                      className="w-full custom-slider cursor-pointer"
                    />
                    <input type="hidden" {...register("weight")} />
                  </div>

                  <div className="flex justify-between text-[11px] font-bold text-slate-400 px-1 mt-1">
                    <span className="cursor-pointer hover:text-[#BC0202] transition-colors" onClick={() => handleIndexChange(0)}>6 kg</span>
                    <span className="cursor-pointer hover:text-[#BC0202] transition-colors" onClick={() => handleIndexChange(1)}>13 kg</span>
                    <span className="cursor-pointer hover:text-[#BC0202] transition-colors" onClick={() => handleIndexChange(2)}>45 kg+</span>
                  </div>
                </div>
              </div>

              {/* Delivery Area & Mobile Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  id="form-delivery-location"
                  label="DELIVERY AREA / LOCATION"
                  placeholder="Select Delivery Area"
                  componentType="select"
                  required
                  options={DELIVERY_LOCATIONS}
                  error={errors.location?.message}
                  {...register("location", { required: "Delivery location is required" })}
                />

                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="form-mobile" className="text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
                    MOBILE NO.* <span className="text-[#BC0202]">*</span>
                  </label>
                  <div className={`flex h-11 relative shadow-sm rounded-xl border ${errors.mobile ? "border-red-400 focus-within:ring-2 focus-within:ring-[#BC0202]/20 focus-within:border-[#BC0202] bg-red-50/50" : "border-slate-200 focus-within:ring-2 focus-within:ring-[#BC0202]/20 focus-within:border-[#BC0202] bg-white"} transition-all overflow-hidden`}>
                    <select 
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-[68px] shrink-0 px-1 bg-slate-100/60 text-[11px] font-bold text-slate-800 focus:outline-none border-r border-slate-200 cursor-pointer"
                    >
                      {COUNTRY_CALLING_CODES.slice(0, 30).map(c => (
                        <option key={c.iso + c.code} value={c.code}>{c.iso} {c.code}</option>
                      ))}
                    </select>
                    <input
                      id="form-mobile"
                      type="tel"
                      placeholder="700 000 000"
                      {...register("mobile", { 
                        required: "Mobile phone is required",
                        pattern: {
                          value: /^[0-9\s-]{6,15}$/,
                          message: "Invalid phone format"
                        }
                      })}
                      className="w-full px-2 bg-transparent text-[11px] sm:text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none tracking-tight"
                    />
                  </div>
                  {errors.mobile && <span className="text-[10px] text-red-500 font-bold ml-1">{errors.mobile.message}</span>}
                </div>
              </div>

              {/* Empty Cylinder Exchange Radios */}
              <div id="exchange-option-container" className="pt-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-2">
                  DO YOU HAVE AN EMPTY CYLINDER TO EXCHANGE ?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="exchange-yes-btn"
                    type="button"
                    onClick={() => setExchangeValue("YES")}
                    className={`py-2 px-3 rounded-xl font-bold text-[11px] border text-center transition-all cursor-pointer ${
                      exchangeValue === "YES"
                        ? "bg-red-50 border-[#BC0202] text-[#830000] shadow-xs font-extrabold"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    YES (CYLINDER EXCHANGE)
                  </button>
                  <button
                    id="exchange-no-btn"
                    type="button"
                    onClick={() => setExchangeValue("NO")}
                    className={`py-2 px-3 rounded-xl font-bold text-[11px] border text-center transition-all cursor-pointer ${
                      exchangeValue === "NO"
                        ? "bg-red-50 border-[#BC0202] text-[#830000] shadow-xs font-extrabold"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    NO (INCLUDE DEPOSIT)
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="submit-calculator-btn"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] hover:from-[#000000] hover:to-[#BC0202] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all scale-[1.01] hover:scale-[1.02] active:scale-[0.99] cursor-pointer"
                >
                  Check Gas Charges & Book Delivery
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
