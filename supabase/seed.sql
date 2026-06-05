-- Seed data: 25+ diverse Chicago, IL properties
-- Idempotent: truncate then re-insert on every run.

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
 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&auto=format&fit=crop'),

-- 2: Wicker Park – Townhouse
(uuid_generate_v4(), '1847 W Schiller St', 'Chicago', 'IL', '60622',
 785000, 3, 3, 2400, 5,
 'Marcus Rivera', 'marcus.rivera@atproperties.com', '@properties',
 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&auto=format&fit=crop'),

-- 3: Logan Square – Condo
(uuid_generate_v4(), '2540 N Milwaukee Ave #3N', 'Chicago', 'IL', '60647',
 389000, 2, 2, 1150, 22,
 'Sarah Patel', 'sarah.patel@bairdwarner.com', 'Baird & Warner',
 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop'),

-- 4: Hyde Park – Multi-Family
(uuid_generate_v4(), '5412 S Blackstone Ave', 'Chicago', 'IL', '60615',
 620000, 4, 3, 3100, 45,
 'James Okafor', 'james.okafor@remax.com', 'RE/MAX',
 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&auto=format&fit=crop'),

-- 5: Andersonville – Single Family
(uuid_generate_v4(), '5701 N Magnolia Ave', 'Chicago', 'IL', '60660',
 875000, 4, 3, 3000, 8,
 'Claire Nguyen', 'claire.nguyen@coldwellbanker.com', 'Coldwell Banker',
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop'),

-- 6: River North – Condo
(uuid_generate_v4(), '345 N LaSalle Dr #1802', 'Chicago', 'IL', '60654',
 549000, 2, 2, 1320, 31,
 'Tyler Brooks', 'tyler.brooks@sothebys.com', 'Sotheby''s International Realty',
 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&auto=format&fit=crop'),

-- 7: Bucktown – Single Family
(uuid_generate_v4(), '2033 N Damen Ave', 'Chicago', 'IL', '60647',
 1020000, 4, 4, 3800, 3,
 'Priya Sharma', 'priya.sharma@atproperties.com', '@properties',
 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop'),

-- 8: Pilsen – Townhouse
(uuid_generate_v4(), '1922 W 18th St', 'Chicago', 'IL', '60608',
 415000, 3, 2, 1800, 60,
 'Carlos Mendez', 'carlos.mendez@kwrealty.com', 'Keller Williams',
 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&auto=format&fit=crop'),

-- 9: Gold Coast – Condo
(uuid_generate_v4(), '1212 N Lake Shore Dr #15A', 'Chicago', 'IL', '60610',
 980000, 3, 3, 2200, 18,
 'Amanda Johansson', 'amanda.johansson@compass.com', 'Compass',
 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop'),

-- 10: Bridgeport – Single Family
(uuid_generate_v4(), '3108 S Halsted St', 'Chicago', 'IL', '60608',
 285000, 3, 2, 1600, 75,
 'Donna Fitzgerald', 'donna.fitzgerald@remax.com', 'RE/MAX',
 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&auto=format&fit=crop'),

-- 11: Streeterville – Condo
(uuid_generate_v4(), '222 E Pearson St #1104', 'Chicago', 'IL', '60611',
 725000, 2, 2, 1480, 14,
 'Nathan Goldberg', 'nathan.goldberg@sothebys.com', 'Sotheby''s International Realty',
 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&auto=format&fit=crop'),

-- 12: Ravenswood – Single Family
(uuid_generate_v4(), '4514 N Paulina St', 'Chicago', 'IL', '60640',
 690000, 4, 3, 2700, 27,
 'Linda Tremblay', 'linda.tremblay@bairdwarner.com', 'Baird & Warner',
 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop'),

-- 13: South Loop – Condo
(uuid_generate_v4(), '1901 S Calumet Ave #805', 'Chicago', 'IL', '60616',
 319000, 1, 1, 780, 38,
 'Ryan McCormick', 'ryan.mccormick@exprealty.com', 'eXp Realty',
 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop'),

-- 14: Ukrainian Village – Townhouse
(uuid_generate_v4(), '2205 W Rice St', 'Chicago', 'IL', '60622',
 560000, 3, 3, 2100, 9,
 'Eva Christensen', 'eva.christensen@atproperties.com', '@properties',
 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&auto=format&fit=crop'),

-- 15: Edgewater – Multi-Family
(uuid_generate_v4(), '1047 W Bryn Mawr Ave', 'Chicago', 'IL', '60660',
 475000, 4, 2, 2800, 52,
 'Gregory Walsh', 'gregory.walsh@coldwellbanker.com', 'Coldwell Banker',
 'https://images.unsplash.com/photo-1598228723793-83e4e2e0faab?w=600&auto=format&fit=crop'),

-- 16: West Loop – Condo
(uuid_generate_v4(), '1000 W Washington Blvd #410', 'Chicago', 'IL', '60607',
 849000, 2, 2, 1550, 6,
 'Megan Torres', 'megan.torres@compass.com', 'Compass',
 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop'),

-- 17: Beverly – Single Family
(uuid_generate_v4(), '9801 S Longwood Dr', 'Chicago', 'IL', '60643',
 385000, 4, 2, 2400, 41,
 'Frank Sullivan', 'frank.sullivan@kwrealty.com', 'Keller Williams',
 'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?w=600&auto=format&fit=crop'),

-- 18: Evanston (North Shore) – Single Family
(uuid_generate_v4(), '1422 Hinman Ave', 'Evanston', 'IL', '60201',
 1150000, 5, 4, 4500, 17,
 'Heather Kim', 'heather.kim@bairdwarner.com', 'Baird & Warner',
 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop'),

-- 19: Lakeview – Condo
(uuid_generate_v4(), '3450 N Lake Shore Dr #12B', 'Chicago', 'IL', '60657',
 449000, 2, 2, 1200, 20,
 'Jason Lee', 'jason.lee@exprealty.com', 'eXp Realty',
 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop'),

-- 20: Rogers Park – Multi-Family
(uuid_generate_v4(), '7214 N Paulina St', 'Chicago', 'IL', '60626',
 390000, 3, 2, 2200, 63,
 'Anita Robinson', 'anita.robinson@remax.com', 'RE/MAX',
 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop'),

-- 21: Old Town – Townhouse
(uuid_generate_v4(), '230 W Eugenie St', 'Chicago', 'IL', '60614',
 925000, 4, 4, 3200, 11,
 'Victor Petrov', 'victor.petrov@sothebys.com', 'Sotheby''s International Realty',
 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&auto=format&fit=crop'),

-- 22: Humboldt Park – Single Family
(uuid_generate_v4(), '3312 W Division St', 'Chicago', 'IL', '60651',
 265000, 3, 1, 1450, 88,
 'Monica Ramirez', 'monica.ramirez@kwrealty.com', 'Keller Williams',
 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=600&auto=format&fit=crop'),

-- 23: Bronzeville – Single Family
(uuid_generate_v4(), '4401 S King Dr', 'Chicago', 'IL', '60653',
 310000, 3, 2, 1700, 55,
 'DeShawn Carter', 'deshawn.carter@coldwellbanker.com', 'Coldwell Banker',
 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=600&auto=format&fit=crop'),

-- 24: Printer's Row – Condo
(uuid_generate_v4(), '732 S Financial Pl #1203', 'Chicago', 'IL', '60605',
 289000, 1, 1, 700, 33,
 'Rachel Bloom', 'rachel.bloom@atproperties.com', '@properties',
 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&auto=format&fit=crop'),

-- 25: Irving Park – Single Family
(uuid_generate_v4(), '4102 N Kedzie Ave', 'Chicago', 'IL', '60618',
 519000, 4, 3, 2500, 24,
 'Tom Harrington', 'tom.harrington@bairdwarner.com', 'Baird & Warner',
 'https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=600&auto=format&fit=crop'),

-- 26: Near North Side – Condo
(uuid_generate_v4(), '400 W Ontario St #902', 'Chicago', 'IL', '60654',
 465000, 2, 2, 1100, 7,
 'Alison Park', 'alison.park@compass.com', 'Compass',
 'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=600&auto=format&fit=crop'),

-- 27: Jefferson Park – Single Family
(uuid_generate_v4(), '4850 N Lavergne Ave', 'Chicago', 'IL', '60630',
 359000, 3, 2, 1900, 16,
 'Bob Wisnewski', 'bob.wisnewski@remax.com', 'RE/MAX',
 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop'),

-- 28: Magnificent Mile – Condo
(uuid_generate_v4(), '110 E Delaware Pl #2801', 'Chicago', 'IL', '60611',
 1180000, 3, 3, 2600, 1,
 'Olivia Bennett', 'olivia.bennett@sothebys.com', 'Sotheby''s International Realty',
 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=600&auto=format&fit=crop'),

-- 29: Pullman – Multi-Family
(uuid_generate_v4(), '11101 S Forrestville Ave', 'Chicago', 'IL', '60628',
 185000, 4, 2, 2100, 90,
 'Kevin Dunn', 'kevin.dunn@exprealty.com', 'eXp Realty',
 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=600&auto=format&fit=crop');

COMMIT;
