export type UserRole = 'industry' | 'user';

export type SeverityLevel = 'safe' | 'moderate' | 'unhealthy' | 'hazardous';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
}

export interface SensorReading {
  id: string;
  sensorId: string;
  timestamp: string;
  pollutants: {
    nh3: number;
    co2: number;
    ch4: number;
    so2: number;
    pm25: number;
  };
  environmental: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
  };
  severity: SeverityLevel;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
}

export interface Alert {
  id: string;
  type: 'sensor' | 'prediction';
  severity: SeverityLevel;
  title: string;
  message: string;
  timestamp: string;
  sensorId?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  acknowledged: boolean;
}

export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface GeoJSONFeature {
  type: 'Feature';
  properties: Record<string, unknown>;
  geometry: GeoJSONPolygon;
}

export interface PredictionData {
  id: string;
  timestamp: string;
  gasType: string;
  spreadDirection: string;
  spreadDistance: number;
  timeFrame: number;
  affectedArea: GeoJSONFeature;
  summary: string;
  severity: SeverityLevel;
}

export interface HistoricalData {
  timestamp: string;
  nh3: number;
  co2: number;
  ch4: number;
  so2: number;
  pm25: number;
  temperature: number;
  humidity: number;
}
