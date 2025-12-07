import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SensorReading, Alert, PredictionData, HistoricalData } from '@/types';
import { mockSensorReadings, mockAlerts, mockPrediction, generateHistoricalData } from '@/api/mockData';

interface SensorContextType {
  sensorReadings: SensorReading[];
  alerts: Alert[];
  prediction: PredictionData | null;
  historicalData: HistoricalData[];
  isLoading: boolean;
  refreshSensors: () => void;
  acknowledgeAlert: (alertId: string) => void;
}

const SensorContext = createContext<SensorContextType | undefined>(undefined);

export const SensorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setSensorReadings(mockSensorReadings);
      setAlerts(mockAlerts);
      setPrediction(mockPrediction);
      setHistoricalData(generateHistoricalData());
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    fetchData();
    
    // Simulate real-time updates every 5 seconds
    const interval = setInterval(() => {
      setSensorReadings(prev => prev.map(sensor => ({
        ...sensor,
        pollutants: {
          nh3: sensor.pollutants.nh3 + (Math.random() - 0.5) * 2,
          co2: sensor.pollutants.co2 + (Math.random() - 0.5) * 10,
          ch4: sensor.pollutants.ch4 + (Math.random() - 0.5) * 5,
          so2: sensor.pollutants.so2 + (Math.random() - 0.5) * 1,
          pm25: sensor.pollutants.pm25 + (Math.random() - 0.5) * 5,
        },
        environmental: {
          ...sensor.environmental,
          temperature: sensor.environmental.temperature + (Math.random() - 0.5),
          humidity: Math.min(100, Math.max(0, sensor.environmental.humidity + (Math.random() - 0.5) * 2)),
        },
        timestamp: new Date().toISOString(),
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const refreshSensors = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  }, []);

  return (
    <SensorContext.Provider value={{
      sensorReadings,
      alerts,
      prediction,
      historicalData,
      isLoading,
      refreshSensors,
      acknowledgeAlert,
    }}>
      {children}
    </SensorContext.Provider>
  );
};

export const useSensors = () => {
  const context = useContext(SensorContext);
  if (context === undefined) {
    throw new Error('useSensors must be used within a SensorProvider');
  }
  return context;
};
