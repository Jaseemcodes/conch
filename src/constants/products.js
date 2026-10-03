export const PRODUCT_CATEGORIES = [
  {
    id: "lpg-gas-cylinders",
    title: "LPG Gas Cylinders",
    path: "/products/lpg-gas-cylinders",
    items: [
      {
        id: "6kg-gas",
        title: "6Kg Gas",
        path: "/products/6kg-gas",
        category: "LPG Gas Cylinders",
        desc: "Compact 6kg LPG cylinder refill and new complete set with burner & grill for small households and students."
      },
      {
        id: "13kg-gas",
        title: "13Kg Gas",
        path: "/products/13kg-gas",
        category: "LPG Gas Cylinders",
        desc: "Standard 13kg cooking gas cylinder for families, restaurants and catering services."
      },
      {
        id: "40kg-gas",
        title: "40Kg Gas",
        path: "/products/40kg-gas",
        category: "LPG Gas Cylinders",
        desc: "High capacity 40kg commercial cylinder for hotels, industrial kitchens, and bakeries."
      },
      {
        id: "45kg-gas",
        title: "45Kg Gas",
        path: "/products/45kg-gas",
        category: "LPG Gas Cylinders",
        desc: "Heavy duty 45kg commercial & industrial LPG supply for high volume gas consumption."
      }
    ]
  },
  {
    id: "gas-accessories",
    title: "Gas Accessories",
    path: "/products/gas-accessories",
    items: [
      {
        id: "regulators",
        title: "Regulators",
        path: "/products/regulators",
        category: "Gas Accessories",
        desc: "Certified high-pressure and low-pressure gas regulators with safety shut-off valves."
      },
      {
        id: "stoves-cookers",
        title: "Stoves & Cookers",
        path: "/products/stoves-cookers",
        category: "Gas Accessories",
        desc: "Single, double, and multi-burner premium stainless steel and glass top gas stoves."
      },
      {
        id: "bulk-gas-tanks",
        title: "Bulk Gas Tanks",
        path: "/products/bulk-gas-tanks",
        category: "Gas Accessories",
        desc: "Commercial stationary bulk LPG storage tanks with professional on-site turnkey installation."
      },
      {
        id: "gas-level-indicator-tag",
        title: "Gas Level Indicator Tag",
        path: "/products/gas-level-indicator-tag",
        category: "Gas Accessories",
        desc: "Magnetic LPG cylinder level monitor to accurately track remaining gas and prevent running out."
      }
    ]
  },
  {
    id: "lubricants",
    title: "Lubricants",
    path: "/products/lubricants",
    items: [
      {
        id: "multipurpose-grease-50g",
        title: "Multipurpose Grease (50 g)",
        path: "/products/multipurpose-grease-50g",
        category: "Lubricants",
        desc: "High performance multipurpose grease in compact 50g packaging for machinery and domestic lubrication."
      },
      {
        id: "ep2-grease-500g",
        title: "EP2 GREASE (500 g)",
        path: "/products/ep2-grease-500g",
        category: "Lubricants",
        desc: "Extreme pressure lithium based EP2 industrial grease 500g tub for heavy duty mechanical bearings."
      },
      {
        id: "ep2-grease-15kg",
        title: "EP2 GREASE (15 kg)",
        path: "/products/ep2-grease-15kg",
        category: "Lubricants",
        desc: "High performance EP2 industrial grease 15kg bucket for fleet automotive, industrial and plant machinery."
      },
      {
        id: "ep2-grease-180kg",
        title: "EP2 GREASE (180 kg)",
        path: "/products/ep2-grease-180kg",
        category: "Lubricants",
        desc: "Bulk industrial EP2 lubricant drum 180kg for manufacturing plants, heavy machinery and transport depots."
      }
    ]
  },
  {
    id: "industrial-gas",
    title: "Industrial Gas",
    path: "/products/industrial-gas",
    items: [
      {
        id: "argon-gas-99-99",
        title: "Argon GAS 99.99%",
        path: "/products/argon-gas-99-99",
        category: "Industrial Gas",
        desc: "High purity 99.99% shielding Argon gas cylinder for TIG/MIG precision metal welding and fabrication."
      },
      {
        id: "acetylene-gas-99-9",
        title: "Acetylene Gas 99.9%",
        path: "/products/acetylene-gas-99-9",
        category: "Industrial Gas",
        desc: "Certified 99.9% Acetylene gas cylinder for oxy-acetylene heavy metal cutting, brazing, and heating."
      },
      {
        id: "oxygen-empty-cylinder",
        title: "Oxygen Empty cylinder",
        path: "/products/oxygen-empty-cylinder",
        category: "Industrial Gas",
        desc: "Brand new high pressure seamless steel oxygen cylinder bottle tested and certified to ISO standards."
      },
      {
        id: "medical-oxygen-refill",
        title: "Medical Oxygen Refill",
        path: "/products/medical-oxygen-refill",
        category: "Industrial Gas",
        desc: "Certified 99.5%+ ultra-pure medical grade oxygen refill for hospitals, emergency response and home care."
      }
    ]
  }
];

// Flat list of all products for easy lookup
export const ALL_PRODUCTS = PRODUCT_CATEGORIES.flatMap(cat => cat.items);
