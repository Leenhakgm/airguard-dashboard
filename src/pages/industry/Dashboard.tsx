import React from 'react';
import { useSensors } from '@/context/SensorContext';
import { useAuth } from '@/context/AuthContext';
import { SensorGrid } from '@/components/SensorGrid';
import { MapComponent } from '@/components/MapComponent';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, Activity } from 'lucide-react';

const IndustryDashboard: React.FC = () => {
  const { sensorReadings, prediction, isLoading, refreshSensors } = useSensors();
  const { user } = useAuth();

  const lastUpdate = sensorReadings[0]?.timestamp 
    ? new Date(sensorReadings[0].timestamp).toLocaleTimeString()
    : 'N/A';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Industry Dashboard</h1>
          <p className="text-muted-foreground">Real-time air quality monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Last update: {lastUpdate}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshSensors}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">System Status</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-safe/10">
            <p className="text-2xl font-bold text-safe">
              {sensorReadings.filter(s => s.severity === 'safe').length}
            </p>
            <p className="text-xs text-muted-foreground">Safe Sensors</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-moderate/10">
            <p className="text-2xl font-bold text-moderate">
              {sensorReadings.filter(s => s.severity === 'moderate').length}
            </p>
            <p className="text-xs text-muted-foreground">Moderate</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-unhealthy/10">
            <p className="text-2xl font-bold text-unhealthy">
              {sensorReadings.filter(s => s.severity === 'unhealthy').length}
            </p>
            <p className="text-xs text-muted-foreground">Unhealthy</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-hazardous/10">
            <p className="text-2xl font-bold text-hazardous">
              {sensorReadings.filter(s => s.severity === 'hazardous').length}
            </p>
            <p className="text-xs text-muted-foreground">Hazardous</p>
          </div>
        </div>
      </div>

      {/* Real-time Sensor Readings */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Real-Time Sensor Readings</h2>
        <SensorGrid readings={sensorReadings} isLoading={isLoading} />
      </section>

      {/* Map View */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Live Sensor Map</h2>
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
    </div>
  );
};

export default IndustryDashboard;
