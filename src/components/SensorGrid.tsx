import React from 'react';
import { SensorCard, EnvironmentalCard } from './SensorCard';
import { SensorReading, SeverityLevel } from '@/types';
import { Cloud, Flame, Wind, Droplets, CircleDot } from 'lucide-react';

interface SensorGridProps {
  readings: SensorReading[];
  isLoading?: boolean;
}

const getGasSeverity = (value: number, gas: string): SeverityLevel => {
  const thresholds: Record<string, number[]> = {
    nh3: [25, 50, 100],
    co2: [500, 700, 1000],
    ch4: [2.5, 4, 6],
    so2: [15, 35, 75],
    pm25: [35, 75, 150],
  };

  const [moderate, unhealthy, hazardous] = thresholds[gas] || [50, 100, 200];
  
  if (value < moderate) return 'safe';
  if (value < unhealthy) return 'moderate';
  if (value < hazardous) return 'unhealthy';
  return 'hazardous';
};

export const SensorGrid: React.FC<SensorGridProps> = ({ readings, isLoading = false }) => {
  // Aggregate readings or use the first one for display
  const primaryReading = readings[0];

  const gasIcons: Record<string, React.ReactNode> = {
    nh3: <Cloud className="w-5 h-5" />,
    co2: <Flame className="w-5 h-5" />,
    ch4: <Wind className="w-5 h-5" />,
    so2: <Droplets className="w-5 h-5" />,
    pm25: <CircleDot className="w-5 h-5" />,
  };

  const gasUnits: Record<string, string> = {
    nh3: 'ppm',
    co2: 'ppm',
    ch4: 'ppm',
    so2: 'ppb',
    pm25: 'µg/m³',
  };

  const gasLabels: Record<string, string> = {
    nh3: 'NH₃ (Ammonia)',
    co2: 'CO₂ (Carbon Dioxide)',
    ch4: 'CH₄ (Methane)',
    so2: 'SO₂ (Sulfur Dioxide)',
    pm25: 'PM2.5',
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <SensorCard
              key={i}
              title=""
              value={0}
              unit=""
              severity="safe"
              icon={null}
              isLoading
            />
          ))}
        </div>
        <EnvironmentalCard
          temperature={0}
          humidity={0}
          windSpeed={0}
          windDirection={0}
          isLoading
        />
      </div>
    );
  }

  if (!primaryReading) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-muted-foreground">No sensor data available</p>
      </div>
    );
  }

  const pollutants = Object.entries(primaryReading.pollutants);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {pollutants.map(([gas, value], index) => (
          <div 
            key={gas} 
            style={{ animationDelay: `${index * 100}ms` }}
            className="animate-slide-up"
          >
            <SensorCard
              title={gasLabels[gas]}
              value={value}
              unit={gasUnits[gas]}
              severity={getGasSeverity(value, gas)}
              icon={gasIcons[gas]}
              gasType={gas}
            />
          </div>
        ))}
      </div>
      
      <EnvironmentalCard
        temperature={primaryReading.environmental.temperature}
        humidity={primaryReading.environmental.humidity}
        windSpeed={primaryReading.environmental.windSpeed}
        windDirection={primaryReading.environmental.windDirection}
      />
    </div>
  );
};
