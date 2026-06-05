/**
 * Centralized property data.
 * In Sprint 3 this module will be updated to fetch from the database —
 * all callers already use the async `getProperties()` / `getPropertyById()`
 * interfaces so no page-level changes will be needed at that point.
 */

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  dom: number;
  // Agent / listing info
  agent: string;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  brokerage: string;
  // Media
  img: string;
  photos: string[];
  // AI / market fields
  type: string;
  priceHistory: string;
  priceChange: number;
  aiScore: number;
  aiLabel: string;
  aiColor: string;
  suggestedOffer: number[];
  marketTrend: string;
  // Dashboard display
  reduced: boolean;
}

export const ALL_PROPERTIES: Property[] = [
  {
    id: "1",
    address: "2847 N Clark St",
    city: "Chicago",
    state: "IL",
    zip: "60657",
    price: 485000,
    beds: 3,
    baths: 2,
    sqft: 1850,
    dom: 12,
    agent: "Sarah Johnson",
    agentName: "Sarah Johnson",
    agentPhone: "(312) 555-0192",
    agentEmail: "sarah.johnson@coldwellbanker.com",
    brokerage: "Coldwell Banker",
    img: "https://picsum.photos/seed/orchard/600/400",
    photos: ["https://picsum.photos/seed/orchard/800/600"],
    type: "Single Family",
    priceHistory: "reduced",
    priceChange: -15000,
    aiScore: 87,
    aiLabel: "Great Value",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [475000, 492000],
    marketTrend: "hot",
    reduced: true,
  },
  {
    id: "2",
    address: "1520 W Wrightwood Ave",
    city: "Chicago",
    state: "IL",
    zip: "60614",
    price: 625000,
    beds: 4,
    baths: 2.5,
    sqft: 2400,
    dom: 5,
    agent: "Linda Park",
    agentName: "Linda Park",
    agentPhone: "(312) 555-0341",
    agentEmail: "lpark@bairdwarner.com",
    brokerage: "Baird & Warner",
    img: "https://picsum.photos/seed/schiller/600/400",
    photos: ["https://picsum.photos/seed/schiller/800/600"],
    type: "Townhouse",
    priceHistory: "same",
    priceChange: 0,
    aiScore: 72,
    aiLabel: "Competitive",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [618000, 635000],
    marketTrend: "hot",
    reduced: false,
  },
  {
    id: "3",
    address: "4521 N Ashland Ave",
    city: "Chicago",
    state: "IL",
    zip: "60640",
    price: 359000,
    beds: 2,
    baths: 1,
    sqft: 1200,
    dom: 28,
    agent: "Mike Torres",
    agentName: "Mike Torres",
    agentPhone: "(312) 555-0847",
    agentEmail: "m.torres@remax.com",
    brokerage: "RE/MAX",
    img: "https://picsum.photos/seed/milwaukee/600/400",
    photos: ["https://picsum.photos/seed/milwaukee/800/600"],
    type: "Condo",
    priceHistory: "reduced",
    priceChange: -20000,
    aiScore: 91,
    aiLabel: "Best Deal",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [345000, 360000],
    marketTrend: "cooling",
    reduced: true,
  },
  {
    id: "4",
    address: "3102 W Belmont Ave",
    city: "Chicago",
    state: "IL",
    zip: "60618",
    price: 549000,
    beds: 3,
    baths: 2,
    sqft: 2100,
    dom: 3,
    agent: "Donna Keller",
    agentName: "Donna Keller",
    agentPhone: "(312) 555-0223",
    agentEmail: "d.keller@compass.com",
    brokerage: "Compass",
    img: "https://picsum.photos/seed/hinman/600/400",
    photos: ["https://picsum.photos/seed/hinman/800/600"],
    type: "Single Family",
    priceHistory: "increased",
    priceChange: 10000,
    aiScore: 65,
    aiLabel: "Act Fast",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [545000, 565000],
    marketTrend: "hot",
    reduced: false,
  },
  {
    id: "5",
    address: "7845 S Cottage Grove Ave",
    city: "Chicago",
    state: "IL",
    zip: "60619",
    price: 229000,
    beds: 3,
    baths: 1.5,
    sqft: 1600,
    dom: 45,
    agent: "James Wu",
    agentName: "James Wu",
    agentPhone: "(312) 555-0519",
    agentEmail: "j.wu@atproperties.com",
    brokerage: "@properties",
    img: "https://picsum.photos/seed/magnolia/600/400",
    photos: ["https://picsum.photos/seed/magnolia/800/600"],
    type: "Single Family",
    priceHistory: "reduced",
    priceChange: -25000,
    aiScore: 95,
    aiLabel: "Negotiate!",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [210000, 225000],
    marketTrend: "cooling",
    reduced: true,
  },
  {
    id: "6",
    address: "1234 W Fullerton Ave",
    city: "Chicago",
    state: "IL",
    zip: "60614",
    price: 795000,
    beds: 4,
    baths: 3,
    sqft: 3200,
    dom: 8,
    agent: "Rachel Bloom",
    agentName: "Rachel Bloom",
    agentPhone: "(312) 555-0761",
    agentEmail: "r.bloom@sothebys.com",
    brokerage: "Sotheby's",
    img: "https://picsum.photos/seed/rogerspark/600/400",
    photos: ["https://picsum.photos/seed/rogerspark/800/600"],
    type: "Single Family",
    priceHistory: "same",
    priceChange: 0,
    aiScore: 78,
    aiLabel: "Well-Priced",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [785000, 810000],
    marketTrend: "hot",
    reduced: false,
  },
];

/**
 * Returns all properties. Stub for the future database query in Sprint 3.
 */
export async function getProperties(): Promise<Property[]> {
  return ALL_PROPERTIES;
}

/**
 * Returns a single property by id, or undefined if not found.
 */
export function getPropertyById(id: string): Property | undefined {
  return ALL_PROPERTIES.find((p) => p.id === id);
}
