import React from 'react';
import { useSensors } from '@/context/SensorContext';
import { useAuth } from '@/context/AuthContext';
import { MapComponent } from '@/components/MapComponent';
import { Brain, Wind, Clock, MapPin, AlertTriangle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const Prediction: React.FC = () => {
  const { sensorReadings, prediction, isLoading } = useSensors();
  const { user } = useAuth();

  const severityColors = {
    safe: 'text-safe border-safe bg-safe/10',
    moderate: 'text-moderate border-moderate bg-moderate/10',
    unhealthy: 'text-unhealthy border-unhealthy bg-unhealthy/10',
    hazardous: 'text-hazardous border-hazardous bg-hazardous/10',
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Brain className="w-7 h-7 text-primary" />
            AI Prediction
          </h1>
          <p className="text-muted-foreground">Gas spread prediction and analysis</p>
        </div>
      </div>

      {prediction ? (
        <>
          {/* Prediction Summary Card */}
          <div className={cn(
            'glass-card p-6 border-2 animate-slide-up',
            severityColors[prediction.severity]
          )}>
            <div className="flex items-start gap-4">
              <div className={cn(
                'p-3 rounded-xl',
                prediction.severity === 'hazardous' ? 'bg-hazardous/20 animate-pulse' : 'bg-unhealthy/20'
              )}>
                <AlertTriangle className={cn(
                  'w-8 h-8',
                  prediction.severity === 'hazardous' ? 'text-hazardous' : 'text-unhealthy'
                )} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Gas Spread Alert</h2>
                <p className="text-muted-foreground">{prediction.summary}</p>
              </div>
            </div>
          </div>

          {/* Prediction Details */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <span className="data-label">Gas Type</span>
              </div>
              <p className="text-2xl font-bold">{prediction.gasType}</p>
            </div>

            <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Wind className="w-5 h-5 text-primary" />
                </div>
                <span className="data-label">Spread Direction</span>
              </div>
              <p className="text-2xl font-bold">{prediction.spreadDirection}</p>
            </div>

            <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <span className="data-label">Spread Distance</span>
              </div>
              <p className="text-2xl font-bold">{prediction.spreadDistance} km</p>
            </div>

            <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <span className="data-label">Time Frame</span>
              </div>
              <p className="text-2xl font-bold">{prediction.timeFrame} min</p>
            </div>
          </div>

          {/* Prediction Map */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Predicted Spread Area</h2>
            <MapComponent
              sensors={sensorReadings}
              industryLocation={user?.location ? {
                latitude: user.location.latitude,
                longitude: user.location.longitude,
                name: user.location.address,
              } : undefined}
              prediction={prediction}
              isLoading={isLoading}
            />
          </section>

          {/* Technical Details */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Prediction Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Prediction Timestamp</h4>
                <p className="font-mono">{new Date(prediction.timestamp).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Severity Level</h4>
                <span className={cn(
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize border',
                  severityColors[prediction.severity]
                )}>
                  {prediction.severity}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-card p-12 text-center">
          <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Active Predictions</h2>
          <p className="text-muted-foreground">
            The AI system is monitoring sensor data. Predictions will appear when anomalies are detected.
          </p>
        </div>
      )}
    </div>
  );
};

export default Prediction;
