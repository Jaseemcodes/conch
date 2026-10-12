import React from 'react';

export default function Logo({ className = "", hideSubtitle = false, darkMode = false, imgClassName = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img 
        src="/logo.webp" 
        alt="Conch Gas Limited" 
        width={48}
        height={48}
        loading="eager"
        className={`h-[36px] w-auto object-contain transition-transform duration-200 group-hover:scale-105 shrink-0 ${imgClassName || 'md:h-[44px]'}`} 
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/logo.png";
        }}
      />
      <div className="flex flex-col justify-center select-none text-left">
        <span className={`text-sm md:text-base font-black tracking-tight font-display leading-tight uppercase whitespace-nowrap ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          Conch Gas <span className="text-[#BC0202]">Limited</span>
        </span>
        {!hideSubtitle && (
          <span className={`text-[8.5px] md:text-[9.5px] font-bold tracking-widest uppercase mt-0.5 leading-none ${
            darkMode ? 'text-slate-300' : 'text-slate-500'
          }`}>
            LPG & Industrial Gases
          </span>
        )}
      </div>
    </div>
  );
}
