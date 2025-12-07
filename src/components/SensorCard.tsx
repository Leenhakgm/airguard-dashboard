import React from 'react';
import { cn } from '@/lib/utils';
import { SeverityLevel } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Wind, Droplets, Thermometer, Compass } from 'lucide-react';

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  severity: SeverityLevel;
  icon: React.ReactNode;
  isLoading?: boolean;
  gasType?: string;
}

const severityConfig: Record<SeverityLevel, { bg: string; border: string; text: string; dot: string }> = {
  safe: {
    bg: 'bg-safe/10',
    border: 'border-safe/30',
    text: 'text-safe',
    dot: 'bg-safe',
  },
  moderate: {
    bg: 'bg-moderate/10',
    border: 'border-moderate/30',
    text: 'text-moderate',
    dot: 'bg-moderate',
  },
  unhealthy: {
    bg: 'bg-unhealthy/10',
    border: 'border-unhealthy/30',
    text: 'text-unhealthy',
    dot: 'bg-unhealthy',
  },
  hazardous: {
    bg: 'bg-hazardous/10',
    border: 'border-hazardous/30',
    text: 'text-hazardous',
    dot: 'bg-hazardous animate-pulse',
  },
};

export const SensorCard: React.FC<SensorCardProps> = ({
  title,
  value,
  unit,
  severity,
  icon,
  isLoading = false,
  gasType,
}) => {
  const config = severityConfig[severity];

  if (isLoading) {
    return (
      <div className="glass-card p-5 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'glass-card p-5 transition-all duration-300 hover:scale-[1.02] animate-slide-up',
        config.bg,
        config.border,
        'border'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn('p-2 rounded-lg', config.bg, config.text)}>
            {icon}
          </span>
          <span className="data-label">{title}</span>
        </div>
        <div className={cn('w-2 h-2 rounded-full', config.dot)} />
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className={cn('sensor-value', config.text)}>
          {value.toFixed(1)}
        </span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      
      <div className="mt-2 flex items-center gap-2">
        <span className={cn(
          'text-xs px-2 py-0.5 rounded-full capitalize',
          config.bg,
          config.text,
          'border',
          config.border
        )}>
          {severity}
        </span>
      </div>
    </div>
  );
};

interface EnvironmentalCardProps {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  isLoading?: boolean;
}

export const EnvironmentalCard: React.FC<EnvironmentalCardProps> = ({
  temperature,
  humidity,
  windSpeed,
  windDirection,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="glass-card p-5 space-y-4">
        <Skeleton className="h-4 w-32" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  const getWindDirectionLabel = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <div className="glass-card p-5 animate-slide-up">
      <h3 className="data-label mb-4">Environmental Conditions</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-mono font-bold">{temperature.toFixed(1)}°C</p>
            <p className="text-xs text-muted-foreground">Temperature</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-mono font-bold">{humidity.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Humidity</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-mono font-bold">{windSpeed.toFixed(1)} km/h</p>
            <p className="text-xs text-muted-foreground">Wind Speed</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-mono font-bold">{getWindDirectionLabel(windDirection)}</p>
            <p className="text-xs text-muted-foreground">Direction ({windDirection}°)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
