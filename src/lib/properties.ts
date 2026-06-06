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
  // MLS listing status
  status?: "Active" | "Pending" | "Sold" | "Withdrawn";
}

function u(photoId: string, w = 600, h = 400) {
  return `https://images.unsplash.com/photo-${photoId}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
}

// Verified exterior house photo IDs from Unsplash
const EXT: Record<string, string> = {
  brickLawn:    "_jh0Rx42TzQ", // modern brick house, green lawn
  rowHouses:    "ItiOAk9yv6Y", // row of houses (townhouse feel)
  whiteOrange:  "NcVOI8QOyFA", // white house with orange roof
  brownBrick:   "z11gbBo13ro", // brown and white concrete house
  modestHouse:  "esx_MLBNOEI", // smaller suburban houses (value listing)
  woodStone:    "hPu2n_SfV7Q", // modern house, wood and stone
  twinWhite:    "ntJvpk36rbA", // two white houses side by side
  modernGarage: "3qRx6B4cT6g", // modern garage doors on white house
  largePorch:   "8lLy5VR5l1w", // white house with large front porch
  grayFence:    "j3l5s6TrEi8", // gray house with fence and gravel
  modernGreen:  "KqrbNYj7QJQ", // modern house nestled in lush greenery
  hedgesGate:   "4b25Ic2VjiQ", // modern house with manicured hedges
  greenRoof:    "Rb3HbkNNoLQ", // house with green roof and white pillars
  patioDusk:    "b7CZPHVtNoc", // modern house with patio
  porchPlants:  "OKkX8fv8w6I", // white house with porch and green plants
};

// Verified interior photo IDs from Unsplash
const INT: Record<string, string> = {
  kitchenWood:    "XU_ODlSO9ac", // modern kitchen, wooden cabinets and island
  kitchenLiving:  "Hnec2oEbbxk", // open kitchen + living, natural wood
  kitchenWhite:   "-aDGbdTsBZg", // white and brown kitchen cabinet
  kitchenMarble:  "JyeUdbb9TOg", // large kitchen, marble countertops
  kitchenSteel:   "htmZWzApbJE", // modern kitchen, stainless steel
  kitchenIsland:  "YFzqRFFyauw", // kitchen with island
  kitchenBeige:   "lIVK3z606og", // brown and beige kitchen interior
  kitchenMinimal: "Fgo8WHmi5T0", // minimalist modern kitchen
  livingWhite:    "9M66C_w_ToM", // white and brown living room set
  livingOpen:     "XyGvEj587Mc", // interior of a living room
  livingAerial:   "e5zPqLcPg2k", // aerial view of living + dining room
  livingCouch:    "w1w7sQ8md0I", // interior living room of house
  bedroom1:       "sjMSp5YVf7s", // a bed in a room
  bedroom2:       "CY26oG9TcFs", // bed next to doorway
  bedroom3:       "b_GtasP517U", // photography of bedroom
};

function p(ext: string, int1: string, int2: string): string[] {
  return [u(EXT[ext], 800, 600), u(INT[int1], 800, 600), u(INT[int2], 800, 600)];
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
    img: u(EXT.brickLawn),
    photos: p("brickLawn", "kitchenWood", "livingWhite"),
    type: "Single Family",
    priceHistory: "reduced",
    priceChange: -15000,
    aiScore: 87,
    aiLabel: "Great Value",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [475000, 492000],
    marketTrend: "hot",
    reduced: true,
    status: "Active",
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
    img: u(EXT.rowHouses),
    photos: p("rowHouses", "kitchenLiving", "livingOpen"),
    type: "Townhouse",
    priceHistory: "same",
    priceChange: 0,
    aiScore: 72,
    aiLabel: "Competitive",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [618000, 635000],
    marketTrend: "hot",
    reduced: false,
    status: "Active",
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
    img: u(EXT.whiteOrange),
    photos: p("whiteOrange", "kitchenBeige", "bedroom1"),
    type: "Condo",
    priceHistory: "reduced",
    priceChange: -20000,
    aiScore: 91,
    aiLabel: "Best Deal",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [345000, 360000],
    marketTrend: "cooling",
    reduced: true,
    status: "Active",
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
    img: u(EXT.brownBrick),
    photos: p("brownBrick", "kitchenMarble", "livingCouch"),
    type: "Single Family",
    priceHistory: "increased",
    priceChange: 10000,
    aiScore: 65,
    aiLabel: "Act Fast",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [545000, 565000],
    marketTrend: "hot",
    reduced: false,
    status: "Active",
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
    img: u(EXT.modestHouse),
    photos: p("modestHouse", "kitchenWhite", "bedroom2"),
    type: "Single Family",
    priceHistory: "reduced",
    priceChange: -25000,
    aiScore: 95,
    aiLabel: "Negotiate!",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [210000, 225000],
    marketTrend: "cooling",
    reduced: true,
    status: "Pending",
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
    img: u(EXT.woodStone),
    photos: p("woodStone", "kitchenSteel", "livingAerial"),
    type: "Single Family",
    priceHistory: "same",
    priceChange: 0,
    aiScore: 78,
    aiLabel: "Well-Priced",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [785000, 810000],
    marketTrend: "hot",
    reduced: false,
    status: "Active",
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
    img: u(EXT.twinWhite),
    photos: p("twinWhite", "kitchenIsland", "livingAerial"),
    type: "Townhouse",
    priceHistory: "same",
    priceChange: 0,
    aiScore: 76,
    aiLabel: "Well-Priced",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [688000, 712000],
    marketTrend: "hot",
    reduced: false,
    status: "Active",
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
    img: u(EXT.modernGarage),
    photos: p("modernGarage", "kitchenMarble", "livingWhite"),
    type: "Condo",
    priceHistory: "reduced",
    priceChange: -50000,
    aiScore: 82,
    aiLabel: "Great Value",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [1100000, 1160000],
    marketTrend: "neutral",
    reduced: true,
    status: "Active",
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
    img: u(EXT.largePorch),
    photos: p("largePorch", "kitchenMinimal", "bedroom3"),
    type: "Condo",
    priceHistory: "same",
    priceChange: 0,
    aiScore: 84,
    aiLabel: "Great Value",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [405000, 422000],
    marketTrend: "neutral",
    reduced: false,
    status: "Active",
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
    img: u(EXT.grayFence),
    photos: p("grayFence", "kitchenWood", "livingCouch"),
    type: "Multi-Family",
    priceHistory: "reduced",
    priceChange: -15000,
    aiScore: 89,
    aiLabel: "Best Deal",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [505000, 525000],
    marketTrend: "cooling",
    reduced: true,
    status: "Active",
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
    img: u(EXT.modernGreen),
    photos: p("modernGreen", "kitchenSteel", "livingOpen"),
    type: "Single Family",
    priceHistory: "same",
    priceChange: 0,
    aiScore: 70,
    aiLabel: "Competitive",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [865000, 895000],
    marketTrend: "hot",
    reduced: false,
    status: "Active",
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
    img: u(EXT.hedgesGate),
    photos: p("hedgesGate", "kitchenBeige", "bedroom1"),
    type: "Condo",
    priceHistory: "same",
    priceChange: 0,
    aiScore: 80,
    aiLabel: "Well-Priced",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [330000, 345000],
    marketTrend: "neutral",
    reduced: false,
    status: "Active",
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
    img: u(EXT.greenRoof),
    photos: p("greenRoof", "kitchenLiving", "bedroom2"),
    type: "Single Family",
    priceHistory: "reduced",
    priceChange: -10000,
    aiScore: 86,
    aiLabel: "Great Value",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [460000, 480000],
    marketTrend: "neutral",
    reduced: true,
    status: "Active",
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
    img: u(EXT.patioDusk),
    photos: p("patioDusk", "kitchenWhite", "bedroom3"),
    type: "Single Family",
    priceHistory: "reduced",
    priceChange: -35000,
    aiScore: 93,
    aiLabel: "Negotiate!",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [265000, 285000],
    marketTrend: "cooling",
    reduced: true,
    status: "Sold",
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
    img: u(EXT.porchPlants),
    photos: p("porchPlants", "kitchenIsland", "livingOpen"),
    type: "Condo",
    priceHistory: "same",
    priceChange: 0,
    aiScore: 75,
    aiLabel: "Well-Priced",
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [565000, 588000],
    marketTrend: "neutral",
    reduced: false,
    status: "Active",
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
