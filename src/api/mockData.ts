import { SensorReading, Alert, PredictionData, HistoricalData, SeverityLevel } from '@/types';

const getSeverity = (pm25: number): SeverityLevel => {
  if (pm25 < 35) return 'safe';
  if (pm25 < 75) return 'moderate';
  if (pm25 < 150) return 'unhealthy';
  return 'hazardous';
};

export const mockSensorReadings: SensorReading[] = [
  {
    id: 'sensor-1',
    sensorId: 'SN-001',
    timestamp: new Date().toISOString(),
    pollutants: {
      nh3: 12.5,
      co2: 420,
      ch4: 1.9,
      so2: 8.2,
      pm25: 28,
    },
    environmental: {
      temperature: 28.5,
      humidity: 65,
      windSpeed: 12,
      windDirection: 45,
    },
    severity: 'safe',
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      name: 'Sector 12, Industrial Zone',
    },
  },
  {
    id: 'sensor-2',
    sensorId: 'SN-002',
    timestamp: new Date().toISOString(),
    pollutants: {
      nh3: 45.2,
      co2: 580,
      ch4: 3.2,
      so2: 22.5,
      pm25: 95,
    },
    environmental: {
      temperature: 31.2,
      humidity: 58,
      windSpeed: 8,
      windDirection: 120,
    },
    severity: 'unhealthy',
    location: {
      latitude: 28.6200,
      longitude: 77.2150,
      name: 'Chemical Plant A',
    },
  },
  {
    id: 'sensor-3',
    sensorId: 'SN-003',
    timestamp: new Date().toISOString(),
    pollutants: {
      nh3: 78.9,
      co2: 720,
      ch4: 5.8,
      so2: 45.2,
      pm25: 185,
    },
    environmental: {
      temperature: 33.8,
      humidity: 52,
      windSpeed: 15,
      windDirection: 200,
    },
    severity: 'hazardous',
    location: {
      latitude: 28.6080,
      longitude: 77.2020,
      name: 'Refinery Complex',
    },
  },
  {
    id: 'sensor-4',
    sensorId: 'SN-004',
    timestamp: new Date().toISOString(),
    pollutants: {
      nh3: 25.3,
      co2: 510,
      ch4: 2.4,
      so2: 15.8,
      pm25: 55,
    },
    environmental: {
      temperature: 29.5,
      humidity: 62,
      windSpeed: 10,
      windDirection: 90,
    },
    severity: 'moderate',
    location: {
      latitude: 28.6250,
      longitude: 77.2000,
      name: 'Processing Unit B',
    },
  },
  {
    id: 'sensor-5',
    sensorId: 'SN-005',
    timestamp: new Date().toISOString(),
    pollutants: {
      nh3: 8.2,
      co2: 395,
      ch4: 1.5,
      so2: 5.5,
      pm25: 18,
    },
    environmental: {
      temperature: 27.2,
      humidity: 70,
      windSpeed: 14,
      windDirection: 315,
    },
    severity: 'safe',
    location: {
      latitude: 28.6180,
      longitude: 77.2250,
      name: 'Green Zone Monitoring',
    },
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'sensor',
    severity: 'hazardous',
    title: 'Critical SO₂ Levels Detected',
    message: 'Sensor SN-003 at Refinery Complex has detected SO₂ levels exceeding safety thresholds. Immediate action required.',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    sensorId: 'SN-003',
    location: { latitude: 28.6080, longitude: 77.2020 },
    acknowledged: false,
  },
  {
    id: 'alert-2',
    type: 'prediction',
    severity: 'unhealthy',
    title: 'Gas Spread Warning - East Zone',
    message: 'AI prediction indicates potential gas spread towards eastern residential areas within 45 minutes.',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    location: { latitude: 28.6100, longitude: 77.2100 },
    acknowledged: false,
  },
  {
    id: 'alert-3',
    type: 'sensor',
    severity: 'moderate',
    title: 'Elevated PM2.5 Levels',
    message: 'PM2.5 concentrations at Chemical Plant A are approaching unhealthy levels.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    sensorId: 'SN-002',
    location: { latitude: 28.6200, longitude: 77.2150 },
    acknowledged: true,
  },
  {
    id: 'alert-4',
    type: 'sensor',
    severity: 'safe',
    title: 'Levels Normalized',
    message: 'Air quality at Sector 12 has returned to safe levels.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    sensorId: 'SN-001',
    location: { latitude: 28.6139, longitude: 77.2090 },
    acknowledged: true,
  },
];

export const mockPrediction: PredictionData = {
  id: 'pred-1',
  timestamp: new Date().toISOString(),
  gasType: 'SO₂',
  spreadDirection: 'East-Northeast',
  spreadDistance: 1.2,
  timeFrame: 30,
  affectedArea: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [77.2020, 28.6080],
        [77.2150, 28.6120],
        [77.2200, 28.6050],
        [77.2180, 28.5980],
        [77.2050, 28.6000],
        [77.2020, 28.6080],
      ]],
    },
  },
  summary: 'Based on current wind patterns and emission rates, SO₂ is predicted to spread east-northeast covering approximately 1.2 km within the next 30 minutes. Residential areas in the eastern zone may be affected.',
  severity: 'unhealthy',
};

export const generateHistoricalData = (): HistoricalData[] => {
  const data: HistoricalData[] = [];
  const now = new Date();
  
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      timestamp: timestamp.toISOString(),
      nh3: 15 + Math.random() * 40 + Math.sin(i / 4) * 10,
      co2: 400 + Math.random() * 200 + Math.sin(i / 6) * 50,
      ch4: 1.5 + Math.random() * 3,
      so2: 10 + Math.random() * 30 + Math.sin(i / 3) * 8,
      pm25: 25 + Math.random() * 80 + Math.sin(i / 5) * 20,
      temperature: 25 + Math.random() * 10 + Math.sin(i / 8) * 3,
      humidity: 50 + Math.random() * 30,
    });
  }
  
  return data;
};

// Mock API functions
export const api = {
  login: async (username: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (username && password) {
      return { success: true, token: 'mock-jwt-token' };
    }
    throw new Error('Invalid credentials');
  },

  getSensorsLatest: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSensorReadings;
  },

  getSensorsHistory: async (startDate: string, endDate: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateHistoricalData();
  },

  getAllSensors: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSensorReadings;
  },

  getPrediction: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockPrediction;
  },

  getUserAlerts: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAlerts.filter(a => a.type === 'prediction' || a.severity === 'hazardous');
  },

  getIndustryAlerts: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAlerts;
  },

  geocodeAddress: async (address: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Mock geocoding - returns coordinates near Delhi
    return {
      latitude: 28.6139 + (Math.random() - 0.5) * 0.05,
      longitude: 77.2090 + (Math.random() - 0.5) * 0.05,
    };
  },
};
