import { Link } from "react-router-dom";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Facebook, 
  Instagram, 
  Twitter 
} from "lucide-react";
import { FOOTER } from "../../constants";
import Logo from "./Logo";

export default function Footer({ settings }) {
  const aboutTextVal = settings?.aboutText || FOOTER.about.text;
  const addressVal = settings?.address || FOOTER.locateUs.address;
  const copyrightVal = settings?.copyright || FOOTER.copyright;

  const phoneNumbers = settings?.phone 
    ? [settings.phone] 
    : FOOTER.locateUs.phones || [FOOTER.locateUs.phone];

  const emailAddresses = settings?.email 
    ? [settings.email] 
    : FOOTER.locateUs.emails || [FOOTER.locateUs.email];

  const facebookHref = settings?.socialLinks?.facebook || "https://facebook.com";
  const instagramHref = settings?.socialLinks?.instagram || "https://instagram.com";
  const twitterHref = settings?.socialLinks?.twitter || "https://twitter.com";

  return (
    <footer id="footer-container" className="bg-slate-900 text-slate-300 font-sans">
      
      {/* Upper footer with 4 columns */}
      <div id="footer-upper" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        
        {/* Column 1: About Company */}
        <div id="footer-col-about" className="space-y-4">
          <div id="footer-logo" className="flex items-center">
            <Link to="/" className="inline-block">
              <Logo darkMode={true} />
            </Link>
          </div>
          <h3 id="footer-about-title" className="text-white font-bold text-base tracking-wider border-b border-slate-800 pb-2">
            About Conch Gas
          </h3>
          <p id="footer-about-text" className="text-[14.5px] text-slate-400 font-sans leading-relaxed">
            {aboutTextVal}
          </p>
          <div id="footer-socials" className="flex items-center gap-3 pt-2">
            <a
              id="social-fb"
              href={facebookHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Facebook page"
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-[#BC0202] flex items-center justify-center transition-all duration-200"
            >
              <Facebook size={16} />
            </a>
            <a
              id="social-ig"
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Instagram profile"
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-pink-500 hover:bg-slate-750 flex items-center justify-center transition-all duration-200"
            >
              <Instagram size={16} />
            </a>
            <a
              id="social-tw"
              href={twitterHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Twitter profile"
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-sky-400 hover:bg-slate-750 flex items-center justify-center transition-all duration-200"
            >
              <Twitter size={16} />
            </a>
          </div>
        </div>
 
        {/* Column 2: GAS REFILLS */}
        <div id="footer-col-refills" className="space-y-4">
          <h3 id="footer-refills-title" className="text-white font-bold text-base tracking-wider border-b border-slate-800 pb-2">
            {FOOTER.gasRefills?.title || "GAS REFILLS"}
          </h3>
          <ul id="footer-refills-list" className="flex flex-wrap gap-x-5 gap-y-3 text-sm md:flex-col md:gap-y-2.5 md:gap-x-0">
            {(FOOTER.gasRefills?.links || []).map((link, idx) => (
              <li key={idx}>
                <Link
                  id={`footer-refill-link-${idx}`}
                  to={link.path}
                  className="hover:text-[#FF0000] hover:underline transition-all text-slate-400 block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: SERVICES */}
        <div id="footer-col-services" className="space-y-4">
          <h3 id="footer-services-title" className="text-white font-bold text-base tracking-wider border-b border-slate-800 pb-2">
            {FOOTER.services?.title || "SERVICES"}
          </h3>
          <ul id="footer-services-list" className="flex flex-wrap gap-x-5 gap-y-3 text-sm md:flex-col md:gap-y-2.5 md:gap-x-0">
            {(FOOTER.services?.links || []).map((link, idx) => (
              <li key={idx}>
                <Link
                  id={`footer-service-link-${idx}`}
                  to={link.path}
                  className="hover:text-[#FF0000] hover:underline transition-all text-slate-400 block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: ADDRESS / Locate Us */}
        <div id="footer-col-locate" className="space-y-4 font-sans">
          <h3 id="footer-locate-title" className="text-white font-bold text-base tracking-wider border-b border-slate-800 pb-2">
            {FOOTER.locateUs.title || "ADDRESS"}
          </h3>
          <div id="footer-locate-details" className="space-y-3.5 text-sm text-slate-400">
            
            {/* Address */}
            <div id="footer-address" className="flex items-start gap-2.5">
              <MapPin size={18} className="text-[#BC0202] shrink-0 mt-0.5" />
              <span id="footer-address-text" className="leading-relaxed">{addressVal}</span>
            </div>

            {/* Phone numbers */}
            <div className="space-y-2">
              {phoneNumbers.map((phoneNum, pIdx) => (
                <a
                  key={pIdx}
                  id={`footer-phone-link-${pIdx}`}
                  href={`tel:${phoneNum.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-2.5 hover:text-[#FF0000] transition-colors"
                >
                  <Phone size={16} className="text-[#BC0202] shrink-0" />
                  <span id={`footer-phone-text-${pIdx}`}>{phoneNum}</span>
                </a>
              ))}
            </div>

            {/* Email addresses */}
            <div className="space-y-2">
              {emailAddresses.map((emailAddr, eIdx) => (
                <a
                  key={eIdx}
                  id={`footer-email-link-${eIdx}`}
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddr}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-[#FF0000] transition-colors"
                >
                  <Mail size={16} className="text-[#BC0202] shrink-0" />
                  <span id={`footer-email-text-${eIdx}`}>{emailAddr}</span>
                </a>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Bottom copyright bar */}
      <div id="footer-bottom-copyright" className="border-t border-slate-800/80 py-6 text-center md:text-left text-xs text-slate-500 font-sans max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span>{copyrightVal}</span>
        </div>
        <div className="text-slate-500">
          Developed by{" "}
          <a 
            href="https://sociallyconnect.in/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#FF0000] hover:underline font-medium"
          >
            Socially Connect
          </a>
        </div>
      </div>

    </footer>
  );
}

