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

// Unsplash CDN — specific photo IDs chosen for house/real-estate content
function u(photoId: string, w = 600, h = 400) {
  return `https://images.unsplash.com/photo-${photoId}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
}

// Curated exterior + interior shots for each listing (3 photos each)
// Exteriors
const EXT = [
  "1568605114967-8130f3a36994", // classic brick house
  "1570129477492-45c003edd2be", // craftsman bungalow
  "1580587771525-78b9dba3b914", // modern white house
  "1564013799919-ab600027ffc6", // two-story colonial
  "1512917774080-9991f1c4c750", // house at dusk
  "1558618666-fcd25c85cd64",    // Chicago brownstone row
  "1523217582562-09d0def993a6", // charming cottage
  "1600596542815-ffad4c1539a9", // luxury home
  "1600210492493-0946911123ea", // suburban house
  "1576941089067-2de3c901e126", // brick bungalow
  "1605276374104-dee2a0ed3cd6", // urban row house
  "1460317442991-0ec209397118", // mid-rise condo exterior
  "1486325212027-8081e485255e", // cape cod style
  "1554995207-c18c203602cb",    // lake house
  "1502672260266-1c1ef2d93688", // corner lot house
];
// Interiors (kitchen / living / bath / bedroom)
const INT = [
  "1560185007-c5ca9d2c014d", // modern kitchen
  "1616594039964-ae9021a400a0", // bright living room
  "1584622650111-993a426fbf0a", // white kitchen
  "1560440021-33f9b867899d", // spa bathroom
  "1505843513577-22bb7d21e455", // master bedroom
  "1555041469-a586c61ea9bc",    // open living room
  "1556909114-f6e7ad7d3136",    // eat-in kitchen
  "1484154218962-a197022b5858", // kitchen island
  "1528323273322-0eb845b98895", // cozy dining room
  "1616046229478-9901369b8e17", // modern bathroom
];

function photos(extIdx: number, intIdx1: number, intIdx2: number, w = 800, h = 600): string[] {
  return [u(EXT[extIdx], w, h), u(INT[intIdx1], w, h), u(INT[intIdx2], w, h)];
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
    img: u(EXT[0]),
    photos: photos(0, 0, 1),
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
    img: u(EXT[5]),
    photos: photos(5, 2, 5),
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
    img: u(EXT[11]),
    photos: photos(11, 3, 9),
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
    img: u(EXT[9]),
    photos: photos(9, 6, 0),
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
    img: u(EXT[1]),
    photos: photos(1, 7, 4),
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
    img: u(EXT[7]),
    photos: photos(7, 1, 5),
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
  {
    id: "7",
    address: "2156 N Damen Ave",
    city: "Chicago",
    state: "IL",
    zip: "60647",
    price: 699000,
    beds: 3,
    baths: 2.5,
    sqft: 2050,
    dom: 6,
    agent: "Tom Nguyen",
    agentName: "Tom Nguyen",
    agentPhone: "(312) 555-0384",
    agentEmail: "t.nguyen@compass.com",
    brokerage: "Compass",
    img: u(EXT[10]),
    photos: photos(10, 2, 8),
    type: "Townhouse",
    priceHistory: "same",
    priceChange: 0,
    aiScore: 76,
    aiLabel: "Well-Priced",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [688000, 712000],
    marketTrend: "hot",
    reduced: false,
  },
  {
    id: "8",
    address: "540 N Lake Shore Dr, Unit 2104",
    city: "Chicago",
    state: "IL",
    zip: "60611",
    price: 1150000,
    beds: 2,
    baths: 2,
    sqft: 1550,
    dom: 21,
    agent: "Patricia Novak",
    agentName: "Patricia Novak",
    agentPhone: "(312) 555-0903",
    agentEmail: "p.novak@jll.com",
    brokerage: "JLL Residential",
    img: u(EXT[2]),
    photos: photos(2, 5, 9),
    type: "Condo",
    priceHistory: "reduced",
    priceChange: -50000,
    aiScore: 82,
    aiLabel: "Great Value",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [1100000, 1160000],
    marketTrend: "neutral",
    reduced: true,
  },
  {
    id: "9",
    address: "1703 W Byron St",
    city: "Chicago",
    state: "IL",
    zip: "60613",
    price: 415000,
    beds: 2,
    baths: 2,
    sqft: 1400,
    dom: 18,
    agent: "Carlos Reyes",
    agentName: "Carlos Reyes",
    agentPhone: "(312) 555-0628",
    agentEmail: "c.reyes@bairdwarner.com",
    brokerage: "Baird & Warner",
    img: u(EXT[6]),
    photos: photos(6, 3, 6),
    type: "Condo",
    priceHistory: "same",
    priceChange: 0,
    aiScore: 84,
    aiLabel: "Great Value",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [405000, 422000],
    marketTrend: "neutral",
    reduced: false,
  },
  {
    id: "10",
    address: "6312 N Glenwood Ave",
    city: "Chicago",
    state: "IL",
    zip: "60660",
    price: 520000,
    beds: 4,
    baths: 2,
    sqft: 2300,
    dom: 33,
    agent: "Amy Chen",
    agentName: "Amy Chen",
    agentPhone: "(773) 555-0114",
    agentEmail: "a.chen@coldwellbanker.com",
    brokerage: "Coldwell Banker",
    img: u(EXT[13]),
    photos: photos(13, 7, 2),
    type: "Multi-Family",
    priceHistory: "reduced",
    priceChange: -15000,
    aiScore: 89,
    aiLabel: "Best Deal",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [505000, 525000],
    marketTrend: "cooling",
    reduced: true,
  },
  {
    id: "11",
    address: "819 W Oakdale Ave",
    city: "Chicago",
    state: "IL",
    zip: "60657",
    price: 875000,
    beds: 5,
    baths: 3.5,
    sqft: 3800,
    dom: 4,
    agent: "Scott Harmon",
    agentName: "Scott Harmon",
    agentPhone: "(312) 555-0277",
    agentEmail: "s.harmon@atproperties.com",
    brokerage: "@properties",
    img: u(EXT[3]),
    photos: photos(3, 0, 8),
    type: "Single Family",
    priceHistory: "same",
    priceChange: 0,
    aiScore: 70,
    aiLabel: "Competitive",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [865000, 895000],
    marketTrend: "hot",
    reduced: false,
  },
  {
    id: "12",
    address: "448 W Dickens Ave",
    city: "Chicago",
    state: "IL",
    zip: "60614",
    price: 339000,
    beds: 1,
    baths: 1,
    sqft: 900,
    dom: 14,
    agent: "Nina Patel",
    agentName: "Nina Patel",
    agentPhone: "(312) 555-0461",
    agentEmail: "n.patel@redfin.com",
    brokerage: "Redfin",
    img: u(EXT[12]),
    photos: photos(12, 4, 1),
    type: "Condo",
    priceHistory: "same",
    priceChange: 0,
    aiScore: 80,
    aiLabel: "Well-Priced",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [330000, 345000],
    marketTrend: "neutral",
    reduced: false,
  },
  {
    id: "13",
    address: "2901 W Diversey Ave",
    city: "Chicago",
    state: "IL",
    zip: "60647",
    price: 469000,
    beds: 3,
    baths: 2,
    sqft: 1750,
    dom: 9,
    agent: "Kevin Walsh",
    agentName: "Kevin Walsh",
    agentPhone: "(773) 555-0852",
    agentEmail: "k.walsh@koenig-rubloff.com",
    brokerage: "Berkshire Hathaway HS",
    img: u(EXT[8]),
    photos: photos(8, 6, 3),
    type: "Single Family",
    priceHistory: "reduced",
    priceChange: -10000,
    aiScore: 86,
    aiLabel: "Great Value",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [460000, 480000],
    marketTrend: "neutral",
    reduced: true,
  },
  {
    id: "14",
    address: "5527 S Woodlawn Ave",
    city: "Chicago",
    state: "IL",
    zip: "60637",
    price: 289000,
    beds: 3,
    baths: 2,
    sqft: 1900,
    dom: 52,
    agent: "Diana Moore",
    agentName: "Diana Moore",
    agentPhone: "(773) 555-0338",
    agentEmail: "d.moore@remax.com",
    brokerage: "RE/MAX",
    img: u(EXT[14]),
    photos: photos(14, 8, 4),
    type: "Single Family",
    priceHistory: "reduced",
    priceChange: -35000,
    aiScore: 93,
    aiLabel: "Negotiate!",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [265000, 285000],
    marketTrend: "cooling",
    reduced: true,
  },
  {
    id: "15",
    address: "350 W Hubbard St, Unit 606",
    city: "Chicago",
    state: "IL",
    zip: "60654",
    price: 575000,
    beds: 2,
    baths: 2,
    sqft: 1300,
    dom: 16,
    agent: "Marcus Bell",
    agentName: "Marcus Bell",
    agentPhone: "(312) 555-0995",
    agentEmail: "m.bell@compass.com",
    brokerage: "Compass",
    img: u(EXT[4]),
    photos: photos(4, 1, 9),
    type: "Condo",
    priceHistory: "same",
    priceChange: 0,
    aiScore: 75,
    aiLabel: "Well-Priced",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [565000, 588000],
    marketTrend: "neutral",
    reduced: false,
  },
];

/**
 * Returns all properties. Stub for the future database query.
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
