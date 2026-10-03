import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, openAuthModal } = useAuth();

  // Retrieve calculated quote and selected provider details from routing state
  const calculatedQuote = location.state?.calculatedQuote || {
    country: "Uganda",
    countryCode: "UG",
    location: "Kampala (Kira Road Depot)",
    gasType: "LPG Cooking Gas",
    medicineType: "LPG Cooking Gas",
    gasLabel: "6KG LPG Cooking Gas Cylinder",
    mobile: "",
    prescription: "YES",
    weight: 6,
    provider: "CONCH EXPRESS",
    price: 48000,
    timeline: "Within 2 Hours",
    bookingRef: "CG-849102",
    serviceType: "DOORSTEP REFILL (EXCHANGE)",
    orderMode: "Gas Refill"
  };

  const selectedProvider = location.state?.selectedProvider || {
    name: "CONCH EXPRESS",
    keyName: "CONCH EXPRESS",
    price: calculatedQuote.price || 48000,
    timeline: "Within 2 Hours"
  };

  const displayWeight = calculatedQuote.weight 
    ? (String(calculatedQuote.weight).toUpperCase().includes("KG") ? calculatedQuote.weight : `${calculatedQuote.weight} KG`)
    : "Standard Size";

  // Form handling
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user?.name ? user.name.split(" ")[0] : "",
      lastName: user?.name ? user.name.split(" ").slice(1).join(" ") : "",
      country: "Uganda",
      streetAddress1: user?.address || "",
      streetAddress2: "",
      city: calculatedQuote.location || user?.city || "Kampala",
      state: "Central Region",
      postcode: "00256",
      phone: calculatedQuote.mobile || user?.phone || "",
      email: user?.email || "",
      orderNotes: ""
    }
  });

  // States for submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Sync user profile when logged in
  useEffect(() => {
    if (user) {
      if (user.name) {
        const parts = user.name.split(" ");
        setValue("firstName", parts[0] || "");
        setValue("lastName", parts.slice(1).join(" ") || "");
      }
      if (user.email) setValue("email", user.email);
      if (user.phone) setValue("phone", user.phone);
      if (user.address) setValue("streetAddress1", user.address);
      if (user.city) setValue("city", user.city);
    }
  }, [user, setValue]);

  // Pricing calculations
  const baseCharges = selectedProvider.price || calculatedQuote.price || 110000;
  const deliveryFee = 0; // Free Conch Express delivery
  const totalAmount = Math.round(baseCharges + deliveryFee);

  // Submit Handler
  const onSubmitBooking = async (data) => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const fullCustomerName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();
      const formattedAddress = [
        data.streetAddress1.trim(),
        data.streetAddress2?.trim(),
        data.city.trim(),
        data.state.trim(),
        data.postcode.trim(),
        data.country.trim()
      ].filter(Boolean).join(", ");

      const payload = {
        customerName: fullCustomerName,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        billingCountry: data.country.trim(),
        streetAddress1: data.streetAddress1.trim(),
        streetAddress2: data.streetAddress2?.trim() || "",
        city: data.city.trim(),
        state: data.state.trim(),
        postcode: data.postcode.trim(),
        orderNotes: data.orderNotes?.trim() || "",
        customerEmail: data.email?.trim() || "",
        customerPhone: data.phone.trim(),
        originAddress: "Conch Gas Depot, Kira Road, Kampala, Uganda",
        originCity: "Kampala (Kira Road)",
        destinationCountry: data.country.trim() || "Uganda",
        destinationCountryCode: data.country === "Uganda" ? "UG" : "UG",
        destinationCity: data.city.trim() || "Kampala",
        destinationAddress: formattedAddress,
        gasType: calculatedQuote.gasType || calculatedQuote.medicineType || "LPG Domestic Gas",
        cylinderSize: `${calculatedQuote.weight || 13} KG`,
        orderType: (calculatedQuote.serviceType || "").toLowerCase().includes("new") ? "new_cylinder" : "refill",
        cylinderExchange: calculatedQuote.prescription === "YES" || calculatedQuote.cylinderExchange !== false,
        emptyCylinderBrand: "Conch Gas",
        deliveryArea: data.city.trim() || "Kampala Central",
        deliverySlot: "Today - Within 2 Hours (Express)",
        paymentMethod: "cash_on_delivery",
        weight: typeof calculatedQuote.weight === "number" ? calculatedQuote.weight : parseFloat(calculatedQuote.weight) || 13,
        basePrice: baseCharges,
        finalPrice: totalAmount,
        courierPartner: "CONCH EXPRESS",
        estimatedDeliveryTime: "Within 2 Hours",
        notes: data.orderNotes?.trim() || ""
      };

      const response = await api.post("/orders/public", payload);
      
      if (response.data && response.data.success) {
        navigate("/thanks.php", {
          state: {
            successData: response.data.data,
            selectedProvider: {
              name: "CONCH EXPRESS",
              keyName: "CONCH EXPRESS",
              price: baseCharges,
              timeline: "Within 2 Hours"
            },
            totalAmount,
            calculatedQuote
          }
        });
      } else {
        setErrorMsg("Failed to book order. Please try again or call support.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      const serverMsg = err.response?.data?.message || "An error occurred during booking. Please try again.";
      setErrorMsg(serverMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="booking-checkout-page" className="pb-20 bg-[#f9fafb] font-sans text-slate-700">
      
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1 uppercase font-display">
              Checkout & Gas Booking
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Official Conch Gas Express Doorstep Delivery in Kampala and across Uganda.
            </p>
          </div>

          {!isLoggedIn ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xs font-black">
                ✨
              </div>
              <div className="text-xs">
                <span className="font-bold text-amber-900 block">Returning Customer?</span>
                <button
                  type="button"
                  onClick={() => openAuthModal("login", "/booking.php")}
                  className="text-red-600 hover:text-red-700 font-extrabold underline cursor-pointer text-[11px]"
                >
                  Click here to login for auto-fill
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
                ✓
              </div>
              <div className="text-xs">
                <span className="font-bold text-emerald-900 block">Logged in as {user?.name || "Customer"}</span>
                <span className="text-emerald-700 text-[11px]">Your details have been prefilled.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <form onSubmit={handleSubmit(onSubmitBooking)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Billing Details & Additional Information */}
          <div className="lg:col-span-8 space-y-6">
            
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-semibold border border-red-100 animate-pulse">
                {errorMsg}
              </div>
            )}

            {/* BILLING DETAILS CARD */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-5">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide pb-1 border-b border-slate-100">
                BILLING DETAILS
              </h2>

              {/* Row 1: First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    First Name <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jaseem"
                    {...register("firstName", { required: "First name is required" })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  />
                  {errors.firstName && <span className="text-[11px] text-red-600 font-semibold mt-1 block">{errors.firstName.message}</span>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Last Name <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rafik"
                    {...register("lastName", { required: "Last name is required" })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  />
                  {errors.lastName && <span className="text-[11px] text-red-600 font-semibold mt-1 block">{errors.lastName.message}</span>}
                </div>
              </div>

              {/* Row 2: Country / Region */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Country / Region <span className="text-red-600 font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register("country", { required: "Country is required" })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 appearance-none cursor-pointer pr-10 transition-all"
                  >
                    <option value="Uganda">Uganda</option>
                    <option value="India">India</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="South Sudan">South Sudan</option>
                    <option value="Democratic Republic of Congo">Democratic Republic of Congo</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
                {errors.country && <span className="text-[11px] text-red-600 font-semibold mt-1 block">{errors.country.message}</span>}
              </div>

              {/* Row 3: Street address (2 inputs) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Street address <span className="text-red-600 font-bold">*</span>
                </label>
                <div className="space-y-2.5">
                  <input
                    type="text"
                    placeholder="House number and street name"
                    {...register("streetAddress1", { required: "Street address is required" })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  />
                  {errors.streetAddress1 && <span className="text-[11px] text-red-600 font-semibold mt-0.5 block">{errors.streetAddress1.message}</span>}
                  
                  <input
                    type="text"
                    placeholder="Apartment, suite, unit, etc. (optional)"
                    {...register("streetAddress2")}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  />
                </div>
              </div>

              {/* Row 4: Town / City */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Town / City <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kampala"
                  {...register("city", { required: "Town / City is required" })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                />
                {errors.city && <span className="text-[11px] text-red-600 font-semibold mt-1 block">{errors.city.message}</span>}
              </div>

              {/* Row 5: State / County */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  State / County <span className="text-red-600 font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register("state", { required: "State / County is required" })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 appearance-none cursor-pointer pr-10 transition-all"
                  >
                    <option value="Central Region">Central Region</option>
                    <option value="Kampala">Kampala</option>
                    <option value="Wakiso">Wakiso</option>
                    <option value="Mukono">Mukono</option>
                    <option value="Entebbe">Entebbe</option>
                    <option value="Jinja">Jinja</option>
                    <option value="Eastern Region">Eastern Region</option>
                    <option value="Western Region">Western Region</option>
                    <option value="Northern Region">Northern Region</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Other State / County">Other State / County</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
                {errors.state && <span className="text-[11px] text-red-600 font-semibold mt-1 block">{errors.state.message}</span>}
              </div>

              {/* Row 6: Postcode / ZIP */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Postcode / ZIP <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 110094 or 00256"
                  {...register("postcode", { required: "Postcode / ZIP is required" })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                />
                {errors.postcode && <span className="text-[11px] text-red-600 font-semibold mt-1 block">{errors.postcode.message}</span>}
              </div>

              {/* Row 7: Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 0700000000"
                  {...register("phone", { 
                    required: "Phone number is required",
                    pattern: { value: /^[0-9\s+()-]{7,20}$/, message: "Please enter a valid phone number" }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                />
                {errors.phone && <span className="text-[11px] text-red-600 font-semibold mt-1 block">{errors.phone.message}</span>}
              </div>

              {/* Row 8: Email Address (optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address <span className="text-slate-400 text-[11px] font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. ahaadmalik7065@gmail.com"
                  {...register("email")}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                />
              </div>

            </div>

            {/* ADDITIONAL INFORMATION CARD */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide pb-1 border-b border-slate-100">
                ADDITIONAL INFORMATION
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Order notes <span className="text-slate-400 text-[11px] font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  {...register("orderNotes")}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all resize-y"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Checkout Pricing Summary & Place Order */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">
            
            {/* Conch Gas Official Delivery Header */}
            <div className="flex flex-col items-center justify-center text-center pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#830000] to-[#FF0000] flex items-center justify-center text-white shadow-md shadow-red-500/20 mb-2">
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                  <path d="M12.001 2c-.28 0-.53.11-.71.29L3.71 9.87a6.99 6.99 0 00-.71 9.13 7.002 7.002 0 0010.58 1.42 6.99 6.99 0 006.42-8.55c-.47-2.35-2.22-4.13-4.57-4.66l-2.72-5.92a1.002 1.002 0 00-.71-.29zm0 5.2a4 4 0 014 4c0 1.66-1.01 3.08-2.45 3.68l.45 1.12-1.9.76-.55-1.37a3.993 3.993 0 01-3.55-4.19c0-2.21 1.79-4 4-4z"/>
                </svg>
              </div>
              <span className="text-base font-black text-slate-900 tracking-tight font-display uppercase">YOUR ORDER SUMMARY</span>
              <span className="text-[10px] font-black uppercase text-[#BC0202] tracking-widest bg-red-50 px-2.5 py-0.5 rounded-md mt-1 border border-red-100">CONCH EXPRESS DELIVERY</span>
            </div>

            {/* Pricing Summary List */}
            <div className="divide-y divide-slate-100 text-xs font-semibold font-sans mt-2">
              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 uppercase tracking-wide text-[10px]">Product</span>
                <span className="text-slate-800 font-extrabold text-right max-w-[60%] truncate">
                  {calculatedQuote.gasLabel || calculatedQuote.medicineType || calculatedQuote.gasType || "LPG Cooking Gas"}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 uppercase tracking-wide text-[10px]">Cylinder Size</span>
                <span className="text-[#BC0202] font-black">
                  {displayWeight}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 uppercase tracking-wide text-[10px]">Order Type</span>
                <span className="text-slate-800 font-extrabold">
                  {calculatedQuote.orderMode || calculatedQuote.serviceType || "Gas Refill (Exchange)"}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 uppercase tracking-wide text-[10px]">Depot / Dispatch</span>
                <span className="text-slate-800 font-extrabold">Kira Road Depot</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 uppercase tracking-wide text-[10px]">Est. Delivery</span>
                <span className="text-[#BC0202] font-extrabold">Within 2 Hours</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 uppercase tracking-wide text-[10px]">Cylinder Price</span>
                <span className="text-slate-800 font-extrabold">UGX {Number(baseCharges).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 uppercase tracking-wide text-[10px]">Doorstep Delivery</span>
                <span className="text-emerald-600 font-black">FREE</span>
              </div>
              <div className="flex justify-between py-3.5 border-t-2 border-slate-200 bg-red-50/50 px-3 rounded-xl mt-3">
                <span className="text-slate-900 font-black uppercase tracking-wide text-xs self-center">Total Amount</span>
                <span className="text-lg font-black text-[#BC0202]">UGX {Number(totalAmount).toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Note */}
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 text-[11px] leading-relaxed">
              <span className="font-bold text-slate-800 block mb-0.5">Payment on Delivery:</span>
              Cash, MTN MoMo, Airtel Money, or POS card accepted at your doorstep.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-5 bg-[#BC0202] hover:bg-red-700 text-white font-black uppercase text-xs tracking-wider py-3.5 px-6 rounded-xl shadow-md shadow-red-600/20 transition-all disabled:opacity-50 select-none cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Placing Order...</span>
                </>
              ) : (
                <span>Place Order / Confirm Booking</span>
              )}
            </button>

            {/* Guarantee badge */}
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-700 font-bold">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Factory Sealed & Full Weight Guaranteed</span>
              </div>
              <a 
                href="tel:+256200900010" 
                className="text-[11px] font-bold text-slate-500 hover:text-[#BC0202] transition-colors block mt-2"
              >
                📞 Hotline: +256 200 900 010
              </a>
            </div>

          </div>

        </form>
      </div>

    </div>
  );
}
