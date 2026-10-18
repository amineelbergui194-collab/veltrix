export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return '0 DH';
  const num = Number(amount);
  return `${num % 1 === 0 ? num : num.toFixed(2)} DH`;
};

export const CATEGORIES = [
  {
    id: 'airpods',
    name: 'AirPods',
    tagline: 'Premium wireless audio for everyday listening.',
    count: '6 Products',
    image: '/images/airpods-pro.png',
    iconName: 'Headphones',
  },
  {
    id: 'headphones',
    name: 'Headphones',
    tagline: 'Immersive sound and modern design.',
    count: '7 Products',
    image: '/images/jbl-headphones.jpg',
    iconName: 'Speaker',
  },
  {
    id: 'apple-watch',
    name: 'Apple Watch',
    tagline: 'Premium titanium bands and wearable accessories.',
    count: '6 Products',
    image: '/images/apple-watch-collection.png',
    iconName: 'Watch',
  },
  {
    id: 'cables-adapters',
    name: 'Cables & Adapters',
    tagline: 'Reliable charging and connectivity.',
    count: '12 Products',
    image: '/images/usbc-cable.webp',
    iconName: 'Zap',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    tagline: 'Essential tech accessories for your devices.',
    count: '15 Products',
    image: '/images/power-adapter.jpg',
    iconName: 'Smartphone',
  },
];

export const setProductPrice = (productId, newPrice) => {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (product) {
    const num = Number(newPrice);
    if (!isNaN(num) && num > 0) {
      product.price = num;
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const overrides = JSON.parse(localStorage.getItem('veltrix_products_override') || '{}');
          overrides[productId] = num;
          localStorage.setItem('veltrix_products_override', JSON.stringify(overrides));
        } catch {}
      }
      return true;
    }
  }
  return false;
};

export const resetProductPrice = (productId) => {
  const defaults = {
    'apple-earpods-lightning': 70,
    'airpods-pro-3': 220,
    'airpods-pro-2': 120,
    'usbc-fast-charging-cable-100w': 65,
    'mfi-lightning-charging-cable': 65,
    'veltrix-gan-compact-adapter': 70,
    'veltrix-3in1-foldable-magsafe': 150,
    'veltrix-magsafe-power-bank-10k': 130,
  };
  if (defaults[productId] !== undefined) {
    return setProductPrice(productId, defaults[productId]);
  }
  return false;
};

export const PRODUCTS = [
  {
    id: 'apple-earpods-lightning',
    name: 'Apple EarPods with Lightning Connector',
    subtitle: 'Lightning Connector with Built-in Remote and Microphone',
    category: 'Audio & Headphones',
    fullCategory: 'Electronics → Audio & Headphones',
    categorySlug: 'headphones',
    secondaryCategorySlug: 'airpods',
    brand: 'Apple',
    connector: 'Lightning',
    price: 70,
    originalPrice: 99,
    currency: 'MAD',
    rating: 4.8,
    reviewCount: 284,
    badge: 'OFFICIAL APPLE',
    isBestSeller: true,
    isNew: true,
    inStock: true,
    stockCount: 50,
    images: [
      '/images/apple.jpg'
    ],
    colors: [
      { name: 'White', hex: '#ffffff', bg: 'bg-white' }
    ],
    description: 'Enjoy clear audio and comfortable everyday listening with Apple EarPods featuring a Lightning connector, designed for compatible Apple devices.',
    highlights: [
      'Engineered by Apple with geometry designed for comfort and natural acoustic ear fit',
      'High-performance dynamic speaker drivers designed to maximize sound output and minimize sound loss',
      'Deeper, richer bass tones and crystal-clear high frequencies for music and voice',
      'Built-in inline remote to adjust volume, control music and video playback, and answer or end calls',
      'Integrated high-definition microphone for clear phone calls and Siri voice commands',
      'Official Lightning connector offering seamless digital audio on iPhone, iPad, and iPod touch models'
    ],
    specs: {
      'Brand': 'Apple',
      'Model': 'EarPods with Lightning Connector',
      'Product Type': 'Wired In-Ear Headphones',
      'Connector': 'Lightning',
      'Color': 'White',
      'Audio Form Factor': 'Ergonomic In-Ear (EarPods Geometry)',
      'Inline Controls': 'Volume control (+/-), Play/Pause, Call Answer/End',
      'Microphone': 'Built-in High-Definition Voice Microphone',
      'Audio Processing': 'Pure Digital Lightning Audio Output',
      'Compatibility': 'All devices with a Lightning connector and iOS 10 or later (iPhone 14/13/12/11/SE/X/8/7, iPad)',
      'Warranty': '1-Year Official Apple / Veltrix Warranty'
    },
    reviews: [
      {
        id: 'r-earpods-1',
        author: 'Karim Mansouri',
        rating: 5,
        date: '2 days ago',
        verified: true,
        title: 'Original Apple quality at unbeatable price',
        text: 'Crisp sound and the microphone works flawlessly for calls and voice notes. Exactly what I needed for my iPhone.'
      },
      {
        id: 'r-earpods-2',
        author: 'Yasmine Benjelloun',
        rating: 5,
        date: '1 week ago',
        verified: true,
        title: 'Authentic packaging and fast delivery',
        text: 'Received within 24 hours in Casablanca. Perfect packaging and 100% genuine Apple EarPods with Lightning connector.'
      }
    ]
  },
  {
    id: 'airpods-pro-3',
    name: 'AirPods Pro 3',
    subtitle: 'Active Noise Cancellation with USB-C MagSafe Case',
    category: 'AirPods',
    categorySlug: 'airpods',
    price: 220,
    originalPrice: 280,
    rating: 4.9,
    reviewCount: 384,
    badge: 'BEST SELLER',
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockCount: 14,
    images: [
      '/images/airpods-pro-3.webp'
    ],
    colors: [
      { name: 'White Gloss', hex: '#f8fafc', bg: 'bg-white' },
      { name: 'Stealth Matte Skin', hex: '#18181b', bg: 'bg-neutral-900' }
    ],
    description: 'Equipped with the upgraded H2 chip, AirPods Pro 3 deliver pro-level Active Noise Cancellation, Adaptive Audio that tailors sound control to your environment, and Personalized Spatial Audio with dynamic head tracking. Comes with a USB-C MagSafe Charging Case with built-in speaker and lanyard loop.',
    highlights: [
      'Up to 2x more Active Noise Cancellation compared to previous generation',
      'Adaptive Audio seamlessly blends ANC and Transparency mode',
      'Personalized Spatial Audio with dynamic head tracking',
      'MagSafe Charging Case (USB-C) with speaker and lanyard loop',
      'Dust, sweat, and water resistant (IP54 rated)'
    ],
    specs: {
      'Audio Driver': 'Custom high-excursion Apple driver & high dynamic range amplifier',
      'Connectivity': 'Bluetooth 5.3',
      'Battery Life': 'Up to 6 hours listening (30 hours with case)',
      'Charging Port': 'USB-C & Qi / MagSafe Wireless',
      'Sensors': 'Dual beamforming mics, inward-facing mic, skin-detect sensor',
      'Compatibility': 'iOS, iPadOS, macOS, watchOS, and standard Bluetooth devices',
      'Warranty': '1-Year Official Limited Warranty'
    },
    reviews: [
      {
        id: 'r1',
        author: 'Julian Vance',
        rating: 5,
        date: '2 days ago',
        verified: true,
        title: 'Unbelievable noise cancellation',
        text: 'The noise cancellation in busy coffee shops and during train commutes is unmatched. Soundstage is punchy and the USB-C case makes my everyday carry so much simpler.'
      },
      {
        id: 'r2',
        author: 'Elena Rostova',
        rating: 5,
        date: '1 week ago',
        verified: true,
        title: 'Worth every dollar',
        text: 'Adaptive audio automatically transitions when I start speaking to someone. Veltrix delivered it within 24 hours in pristine packaging.'
      }
    ]
  },
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro 2',
    subtitle: 'Next-Gen Wireless Earbuds with Precision Acoustic Chambers',
    category: 'AirPods',
    categorySlug: 'airpods',
    price: 120,
    originalPrice: 150,
    rating: 4.8,
    reviewCount: 192,
    badge: 'NEW',
    isBestSeller: true,
    isNew: true,
    inStock: true,
    stockCount: 22,
    images: [
      '/images/airpods-pro.png'
    ],
    colors: [
      { name: 'Midnight Titanium', hex: '#1e293b', bg: 'bg-slate-800' },
      { name: 'Pure Frost', hex: '#f1f5f9', bg: 'bg-slate-100' }
    ],
    description: 'Designed for discerning listeners who demand studio-grade low latency and crystalline frequency balance. The AirPods Pro 2 incorporates high-definition dual graphene drivers, quad beamforming noise-isolating microphones, and an aerodynamic stem profile.',
    highlights: [
      'High-resolution wireless audio streaming with ultra-low 35ms latency',
      'Hybrid Active Noise Cancellation blocking up to 38dB of ambient noise',
      'Ergonomic contouring with 4 sets of hypoallergenic silicone ear tips',
      'Smart touch controls with tactile haptic feedback volume sliding',
      'Qi-compatible wireless fast charging case'
    ],
    specs: {
      'Acoustic Driver': '11mm Graphene Composite Dual Drivers',
      'Frequency Response': '15Hz – 25,000Hz',
      'Noise Reduction': 'Hybrid Dual-Mic Active Noise Cancellation (-38dB)',
      'Battery Life': '8 hours per charge / 36 hours total with case',
      'Charging': 'USB-C Fast Charge + Qi Wireless',
      'Water Resistance': 'IPX5 Sweat & Rain Resistant',
      'Warranty': '1-Year Veltrix Replacement Warranty'
    },
    reviews: [
      {
        id: 'r3',
        author: 'Marcus Chen',
        rating: 5,
        date: '3 days ago',
        verified: true,
        title: 'Incredible clarity and bass response',
        text: 'The sound separation on vocal tracks and acoustic music is stunning. Very comfortable for 5+ hour work sessions.'
      }
    ]
  },
  {
    id: 'usbc-fast-charging-cable-100w',
    name: 'USB-C Fast Charging Cable (60W)',
    subtitle: 'Woven Braided Core with E-Marker Smart Chip (1m)',
    category: 'Cables & Adapters',
    categorySlug: 'cables-adapters',
    price: 65,
    originalPrice: 85,
    rating: 4.9,
    reviewCount: 421,
    badge: 'BEST SELLER',
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockCount: 85,
    images: [
      '/images/usbc-cable.webp'
    ],
    colors: [
      { name: 'White Braided', hex: '#f8fafc', bg: 'bg-white' },
      { name: 'Space Gray Braided', hex: '#4b5563', bg: 'bg-gray-600' },
      { name: 'Obsidian Black', hex: '#18181b', bg: 'bg-neutral-900' }
    ],
    description: 'Engineered with double-woven durable braiding, this 60W USB-C cable powers everything from iPhone 15/16 and iPad Pro to MacBook Air and laptops at maximum rated speed without heating up.',
    highlights: [
      '60W (20V/3A) Power Delivery ultra-rapid charging',
      'Integrated E-Marker Smart Chip prevents overvoltage & overheating',
      '30,000+ bend lifespan rating with aluminum alloy strain relief collars',
      '480 Mbps high-speed synchronous data transfer',
      'Compact 3.3ft (1 meter) length with complimentary leather cable organizer'
    ],
    specs: {
      'Maximum Power': '60W (20V / 3A)',
      'Data Transfer Rate': '480 Mbps (USB 2.0 Standard)',
      'Cable Length': '1.0m (3.3 ft)',
      'Jacket Material': 'Double-braided Woven Armor',
      'Connectors': 'Anodized Aluminum Housings with Gold-plated Pins',
      'Warranty': 'Lifetime Replacement Warranty'
    },
    reviews: [
      {
        id: 'r6',
        author: 'Thomas R.',
        rating: 5,
        date: '1 day ago',
        verified: true,
        title: 'The sturdiest USB-C cable I own',
        text: 'Charges my MacBook and iPhone 16 at top speed. The cable doesn’t kink or fray around the connector necks.'
      }
    ]
  },
  {
    id: 'mfi-lightning-charging-cable',
    name: 'Lightning Fast Charging Cable',
    subtitle: 'MFi-Certified Duraflex Reinforced USB-C to Lightning',
    category: 'Cables & Adapters',
    categorySlug: 'cables-adapters',
    price: 65,
    originalPrice: 80,
    rating: 4.8,
    reviewCount: 388,
    badge: 'ESSENTIAL',
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockCount: 64,
    images: [
      '/images/lightning-cable.jpg'
    ],
    colors: [
      { name: 'Silver White', hex: '#f8fafc', bg: 'bg-white' },
      { name: 'Graphite', hex: '#374151', bg: 'bg-gray-700' }
    ],
    description: 'Certified MFi Lightning to USB-C cable designed for fast-charging iPhones from 0 to 50% in approximately 30 minutes with an 18W+ Power Delivery charger. Built to outlast standard OEM cables by 10x.',
    highlights: [
      'Apple MFi-certified C94 chip prevents "Accessory not supported" popups',
      'Supports high-velocity PD fast charging (up to 27W for iPhone 14/13/12)',
      'Reinforced silicone neck joints tested to 25,000 bending cycles',
      'Tangle-free tactile silicone exterior sleeve',
      '1.5m optimal bedside and vehicle length'
    ],
    specs: {
      'Connector Type': 'USB-C to Lightning',
      'Power Rating': 'Up to 27W Power Delivery',
      'Length': '1.5m (5 ft)',
      'Certification': 'Apple MFi Certified (C94 Terminal)',
      'Lifespan': '25,000+ bends tested',
      'Warranty': 'Lifetime Replacement Warranty'
    },
    reviews: [
      {
        id: 'r7',
        author: 'Sarah Jenkins',
        rating: 5,
        date: '4 days ago',
        verified: true,
        title: 'No more frayed white cables',
        text: 'Finally a lightning cable that doesn’t split at the neck after two months. Charges fast with zero heat.'
      }
    ]
  },
  {
    id: 'veltrix-gan-compact-adapter',
    name: 'Veltrix GaN Ultra 35W Dual Adapter',
    subtitle: 'Compact Dual USB-C GaN Fast Charger for iPhone & Watch',
    category: 'Cables & Adapters',
    categorySlug: 'cables-adapters',
    price: 70,
    originalPrice: 95,
    rating: 4.9,
    reviewCount: 275,
    badge: 'TOP RATED',
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockCount: 42,
    images: [
      '/images/power-adapter.jpg'
    ],
    colors: [
      { name: 'Matte White', hex: '#f8fafc', bg: 'bg-white' },
      { name: 'Matte Stealth', hex: '#18181b', bg: 'bg-neutral-900' }
    ],
    description: 'Powered by advanced Gallium Nitride (GaN III) semiconductor architecture, this ultra-mini wall charger delivers 35W total output across two USB-C ports. Small enough to fit in a pocket, powerful enough to fast-charge an iPhone and Apple Watch simultaneously.',
    highlights: [
      'GaN III technology offers 40% smaller footprint with 3x cooler operation',
      'Dual USB-C ports with dynamic smart wattage splitting (35W single / 20W + 15W dual)',
      'Foldable US plug prongs for scratch-free pocket portability',
      '9-point Veltrix MultiProtect safety system guarding against surges and shorts',
      'Universal voltage support (100-240V) ideal for international travel'
    ],
    specs: {
      'Total Output': '35W Max',
      'Input': '100-240V ~ 50/60Hz 1.0A',
      'Output Ports': '2 x USB-C (PD 3.0 / QC 4.0 / PPS)',
      'Dimensions': '36mm x 36mm x 40mm',
      'Weight': '58 grams',
      'Safety': 'GaN III Temperature Guard, UL94 V-0 Fire-resistant casing',
      'Warranty': '18-Month Veltrix Warranty'
    },
    reviews: [
      {
        id: 'r8',
        author: 'Alexandre M.',
        rating: 5,
        date: '6 days ago',
        verified: true,
        title: 'My favorite travel companion',
        text: 'Charges my phone and watch at night from one tiny outlet block. Doesn’t get warm at all.'
      }
    ]
  },
  {
    id: 'veltrix-3in1-foldable-magsafe',
    name: 'Veltrix 3-in-1 Magnetic Travel Charger',
    subtitle: 'Foldable 15W MagSafe Phone, Watch & AirPods Charging Station',
    category: 'Accessories',
    categorySlug: 'accessories',
    price: 150,
    originalPrice: 190,
    rating: 4.9,
    reviewCount: 326,
    badge: 'BEST SELLER',
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockCount: 45,
    images: [
      '/images/power-adapter.jpg',
      '/images/usbc-cable.jpg'
    ],
    colors: [
      { name: 'Matte Space Gray', hex: '#374151', bg: 'bg-gray-700' },
      { name: 'Alpine White', hex: '#f8fafc', bg: 'bg-white' }
    ],
    description: 'Consolidate your entire nightstand into one sleek, origami-folding magnetic dock. Charges your MagSafe iPhone at up to 15W, Apple Watch fast charging puck, and Qi wireless earbuds simultaneously with a single USB-C cable.',
    highlights: [
      'Charges 3 devices simultaneously: iPhone (15W), Apple Watch (5W), AirPods (5W)',
      'Folds flat into a palm-sized puck for minimalist travel carry',
      'Transforms into an upright StandBy mode viewing stand',
      'Strong N52 neodymium magnets hold heavy Pro Max phones securely',
      'Includes premium 30W GaN adapter and braided USB-C cable'
    ],
    specs: {
      'Total Output': '25W Max',
      'Dimensions (Folded)': '82mm x 82mm x 24mm',
      'Weight': '178g',
      'Compatibility': 'iPhone 12-16 MagSafe, Apple Watch 2-Ultra 2, AirPods Pro/3',
      'Safety': 'FOD (Foreign Object Detection), Overheat Protection',
      'Warranty': '18-Month Veltrix Warranty'
    },
    reviews: [
      {
        id: 'r11',
        author: 'Sophia Zhang',
        rating: 5,
        date: '4 days ago',
        verified: true,
        title: 'Eliminated cable clutter on my nightstand',
        text: 'Folds up into my carry-on effortlessly. Holds my iPhone 15 Pro horizontally in StandBy clock mode perfectly.'
      }
    ]
  },
  {
    id: 'veltrix-magsafe-power-bank-10k',
    name: 'Veltrix MagSlim 10,000mAh Power Bank',
    subtitle: 'Ultra-Thin Magnetic Battery Pack with Smart LED Matrix',
    category: 'Accessories',
    categorySlug: 'accessories',
    price: 130,
    originalPrice: 160,
    rating: 4.8,
    reviewCount: 189,
    badge: 'NEW',
    isBestSeller: false,
    isNew: true,
    inStock: true,
    stockCount: 38,
    images: [
      '/images/power-adapter.jpg'
    ],
    colors: [
      { name: 'Graphite Armor', hex: '#1e293b', bg: 'bg-slate-800' },
      { name: 'Titanium Silver', hex: '#94a3b8', bg: 'bg-slate-400' }
    ],
    description: 'At only 12.8mm thin with an anodized aluminum exterior, the MagSlim snaps cleanly to the back of your phone without blocking the camera lenses. Features 15W wireless snap charging and a 20W USB-C PD bidirectional port.',
    highlights: [
      'Slim 12.8mm profile that easily slips into jeans pockets while attached',
      '10,000mAh capacity provides 2.2 full charges for iPhone 15/16',
      'Discrete digital LED percentage display',
      'Dual device charging: one wirelessly and one via high-speed USB-C',
      'Soft-touch silicone magnetic face prevents phone scratch marks'
    ],
    specs: {
      'Capacity': '10,000mAh / 38.5Wh',
      'Wireless Output': '5W / 7.5W / 10W / 15W Max',
      'USB-C Input/Output': 'PD 20W Max (5V/3A, 9V/2.22A, 12V/1.67A)',
      'Dimensions': '104mm x 68mm x 12.8mm',
      'Weight': '195g',
      'Warranty': '1-Year Veltrix Warranty'
    },
    reviews: [
      {
        id: 'r12',
        author: 'Daniel Kim',
        rating: 5,
        date: '1 week ago',
        verified: true,
        title: 'Snaps on firmly and feels luxurious',
        text: 'The digital percentage indicator is very clear. It doesn’t overheat like cheap plastic magnetic packs.'
      }
    ]
  }
];

export const TRUST_FEATURES = [
  {
    icon: 'ShieldCheck',
    title: 'Secure Checkout',
    description: 'Shop with confidence through a secure 256-bit encrypted checkout experience with Apple Pay & card protection.'
  },
  {
    icon: 'Truck',
    title: 'Fast Shipping',
    description: 'Get your technology essentials delivered quickly. Orders dispatched within 24 hours with tracked express delivery.'
  },
  {
    icon: 'Sparkles',
    title: 'Quality Products',
    description: 'Carefully selected products and accessories engineered with premium materials for everyday reliability.'
  },
  {
    icon: 'Headphones',
    title: 'Customer Support',
    description: "We're here to help whenever you need us. Dedicated 24/7 technical and customer service assistance."
  }
];

export const CUSTOMER_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Alexander Ward',
    role: 'Creative Director & Tech Reviewer',
    rating: 5,
    product: 'AirPods Pro 2',
    date: 'Verified Buyer • 3 days ago',
    text: 'Veltrix completely changed my audio workflow. The soundstage clarity is razor-sharp, build quality is immaculate, and shipping took less than 36 hours. A genuinely elite tech shopping experience.'
  },
  {
    id: 'rev-2',
    name: 'Maya Lin',
    role: 'Senior Software Engineer',
    rating: 5,
    product: 'USB-C Fast Charging Cable (60W)',
    date: 'Verified Buyer • 1 week ago',
    text: 'The 60W braided cables are without question the finest I have ever used. Handles my MacBook Air and fast phone charging effortlessly without any overheating or crimping.'
  },
  {
    id: 'rev-3',
    name: 'Harrison Sterling',
    role: 'Product Architect',
    rating: 5,
    product: 'Veltrix 3-in-1 Magnetic Travel Charger',
    date: 'Verified Buyer • 2 weeks ago',
    text: 'Impeccable packaging, pristine authentic hardware, and transparent customer support. The foldable 3-in-1 travel dock charges my phone, watch, and earbuds flawlessly.'
  },
  {
    id: 'rev-4',
    name: 'Chloe Davenport',
    role: 'Audiophile & Musician',
    rating: 5,
    product: '65W GaN Dual USB-C Fast Adapter',
    date: 'Verified Buyer • 3 weeks ago',
    text: 'The 65W GaN charger runs cool while fast charging my laptop and phone simultaneously. Compact design makes it an everyday carry essential.'
  }
];

export const FAQS = [
  {
    question: 'How fast is standard and express shipping?',
    answer: 'All orders are processed and dispatched within 24 business hours from our fulfillment hub. Standard shipping takes 2-4 business days (Free over 300 DH). Express shipping takes 1-2 business days.'
  },
  {
    question: 'Are all cables and adapters safe for Apple devices?',
    answer: 'Yes! All Veltrix cables and chargers undergo rigorous certification. Our Lightning cables are Apple MFi-certified, and our GaN USB-C chargers meet full USB Power Delivery (PD 3.0) and PPS protocols with active thermal management.'
  },
  {
    question: 'What is the Veltrix return and warranty policy?',
    answer: 'We provide a 30-Day Risk-Free Trial on all products. If you are not completely satisfied, return it in original packaging for a full refund. Furthermore, all accessories include our complimentary 1 to 2-year replacement warranty.'
  },
  {
    question: 'How do I track my order once placed?',
    answer: 'Immediately after your order is dispatched, you will receive a tracking link via email and SMS. You can also look up your real-time status using our Order Tracking portal with your Order ID and email address.'
  },
  {
    question: 'Which payment methods do you accept?',
    answer: 'We accept Cash on Delivery (Paiement à la livraison), Apple Pay, and PayPal with end-to-end 256-bit SSL encryption.'
  }
];

// Initialize price overrides from client storage if available
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const overrides = JSON.parse(localStorage.getItem('veltrix_products_override') || '{}');
    PRODUCTS.forEach((p) => {
      if (overrides[p.id] !== undefined && typeof overrides[p.id] === 'number') {
        p.price = overrides[p.id];
      }
    });
  } catch {}
}

