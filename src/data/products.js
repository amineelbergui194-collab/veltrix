export const CATEGORIES = [
  {
    id: 'airpods',
    name: 'AirPods',
    tagline: 'Premium wireless audio for everyday listening.',
    count: '6 Products',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    iconName: 'Headphones',
  },
  {
    id: 'headphones',
    name: 'Headphones',
    tagline: 'Immersive sound and modern design.',
    count: '8 Products',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    iconName: 'Speaker',
  },
  {
    id: 'apple-watch',
    name: 'Apple Watch',
    tagline: 'Smart technology for your everyday life.',
    count: '7 Products',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
    iconName: 'Watch',
  },
  {
    id: 'cables-adapters',
    name: 'Cables & Adapters',
    tagline: 'Reliable charging and connectivity.',
    count: '12 Products',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    iconName: 'Zap',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    tagline: 'Essential tech accessories for your devices.',
    count: '15 Products',
    image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=800&q=80',
    iconName: 'Smartphone',
  },
];

export const PRODUCTS = [
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro 2',
    subtitle: 'Active Noise Cancellation with USB-C MagSafe Case',
    category: 'AirPods',
    categorySlug: 'airpods',
    price: 249.00,
    originalPrice: 279.00,
    rating: 4.9,
    reviewCount: 384,
    badge: 'BEST SELLER',
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockCount: 14,
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85'
    ],
    colors: [
      { name: 'White Gloss', hex: '#f8fafc', bg: 'bg-white' },
      { name: 'Stealth Matte Skin', hex: '#18181b', bg: 'bg-neutral-900' }
    ],
    description: 'Equipped with the upgraded H2 chip, AirPods Pro 2 deliver pro-level Active Noise Cancellation, Adaptive Audio that tailors sound control to your environment, and Personalized Spatial Audio with dynamic head tracking. Comes with a USB-C MagSafe Charging Case with built-in speaker and lanyard loop.',
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
    id: 'airpods-pro-4-edition',
    name: 'AirPods Pro 4 Studio Edition',
    subtitle: 'Next-Gen Wireless Earbuds with Precision Acoustic Chambers',
    category: 'AirPods',
    categorySlug: 'airpods',
    price: 189.00,
    originalPrice: 229.00,
    rating: 4.8,
    reviewCount: 192,
    badge: 'NEW',
    isBestSeller: true,
    isNew: true,
    inStock: true,
    stockCount: 22,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=900&q=85'
    ],
    colors: [
      { name: 'Midnight Titanium', hex: '#1e293b', bg: 'bg-slate-800' },
      { name: 'Pure Frost', hex: '#f1f5f9', bg: 'bg-slate-100' }
    ],
    description: 'Designed for discerning listeners who demand studio-grade low latency and crystalline frequency balance. The AirPods Pro 4 Studio Edition incorporates high-definition dual graphene drivers, quad beamforming noise-isolating microphones, and an aerodynamic stem profile.',
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
    id: 'veltrix-horizon-headphones',
    name: 'Veltrix Horizon Wireless ANC',
    subtitle: 'Audiophile Over-Ear Headphones with 45mm Drivers',
    category: 'Headphones',
    categorySlug: 'headphones',
    price: 299.00,
    originalPrice: 349.00,
    rating: 4.9,
    reviewCount: 247,
    badge: 'STAFF PICK',
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockCount: 9,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85'
    ],
    colors: [
      { name: 'Space Black', hex: '#111827', bg: 'bg-neutral-900' },
      { name: 'Silver Lunar', hex: '#cbd5e1', bg: 'bg-slate-300' }
    ],
    description: 'Veltrix flagship Horizon ANC headphones combine aerospace-grade lightweight aluminum earcups with plush memory foam protein leather cushions. Engineered with custom 45mm neodymium dynamic drivers delivering wide concert-hall spatial reproduction.',
    highlights: [
      '45mm Custom Titanium Coated Neodymium Drivers',
      'Triple-mode Active Noise Cancellation (Max, Commute, Transparency)',
      'Industry-leading 60-Hour battery life on a single charge',
      'Multipoint Bluetooth 5.3 pairing (seamless laptop & phone handoff)',
      'Aircraft-grade aluminum yoke with magnetic detachable ear pads'
    ],
    specs: {
      'Drivers': '45mm Neodymium Dynamic Diaphragms',
      'Impedance': '32 Ohm',
      'Battery Playtime': '60h (ANC off) / 45h (ANC on)',
      'Quick Charge': '10 mins charge = 5 hours playback',
      'Cabling': 'USB-C Lossless Audio & 3.5mm Gold-plated Cable Included',
      'Weight': '265g',
      'Warranty': '2-Year Veltrix Global Warranty'
    },
    reviews: [
      {
        id: 'r4',
        author: 'David S.',
        rating: 5,
        date: '5 days ago',
        verified: true,
        title: 'Better comfort than competitors at half the weight',
        text: 'The memory foam does not create pressure points even when wearing glasses. Battery truly lasts through an entire week of work and flights.'
      }
    ]
  },
  {
    id: 'jbl-tune-wireless-headphones',
    name: 'JBL Wireless Over-Ear Headset',
    subtitle: 'Signature Pure Bass Sound with Multi-Device Connection',
    category: 'Headphones',
    categorySlug: 'headphones',
    price: 129.95,
    originalPrice: 159.95,
    rating: 4.7,
    reviewCount: 310,
    badge: 'POPULAR',
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockCount: 18,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=900&q=85'
    ],
    colors: [
      { name: 'Matte Black', hex: '#0a0a0a', bg: 'bg-black' },
      { name: 'Deep Navy', hex: '#1e3a8a', bg: 'bg-blue-900' }
    ],
    description: 'Renowned JBL Pure Bass Sound packed into a comfortable, foldable design. Features active environmental noise management, 50-hour battery lifespan, and quick speed charging that provides 2 hours of juice in just 5 minutes.',
    highlights: [
      'Authentic JBL Pure Bass Acoustic Profile',
      'Active Noise Cancellation with Smart Ambient technology',
      'Up to 50 Hours of continuous playback (44h with ANC)',
      'Speed Charge: 5 minutes gives 2 additional hours of music',
      'Lightweight folding design with integrated earcup controls'
    ],
    specs: {
      'Driver Size': '40mm Dynamic Driver',
      'Bluetooth Version': '5.0',
      'Battery Capacity': '610 mAh Polymer Li-ion',
      'Charging Time': '2 hours from empty',
      'Weight': '220g',
      'Compatibility': 'Universal Bluetooth Android, iOS, Windows, Mac',
      'Warranty': '1-Year Limited Manufacturer Warranty'
    },
    reviews: [
      {
        id: 'r5',
        author: 'Rachel K.',
        rating: 5,
        date: '2 weeks ago',
        verified: true,
        title: 'Bass is punchy without distorting vocals',
        text: 'Great daily drivers for gym and study sessions. Very lightweight and fold up neatly into my backpack.'
      }
    ]
  },
  {
    id: 'usbc-fast-charging-cable-100w',
    name: 'USB-C Fast Charging Cable (100W)',
    subtitle: 'Braided Kevlar Core with E-Marker Smart Chip (2m)',
    category: 'Cables & Adapters',
    categorySlug: 'cables-adapters',
    price: 24.99,
    originalPrice: 32.00,
    rating: 4.9,
    reviewCount: 421,
    badge: 'BEST SELLER',
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockCount: 85,
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=900&q=85'
    ],
    colors: [
      { name: 'Space Gray Braided', hex: '#4b5563', bg: 'bg-gray-600' },
      { name: 'Obsidian Black', hex: '#18181b', bg: 'bg-neutral-900' }
    ],
    description: 'Engineered with double-woven ballistic nylon and reinforced with DuPont Kevlar fibers, this 100W USB-C cable powers everything from iPhone 15/16 and iPad Pro to 16-inch MacBook Pros at maximum rated speed without heating up.',
    highlights: [
      '100W (20V/5A) Power Delivery 3.0 ultra-rapid charging',
      'Integrated E-Marker Smart Chip prevents overvoltage & overheating',
      '30,000+ bend lifespan rating with aluminum alloy strain relief collars',
      '480 Mbps high-speed synchronous data transfer',
      'Generous 6.6ft (2 meter) length with complimentary leather cable organizer'
    ],
    specs: {
      'Maximum Power': '100W (20V / 5A)',
      'Data Transfer Rate': '480 Mbps (USB 2.0 Standard)',
      'Cable Length': '2.0m (6.6 ft)',
      'Jacket Material': 'Double-braided Ballistic Nylon Armor',
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
        text: 'Charges my MacBook Pro 16 inch and iPhone 16 at top speed. The cable doesn’t kink or fray around the connector necks.'
      }
    ]
  },
  {
    id: 'mfi-lightning-charging-cable',
    name: 'Lightning Fast Charging Cable',
    subtitle: 'MFi-Certified Duraflex Reinforced USB-C to Lightning',
    category: 'Cables & Adapters',
    categorySlug: 'cables-adapters',
    price: 19.99,
    originalPrice: 24.99,
    rating: 4.8,
    reviewCount: 388,
    badge: 'ESSENTIAL',
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockCount: 64,
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=900&q=85'
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
    price: 34.99,
    originalPrice: 44.99,
    rating: 4.9,
    reviewCount: 275,
    badge: 'TOP RATED',
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockCount: 42,
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=900&q=85'
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
    id: 'apple-watch-ultra-edition',
    name: 'Apple Watch Ultra 2 Edition',
    subtitle: 'Rugged Titanium GPS + Cellular with Orange Alpine Loop',
    category: 'Apple Watch',
    categorySlug: 'apple-watch',
    price: 779.00,
    originalPrice: 799.00,
    rating: 4.9,
    reviewCount: 154,
    badge: 'FLAGSHIP',
    isBestSeller: true,
    isNew: true,
    inStock: true,
    stockCount: 6,
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85'
    ],
    colors: [
      { name: 'Natural Titanium', hex: '#94a3b8', bg: 'bg-slate-400' },
      { name: 'Dark Titanium', hex: '#334155', bg: 'bg-slate-700' }
    ],
    description: 'The most capable and rugged smartwatch ever built. Featuring an aerospace-grade 49mm titanium case, customizable Action button, 3000 nit sapphire crystal display, dual-frequency precision GPS, and up to 72 hours of battery in Low Power Mode.',
    highlights: [
      '49mm Aerospace-grade Titanium Case with raised bezel for edge protection',
      'Ultra-bright 3,000 nit Always-On Retina display readable under direct sun',
      'Precision Dual-Frequency GPS (L1 and L5) for exact route metrics',
      '100m Water Resistance & EN13319 dive computer certification to 40m',
      'Up to 36 hours regular battery life / 72 hours in Low Power Mode'
    ],
    specs: {
      'Case Size': '49mm',
      'Case Material': 'Aerospace Grade Titanium',
      'Glass': 'Flat Sapphire Crystal Display',
      'Water Resistance': '100m (WR100) / Dive certified to 40m',
      'Connectivity': 'Cellular LTE & UMTS, Wi-Fi 4, Bluetooth 5.3, U2 Chip',
      'Battery': 'Up to 36 hours standard / 72 hours low power',
      'Warranty': '1-Year Official Manufacturer Warranty'
    },
    reviews: [
      {
        id: 'r9',
        author: 'Capt. Brandon Lee',
        rating: 5,
        date: '1 week ago',
        verified: true,
        title: 'Unbelievable battery life and screen',
        text: 'I run ultra-marathons and this is the only watch that tracks dual-band GPS all day without flinching. Titanium casing takes knocks easily.'
      }
    ]
  },
  {
    id: 'titanium-link-apple-watch-band',
    name: 'Titanium Link Bracelet for Apple Watch',
    subtitle: 'Precision Butterfly Clasp for 44/45/49mm Cases',
    category: 'Apple Watch',
    categorySlug: 'apple-watch',
    price: 69.99,
    originalPrice: 89.99,
    rating: 4.8,
    reviewCount: 204,
    badge: 'POPULAR',
    isBestSeller: false,
    isNew: false,
    inStock: true,
    stockCount: 31,
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=85'
    ],
    colors: [
      { name: 'Brushed Silver', hex: '#cbd5e1', bg: 'bg-slate-300' },
      { name: 'Diamond-Like Carbon Black', hex: '#0f172a', bg: 'bg-slate-900' }
    ],
    description: 'Crafted from grade-4 titanium alloy with an exquisite brushed finish. Features custom tool-free link adjustment buttons and an invisible butterfly clasp that folds flush within the bracelet.',
    highlights: [
      'Grade-4 Titanium alloy matching Apple Watch Ultra and Stainless cases',
      'Integrated tool-free link removal mechanism for custom wrist sizing',
      'Subtle double-fold butterfly deployment clasp',
      'Scratch-resistant DLC (Diamond-Like Carbon) protective surface',
      'Compatible with 42mm, 44mm, 45mm, and 49mm Apple Watch models'
    ],
    specs: {
      'Material': 'Grade-4 Titanium Alloy',
      'Wrist Fit': '140mm – 215mm circumference',
      'Closure': 'Dual-deployant butterfly clasp',
      'Weight': '68g',
      'Compatibility': 'Apple Watch Ultra 1/2, Series 10/9/8/7/SE (42/44/45/49mm)',
      'Warranty': '2-Year Hardware Warranty'
    },
    reviews: [
      {
        id: 'r10',
        author: 'Victor Cruz',
        rating: 5,
        date: '3 weeks ago',
        verified: true,
        title: 'Looks OEM at one-fourth the price',
        text: 'The color match with the Ultra 2 titanium is dead-on. Changing links without tiny pins or tools took less than two minutes.'
      }
    ]
  },
  {
    id: 'veltrix-3in1-foldable-magsafe',
    name: 'Veltrix 3-in-1 Magnetic Travel Charger',
    subtitle: 'Foldable 15W MagSafe Phone, Watch & AirPods Charging Station',
    category: 'Accessories',
    categorySlug: 'accessories',
    price: 59.99,
    originalPrice: 79.99,
    rating: 4.9,
    reviewCount: 326,
    badge: 'BEST SELLER',
    isBestSeller: true,
    isNew: false,
    inStock: true,
    stockCount: 45,
    images: [
      'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=85'
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
    price: 49.99,
    originalPrice: 65.00,
    rating: 4.8,
    reviewCount: 189,
    badge: 'NEW',
    isBestSeller: false,
    isNew: true,
    inStock: true,
    stockCount: 38,
    images: [
      'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=85'
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
  },
  {
    id: 'aluminum-desktop-device-stand',
    name: 'Precision Aluminum Desktop Stand',
    subtitle: 'Dual 360° Hinges with Cable Routing Channel',
    category: 'Accessories',
    categorySlug: 'accessories',
    price: 32.50,
    originalPrice: 39.99,
    rating: 4.8,
    reviewCount: 167,
    badge: 'POPULAR',
    isBestSeller: false,
    isNew: false,
    inStock: true,
    stockCount: 50,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=85'
    ],
    colors: [
      { name: 'Space Gray', hex: '#374151', bg: 'bg-gray-700' },
      { name: 'Silver Matte', hex: '#cbd5e1', bg: 'bg-slate-300' }
    ],
    description: 'CNC machined from a solid block of aircraft-grade 6000-series aluminum. Designed with ultra-stiff dual damping hinges that support everything from compact phones to 13-inch iPad tablets at any viewing angle without sagging.',
    highlights: [
      'Solid CNC aluminum unibody construction with sandblasted anodized finish',
      'Heavy weighted base with anti-skid silicone pads prevents tipping',
      'Rear channel routes cables cleanly behind your desk',
      'Dual precision tension hinges hold up to 1.5kg weight',
      'Folds flat for briefcase carry'
    ],
    specs: {
      'Material': '6063 Anodized Aluminum Alloy',
      'Weight': '310g',
      'Angle Adjustment': 'Dual 270° multi-axis hinges',
      'Base Size': '120mm x 100mm x 4mm',
      'Compatibility': 'All smartphones, e-readers, and tablets up to 13 inches',
      'Warranty': '5-Year Mechanical Warranty'
    },
    reviews: [
      {
        id: 'r13',
        author: 'Liam Miller',
        rating: 5,
        date: '2 weeks ago',
        verified: true,
        title: 'Rock solid on my work desk',
        text: 'Holds my iPad Pro firmly while drawing or taking video calls. High end finish matches Apple hardware seamlessly.'
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
    product: 'USB-C Fast Charging Cable (100W)',
    date: 'Verified Buyer • 1 week ago',
    text: 'The 100W Kevlar braided cables are without question the finest I have ever used. Handles my MacBook Pro and fast phone charging effortlessly without any overheating or crimping.'
  },
  {
    id: 'rev-3',
    name: 'Harrison Sterling',
    role: 'Product Architect',
    rating: 5,
    product: 'Apple Watch Ultra 2 Edition',
    date: 'Verified Buyer • 2 weeks ago',
    text: 'Impeccable packaging, pristine authentic hardware, and transparent customer support. The titanium bracelet pairing transforms the watch into an executive showpiece.'
  },
  {
    id: 'rev-4',
    name: 'Chloe Davenport',
    role: 'Audiophile & Musician',
    rating: 5,
    product: 'Veltrix Horizon Wireless ANC',
    date: 'Verified Buyer • 3 weeks ago',
    text: 'The soundstage on the Horizon headphones rival studio cans that cost double. Active noise cancellation is completely silent without cabin pressure sensation.'
  }
];

export const FAQS = [
  {
    question: 'How fast is standard and express shipping?',
    answer: 'All orders are processed and dispatched within 24 business hours from our fulfillment hub. Standard shipping takes 3-5 business days (Free over $50). Express shipping takes 1-2 business days.'
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
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), Apple Pay, Google Pay, PayPal, and Shop Pay with end-to-end 256-bit SSL encryption.'
  }
];
