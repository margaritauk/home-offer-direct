-- Seed data: 25+ diverse Chicago, IL properties
-- Idempotent: truncate then re-insert on every run.
--
-- img URLs use https://picsum.photos/id/{n}/600/400 (direct, no redirect).
-- The /seed/{name}/ format issued a 302 → fastly.picsum.photos which iOS Safari
-- blocks under strict privacy / cross-site tracking prevention, causing every
-- card to fall back to its gradient placeholder.

BEGIN;

-- WARNING: Re-running truncates properties CASCADE (deletes saved_homes and offers referencing these properties).
-- Must be run as service_role (supabase db seed, or psql with service_role JWT).
TRUNCATE public.properties RESTART IDENTITY CASCADE;

INSERT INTO public.properties
  (id, address, city, state, zip, price, beds, baths, sqft, dom,
   agent_name, agent_email, brokerage, img)
VALUES

-- 1: Lincoln Park – Single Family
(uuid_generate_v4(), '2314 N Orchard St', 'Chicago', 'IL', '60614',
 1195000, 5, 4, 4200, 12,
 'Diane Kowalski', 'diane.kowalski@compass.com', 'Compass',
 'https://picsum.photos/id/10/600/400'),

-- 2: Wicker Park – Townhouse
(uuid_generate_v4(), '1847 W Schiller St', 'Chicago', 'IL', '60622',
 785000, 3, 3, 2400, 5,
 'Marcus Rivera', 'marcus.rivera@atproperties.com', '@properties',
 'https://picsum.photos/id/29/600/400'),

-- 3: Logan Square – Condo
(uuid_generate_v4(), '2540 N Milwaukee Ave #3N', 'Chicago', 'IL', '60647',
 389000, 2, 2, 1150, 22,
 'Sarah Patel', 'sarah.patel@bairdwarner.com', 'Baird & Warner',
 'https://picsum.photos/id/48/600/400'),

-- 4: Hyde Park – Multi-Family
(uuid_generate_v4(), '5412 S Blackstone Ave', 'Chicago', 'IL', '60615',
 620000, 4, 3, 3100, 45,
 'James Okafor', 'james.okafor@remax.com', 'RE/MAX',
 'https://picsum.photos/id/67/600/400'),

-- 5: Andersonville – Single Family
(uuid_generate_v4(), '5701 N Magnolia Ave', 'Chicago', 'IL', '60660',
 875000, 4, 3, 3000, 8,
 'Claire Nguyen', 'claire.nguyen@coldwellbanker.com', 'Coldwell Banker',
 'https://picsum.photos/id/86/600/400'),

-- 6: River North – Condo
(uuid_generate_v4(), '345 N LaSalle Dr #1802', 'Chicago', 'IL', '60654',
 549000, 2, 2, 1320, 31,
 'Tyler Brooks', 'tyler.brooks@sothebys.com', 'Sotheby''s International Realty',
 'https://picsum.photos/id/106/600/400'),

-- 7: Bucktown – Single Family
(uuid_generate_v4(), '2033 N Damen Ave', 'Chicago', 'IL', '60647',
 1020000, 4, 4, 3800, 3,
 'Priya Sharma', 'priya.sharma@atproperties.com', '@properties',
 'https://picsum.photos/id/124/600/400'),

-- 8: Pilsen – Townhouse
(uuid_generate_v4(), '1922 W 18th St', 'Chicago', 'IL', '60608',
 415000, 3, 2, 1800, 60,
 'Carlos Mendez', 'carlos.mendez@kwrealty.com', 'Keller Williams',
 'https://picsum.photos/id/137/600/400'),

-- 9: Gold Coast – Condo
(uuid_generate_v4(), '1212 N Lake Shore Dr #15A', 'Chicago', 'IL', '60610',
 980000, 3, 3, 2200, 18,
 'Amanda Johansson', 'amanda.johansson@compass.com', 'Compass',
 'https://picsum.photos/id/152/600/400'),

-- 10: Bridgeport – Single Family
(uuid_generate_v4(), '3108 S Halsted St', 'Chicago', 'IL', '60608',
 285000, 3, 2, 1600, 75,
 'Donna Fitzgerald', 'donna.fitzgerald@remax.com', 'RE/MAX',
 'https://picsum.photos/id/164/600/400'),

-- 11: Streeterville – Condo
(uuid_generate_v4(), '222 E Pearson St #1104', 'Chicago', 'IL', '60611',
 725000, 2, 2, 1480, 14,
 'Nathan Goldberg', 'nathan.goldberg@sothebys.com', 'Sotheby''s International Realty',
 'https://picsum.photos/id/177/600/400'),

-- 12: Ravenswood – Single Family
(uuid_generate_v4(), '4514 N Paulina St', 'Chicago', 'IL', '60640',
 690000, 4, 3, 2700, 27,
 'Linda Tremblay', 'linda.tremblay@bairdwarner.com', 'Baird & Warner',
 'https://picsum.photos/id/188/600/400'),

-- 13: South Loop – Condo
(uuid_generate_v4(), '1901 S Calumet Ave #805', 'Chicago', 'IL', '60616',
 319000, 1, 1, 780, 38,
 'Ryan McCormick', 'ryan.mccormick@exprealty.com', 'eXp Realty',
 'https://picsum.photos/id/200/600/400'),

-- 14: Ukrainian Village – Townhouse
(uuid_generate_v4(), '2205 W Rice St', 'Chicago', 'IL', '60622',
 560000, 3, 3, 2100, 9,
 'Eva Christensen', 'eva.christensen@atproperties.com', '@properties',
 'https://picsum.photos/id/210/600/400'),

-- 15: Edgewater – Multi-Family
(uuid_generate_v4(), '1047 W Bryn Mawr Ave', 'Chicago', 'IL', '60660',
 475000, 4, 2, 2800, 52,
 'Gregory Walsh', 'gregory.walsh@coldwellbanker.com', 'Coldwell Banker',
 'https://picsum.photos/id/218/600/400'),

-- 16: West Loop – Condo
(uuid_generate_v4(), '1000 W Washington Blvd #410', 'Chicago', 'IL', '60607',
 849000, 2, 2, 1550, 6,
 'Megan Torres', 'megan.torres@compass.com', 'Compass',
 'https://picsum.photos/id/225/600/400'),

-- 17: Beverly – Single Family
(uuid_generate_v4(), '9801 S Longwood Dr', 'Chicago', 'IL', '60643',
 385000, 4, 2, 2400, 41,
 'Frank Sullivan', 'frank.sullivan@kwrealty.com', 'Keller Williams',
 'https://picsum.photos/id/234/600/400'),

-- 18: Evanston (North Shore) – Single Family
(uuid_generate_v4(), '1422 Hinman Ave', 'Evanston', 'IL', '60201',
 1150000, 5, 4, 4500, 17,
 'Heather Kim', 'heather.kim@bairdwarner.com', 'Baird & Warner',
 'https://picsum.photos/id/241/600/400'),

-- 19: Lakeview – Condo
(uuid_generate_v4(), '3450 N Lake Shore Dr #12B', 'Chicago', 'IL', '60657',
 449000, 2, 2, 1200, 20,
 'Jason Lee', 'jason.lee@exprealty.com', 'eXp Realty',
 'https://picsum.photos/id/248/600/400'),

-- 20: Rogers Park – Multi-Family
(uuid_generate_v4(), '7214 N Paulina St', 'Chicago', 'IL', '60626',
 390000, 3, 2, 2200, 63,
 'Anita Robinson', 'anita.robinson@remax.com', 'RE/MAX',
 'https://picsum.photos/id/255/600/400'),

-- 21: Old Town – Townhouse
(uuid_generate_v4(), '230 W Eugenie St', 'Chicago', 'IL', '60614',
 925000, 4, 4, 3200, 11,
 'Victor Petrov', 'victor.petrov@sothebys.com', 'Sotheby''s International Realty',
 'https://picsum.photos/id/261/600/400'),

-- 22: Humboldt Park – Single Family
(uuid_generate_v4(), '3312 W Division St', 'Chicago', 'IL', '60651',
 265000, 3, 1, 1450, 88,
 'Monica Ramirez', 'monica.ramirez@kwrealty.com', 'Keller Williams',
 'https://picsum.photos/id/268/600/400'),

-- 23: Bronzeville – Single Family
(uuid_generate_v4(), '4401 S King Dr', 'Chicago', 'IL', '60653',
 310000, 3, 2, 1700, 55,
 'DeShawn Carter', 'deshawn.carter@coldwellbanker.com', 'Coldwell Banker',
 'https://picsum.photos/id/272/600/400'),

-- 24: Printer''s Row – Condo
(uuid_generate_v4(), '732 S Financial Pl #1203', 'Chicago', 'IL', '60605',
 289000, 1, 1, 700, 33,
 'Rachel Bloom', 'rachel.bloom@atproperties.com', '@properties',
 'https://picsum.photos/id/276/600/400'),

-- 25: Irving Park – Single Family
(uuid_generate_v4(), '4102 N Kedzie Ave', 'Chicago', 'IL', '60618',
 519000, 4, 3, 2500, 24,
 'Tom Harrington', 'tom.harrington@bairdwarner.com', 'Baird & Warner',
 'https://picsum.photos/id/279/600/400'),

-- 26: Near North Side – Condo
(uuid_generate_v4(), '400 W Ontario St #902', 'Chicago', 'IL', '60654',
 465000, 2, 2, 1100, 7,
 'Alison Park', 'alison.park@compass.com', 'Compass',
 'https://picsum.photos/id/282/600/400'),

-- 27: Jefferson Park – Single Family
(uuid_generate_v4(), '4850 N Lavergne Ave', 'Chicago', 'IL', '60630',
 359000, 3, 2, 1900, 16,
 'Bob Wisnewski', 'bob.wisnewski@remax.com', 'RE/MAX',
 'https://picsum.photos/id/287/600/400'),

-- 28: Magnificent Mile – Condo
(uuid_generate_v4(), '110 E Delaware Pl #2801', 'Chicago', 'IL', '60611',
 1180000, 3, 3, 2600, 1,
 'Olivia Bennett', 'olivia.bennett@sothebys.com', 'Sotheby''s International Realty',
 'https://picsum.photos/id/293/600/400'),

-- 29: Pullman – Multi-Family
(uuid_generate_v4(), '11101 S Forrestville Ave', 'Chicago', 'IL', '60628',
 185000, 4, 2, 2100, 90,
 'Kevin Dunn', 'kevin.dunn@exprealty.com', 'eXp Realty',
 'https://picsum.photos/id/299/600/400');

COMMIT;
