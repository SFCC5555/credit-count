-- Seed catalogue: 45 real coasters across 12 countries, 13 manufacturers,
-- 3 types, so stats (by country/manufacturer/type) and the leaderboard
-- have meaningful data to demo. Plain INSERTs — safe to run once against
-- an empty catalogue only.

insert into public.coasters (name, park, country, manufacturer, type) values

-- ── United States – Steel ───────────────────────────────────────────────────
('Millennium Force',   'Cedar Point',                'United States', 'Intamin',           'Steel'),
('Maverick',           'Cedar Point',                'United States', 'Intamin',           'Steel'),
('Top Thrill 2',       'Cedar Point',                'United States', 'Zamperla',          'Steel'),
('Fury 325',           'Carowinds',                  'United States', 'B&M',               'Steel'),
('Intimidator 305',    'Kings Dominion',             'United States', 'Intamin',           'Steel'),
('Orion',              'Kings Island',               'United States', 'B&M',               'Steel'),
('Candymonium',        'Hersheypark',                'United States', 'B&M',               'Steel'),
('Skyrush',            'Hersheypark',                'United States', 'Intamin',           'Steel'),
('Kingda Ka',          'Six Flags Great Adventure',  'United States', 'Intamin',           'Steel'),
('Tatsu',              'Six Flags Magic Mountain',   'United States', 'B&M',               'Steel'),
('X2',                 'Six Flags Magic Mountain',   'United States', 'Arrow Dynamics',    'Steel'),
('Full Throttle',      'Six Flags Magic Mountain',   'United States', 'Premier Rides',     'Steel'),

-- ── United States – Wooden ──────────────────────────────────────────────────
('El Toro',            'Six Flags Great Adventure',  'United States', 'Intamin',           'Wooden'),
('Voyage',             'Holiday World',              'United States', 'The Gravity Group', 'Wooden'),
('Phoenix',            'Knoebels Amusement Resort',  'United States', 'Prior & Church',    'Wooden'),
('Boulder Dash',       'Lake Compounce',             'United States', 'CCI',               'Wooden'),
('Mystic Timbers',     'Kings Island',               'United States', 'GCI',               'Wooden'),
('Lightning Rod',      'Dollywood',                  'United States', 'RMC',               'Wooden'),

-- ── United States – Hybrid ──────────────────────────────────────────────────
('Steel Vengeance',    'Cedar Point',                'United States', 'RMC',               'Hybrid'),
('Goliath',            'Six Flags Great America',    'United States', 'RMC',               'Hybrid'),
('Twisted Timbers',    'Kings Dominion',             'United States', 'RMC',               'Hybrid'),

-- ── Canada ──────────────────────────────────────────────────────────────────
('Leviathan',          'Canada''s Wonderland',       'Canada',        'B&M',               'Steel'),
('Behemoth',           'Canada''s Wonderland',       'Canada',        'B&M',               'Steel'),

-- ── United Kingdom ──────────────────────────────────────────────────────────
('Nemesis',            'Alton Towers',               'United Kingdom', 'B&M',              'Steel'),
('Oblivion',           'Alton Towers',               'United Kingdom', 'B&M',              'Steel'),
('The Smiler',         'Alton Towers',               'United Kingdom', 'Gerstlauer',       'Steel'),
('Wicker Man',         'Alton Towers',               'United Kingdom', 'GCI',              'Wooden'),
('Stealth',            'Thorpe Park',                'United Kingdom', 'Intamin',          'Steel'),
('Icon',               'Blackpool Pleasure Beach',   'United Kingdom', 'Mack Rides',       'Steel'),
('The Big One',        'Blackpool Pleasure Beach',   'United Kingdom', 'Arrow Dynamics',   'Steel'),

-- ── Germany ─────────────────────────────────────────────────────────────────
('Expedition GeForce', 'Holiday Park',               'Germany',       'Intamin',           'Steel'),
('Taron',              'Phantasialand',              'Germany',       'Intamin',           'Steel'),
('Black Mamba',        'Phantasialand',              'Germany',       'B&M',               'Steel'),

-- ── Sweden ──────────────────────────────────────────────────────────────────
('Helix',              'Liseberg',                   'Sweden',        'Mack Rides',        'Steel'),
('Wildfire',           'Kolmården Wildlife Park',    'Sweden',        'RMC',               'Hybrid'),

-- ── Netherlands ─────────────────────────────────────────────────────────────
('Untamed',            'Walibi Holland',             'Netherlands',   'RMC',               'Hybrid'),
('Troy',               'Toverland',                  'Netherlands',   'GCI',               'Wooden'),

-- ── Poland ──────────────────────────────────────────────────────────────────
('Hyperion',           'Energylandia',               'Poland',        'Intamin',           'Steel'),
('Zadra',              'Energylandia',               'Poland',        'RMC',               'Hybrid'),

-- ── Spain ───────────────────────────────────────────────────────────────────
('Shambhala',          'PortAventura World',         'Spain',         'B&M',               'Steel'),

-- ── France ──────────────────────────────────────────────────────────────────
('Toutatis',           'Parc Astérix',               'France',        'Intamin',           'Steel'),

-- ── Belgium ─────────────────────────────────────────────────────────────────
('Kondaa',             'Walibi Belgium',             'Belgium',       'Intamin',           'Steel'),

-- ── Japan ───────────────────────────────────────────────────────────────────
('Hakugei',            'Nagashima Spa Land',         'Japan',         'RMC',               'Hybrid'),
('Eejanaika',          'Fuji-Q Highland',            'Japan',         'S&S Worldwide',     'Steel'),

-- ── United Arab Emirates ────────────────────────────────────────────────────
('Formula Rossa',      'Ferrari World Abu Dhabi',    'United Arab Emirates', 'Intamin',   'Steel');
