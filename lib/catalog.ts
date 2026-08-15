export type Scent = {
  id: string;
  name: string;
  family: string;
  notes: string;
  price: number;
  available: boolean;
  tone: string;
  image: string;
  description?: string;
}

export const scents: Scent[] = [
  {
    id: 'oud-royale',
    name: 'Oud Royale',
    family: 'Oud',
    notes: 'Oud · Amber · Cedarwood',
    price: 8500,
    available: true,
    tone: 'amber',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&h=800&fit=crop&q=80',
    description: 'A regal blend of dark resinous Cambodian oud, glowing warm amber, and smoked cedarwood.'
  },
  {
    id: 'aventus-type',
    name: 'Fresh Adventure',
    family: 'Fresh',
    notes: 'Pineapple · Birch · Blackcurrant',
    price: 7000,
    available: true,
    tone: 'smoke',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&h=800&fit=crop&q=80',
    description: 'Crisp bergamot and juicy pineapple anchored by dry birch smoke and oakmoss.'
  },
  {
    id: 'soft-vanilla',
    name: 'Sweet Vanilla',
    family: 'Gourmand',
    notes: 'Bourbon Vanilla · Tonka · Sandalwood',
    price: 6500,
    available: true,
    tone: 'parchment',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&h=800&fit=crop&q=80',
    description: 'Creamy Madagascar vanilla beans kissed by warm tonka bean and smooth sandalwood.'
  },
  {
    id: 'rose-oud',
    name: 'Rose & Oud',
    family: 'Floral',
    notes: 'Damask Rose · Saffron · Smoked Oud',
    price: 9000,
    available: true,
    tone: 'deep',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&h=800&fit=crop&q=80',
    description: 'Velvety crimson roses steeped in golden saffron and velvety smoked oud oil.'
  },
  {
    id: 'blue-water',
    name: 'Blue Water',
    family: 'Fresh',
    notes: 'Calabrian Citrus · Marine Accord · Vetiver',
    price: 6000,
    available: true,
    tone: 'smoke',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&h=800&fit=crop&q=80',
    description: 'Cool sea mist infused with zesty grapefruit, crushed mint, and earthy Haitian vetiver.'
  },
  {
    id: 'sandal-letter',
    name: 'Sandal Letter',
    family: 'Woody',
    notes: 'Mysore Sandalwood · Florentine Iris · Leather',
    price: 8000,
    available: true,
    tone: 'amber',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&h=800&fit=crop&q=80',
    description: 'Silky sandalwood paired with powdery iris root and soft vintage leather notes.'
  },
  {
    id: 'grand-amber',
    name: 'Grand Amber',
    family: 'Amber',
    notes: 'Golden Amber · Benzoin · Vanilla Bean',
    price: 9500,
    available: true,
    tone: 'amber',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=800&fit=crop&q=80',
    description: 'Enveloping resinous amber warmed by styrax benzoin and sweet vanilla nectar.'
  },
  {
    id: 'velvet-iris',
    name: 'Velvet Iris',
    family: 'Floral',
    notes: 'Florentine Iris · Violet Leaf · White Musk',
    price: 7500,
    available: true,
    tone: 'parchment',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&h=800&fit=crop&q=80',
    description: 'Powdery Tuscan iris blended with crisp violet leaves and silky white musk.'
  },
  {
    id: 'smokey-leather',
    name: 'Smokey Leather',
    family: 'Woody',
    notes: 'Tuscan Leather · Raspberry · Wild Thyme',
    price: 8800,
    available: true,
    tone: 'deep',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&h=800&fit=crop&q=80',
    description: 'Rich dark suede and raw leather lifted by ripe raspberry and herbal thyme.'
  },
  {
    id: 'citrus-blossom',
    name: 'Citrus Blossom',
    family: 'Fresh',
    notes: 'Italian Neroli · Bergamot · Orange Blossom',
    price: 6500,
    available: true,
    tone: 'smoke',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&h=800&fit=crop&q=80',
    description: 'Sun-drenched Riviera neroli fused with crushed citrus leaves and white floral breeze.'
  }
]

export const decantSizes = [
  { ml: 10, label: '10ml Pocket Atomizer', badge: 'Travel Size', multiplier: 1 },
  { ml: 30, label: '30ml Signature Decant', badge: 'Most Popular', multiplier: 2.5 },
  { ml: 50, label: '50ml Vanity Bottle', badge: 'Best Value', multiplier: 3.8 }
]

export const shopDetails = {
  headline: 'The Bespoke Fragrance Bar Experience',
  tagline: 'Artisanal Oil Decanting & Personal Fragrance Pairing in Yenagoa',
  decantPhilosophy: 'At Trendy Scents, we eliminate department store markup and excessive branding clutter. You pay purely for concentrated, premium oil extracts poured precisely to your desired volume.',
  guarantees: [
    { title: '100% Uncut Oils', desc: 'No diluted alcohol fillers. Long-lasting sillage that stays on skin and garments for up to 48 hours.' },
    { title: 'Millilitre Precision', desc: 'Each decant is measured with laboratory glass pipettes right at the bar.' },
    { title: 'UV Glass Packaging', desc: 'Housed in high-grade amber and smoked glass atomizers to protect delicate scent notes.' },
    { title: 'Bespoke Layering', desc: 'Consult with our team to layer base notes like Oud & Vanilla for your custom signature scent.' }
  ]
}

export const shopImage = '/images/shop-interior-1.jpg'
export const shopImages = [
  {
    src: '/images/shop-interior-1.jpg',
    alt: 'Trendy Scents bespoke decant bar table with glass globe chandelier',
    title: 'The Central Decant Bar',
    caption: 'Custom glass decanters & ambient golden lighting along Isaac Boro Expressway.'
  },
  {
    src: '/images/shop-interior-2.jpg',
    alt: 'Decant oil dispensers and warm ceiling lighting',
    title: 'Precision Pouring Station',
    caption: 'Over 40 concentrated perfume oils measured to the exact millilitre.'
  },
  {
    src: '/images/shop-interior-3.jpg',
    alt: 'Matte black display shelves filled with luxury perfume boxes',
    title: 'Architectural Fragrance Wall',
    caption: 'Curated designer perfumes and rare oil extracts housed on sleek matte shelves.'
  }
]
export const ownerImage = '/images/owner-black.jpg'
export const ownerImageTraditional = '/images/owner-traditional.jpg'

export const ownerImages = [
  {
    src: '/images/owner-black.jpg',
    label: 'Contemporary Studio',
    alt: 'Blessing Igoni - Founder of Trendy Scents'
  },
  {
    src: '/images/owner-traditional.jpg',
    label: 'Cultural Heritage',
    alt: 'Blessing Igoni in luxury traditional couture'
  }
]

export const ownerDetails = {
  name: 'Blessing Igoni',
  role: 'Founder & Nose at Trendy Scents',
  bio: 'Pours every bottle with artistic intuition and artisanal precision. What began as a personal passion for rare amber oils, damask rose, and rich oud evolved into Yenagoa’s premier bespoke fragrance bar. At Trendy Scents, fragrance isn’t just worn—it is experienced, measured to the exact millilitre, and tailored to who you are.',
  quote: 'A fragrance should feel like an intimate memory captured in glass—poured just for you.'
}

export const naira = (value: number) => `₦${value.toLocaleString('en-NG')}`

export function getCarouselSlides() {
  const slides = scents.map((s) => ({
    src: s.image,
    alt: `${s.name} perfume bottle`,
    title: s.name,
    subtitle: s.notes,
    meta: [
      { label: "Family", value: s.family },
      { label: "Price / ml", value: naira(s.price) },
      { label: "Availability", value: s.available ? "In Stock" : "Pre-order" },
    ],
  }))

  // Add the "Discover More" final slide pointing to the catalog
  slides.push({
    src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=800&fit=crop&q=80",
    alt: "Full fragrance collection at Trendy Scents",
    title: "Discover All Scents",
    subtitle: "Explore 40+ artisan fragrance oils in our catalog",
    meta: [
      { label: "Catalog", value: "40+ Oils" },
      { label: "Location", value: "Yenagoa Bar" },
      { label: "Tap", value: "Shop Now" },
    ],
  })

  return slides
}
export const storeLocation = {
  name: 'Trendy Scents Fragrance Bar',
  address: 'Isaac Boro Expressway, Yenagoa, Bayelsa State, Nigeria',
  googleMapsUrl: 'https://www.google.com/maps/place/Trendy+Scents/@4.7805902,6.2431559,16z/data=!4m6!3m5!1s0x106a050048eccd6f:0xf339d05ae6a61279!8m2!3d4.9163329!4d6.3059421!16s%2Fg%2F11ykgp551w',
  embedMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.2573215264025!2d6.303367175924765!3d4.916338239857945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x106a050048eccd6f%3A0xf339d05ae6a61279!2sTrendy%20Scents!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng',
  hours: [
    { days: 'Monday – Friday', time: '10:00 AM – 8:00 PM' },
    { days: 'Saturday', time: '10:00 AM – 7:00 PM' },
    { days: 'Sunday', time: 'Closed' }
  ],
  headline: 'Experience Yenagoa’s premier decant lounge and bespoke oil bar in person.',
  writeup: 'Step inside our warm, amber-lit sanctuary along the bustling Isaac Boro Expressway. At Trendy Scents, sampling fragrance is an immersive olfactory journey. Explore over 40 fine oil concentrated perfumes, speak directly with our team, and have your signature scent decanted to the exact millilitre right in front of you.'
}

export const blockedCopy = {
  bank: 'Bank Transfer Details: Trendy Scents | Zenith Bank 1012345678'
}
