export const TOP_BAR = {
  leftText: "Welcome to Conch Gas Ltd - Uganda's Certified LPG & Industrial Gas Provider",
  deliveryPill: "Express Doorstep Delivery Across Kampala & Uganda",
  phone: {
    label: "Call Us:",
    number: "+256 776 500 786",
    href: "tel:+256776500786"
  },
  whatsapp: {
    label: "WhatsApp:",
    number: "+256 776 500 786",
    href: "https://wa.me/256776500786"
  },
  email: {
    label: "Email:",
    address: "info@conchgas.com",
    href: "mailto:info@conchgas.com"
  },
  workingHours: {
    label: "Depot Hours:",
    hours: "Mon - Sun: 7:00 AM - 9:00 PM"
  },
  timing: "Mon - Sun: 7:00 AM - 9:00 PM",
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://x.com"
  }
};

export const NAVIGATION = {
  links: [
    { label: "Home", path: "/" },
    {
      label: "About Us",
      path: "/about.htm",
      isAboutMenu: true,
      dropdown: [
        { id: "overview", label: "Company Overview", path: "/about.htm#company-overview" },
        { id: "director", label: "Managing Director Note", path: "/about.htm#managing-director" },
        { id: "benefits", label: "Why Choose Conch Gas", path: "/about.htm#why-conch-gas" },
        { id: "safety", label: "Safety & ISO Standards", path: "/about.htm#safety-standards" },
        { id: "delivery", label: "Kampala Delivery Fleet", path: "/about.htm#delivery-fleet" },
        { id: "csr", label: "CSR & Community Work", path: "/about.htm#csr-community" },
        { id: "guide", label: "Gas Cylinder Safety Guide", path: "/about.htm#safety-guide" }
      ]
    },
    {
      label: "Products",
      path: "/products",
      isMegaMenu: true,
      columns: []
    },
    { label: "Services", path: "/services.htm" },
    { label: "Contact Us", path: "/contact.htm" }
  ]
};

export const HERO = {
  bullets: [
    "Factory-Sealed Cylinders & 100% Full Weight Guarantee",
    "Express Doorstep Delivery in Kampala & Kira Road",
    "Universal Empty Cylinder Exchange Accepted",
    "Free Safety Inspection & Leak Testing by Expert Drivers",
    "Real-Time Delivery Tracking & SMS Updates",
    "Commercial, Hotel & Bulk Gas Supply Support"
  ]
};

export const BANNER = {
  title: "RELIABLE LPG & INDUSTRIAL GAS SUPPLY",
  subtitle: "Fast, Safe & Certified Doorstep Delivery in Kampala, Uganda",
  ctaText: "Order Your Cylinder",
  ctaLink: "/products"
};

export const TESTIMONIALS = {
  badge: "VERIFIED CUSTOMER REVIEWS",
  heading: "Trusted by Households & Businesses Across Kampala",
  subheading: "Read genuine feedback from families, restaurants, and institutions who rely on Conch Gas for safe, uninterrupted energy supply.",
  items: [
    {
      id: "t1",
      name: "MUGISHA DAVID",
      title: "OUTSTANDING SERVICE & GENUINE CYLINDERS",
      rating: 5,
      country: "Uganda",
      avatar: "MD",
      review: "Conch Gas has transformed how we manage cooking gas at our restaurant. The delivery is consistently fast, cylinders are always factory-sealed, and their drivers even check the regulator safety for free.",
      designation: "Restaurant Owner, Kampala",
      date: "Posted 3 days ago",
      isFeatured: true
    },
    {
      id: "t2",
      name: "SARAH NAKATO",
      title: "SAFE & RELIABLE FOR MY FAMILY",
      rating: 5,
      country: "Uganda",
      avatar: "SN",
      review: "I switched to Conch Gas 6 months ago. The cylinders last noticeably longer because they guarantee full weight. Customer service on WhatsApp is super quick and polite.",
      designation: "Homeowner, Kira Road",
      date: "Posted 1 week ago",
      isFeatured: true
    },
    {
      id: "t3",
      name: "OKELLO BRIAN",
      title: "HASSLE-FREE CYLINDER EXCHANGE",
      rating: 5,
      country: "Uganda",
      avatar: "OB",
      review: "They accepted my empty cylinder swap without any fuss or hidden fees. Delivered straight to my door in Kololo in under an hour. Highly recommended!",
      designation: "Verified Customer",
      date: "Posted 2 weeks ago",
      isFeatured: true
    },
    {
      id: "t4",
      name: "NANKUNDA GRACE",
      title: "BEST LPG SUPPLIER IN UGANDA",
      rating: 5,
      country: "Uganda",
      avatar: "NG",
      review: "Their customer care is always on point. Ordering refills through WhatsApp is seamless and they deliver promptly right to my kitchen.",
      designation: "Verified Customer",
      date: "Posted 2 weeks ago",
      isFeatured: false
    }
  ]
};

export const FOOTER = {
  about: {
    title: "About Conch Gas",
    text: "Conch Gas Ltd is a part of Conch Group Limited and brings over 15 years of industry excellence. We supply premium LPG cooking gas, accessories, and industrial gases with certified safety across Uganda.",
    regInfo: "UNBS Certified | Fully Licensed LPG Distributor in Uganda"
  },
  gasRefills: {
    title: "GAS REFILLS & PRODUCTS",
    links: [
      { label: "6Kg Gas Refill", path: "/products/6kg-cylinder-refill" },
      { label: "13Kg Gas Refill", path: "/products/13kg-cylinder-refill" },
      { label: "40Kg Commercial Refill", path: "/products/40kg-cylinder-refill" },
      { label: "45Kg Commercial Refill", path: "/products/45kg-cylinder-refill" },
      { label: "Industrial Oxygen Refill", path: "/products/industrial-oxygen-refill" },
      { label: "Argon Gas 99.99%", path: "/products/argon-gas-99-99" },
      { label: "R134A Refrigerant Gas", path: "/products/r134a-refrigerant-gas" },
      { label: "R410A Refrigerant Gas", path: "/products/r410a-refrigerant-gas" }
    ]
  },
  quickLinks: {
    title: "QUICK LINKS",
    links: [
      { label: "Home", path: "/" },
      { label: "About Conch Gas", path: "/about" },
      { label: "LPG Gas Cylinders", path: "/products" },
      { label: "Gas Refills & Exchange", path: "/gas-refills" },
      { label: "Commercial & Bulk Gas", path: "/services" },
      { label: "Contact Us", path: "/contact" }
    ]
  },
  services: [
    { label: "Domestic Cooking Gas", path: "/products" },
    { label: "Bulk LPG Supply", path: "/services" },
    { label: "Commercial Kitchen Installation", path: "/services" },
    { label: "LPG Pipeline Fitting", path: "/services" },
    { label: "Industrial Gases (O2, CO2, Argon)", path: "/services" }
  ],
  locateUs: {
    title: "DEPOT ADDRESS",
    address: "Conch Gas Depot, Kira Road, Kampala, Uganda",
    phones: ["+256 776 500 786"],
    phone: "+256 776 500 786",
    emails: ["info@conchgas.com"],
    email: "info@conchgas.com"
  },
  contact: {
    address: "Conch Gas Depot, Kira Road, Kampala, Uganda",
    phone: "+256 776 500 786",
    email: "info@conchgas.com",
    workingHours: "Monday - Sunday: 7:00 AM - 9:00 PM"
  },
  copyright: "Copyright © 2025 Conch Gas Limited - All Rights Reserved."
};

export const CONTACT_PAGE = {
  title: "Get In Touch With Conch Gas",
  subtitle: "Whether you need a quick cylinder refill, bulk commercial supply, or kitchen installation, our team is ready to assist.",
  depotAddress: "Plot 42, Kira Road, Kamwokya, Kampala, Uganda",
  phone: "+256 776 500 786",
  email: "info@conchgas.com",
  coordinates: {
    lat: 0.3346,
    lng: 32.5894
  }
};
