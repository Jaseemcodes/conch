import { useState, lazy, Suspense } from "react";
import { usePageSEO } from "../utils/seo";

// HeroSection, StatsSection, AboutConchSection, ConchSolutionsSection, ConchPricingCatalogSection and ConchBestSellerSection are eagerly loaded (above-the-fold content)
import HeroSection from "../components/sections/HeroSection";
import StatsSection from "../components/sections/StatsSection";
import AboutConchSection from "../components/sections/AboutConchSection";
import ConchSolutionsSection from "../components/sections/ConchSolutionsSection";
import ConchPricingCatalogSection from "../components/sections/ConchPricingCatalogSection";
import ConchBestSellerSection from "../components/sections/ConchBestSellerSection";

// Below-the-fold sections are lazy loaded to reduce initial JS payload
const TestimonialsSection = lazy(() => import("../components/sections/TestimonialsSection"));

// Map section database keys to local components
const componentMap = {
  "hero": HeroSection,
  "stats": StatsSection,
  "about-conch": AboutConchSection,
  "conch-solutions": ConchSolutionsSection,
  "pricing-catalog": ConchPricingCatalogSection,
  "bestseller": ConchBestSellerSection,
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
  const [sections] = useState(DEFAULT_SECTIONS);

  usePageSEO("home", {
    title: "Conch Gas | Trusted LPG Gas Cylinder Delivery & Services",
    description: "Book domestic and commercial LPG cylinders online with Conch Gas. Express delivery, safe installation, and competitive pricing across all sectors.",
    keywords: "LPG cylinder, gas delivery, commercial LPG, domestic gas, Conch Gas"
  });

  return (
    <div id="home-page" className="w-full relative overflow-x-hidden bg-white font-sans">
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
          section.key === "bestseller"
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
    </div>
  );
}
