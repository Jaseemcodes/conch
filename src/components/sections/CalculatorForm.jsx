import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { calculateGasPrice, getDefaultProvider } from "../../utils/pricing";
import { COUNTRY_CALLING_CODES } from "../../constants/countryCodes";
import Input from "../ui/Input";
import api from "../../utils/api";
import { Flame, Package, Check, RefreshCw, Mail, ArrowRight } from "lucide-react";

const DEFAULT_LPG_WEIGHTS = [
  { value: 6, label: "6.0 kg", shortLabel: "6 kg" },
  { value: 13, label: "13.0 kg", shortLabel: "13 kg" },
  { value: 40, label: "40.0 kg", shortLabel: "40 kg" },
  { value: 45, label: "45 kg+", shortLabel: "45 kg+" }
];

const GAS_TYPES = [
  { value: "lpg_domestic", label: "LPG Gas Refill" },
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
  const [products, setProducts] = useState([]);
  const [weightOptions, setWeightOptions] = useState(DEFAULT_LPG_WEIGHTS);
  const [weightIndex, setWeightIndex] = useState(0);
  const [serviceType, setServiceType] = useState(null); // 'REFILL' | 'NEW_CONNECTION' | null
  const [serviceTypeError, setServiceTypeError] = useState(false);
  const [countryCode, setCountryCode] = useState("+256"); // Default Uganda

  const exchangeValue = serviceType === "REFILL" ? "YES" : "NO";

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      gasType: "lpg_domestic",
      location: "",
      weight: "6.0",
      mobile: "",
      email: ""
    }
  });

  const watchedGasType = watch("gasType") || "lpg_domestic";
  const isCustomProduct = watchedGasType && watchedGasType.startsWith("prod_");
  const selectedProduct = isCustomProduct ? products.find(p => p._id === watchedGasType.replace("prod_", "")) : null;

  // Reset serviceType when switching to a custom product (Industrial or Refrigerant gas)
  useEffect(() => {
    if (isCustomProduct) {
      setServiceType(null);
      setServiceTypeError(false);
    }
  }, [isCustomProduct]);

  // Dynamic Gas Type options: 1. LPG, 2. Top 2 Industrial, 3. Top 2 Refrigerant, 4. View More
  const gasTypeOptions = useMemo(() => {
    const list = [];

    // 1. LPG Gas Option
    list.push({
      value: "lpg_domestic",
      label: serviceType === "NEW_CONNECTION" 
        ? "LPG Gas New Connection" 
        : (serviceType === "REFILL" ? "LPG Gas Refill" : "LPG Cooking Gas")
    });

    // 2. Top 2 Industrial Gas Products
    const industrialProds = products
      .filter(p => (p.categoryName || p.category?.name || p.categorySlug || "").toUpperCase().includes("INDUSTRIAL"))
      .slice(0, 2);

    industrialProds.forEach(p => {
      list.push({
        value: `prod_${p._id}`,
        label: `[Industrial Gas] ${p.title}`
      });
    });

    // 3. Top 2 Refrigerant Gas Products
    const refrigerantProds = products
      .filter(p => (p.categoryName || p.category?.name || p.categorySlug || "").toUpperCase().includes("REFRIGERANT"))
      .slice(0, 2);

    refrigerantProds.forEach(p => {
      list.push({
        value: `prod_${p._id}`,
        label: `[Refrigerant Gas] ${p.title}`
      });
    });

    // 4. View More Option (Navigates to Products & Catalog)
    list.push({
      value: "view_more",
      label: "View More Products →"
    });

    return list;
  }, [products, serviceType]);

  // Dynamically load LPG products and refill weights from database
  useEffect(() => {
    api.get("/products").then(res => {
      if (res.data?.success && Array.isArray(res.data.data)) {
        setProducts(res.data.data);

        const lpgProds = res.data.data.filter(p => {
          const cat = (p.categoryName || p.category?.name || p.categorySlug || "").toLowerCase();
          return cat.includes("lpg") || cat.includes("cylinder");
        });

        const weightMap = new Map();
        lpgProds.forEach(p => {
          const rawW = p.weight ? String(p.weight).trim() : (p.title || "");
          const match = rawW.match(/(\d+(\.\d+)?)/);
          if (match) {
            const num = parseFloat(match[1]);
            if (num > 0 && !weightMap.has(num)) {
              weightMap.set(num, {
                value: num,
                label: num >= 45 ? `${num} kg+` : `${num.toFixed(1)} kg`,
                shortLabel: num >= 45 ? `${num} kg+` : `${num} kg`
              });
            }
          }
        });

        if (weightMap.size > 0) {
          const sorted = Array.from(weightMap.values()).sort((a, b) => a.value - b.value);
          setWeightOptions(sorted);
        }
      }
    }).catch(() => {});
  }, []);

  // Helper to find exact product price from database based on weight & order mode
  const getLiveProductPrice = (weightNum, mode, gasTypeVal) => {
    const isLpg = !gasTypeVal || gasTypeVal === "lpg_domestic";

    if (isLpg && products.length > 0) {
      const lpgProds = products.filter(p => {
        const cat = (p.categoryName || p.category?.name || p.categorySlug || "").toLowerCase();
        return cat.includes("lpg") || cat.includes("cylinder");
      });

      // Filter products matching this weight
      const weightMatches = lpgProds.filter(p => {
        const rawW = String(p.weight || p.title || "").toLowerCase();
        const m = rawW.match(/(\d+(\.\d+)?)/);
        return m && Math.round(parseFloat(m[1])) === Math.round(weightNum);
      });

      if (weightMatches.length > 0) {
        if (mode === "NEW_CONNECTION") {
          const newProd = weightMatches.find(p => {
            const t = (p.title || "").toLowerCase();
            return t.includes("new") || t.includes("connection");
          });
          if (newProd && typeof newProd.price === "number" && newProd.price > 0) {
            return newProd.price;
          }
        } else {
          // Default REFILL
          const refillProd = weightMatches.find(p => {
            const t = (p.title || "").toLowerCase();
            return t.includes("refill") || (!t.includes("new") && !t.includes("empty"));
          });
          if (refillProd && typeof refillProd.price === "number" && refillProd.price > 0) {
            return refillProd.price;
          }
        }

        if (typeof weightMatches[0].price === "number" && weightMatches[0].price > 0) {
          return weightMatches[0].price;
        }
      }
    }

    // Fallback to pricing engine if not loaded yet
    return calculateGasPrice(gasTypeVal || "lpg_domestic", weightNum, mode || "REFILL", mode === "REFILL" ? "YES" : "NO");
  };

  // Live computed price for current selection
  const selectedWeightVal = weightOptions[weightIndex]?.value || 6;
  let currentLivePrice = 0;
  if (isCustomProduct && selectedProduct) {
    currentLivePrice = selectedProduct.price || 0;
  } else if (serviceType) {
    currentLivePrice = getLiveProductPrice(selectedWeightVal, serviceType, "lpg_domestic");
  }

  useEffect(() => {
    // Prefill form values from location state if coming back from service provider page (Modify Search)
    const prefill = location.state?.calculatedQuote;
    if (prefill) {
      if (prefill.gasType) setValue("gasType", prefill.gasType);
      if (prefill.location) setValue("location", prefill.location);
      if (prefill.email) setValue("email", prefill.email);
      if (prefill.mobile) {
        const parts = prefill.mobile.split(' ');
        if (parts.length > 1 && parts[0].startsWith('+')) {
          setCountryCode(parts[0]);
          setValue("mobile", parts.slice(1).join(' '));
        } else {
          setValue("mobile", prefill.mobile);
        }
      }
      if (prefill.serviceType) {
        setServiceType(prefill.serviceType.includes("NEW") ? "NEW_CONNECTION" : "REFILL");
      }

      if (prefill.weight !== undefined) {
        const wVal = parseFloat(prefill.weight);
        const foundIdx = weightOptions.findIndex(o => o.value === wVal);
        const idx = foundIdx !== -1 ? foundIdx : (wVal <= 6 ? 0 : wVal <= 13 ? 1 : wVal <= 40 ? 2 : 3);
        setWeightIndex(idx);
        setValue("weight", `${wVal}.0`);
      }
    }
  }, [location.state, setValue, weightOptions]);

  const handleIndexChange = (newIndex) => {
    setWeightIndex(newIndex);
    const val = weightOptions[newIndex]?.value || 6;
    setValue("weight", val.toFixed(1));
  };

  const onSubmitCalculator = async (data) => {
    if (!serviceType && !isCustomProduct) {
      setServiceTypeError(true);
      return;
    }

    const selectedGas = gasTypeOptions.find(g => g.value === data.gasType) || gasTypeOptions[0];
    const selectedLoc = DELIVERY_LOCATIONS.find(l => l.value === data.location) || DELIVERY_LOCATIONS[0];
    const weightVal = weightOptions[weightIndex]?.value || 6;

    let finalPrice = 0;
    let finalGasLabel = selectedGas?.label || "LPG Gas Refill";
    let finalWeight = selectedWeightVal;
    let isHeavyCommercial = false;

    if (isCustomProduct && selectedProduct) {
      finalPrice = selectedProduct.price || 0;
      finalGasLabel = selectedProduct.title;
      finalWeight = selectedProduct.weight || "Standard Cylinder";
    } else {
      finalPrice = getLiveProductPrice(weightVal, serviceType, "lpg_domestic");
      finalGasLabel = selectedGas?.label || (serviceType === "NEW_CONNECTION" ? "LPG Gas New Connection" : "LPG Gas Refill");
      finalWeight = weightVal;
      if (weightVal >= 45) {
        isHeavyCommercial = true;
      }
    }

    // Heavy Commercial 45kg+ or Bulk Commercial Gas
    if (isHeavyCommercial) {
      const specialQuoteObj = {
        country: "Uganda",
        countryCode: "UG",
        location: selectedLoc.label,
        gasType: data.gasType,
        medicineType: finalGasLabel,
        mobile: `${countryCode} ${data.mobile}`,
        email: data.email || "",
        prescription: exchangeValue,
        hasExchange: exchangeValue,
        weight: typeof finalWeight === "number" ? `${finalWeight} KG` : finalWeight,
        serviceType: serviceType === "REFILL" ? "GAS REFILL (EXCHANGE)" : "NEW COMMERCIAL CONNECTION",
        price: finalPrice,
        timeline: "Same Day Tank / Cylinder Dispatch"
      };

      navigate("/special-rates.php", { state: { calculatedQuote: specialQuoteObj } });
      return;
    }

    // Standard Cylinder Calculation
    const calculatedAmount = finalPrice;

    const quoteObj = {
      country: "Uganda",
      countryCode: countryCode,
      location: selectedLoc.label,
      locationValue: data.location,
      productId: isCustomProduct ? selectedProduct?._id : undefined,
      productTitle: finalGasLabel,
      gasType: finalGasLabel,
      gasLabel: finalGasLabel,
      medicineType: finalGasLabel,
      categoryName: isCustomProduct ? (selectedProduct?.categoryName || selectedProduct?.categorySlug || "Special Gas") : "LPG Gas Cylinders",
      quantity: 1,
      mobile: `${countryCode} ${data.mobile}`,
      mobileRaw: data.mobile,
      email: data.email || "",
      prescription: exchangeValue,
      hasExchange: exchangeValue,
      weight: finalWeight,
      provider: "Conch Express Delivery",
      price: calculatedAmount,
      timeline: "Express Doorstep Delivery",
      bookingRef: `CG-${Math.floor(100000 + Math.random() * 900000)}`,
      serviceType: serviceType === "REFILL" ? "GAS REFILL" : (serviceType === "NEW_CONNECTION" ? "NEW COMPLETE CYLINDER CONNECTION" : "STANDARD PRODUCT ORDER"),
      orderMode: serviceType === "REFILL" ? "Gas Refill" : (serviceType === "NEW_CONNECTION" ? "New Connection Kit" : "Direct Purchase")
    };

    // Capture quote lead in background
    try {
      api.post('/quotes', {
        country: "UG",
        countryName: "Uganda",
        location: data.location,
        locationName: selectedLoc.label,
        medicineType: finalGasLabel,
        mobile: `${countryCode} ${data.mobile}`,
        email: data.email || "",
        hasPrescription: exchangeValue,
        estimatedPrice: calculatedAmount,
        estimatedTimeline: "Express Delivery",
        notes: `Gas: ${finalGasLabel} | Size: ${finalWeight} | Order Mode: ${serviceType === "REFILL" ? "Refill" : "New Connection"} | Price: UGX ${calculatedAmount}`
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
                <div className="flex items-center justify-between">
                  <label className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isCustomProduct ? "text-slate-400" : "text-slate-700"}`}>
                    Select Order Mode {!isCustomProduct && <span className="text-[#BC0202]">*</span>}
                  </label>
                  {isCustomProduct && (
                    <span className="text-[9.5px] font-bold text-slate-400 italic">
                      (Disabled for selected gas)
                    </span>
                  )}
                </div>
                <div className={`grid grid-cols-2 gap-3 p-1 rounded-2xl transition-all duration-200 ${
                  serviceTypeError ? "ring-2 ring-[#BC0202]/50 bg-red-50/50 p-2" : ""
                } ${isCustomProduct ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
                  <button
                    type="button"
                    disabled={isCustomProduct}
                    onClick={() => {
                      if (isCustomProduct) return;
                      setServiceType("REFILL");
                      setServiceTypeError(false);
                    }}
                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border-2 text-center transition-all duration-200 shadow-xs select-none relative overflow-hidden ${
                      isCustomProduct
                        ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                        : serviceType === "REFILL"
                          ? "bg-gradient-to-r from-[#830000] to-[#BC0202] border-[#830000] text-white font-black scale-[1.01] shadow-xs cursor-pointer group active:scale-97"
                          : "bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 font-extrabold cursor-pointer group active:scale-97"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Flame className={`w-5 h-5 transition-transform duration-200 ${
                        isCustomProduct 
                          ? "text-slate-400" 
                          : serviceType === "REFILL" 
                            ? "text-white fill-white" 
                            : "text-slate-500 group-hover:text-[#BC0202]"
                      }`} />
                      <span className="text-[9.5px] sm:text-[11px] uppercase tracking-wide">I Want Gas Refill</span>
                    </div>
                    {serviceType === "REFILL" && !isCustomProduct && (
                      <div className="absolute top-0.5 right-0.5 bg-white text-[#BC0202] rounded-full p-0.5 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={isCustomProduct}
                    onClick={() => {
                      if (isCustomProduct) return;
                      setServiceType("NEW_CONNECTION");
                      setServiceTypeError(false);
                    }}
                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border-2 text-center transition-all duration-200 shadow-xs select-none relative overflow-hidden ${
                      isCustomProduct
                        ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                        : serviceType === "NEW_CONNECTION"
                          ? "bg-gradient-to-r from-[#830000] to-[#BC0202] border-[#830000] text-white font-black scale-[1.01] shadow-xs cursor-pointer group active:scale-97"
                          : "bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 font-extrabold cursor-pointer group active:scale-97"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Package className={`w-5 h-5 transition-transform duration-200 ${
                        isCustomProduct 
                          ? "text-slate-400" 
                          : serviceType === "NEW_CONNECTION" 
                            ? "text-white" 
                            : "text-slate-500 group-hover:text-[#BC0202]"
                      }`} />
                      <span className="text-[9px] sm:text-[11px] uppercase tracking-wide">New Connection Kit</span>
                    </div>
                    {serviceType === "NEW_CONNECTION" && !isCustomProduct && (
                      <div className="absolute top-0.5 right-0.5 bg-white text-[#BC0202] rounded-full p-0.5 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                </div>
                {serviceTypeError && !isCustomProduct && (
                  <span className="text-[10px] text-[#BC0202] font-bold ml-1 animate-in fade-in duration-200">
                    Please select an order mode (Gas Refill or New Connection)
                  </span>
                )}
              </div>

              {/* Gas Type & Cylinder Size Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between">
                    <label htmlFor="form-gas-type" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      SELECT GAS TYPE <span className="text-[#BC0202]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => navigate("/products")}
                      className="text-[10.5px] font-bold text-[#BC0202] hover:text-[#830000] hover:underline flex items-center gap-0.5 cursor-pointer transition-colors"
                      title="View all products and categories"
                    >
                      <span>View More</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <Input
                    id="form-gas-type"
                    componentType="select"
                    required
                    options={gasTypeOptions}
                    error={errors.gasType?.message}
                    {...register("gasType", {
                      required: "Gas category is required",
                      onChange: (e) => {
                        if (e.target.value === "view_more") {
                          navigate("/products");
                          setValue("gasType", watchedGasType && watchedGasType !== "view_more" ? watchedGasType : "lpg_domestic");
                        }
                      }
                    })}
                  />
                </div>
                
                {/* Custom Weight / Cylinder Slider (Disabled for Non-LPG products) */}
                <div className={`flex flex-col gap-1 w-full transition-opacity duration-200 ${isCustomProduct ? "opacity-50" : "opacity-100"}`}>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      CYLINDER SIZE {!isCustomProduct && currentLivePrice > 0 && (
                        <span className="text-[#BC0202] font-black lowercase ml-1">
                          ({weightOptions[weightIndex]?.shortLabel || `${weightOptions[weightIndex]?.value || 6} kg`})
                        </span>
                      )}
                    </span>
                    {!isCustomProduct && (
                      <div>
                        {currentLivePrice > 0 ? (
                          <span className="text-xs font-extrabold text-[#BC0202] bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-md shadow-2xs whitespace-nowrap animate-in fade-in duration-200">
                            UGX {currentLivePrice.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-sm font-black text-slate-900 leading-none">
                            {weightOptions[weightIndex]?.shortLabel || `${weightOptions[weightIndex]?.value || 6} kg`}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="relative mt-1">
                    <input
                      type="range"
                      min="0"
                      max={Math.max(0, weightOptions.length - 1)}
                      step="1"
                      disabled={isCustomProduct}
                      value={weightIndex}
                      onChange={(e) => handleIndexChange(parseInt(e.target.value) || 0)}
                      className={`w-full custom-slider ${isCustomProduct ? "cursor-not-allowed" : "cursor-pointer"}`}
                    />
                    <input type="hidden" {...register("weight")} />
                  </div>

                  <div className="flex justify-between text-[11px] font-bold text-slate-400 px-1 mt-1">
                    {weightOptions.map((opt, idx) => (
                      <span
                        key={idx}
                        className={`transition-all duration-150 ${
                          isCustomProduct 
                            ? 'cursor-not-allowed text-slate-300 select-none'
                            : weightIndex === idx 
                              ? 'text-[#BC0202] font-black scale-110 cursor-pointer' 
                              : 'hover:text-[#BC0202] cursor-pointer'
                        }`}
                        onClick={isCustomProduct ? undefined : () => handleIndexChange(idx)}
                      >
                        {opt.shortLabel}
                      </span>
                    ))}
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
                      {COUNTRY_CALLING_CODES.slice(0, 30).map((c, idx) => (
                        <option key={`${c.iso}-${idx}`} value={c.code}>{c.iso} {c.code}</option>
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

              {/* Email Address Input */}
              <div id="email-option-container" className="pt-2">
                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="form-email" className="text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
                    EMAIL ADDRESS <span className="text-[#BC0202]">*</span>
                  </label>
                  <div className={`flex items-center h-11 relative shadow-sm rounded-xl border ${errors.email ? "border-red-400 focus-within:ring-2 focus-within:ring-[#BC0202]/20 focus-within:border-[#BC0202] bg-red-50/50" : "border-slate-200 focus-within:ring-2 focus-within:ring-[#BC0202]/20 focus-within:border-[#BC0202] bg-white"} transition-all overflow-hidden px-3 gap-2.5`}>
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      id="form-email"
                      type="email"
                      placeholder="Enter your email address (e.g. name@example.com)"
                      {...register("email", { 
                        required: "Email address is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address"
                        }
                      })}
                      className="w-full bg-transparent text-[11px] sm:text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none tracking-tight"
                    />
                  </div>
                  {errors.email && <span className="text-[10px] text-red-500 font-bold ml-1">{errors.email.message}</span>}
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="submit-calculator-btn"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] hover:from-[#000000] hover:to-[#BC0202] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all scale-[1.01] hover:scale-[1.02] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>
                    {currentLivePrice > 0 
                      ? `Book Delivery • UGX ${currentLivePrice.toLocaleString()}`
                      : "Check Gas Charges & Book Delivery"
                    }
                  </span>
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
