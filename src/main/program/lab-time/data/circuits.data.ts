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
  {
    trackName: 'Circuit de Barcelona-Catalunya',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 41.5694,
        longitude: 2.258,
      },
    ],
  },
  {
    trackName: 'Circuito de Jerez-Ángel Nieto',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 36.7083,
        longitude: -6.0342,
      },
    ],
  },
  {
    trackName: 'Circuit Ricardo Tormo',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 39.4859,
        longitude: -0.6306,
      },
    ],
  },
  {
    trackName: 'MotorLand Aragón',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 41.0789,
        longitude: -0.2033,
      },
    ],
  },
  {
    trackName: 'Circuito del Jarama',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 40.617,
        longitude: -3.5856,
      },
    ],
  },
  {
    trackName: 'Circuito de Navarra',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 42.5606,
        longitude: -2.168,
      },
    ],
  },
  {
    trackName: 'Circuito de Albacete',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 38.9601,
        longitude: -1.7025,
      },
    ],
  },
  {
    trackName: 'Ascari Race Resort',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 36.7081,
        longitude: -5.1045,
      },
    ],
  },
  {
    trackName: 'Circuito de Monteblanco',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 37.3363,
        longitude: -6.5412,
      },
    ],
  },
  {
    trackName: 'Circuito de Guadix',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 37.2992,
        longitude: -3.1395,
      },
    ],
  },
  {
    trackName: 'Circuito de Kotarr',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 42.3545,
        longitude: -3.6435,
      },
    ],
  },
  {
    trackName: 'Circuito de Calafat',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 40.9393,
        longitude: 0.8233,
      },
    ],
  },
  {
    trackName: 'Circuito de Alcarrás',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 41.5662,
        longitude: 0.5243,
      },
    ],
  },
  {
    trackName: 'Parcmotor Castellolí',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 41.5933,
        longitude: 1.7008,
      },
    ],
  },
  {
    trackName: 'Circuit de la Selva',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 41.8606,
        longitude: 2.6733,
      },
    ],
  },
  {
    trackName: 'Can Padró',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 41.5617,
        longitude: 1.8883,
      },
    ],
  },
  {
    trackName: 'Circuito de Almería',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 37.0852,
        longitude: -2.2666,
      },
    ],
  },
  {
    trackName: 'Andalucía Circuit',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 37.0865,
        longitude: -2.264,
      },
    ],
  },
  {
    trackName: 'Circuito de Cartagena',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 37.605,
        longitude: -0.9844,
      },
    ],
  },
  {
    trackName: 'Circuito de Maspalomas',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 27.7606,
        longitude: -15.5783,
      },
    ],
  },
  {
    trackName: 'Circuito de Fuente Álamo',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 37.7233,
        longitude: -1.1817,
      },
    ],
  },
  {
    trackName: 'Circuito de Mallorca',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 39.49,
        longitude: 2.86,
      },
    ],
  },
  {
    trackName: 'Circuito de Jumilla',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 38.4783,
        longitude: -1.3225,
      },
    ],
  },
  {
    trackName: 'Circuito FK1',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 41.3097,
        longitude: -4.7964,
      },
    ],
  },
  {
    trackName: 'Circuito de Torremocha',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 39.3475,
        longitude: -6.1703,
      },
    ],
  },
  {
    trackName: 'Circuito de San Juan',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 38.889,
        longitude: -3.9275,
      },
    ],
  },
  {
    trackName: 'Circuito de Miranda de Ebro',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 42.6869,
        longitude: -2.9503,
      },
    ],
  },
  {
    trackName: 'Circuito de Móra d’Ebre',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 41.0894,
        longitude: 0.6397,
      },
    ],
  },
  {
    trackName: 'Circuito urbano de Montjuïc',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 41.364,
        longitude: 2.1515,
      },
    ],
  },
  {
    trackName: 'Circuito de Pedralbes',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 41.3908,
        longitude: 2.11,
      },
    ],
  },
  {
    trackName: 'Circuito urbano de Valencia',
    country: 'Spain',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 39.4619,
        longitude: -0.3233,
      },
    ],
  },
  {
    trackName: 'Circuit de la Sarthe',
    country: 'France',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 47.949,
        longitude: 0.224,
      },
    ],
  },
  {
    trackName: 'Circuit Paul Ricard',
    country: 'France',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 43.2506,
        longitude: 5.7917,
      },
    ],
  },
  {
    trackName: 'Magny-Cours',
    country: 'France',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 46.8642,
        longitude: 3.1636,
      },
    ],
  },
  {
    trackName: 'Dijon-Prenois',
    country: 'France',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 47.3625,
        longitude: 4.8991,
      },
    ],
  },
  {
    trackName: 'Nogaro',
    country: 'France',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 43.7699,
        longitude: -0.0376,
      },
    ],
  },
  {
    trackName: 'Lédenon',
    country: 'France',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 43.9293,
        longitude: 4.5096,
      },
    ],
  },
  {
    trackName: 'Charade',
    country: 'France',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 45.7472,
        longitude: 3.0397,
      },
    ],
  },
  {
    trackName: 'Pau Arnos',
    country: 'France',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 43.44668,
        longitude: -0.5318,
      },
    ],
  },
  {
    trackName: 'Nürburgring',
    country: 'Germany',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'GP Circuit',
        latitude: 50.3356,
        longitude: 6.9475,
      },
      {
        trackLayout: 'Nordschleife',
        latitude: 50.334,
        longitude: 6.9396,
      },
    ],
  },
  {
    trackName: 'Hockenheimring',
    country: 'Germany',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 49.3278,
        longitude: 8.5656,
      },
    ],
  },
  {
    trackName: 'Sachsenring',
    country: 'Germany',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 50.7917,
        longitude: 12.6883,
      },
    ],
  },
  {
    trackName: 'Lausitzring',
    country: 'Germany',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 51.5344,
        longitude: 13.9286,
      },
    ],
  },
  {
    trackName: 'Bilster Berg',
    country: 'Germany',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 51.7083,
        longitude: 8.7033,
      },
    ],
  },
  {
    trackName: 'Oschersleben',
    country: 'Germany',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 52.0278,
        longitude: 11.2833,
      },
    ],
  },
  {
    trackName: 'Monza',
    country: 'Italy',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 45.6156,
        longitude: 9.2811,
      },
    ],
  },
  {
    trackName: 'Imola',
    country: 'Italy',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 44.3439,
        longitude: 11.7167,
      },
    ],
  },
  {
    trackName: 'Mugello',
    country: 'Italy',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 43.9975,
        longitude: 11.3719,
      },
    ],
  },
  {
    trackName: 'Misano',
    country: 'Italy',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 43.9619,
        longitude: 12.6847,
      },
    ],
  },
  {
    trackName: 'Vallelunga',
    country: 'Italy',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 42.1575,
        longitude: 12.3686,
      },
    ],
  },
  {
    trackName: 'Silverstone',
    country: 'United Kingdom',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 52.0786,
        longitude: -1.0169,
      },
    ],
  },
  {
    trackName: 'Brands Hatch',
    country: 'United Kingdom',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 51.3569,
        longitude: 0.2633,
      },
    ],
  },
  {
    trackName: 'Donington Park',
    country: 'United Kingdom',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 52.8306,
        longitude: -1.375,
      },
    ],
  },
  {
    trackName: 'Oulton Park',
    country: 'United Kingdom',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 53.1783,
        longitude: -2.6172,
      },
    ],
  },
  {
    trackName: 'Cadwell Park',
    country: 'United Kingdom',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 53.3106,
        longitude: -0.0628,
      },
    ],
  },
  {
    trackName: 'Snetterton',
    country: 'United Kingdom',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 52.4639,
        longitude: 0.9467,
      },
    ],
  },
  {
    trackName: 'Thruxton',
    country: 'United Kingdom',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 51.2066,
        longitude: -1.6006,
      },
    ],
  },
  {
    trackName: 'Knockhill',
    country: 'United Kingdom',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 56.1306,
        longitude: -3.5069,
      },
    ],
  },
  {
    trackName: 'Croft',
    country: 'United Kingdom',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 54.4556,
        longitude: -1.5556,
      },
    ],
  },
  {
    trackName: 'Zandvoort',
    country: 'Netherlands',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 52.3888,
        longitude: 4.5409,
      },
    ],
  },
  {
    trackName: 'Assen',
    country: 'Netherlands',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 52.955,
        longitude: 6.5225,
      },
    ],
  },
  {
    trackName: 'Red Bull Ring',
    country: 'Austria',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 47.2197,
        longitude: 14.7647,
      },
    ],
  },
  {
    trackName: 'Hungaroring',
    country: 'Hungary',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 47.5789,
        longitude: 19.2486,
      },
    ],
  },
  {
    trackName: 'Portimão',
    country: 'Portugal',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 37.227,
        longitude: -8.6267,
      },
    ],
  },
  {
    trackName: 'Estoril',
    country: 'Portugal',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 38.7509,
        longitude: -9.3947,
      },
    ],
  },
  {
    trackName: 'Spa-Francorchamps',
    country: 'Belgium',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 50.4372,
        longitude: 5.9714,
      },
    ],
  },
  {
    trackName: 'Zolder',
    country: 'Belgium',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 50.9906,
        longitude: 5.2567,
      },
    ],
  },
  {
    trackName: 'Brno',
    country: 'Czech Republic',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 49.205,
        longitude: 16.4444,
      },
    ],
  },
  {
    trackName: 'Slovakiaring',
    country: 'Slovakia',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 48.0556,
        longitude: 17.5697,
      },
    ],
  },
  {
    trackName: 'Istanbul Park',
    country: 'Turkey',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 40.9517,
        longitude: 29.405,
      },
    ],
  },
  {
    trackName: 'Anderstorp',
    country: 'Sweden',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 57.2642,
        longitude: 13.6039,
      },
    ],
  },
  {
    trackName: 'Mantorp Park',
    country: 'Sweden',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 58.3519,
        longitude: 15.2828,
      },
    ],
  },
  {
    trackName: 'Rudskogen',
    country: 'Norway',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 59.3517,
        longitude: 11.2583,
      },
    ],
  },
  {
    trackName: 'Ahvenisto',
    country: 'Finland',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 60.9803,
        longitude: 24.4425,
      },
    ],
  },
  {
    trackName: 'Jyllandsringen',
    country: 'Denmark',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 56.1328,
        longitude: 9.5378,
      },
    ],
  },
  {
    trackName: 'Laguna Seca',
    country: 'United States',
    continent: 'North America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 36.5843,
        longitude: -121.7534,
      },
    ],
  },
  {
    trackName: 'Sebring',
    country: 'United States',
    continent: 'North America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 27.4556,
        longitude: -81.3483,
      },
    ],
  },
  {
    trackName: 'Daytona',
    country: 'United States',
    continent: 'North America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 29.1852,
        longitude: -81.0705,
      },
    ],
  },
  {
    trackName: 'Indianapolis',
    country: 'United States',
    continent: 'North America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 39.795,
        longitude: -86.2347,
      },
    ],
  },
  {
    trackName: 'COTA',
    country: 'United States',
    continent: 'North America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 30.1328,
        longitude: -97.6411,
      },
    ],
  },
  {
    trackName: 'Road America',
    country: 'United States',
    continent: 'North America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 43.7986,
        longitude: -87.9911,
      },
    ],
  },
  {
    trackName: 'Road Atlanta',
    country: 'United States',
    continent: 'North America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 34.1533,
        longitude: -83.8153,
      },
    ],
  },
  {
    trackName: 'Watkins Glen',
    country: 'United States',
    continent: 'North America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 42.3369,
        longitude: -76.9272,
      },
    ],
  },
  {
    trackName: 'VIR',
    country: 'United States',
    continent: 'North America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 36.5872,
        longitude: -79.2069,
      },
    ],
  },
  {
    trackName: 'Mid-Ohio',
    country: 'United States',
    continent: 'North America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 40.6892,
        longitude: -82.6354,
      },
    ],
  },
  {
    trackName: 'Lime Rock',
    country: 'United States',
    continent: 'North America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 41.9281,
        longitude: -73.3815,
      },
    ],
  },
  {
    trackName: 'Sonoma',
    country: 'United States',
    continent: 'North America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 38.1608,
        longitude: -122.4547,
      },
    ],
  },
  {
    trackName: 'Willow Springs',
    country: 'United States',
    continent: 'North America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 34.8706,
        longitude: -118.2636,
      },
    ],
  },
  {
    trackName: 'Buttonwillow',
    country: 'United States',
    continent: 'North America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 35.4894,
        longitude: -119.5496,
      },
    ],
  },
  {
    trackName: 'Thunderhill',
    country: 'United States',
    continent: 'North America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 39.5397,
        longitude: -122.3319,
      },
    ],
  },
  {
    trackName: 'Gilles Villeneuve',
    country: 'Canada',
    continent: 'North America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 45.5,
        longitude: -73.5228,
      },
    ],
  },
  {
    trackName: 'Mosport',
    country: 'Canada',
    continent: 'North America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 44.0547,
        longitude: -78.6756,
      },
    ],
  },
  {
    trackName: 'Hermanos Rodríguez',
    country: 'Mexico',
    continent: 'North America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 19.4042,
        longitude: -99.0907,
      },
    ],
  },
  {
    trackName: 'Interlagos',
    country: 'Brazil',
    continent: 'South America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: -23.7036,
        longitude: -46.6997,
      },
    ],
  },
  {
    trackName: 'Buenos Aires',
    country: 'Argentina',
    continent: 'South America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: -34.6943,
        longitude: -58.4595,
      },
    ],
  },
  {
    trackName: 'Termas',
    country: 'Argentina',
    continent: 'South America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: -27.4986,
        longitude: -64.8592,
      },
    ],
  },
  {
    trackName: 'Tocancipá',
    country: 'Colombia',
    continent: 'South America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 4.9656,
        longitude: -73.9136,
      },
    ],
  },
  {
    trackName: 'La Guácima',
    country: 'Costa Rica',
    continent: 'North America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 10.0,
        longitude: -84.2667,
      },
    ],
  },
  {
    trackName: 'El Pinar',
    country: 'Uruguay',
    continent: 'South America',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: -34.7889,
        longitude: -55.8744,
      },
    ],
  },
  {
    trackName: 'Suzuka',
    country: 'Japan',
    continent: 'Asia',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 34.8431,
        longitude: 136.541,
      },
    ],
  },
  {
    trackName: 'Fuji',
    country: 'Japan',
    continent: 'Asia',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 35.3717,
        longitude: 138.9272,
      },
    ],
  },
  {
    trackName: 'Motegi',
    country: 'Japan',
    continent: 'Asia',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 36.5333,
        longitude: 140.2269,
      },
    ],
  },
  {
    trackName: 'Autopolis',
    country: 'Japan',
    continent: 'Asia',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 33.2111,
        longitude: 131.0467,
      },
    ],
  },
  {
    trackName: 'Shanghai',
    country: 'China',
    continent: 'Asia',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 31.3389,
        longitude: 121.22,
      },
    ],
  },
  {
    trackName: 'Zhuhai',
    country: 'China',
    continent: 'Asia',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 22.3692,
        longitude: 113.43,
      },
    ],
  },
  {
    trackName: 'Yas Marina',
    country: 'United Arab Emirates',
    continent: 'Asia',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 24.4672,
        longitude: 54.6031,
      },
      {
        trackLayout: 'North Layout',
        latitude: 24.4672,
        longitude: 54.6031,
      },
    ],
  },
  {
    trackName: 'Dubai Autodrome',
    country: 'United Arab Emirates',
    continent: 'Asia',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 25.0472,
        longitude: 55.2389,
      },
    ],
  },
  {
    trackName: 'Losail',
    country: 'Qatar',
    continent: 'Asia',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 25.49,
        longitude: 51.4542,
      },
    ],
  },
  {
    trackName: 'Bahrain Circuit',
    country: 'Bahrain',
    continent: 'Asia',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 26.0325,
        longitude: 50.5106,
      },
    ],
  },
  {
    trackName: 'Buddh',
    country: 'India',
    continent: 'Asia',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 28.3487,
        longitude: 77.5331,
      },
    ],
  },
  {
    trackName: 'Buriram',
    country: 'Thailand',
    continent: 'Asia',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 14.9625,
        longitude: 103.0847,
      },
    ],
  },
  {
    trackName: 'Sepang',
    country: 'Malaysia',
    continent: 'Asia',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 2.7608,
        longitude: 101.7384,
      },
    ],
  },
  {
    trackName: 'Mandalika',
    country: 'Indonesia',
    continent: 'Asia',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: -8.8928,
        longitude: 116.3017,
      },
    ],
  },
  {
    trackName: 'Kuwait Motor Town',
    country: 'Kuwait',
    continent: 'Asia',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 29.3033,
        longitude: 47.9406,
      },
    ],
  },
  {
    trackName: 'Moscow Raceway',
    country: 'Russia',
    continent: 'Europe',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 55.567,
        longitude: 36.9619,
      },
    ],
  },
  {
    trackName: 'Kyalami',
    country: 'South Africa',
    continent: 'Africa',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: -25.9972,
        longitude: 28.0711,
      },
    ],
  },
  {
    trackName: 'Zwartkops',
    country: 'South Africa',
    continent: 'Africa',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: -25.8097,
        longitude: 28.1647,
      },
    ],
  },
  {
    trackName: 'Phakisa',
    country: 'South Africa',
    continent: 'Africa',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: -27.9033,
        longitude: 26.7306,
      },
    ],
  },
  {
    trackName: 'Marrakech',
    country: 'Morocco',
    continent: 'Africa',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: 31.6295,
        longitude: -7.9811,
      },
    ],
  },
  {
    trackName: 'Bathurst',
    country: 'Australia',
    continent: 'Oceania',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: -33.4399,
        longitude: 149.5595,
      },
    ],
  },
  {
    trackName: 'Phillip Island',
    country: 'Australia',
    continent: 'Oceania',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: -38.4973,
        longitude: 145.2333,
      },
    ],
  },
  {
    trackName: 'Sandown',
    country: 'Australia',
    continent: 'Oceania',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: -37.9497,
        longitude: 145.165,
      },
    ],
  },
  {
    trackName: 'The Bend',
    country: 'Australia',
    continent: 'Oceania',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: -35.3081,
        longitude: 139.5161,
      },
    ],
  },
  {
    trackName: 'Hampton Downs',
    country: 'New Zealand',
    continent: 'Oceania',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: -37.3533,
        longitude: 175.0483,
      },
    ],
  },
  {
    trackName: 'Pukekohe',
    country: 'New Zealand',
    continent: 'Oceania',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: -37.2047,
        longitude: 174.9064,
      },
    ],
  },
  {
    trackName: 'Highlands',
    country: 'New Zealand',
    continent: 'Oceania',
    layouts: [
      {
        trackLayout: 'Main Layout',
        latitude: -44.915,
        longitude: 169.1983,
      },
    ],
  },
];