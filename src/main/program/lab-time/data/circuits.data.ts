export interface CircuitLayoutData {
  trackLayout: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface CircuitData {
  trackName: string;
  country: string;
  continent: string;
  layouts: CircuitLayoutData[];
}

export const CIRCUITS_DATA: CircuitData[] = [
  // ================= SPAIN =================
  {
    trackName: 'Circuit de Barcelona-Catalunya',
    country: 'Spain',
    continent: 'Europe',
    layouts: [{ trackLayout: 'Main Layout', latitude: 41.5694, longitude: 2.258 }],
  },
  {
    trackName: 'Circuito de Jerez-Ángel Nieto',
    country: 'Spain',
    continent: 'Europe',
    layouts: [{ trackLayout: 'Main Layout', latitude: 36.7083, longitude: -6.0342 }],
  },
  {
    trackName: 'Circuit Ricardo Tormo',
    country: 'Spain',
    continent: 'Europe',
    layouts: [{ trackLayout: 'Main Layout', latitude: 39.4859, longitude: -0.6306 }],
  },
  {
    trackName: 'MotorLand Aragón',
    country: 'Spain',
    continent: 'Europe',
    layouts: [{ trackLayout: 'Main Layout', latitude: 41.0789, longitude: -0.2033 }],
  },
  {
    trackName: 'Circuito del Jarama',
    country: 'Spain',
    continent: 'Europe',
    layouts: [{ trackLayout: 'Main Layout', latitude: 40.617, longitude: -3.5856 }],
  },
  {
    trackName: 'Circuito de Navarra',
    country: 'Spain',
    continent: 'Europe',
    layouts: [{ trackLayout: 'Main Layout', latitude: 42.5606, longitude: -2.168 }],
  },
  {
    trackName: 'Circuito de Albacete',
    country: 'Spain',
    continent: 'Europe',
    layouts: [{ trackLayout: 'Main Layout', latitude: 38.9601, longitude: -1.7025 }],
  },
  {
    trackName: 'Ascari Race Resort',
    country: 'Spain',
    continent: 'Europe',
    layouts: [{ trackLayout: 'Main Layout', latitude: 36.7081, longitude: -5.1045 }],
  },
  {
    trackName: 'Circuito de Monteblanco',
    country: 'Spain',
    continent: 'Europe',
    layouts: [{ trackLayout: 'Main Layout', latitude: 37.3363, longitude: -6.5412 }],
  },
  {
    trackName: 'Circuito de Guadix',
    country: 'Spain',
    continent: 'Europe',
    layouts: [{ trackLayout: 'Main Layout', latitude: 37.2992, longitude: -3.1395 }],
  },

  // ================= FRANCE =================
  {
    trackName: 'Circuit de la Sarthe',
    country: 'France',
    continent: 'Europe',
    layouts: [{ trackLayout: 'Main Layout', latitude: 47.949, longitude: 0.224 }],
  },
  {
    trackName: 'Circuit Paul Ricard',
    country: 'France',
    continent: 'Europe',
    layouts: [{ trackLayout: 'Main Layout', latitude: 43.2506, longitude: 5.7917 }],
  },

  // ================= GERMANY =================
  {
    trackName: 'Nürburgring',
    country: 'Germany',
    continent: 'Europe',
    layouts: [
      { trackLayout: 'Nordschleife', latitude: 50.3356, longitude: 6.9475 },
      { trackLayout: 'GP Circuit', latitude: 50.3356, longitude: 6.9475 },
    ],
  },
  {
    trackName: 'Hockenheimring',
    country: 'Germany',
    continent: 'Europe',
    layouts: [{ trackLayout: 'Main Layout', latitude: 49.3278, longitude: 8.5656 }],
  },

  // ================= ITALY =================
  {
    trackName: 'Autodromo Nazionale Monza',
    country: 'Italy',
    continent: 'Europe',
    layouts: [{ trackLayout: 'GP Layout', latitude: 45.6156, longitude: 9.2811 }],
  },
  {
    trackName: 'Autodromo Enzo e Dino Ferrari',
    country: 'Italy',
    continent: 'Europe',
    layouts: [{ trackLayout: 'GP Layout', latitude: 44.3439, longitude: 11.7167 }],
  },

  // ================= UK =================
  {
    trackName: 'Silverstone Circuit',
    country: 'United Kingdom',
    continent: 'Europe',
    layouts: [{ trackLayout: 'GP Layout', latitude: 52.0786, longitude: -1.0169 }],
  },
  {
    trackName: 'Brands Hatch',
    country: 'United Kingdom',
    continent: 'Europe',
    layouts: [{ trackLayout: 'Main Layout', latitude: 51.3569, longitude: 0.2633 }],
  },

  // ================= BELGIUM =================
  {
    trackName: 'Circuit de Spa-Francorchamps',
    country: 'Belgium',
    continent: 'Europe',
    layouts: [{ trackLayout: 'GP Layout', latitude: 50.4372, longitude: 5.9714 }],
  },

  // ================= USA =================
  {
    trackName: 'Laguna Seca Raceway',
    country: 'United States',
    continent: 'America',
    layouts: [{ trackLayout: 'Main Layout', latitude: 36.5843, longitude: -121.7534 }],
  },
  {
    trackName: 'Daytona International Speedway',
    country: 'United States',
    continent: 'America',
    layouts: [
      { trackLayout: 'Road Course', latitude: 29.1852, longitude: -81.0705 },
      { trackLayout: 'Oval', latitude: 29.1852, longitude: -81.0705 },
    ],
  },
  {
    trackName: 'Circuit of the Americas',
    country: 'United States',
    continent: 'America',
    layouts: [{ trackLayout: 'GP Layout', latitude: 30.1328, longitude: -97.6411 }],
  },

  // ================= CANADA =================
  {
    trackName: 'Circuit Gilles Villeneuve',
    country: 'Canada',
    continent: 'America',
    layouts: [{ trackLayout: 'GP Layout', latitude: 45.5, longitude: -73.5228 }],
  },

  // ================= BRAZIL =================
  {
    trackName: 'Autódromo José Carlos Pace',
    country: 'Brazil',
    continent: 'America',
    layouts: [{ trackLayout: 'GP Layout', latitude: -23.7036, longitude: -46.6997 }],
  },

  // ================= JAPAN =================
  {
    trackName: 'Suzuka Circuit',
    country: 'Japan',
    continent: 'Asia',
    layouts: [{ trackLayout: 'Full Circuit', latitude: 34.8431, longitude: 136.541 }],
  },
  {
    trackName: 'Fuji Speedway',
    country: 'Japan',
    continent: 'Asia',
    layouts: [{ trackLayout: 'Full Circuit', latitude: 35.3717, longitude: 138.9272 }],
  },

  // ================= UAE =================
  {
    trackName: 'Yas Marina Circuit',
    country: 'United Arab Emirates',
    continent: 'Middle East',
    layouts: [{ trackLayout: 'GP Layout', latitude: 24.4672, longitude: 54.6031 }],
  },

  // ================= QATAR =================
  {
    trackName: 'Losail International Circuit',
    country: 'Qatar',
    continent: 'Middle East',
    layouts: [{ trackLayout: 'Main Layout', latitude: 25.49, longitude: 51.4542 }],
  },

  // ================= BAHRAIN =================
  {
    trackName: 'Bahrain International Circuit',
    country: 'Bahrain',
    continent: 'Middle East',
    layouts: [{ trackLayout: 'GP Layout', latitude: 26.0325, longitude: 50.5106 }],
  },

  // ================= INDIA =================
  {
    trackName: 'Buddh International Circuit',
    country: 'India',
    continent: 'Asia',
    layouts: [{ trackLayout: 'Main Layout', latitude: 28.3487, longitude: 77.5331 }],
  },

  // ================= MALAYSIA =================
  {
    trackName: 'Sepang International Circuit',
    country: 'Malaysia',
    continent: 'Asia',
    layouts: [{ trackLayout: 'Main Layout', latitude: 2.7608, longitude: 101.7384 }],
  },

  // ================= AUSTRALIA =================
  {
    trackName: 'Mount Panorama Circuit',
    country: 'Australia',
    continent: 'Oceania',
    layouts: [{ trackLayout: 'Bathurst', latitude: -33.4399, longitude: 149.5595 }],
  },
];