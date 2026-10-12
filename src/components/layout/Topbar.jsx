import { Phone, MessageCircle, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react";
import { TOP_BAR } from "../../constants";

export default function Topbar({ settings }) {
  // Format dynamic links with defensive fallback
  const phoneVal = settings?.phone || (typeof TOP_BAR?.phone === "object" ? TOP_BAR?.phone?.number : TOP_BAR?.phone) || "+256 776 500 786";
  const phoneHref = settings?.phone 
    ? `tel:${settings.phone.replace(/[^0-9+]/g, "")}` 
    : (typeof TOP_BAR?.phone === "object" ? TOP_BAR?.phone?.href : `tel:${phoneVal.replace(/[^0-9+]/g, "")}`);

  const whatsappVal = settings?.whatsapp || (typeof TOP_BAR?.whatsapp === "object" ? TOP_BAR?.whatsapp?.number : TOP_BAR?.whatsapp) || "+256 776 500 786";
  const whatsappHref = settings?.whatsapp 
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}` 
    : (typeof TOP_BAR?.whatsapp === "object" ? TOP_BAR?.whatsapp?.href : `https://wa.me/${whatsappVal.replace(/[^0-9]/g, "")}`);

  const emailVal = settings?.email || (typeof TOP_BAR?.email === "object" ? TOP_BAR?.email?.address : TOP_BAR?.email) || "info@conchgas.com";
  const emailHref = settings?.email 
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${settings.email}` 
    : (typeof TOP_BAR?.email === "object" ? TOP_BAR?.email?.href : `mailto:${emailVal}`);

  const workingHoursVal = settings?.workingHours || TOP_BAR?.workingHours?.hours || TOP_BAR?.timing || "Mon - Sun: 7:00 AM - 9:00 PM";

  const facebookHref = settings?.socialLinks?.facebook || TOP_BAR?.socials?.facebook || "https://facebook.com";
  const instagramHref = settings?.socialLinks?.instagram || TOP_BAR?.socials?.instagram || "https://instagram.com";
  const twitterHref = settings?.socialLinks?.twitter || TOP_BAR?.socials?.twitter || "https://twitter.com";

  return (
    <div id="topbar-container" className="hidden sm:block bg-white text-xs pt-3 pb-0.5 px-4">
      <div id="topbar-inner" className="max-w-7xl mx-auto flex items-center justify-between text-slate-600 font-sans">
        
        {/* Left Side: Call & Whatsapp */}
        <div id="topbar-left" className="flex items-center gap-3">
          {/* Call Us */}
          <a
            id="topbar-phone-link"
            href={phoneHref}
            aria-label="Call Customer Support"
            className="group flex items-center h-9 bg-slate-50 hover:bg-red-50/80 border border-slate-200/80 hover:border-[#BC0202]/30 rounded-full px-2.5 transition-all duration-300 ease-out shadow-xs hover:shadow-sm"
          >
            <span className="flex items-center justify-center shrink-0 w-5 h-5">
              <Phone id="topbar-phone-icon" size={16} className="text-[#BC0202] transition-transform duration-300 group-hover:scale-110" />
            </span>
            <span className="flex items-center gap-1 max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap">
              <span id="topbar-phone-label" className="font-semibold text-slate-600">{TOP_BAR?.phone?.label || "Call Us:"}</span>
              <span id="topbar-phone-value" className="text-[#830000] font-bold">{phoneVal}</span>
            </span>
          </a>

          {/* Whatsapp */}
          <a
            id="topbar-whatsapp-link"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="group flex items-center h-9 bg-slate-50 hover:bg-red-50/80 border border-slate-200/80 hover:border-[#BC0202]/30 rounded-full px-2.5 transition-all duration-300 ease-out shadow-xs hover:shadow-sm"
          >
            <span className="flex items-center justify-center shrink-0 w-5 h-5">
              <MessageCircle id="topbar-whatsapp-icon" size={16} className="text-[#BC0202] transition-transform duration-300 group-hover:scale-110" />
            </span>
            <span className="flex items-center gap-1 max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap">
              <span id="topbar-whatsapp-label" className="font-semibold text-slate-600">{TOP_BAR?.whatsapp?.label || "WhatsApp:"}</span>
              <span id="topbar-whatsapp-value" className="text-[#830000] font-bold">{whatsappVal}</span>
            </span>
          </a>
        </div>

        {/* Right Side: Email & Hours */}
        <div id="topbar-right" className="flex items-center gap-3">
          {/* Email */}
          <a
            id="topbar-email-link"
            href={emailHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Email Customer Support"
            className="group flex items-center h-9 bg-slate-50 hover:bg-red-50/80 border border-slate-200/80 hover:border-[#BC0202]/30 rounded-full px-2.5 transition-all duration-300 ease-out shadow-xs hover:shadow-sm"
          >
            <span className="flex items-center justify-center shrink-0 w-5 h-5">
              <Mail id="topbar-email-icon" size={16} className="text-[#BC0202] transition-transform duration-300 group-hover:scale-110" />
            </span>
            <span className="flex items-center gap-1 max-w-0 opacity-0 group-hover:max-w-[300px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap">
              <span id="topbar-email-label" className="font-semibold text-slate-600">{TOP_BAR?.email?.label || "Email:"}</span>
              <span id="topbar-email-value" className="text-[#830000] font-bold">{emailVal}</span>
            </span>
          </a>

          {/* Working Hours */}
          <div
            id="topbar-hours"
            className="group flex items-center h-9 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300 rounded-full px-2.5 transition-all duration-300 ease-out shadow-xs hover:shadow-sm cursor-default"
          >
            <span className="flex items-center justify-center shrink-0 w-5 h-5">
              <Clock id="topbar-hours-icon" size={16} className="text-[#830000] transition-transform duration-300 group-hover:rotate-12" />
            </span>
            <span className="flex items-center gap-1 max-w-0 opacity-0 group-hover:max-w-[300px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap">
              <span id="topbar-hours-label" className="font-semibold text-slate-600">{TOP_BAR?.workingHours?.label || "Hours:"}</span>
              <span id="topbar-hours-value" className="text-slate-900 font-bold">{workingHoursVal}</span>
            </span>
          </div>

          {/* Social Media Links (Facebook, Instagram, Twitter) */}
          <div id="topbar-socials" className="flex items-center gap-1.5 pl-1">
            {/* Facebook */}
            <a
              id="topbar-social-fb"
              href={facebookHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Facebook"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-xs hover:shadow-md transition-all duration-300 ease-out hover:scale-110 group"
              title="Facebook"
            >
              <Facebook size={15} fill="currentColor" className="transition-transform duration-300 group-hover:scale-105" />
            </a>

            {/* Instagram */}
            <a
              id="topbar-social-ig"
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-xs hover:shadow-md transition-all duration-300 ease-out hover:scale-110 group"
              title="Instagram"
            >
              <Instagram size={15} className="transition-transform duration-300 group-hover:scale-105" />
            </a>

            {/* Twitter */}
            <a
              id="topbar-social-tw"
              href={twitterHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Twitter"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1DA1F2] hover:bg-[#1a91da] text-white shadow-xs hover:shadow-md transition-all duration-300 ease-out hover:scale-110 group"
              title="Twitter"
            >
              <Twitter size={15} fill="currentColor" className="transition-transform duration-300 group-hover:scale-105" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
