import { useState, useEffect, lazy, Suspense } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import api from "../utils/api";

import { applyPageSEO } from "../utils/seo";

// HeroSection, StatsSection, AboutConchSection, ConchSolutionsSection, ConchPricingCatalogSection and ConchBestSellerSection are eagerly loaded (above-the-fold content)
import HeroSection from "../components/sections/HeroSection";
import StatsSection from "../components/sections/StatsSection";
import AboutConchSection from "../components/sections/AboutConchSection";
import ConchSolutionsSection from "../components/sections/ConchSolutionsSection";
import ConchPricingCatalogSection from "../components/sections/ConchPricingCatalogSection";
import ConchBestSellerSection from "../components/sections/ConchBestSellerSection";

// Below-the-fold sections are lazy loaded to reduce initial JS payload
const WhatMedicinesSection = lazy(() => import("../components/sections/WhatMedicinesSection"));
const TestimonialsSection = lazy(() => import("../components/sections/TestimonialsSection"));

// Map section database keys to local components
const componentMap = {
  "hero": HeroSection,
  "stats": StatsSection,
  "about-conch": AboutConchSection,
  "conch-solutions": ConchSolutionsSection,
  "what-medicines": ConchSolutionsSection,
  "pricing-catalog": ConchPricingCatalogSection,
  "bestseller": ConchBestSellerSection,
  "process": ConchBestSellerSection,
  "testimonials": TestimonialsSection
};

const DEFAULT_SECTIONS = [
  { key: "hero" },
  { key: "stats", title: "WHY CHOOSE CONCH GAS" },
  { key: "about-conch" },
  { key: "conch-solutions" },
  { key: "pricing-catalog" },
  { key: "bestseller" },
  { key: "testimonials" }
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(false); // Render content instantly
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [hasError, setHasError] = useState(false);

  // Fetch dynamic sections configuration from API silently in the background
  useEffect(() => {
    const loadHomepageData = async () => {
      try {
        const res = await api.get("/homepage");
        if (res.data && res.data.success && res.data.data && res.data.data.length > 0) {
          const cleanSections = res.data.data.filter(s => 
            s.key !== "easy-courier" && 
            s.key !== "flags" && 
            s.key !== "documents" && 
            s.key !== "cta-banner"
          );
          setSections(cleanSections);
        }
      } catch (err) {
        console.error("Failed to load dynamic homepage configuration in background:", err);
        // Do not block the page with an error if we already have the default fallback layout!
      }
    };
    
    loadHomepageData();
  }, []);

  useEffect(() => {
    const seoSec = sections.find(s => s.metaViewTitle || s.metaDescription || s.metaKeywords) || sections[0];
    if (seoSec) {
      applyPageSEO(
        seoSec.metaViewTitle,
        seoSec.metaDescription,
        seoSec.metaKeywords,
        "Courier Medicine - International Medicine Courier Services",
        "Send medicines internationally from India with 100% custom clearance support and free pickup. We courier cancer drugs, lifesaving meds, ayurvedic and general prescriptions worldwide safely.",
        "medicine courier, international medicine delivery, send medicines from India, medicine custom clearance, medicine export"
      );
    }
  }, [sections]);

  return (
    <div id="home-page" className="w-full relative overflow-x-hidden bg-white font-sans">
      {hasError || sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 md:py-32 px-4 text-center min-h-[60vh] bg-slate-50">
          <div className="bg-red-100 p-5 rounded-full mb-6 shadow-sm border border-red-200">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">Oops! Something went wrong</h2>
          <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
            We are unable to load the content from our servers at the moment. Please check your internet connection or try again later.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="group flex items-center justify-center gap-2 px-6 py-3 bg-[#00A19D] hover:bg-[#008A87] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Refresh Page
          </button>
        </div>
      ) : (
        <>
          {sections.map((section) => {
            const Component = componentMap[section.key];
            if (!Component) return null;
            
            // Eagerly imported sections render directly without Suspense delay
            if (
              section.key === "hero" || 
              section.key === "stats" || 
              section.key === "about-conch" || 
              section.key === "conch-solutions" || 
              section.key === "pricing-catalog" ||
              section.key === "bestseller" ||
              section.key === "process"
            ) {
              return (
                <Component 
                  key={section.key} 
                  title={section.title} 
                  subtitle={section.subtitle} 
                  content={section.content} 
                />
              );
            }
            
            // All other sections are lazy — wrap each in its own Suspense
            return (
              <Suspense key={section.key} fallback={null}>
                <Component 
                  title={section.title} 
                  subtitle={section.subtitle} 
                  content={section.content} 
                />
              </Suspense>
            );
          })}
        </>
      )}
    </div>
  );
}
