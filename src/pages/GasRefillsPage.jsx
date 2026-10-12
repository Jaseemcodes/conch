import React from "react";
import ProductPage from "./ProductPage";
import { usePageSEO } from "../utils/seo";

export default function GasRefillsPage() {
  usePageSEO("gas-refills", {
    title: "LPG Gas Cylinder Refill Delivery | Quick Doorstep Refills - Conch Gas",
    description: "Fast doorstep LPG cylinder refill services in Kampala. Certified safe, weight-checked refills for 6kg, 13kg, 40kg, and 45kg tanks with rapid delivery.",
    keywords: "gas refill, LPG refill, cylinder exchange, cooking gas refill, doorstep gas"
  });

  return (
    <ProductPage 
      defaultTitle="LPG Gas Refills"
      defaultCategory="LPG Cooking Gas"
      defaultDesc="Universal doorstep LPG cylinder refill services in Kampala. We refill 6kg, 13kg, 40kg, and 45kg cylinders with certified safe factory-sealed gas."
    />
  );
}
