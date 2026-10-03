import { Phone, MessageCircle, Mail, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { TOP_BAR } from "../../constants";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ settings }) {
  const { user, isLoggedIn, isAdmin, openAuthModal } = useAuth();
  // Format dynamic links
  const phoneVal = settings?.phone || TOP_BAR.phone.number;
  const phoneHref = settings?.phone 
    ? `tel:${settings.phone.replace(/[^0-9+]/g, "")}` 
    : TOP_BAR.phone.href;

  const whatsappVal = settings?.whatsapp || TOP_BAR.whatsapp.number;
  const whatsappHref = settings?.whatsapp 
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}` 
    : TOP_BAR.whatsapp.href;

  const emailVal = settings?.email || TOP_BAR.email.address;
  const emailHref = settings?.email 
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${settings.email}` 
    : TOP_BAR.email.href;

  const workingHoursVal = settings?.workingHours || TOP_BAR.workingHours.hours;

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
              <span id="topbar-phone-label" className="font-semibold text-slate-600">{TOP_BAR.phone.label}</span>
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
              <span id="topbar-whatsapp-label" className="font-semibold text-slate-600">{TOP_BAR.whatsapp.label}</span>
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
              <span id="topbar-email-label" className="font-semibold text-slate-600">{TOP_BAR.email.label}</span>
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
              <span id="topbar-hours-label" className="font-semibold text-slate-600">{TOP_BAR.workingHours.label}</span>
              <span id="topbar-hours-value" className="text-slate-900 font-bold">{workingHoursVal}</span>
            </span>
          </div>

          {/* Customer Auth Button */}
          {isLoggedIn ? (
            <Link
              to={isAdmin ? "/admin/dashboard" : "/my-account"}
              className="flex items-center gap-1.5 h-9 bg-gradient-to-r from-[#830000] via-[#BC0202] to-[#FF0000] hover:brightness-110 text-white rounded-full px-3.5 transition-all duration-300 shadow-xs font-bold text-xs"
            >
              <User size={14} />
              <span>{user?.name?.split(' ')[0] || 'My Account'}</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 h-9 bg-[#000000] hover:bg-gradient-to-r hover:from-[#830000] hover:to-[#BC0202] text-white rounded-full px-3.5 transition-all duration-300 shadow-xs font-bold text-xs cursor-pointer"
            >
              <User size={14} />
              <span>Login / Register</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
