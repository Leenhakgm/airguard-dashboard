import React from 'react';
import { SensorReading, PredictionData, SeverityLevel } from '@/types';
import { cn } from '@/lib/utils';
import { MapPin, Factory, User, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface MapComponentProps {
  sensors: SensorReading[];
  userLocation?: { latitude: number; longitude: number; name?: string };
  industryLocation?: { latitude: number; longitude: number; name?: string };
  prediction?: PredictionData | null;
  isLoading?: boolean;
  showUserInDanger?: boolean;
}

const severityColors: Record<SeverityLevel, string> = {
  safe: 'bg-safe',
  moderate: 'bg-moderate',
  unhealthy: 'bg-unhealthy',
  hazardous: 'bg-hazardous',
};

// Static map visualization (would be replaced with actual map library)
export const MapComponent: React.FC<MapComponentProps> = ({
  sensors,
  userLocation,
  industryLocation,
  prediction,
  isLoading = false,
  showUserInDanger = false,
}) => {
  if (isLoading) {
    return (
      <div className="glass-card p-4 h-[500px]">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
    );
  }

  // Calculate bounds for positioning
  const allLats = [
    ...sensors.map(s => s.location.latitude),
    userLocation?.latitude,
    industryLocation?.latitude,
  ].filter(Boolean) as number[];

  const allLons = [
    ...sensors.map(s => s.location.longitude),
    userLocation?.longitude,
    industryLocation?.longitude,
  ].filter(Boolean) as number[];

  const minLat = Math.min(...allLats);
  const maxLat = Math.max(...allLats);
  const minLon = Math.min(...allLons);
  const maxLon = Math.max(...allLons);

  const normalize = (val: number, min: number, max: number): number => {
    if (max === min) return 50;
    return ((val - min) / (max - min)) * 80 + 10;
  };

  return (
    <div className="glass-card overflow-hidden animate-fade-in">
      <div className="relative h-[500px] bg-gradient-to-br from-secondary/50 to-muted/30 rounded-lg overflow-hidden">
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Prediction polygon visualization */}
        {prediction && (
          <div 
            className={cn(
              'absolute w-48 h-32 rounded-full opacity-30 blur-xl',
              prediction.severity === 'hazardous' ? 'bg-hazardous animate-pulse' : 'bg-unhealthy'
            )}
            style={{
              left: '40%',
              top: '35%',
              transform: 'rotate(-15deg)',
            }}
          />
        )}

        {/* Sensor markers */}
        {sensors.map((sensor, index) => {
          const left = normalize(sensor.location.longitude, minLon, maxLon);
          const top = normalize(sensor.location.latitude, minLat, maxLat);

          return (
            <div
              key={sensor.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 animate-slide-up"
              style={{ 
                left: `${left}%`, 
                top: `${100 - top}%`,
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="group relative">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer',
                    severityColors[sensor.severity],
                    sensor.severity === 'hazardous' && 'animate-pulse'
                  )}
                >
                  <MapPin className="w-4 h-4 text-background" />
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <div className="glass-card px-3 py-2 whitespace-nowrap">
                    <p className="text-xs font-semibold">{sensor.sensorId}</p>
                    <p className="text-xs text-muted-foreground">{sensor.location.name}</p>
                    <p className="text-xs">
                      PM2.5: <span className="font-mono">{sensor.pollutants.pm25.toFixed(1)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Industry marker */}
        {industryLocation && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 animate-slide-up"
            style={{
              left: `${normalize(industryLocation.longitude, minLon, maxLon)}%`,
              top: `${100 - normalize(industryLocation.latitude, minLat, maxLat)}%`,
            }}
          >
            <div className="group relative">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-lg animate-glow">
                <Factory className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="glass-card px-3 py-2 whitespace-nowrap">
                  <p className="text-xs font-semibold">Your Industry</p>
                  <p className="text-xs text-muted-foreground">{industryLocation.name}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User marker */}
        {userLocation && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 animate-slide-up"
            style={{
              left: `${normalize(userLocation.longitude, minLon, maxLon)}%`,
              top: `${100 - normalize(userLocation.latitude, minLat, maxLat)}%`,
            }}
          >
            <div className="group relative">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center shadow-lg',
                showUserInDanger ? 'bg-hazardous animate-alert-pulse' : 'bg-primary animate-glow'
              )}>
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
              {showUserInDanger && (
                <div className="absolute -top-1 -right-1">
                  <AlertTriangle className="w-4 h-4 text-hazardous animate-pulse" />
                </div>
              )}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="glass-card px-3 py-2 whitespace-nowrap">
                  <p className="text-xs font-semibold">Your Location</p>
                  <p className="text-xs text-muted-foreground">{userLocation.name}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 glass-card p-3 space-y-2">
          <p className="text-xs font-semibold mb-2">Air Quality Index</p>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-safe" />
            <span>Safe</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-moderate" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-unhealthy" />
            <span>Unhealthy</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-hazardous" />
            <span>Hazardous</span>
          </div>
        </div>

        {/* Prediction warning */}
        {prediction && (
          <div className="absolute top-4 right-4 glass-card p-3 max-w-xs border border-unhealthy/50 bg-unhealthy/10">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-unhealthy shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-unhealthy">Predicted Spread Zone</p>
                <p className="text-xs text-muted-foreground mt-1">{prediction.summary}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
