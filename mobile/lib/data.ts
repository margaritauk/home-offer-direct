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
  type: string;
  dom: number;
  priceChange: number;
  photo: string;
  aiScore: number;
  aiLabel: string;
  suggestedOffer: [number, number];
  marketTrend: 'hot' | 'cooling' | 'neutral';
  listingAgent: string;
  agentPhone: string;
  agentEmail: string;
  brokerage: string;
}

export const PROPERTIES: Property[] = [
  {
    id: '1', address: '2847 N Clark St', city: 'Chicago', state: 'IL', zip: '60657',
    price: 485000, beds: 3, baths: 2, sqft: 1850, type: 'Single Family', dom: 12,
    priceChange: -15000,
    photo: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    aiScore: 87, aiLabel: 'Great Value', suggestedOffer: [475000, 492000],
    marketTrend: 'hot', listingAgent: 'Sarah Johnson', brokerage: 'Coldwell Banker',
    agentPhone: '3125550192', agentEmail: 'sarah.johnson@coldwellbanker.com',
  },
  {
    id: '2', address: '1520 W Wrightwood Ave', city: 'Chicago', state: 'IL', zip: '60614',
    price: 625000, beds: 4, baths: 2.5, sqft: 2400, type: 'Townhouse', dom: 5,
    priceChange: 0,
    photo: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
    aiScore: 72, aiLabel: 'Competitive', suggestedOffer: [618000, 635000],
    marketTrend: 'hot', listingAgent: 'Michael Chen', brokerage: 'Redfin',
    agentPhone: '3125550341', agentEmail: 'michael.chen@redfin.com',
  },
  {
    id: '3', address: '4521 N Ashland Ave', city: 'Chicago', state: 'IL', zip: '60640',
    price: 359000, beds: 2, baths: 1, sqft: 1200, type: 'Condo', dom: 28,
    priceChange: -20000,
    photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    aiScore: 91, aiLabel: 'Best Deal', suggestedOffer: [345000, 360000],
    marketTrend: 'cooling', listingAgent: 'Amanda Rodriguez', brokerage: 'Compass',
    agentPhone: '3125550847', agentEmail: 'a.rodriguez@compass.com',
  },
  {
    id: '4', address: '3102 W Belmont Ave', city: 'Chicago', state: 'IL', zip: '60618',
    price: 549000, beds: 3, baths: 2, sqft: 2100, type: 'Single Family', dom: 3,
    priceChange: 10000,
    photo: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
    aiScore: 65, aiLabel: 'Act Fast', suggestedOffer: [545000, 565000],
    marketTrend: 'hot', listingAgent: 'Thomas Burke', brokerage: 'Baird & Warner',
    agentPhone: '3125550223', agentEmail: 't.burke@bairdwarner.com',
  },
  {
    id: '5', address: '7845 S Cottage Grove Ave', city: 'Chicago', state: 'IL', zip: '60619',
    price: 229000, beds: 3, baths: 1.5, sqft: 1600, type: 'Single Family', dom: 45,
    priceChange: -25000,
    photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    aiScore: 95, aiLabel: 'Negotiate!', suggestedOffer: [210000, 225000],
    marketTrend: 'cooling', listingAgent: 'Patricia Williams', brokerage: 'Century 21',
    agentPhone: '3125550519', agentEmail: 'p.williams@century21.com',
  },
  {
    id: '6', address: '1234 W Fullerton Ave', city: 'Chicago', state: 'IL', zip: '60614',
    price: 795000, beds: 4, baths: 3, sqft: 3200, type: 'Single Family', dom: 8,
    priceChange: 0,
    photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    aiScore: 78, aiLabel: 'Well-Priced', suggestedOffer: [785000, 810000],
    marketTrend: 'hot', listingAgent: 'Jennifer Davis', brokerage: "Jameson Sotheby's",
    agentPhone: '3125550761', agentEmail: 'j.davis@sothebys.com',
  },
];

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(n);
}

export function formatCurrencyShort(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}
