import React, { useState, useEffect } from 'react';
import { useSensors } from '@/context/SensorContext';
import { useAuth } from '@/context/AuthContext';
import { SensorGrid } from '@/components/SensorGrid';
import { Button } from '@/components/ui/button';
import { AlertBanner } from '@/components/AlertPopup';
import { RefreshCw, Clock, Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const UserDashboard: React.FC = () => {
  const { sensorReadings, prediction, alerts, isLoading, refreshSensors } = useSensors();
  const { user } = useAuth();
  const [showDangerAlert, setShowDangerAlert] = useState(false);

  // Check if user is in predicted danger zone
  const userInDanger = prediction && user?.location ? 
    checkPointInPolygon(
      [user.location.longitude, user.location.latitude],
      prediction.affectedArea.geometry.coordinates[0]
    ) : false;

  useEffect(() => {
    if (userInDanger) {
      setShowDangerAlert(true);
    }
  }, [userInDanger]);

  const lastUpdate = sensorReadings[0]?.timestamp 
    ? new Date(sensorReadings[0].timestamp).toLocaleTimeString()
    : 'N/A';

  // Get relevant alerts for user
  const userAlerts = alerts.filter(a => 
    a.severity === 'hazardous' || a.type === 'prediction'
  );
  const criticalAlert = userAlerts.find(a => !a.acknowledged && a.severity === 'hazardous');

  // Get overall air quality status
  const getOverallStatus = () => {
    const hazardous = sensorReadings.filter(s => s.severity === 'hazardous').length;
    const unhealthy = sensorReadings.filter(s => s.severity === 'unhealthy').length;
    
    if (hazardous > 0 || userInDanger) return { status: 'hazardous', label: 'Hazardous', message: 'Stay indoors and avoid exposure' };
    if (unhealthy > 0) return { status: 'unhealthy', label: 'Unhealthy', message: 'Sensitive groups should limit outdoor activity' };
    if (sensorReadings.some(s => s.severity === 'moderate')) return { status: 'moderate', label: 'Moderate', message: 'Air quality is acceptable' };
    return { status: 'safe', label: 'Good', message: 'Air quality is good for all activities' };
  };

  const overallStatus = getOverallStatus();

  const statusColors = {
    safe: 'bg-safe/10 border-safe text-safe',
    moderate: 'bg-moderate/10 border-moderate text-moderate',
    unhealthy: 'bg-unhealthy/10 border-unhealthy text-unhealthy',
    hazardous: 'bg-hazardous/10 border-hazardous text-hazardous',
  };

  return (
    <div className="space-y-6">
      {/* Danger Zone Alert */}
      {userInDanger && showDangerAlert && (
        <div className="fixed top-16 left-0 right-0 z-40 animate-slide-up">
          <div className="bg-hazardous/95 text-hazardous-foreground p-4 animate-alert-pulse">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6" />
                <div>
                  <p className="font-bold">You are in a predicted danger zone!</p>
                  <p className="text-sm opacity-90">Take immediate precautions and stay indoors.</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDangerAlert(false)}
                className="border-hazardous-foreground text-hazardous-foreground hover:bg-hazardous-foreground/10"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Dashboard</h1>
          <p className="text-muted-foreground">Air quality monitoring for your area</p>
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

      {/* Overall Status Card */}
      <div className={cn(
        'glass-card p-6 border-2 animate-slide-up',
        statusColors[overallStatus.status as keyof typeof statusColors],
        overallStatus.status === 'hazardous' && 'animate-alert-pulse'
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            'p-4 rounded-xl',
            overallStatus.status === 'hazardous' ? 'bg-hazardous/20' : 'bg-current/10'
          )}>
            <Shield className="w-10 h-10" />
          </div>
          <div>
            <p className="text-sm font-medium opacity-70">Current Air Quality</p>
            <h2 className="text-3xl font-bold">{overallStatus.label}</h2>
            <p className="text-sm opacity-80 mt-1">{overallStatus.message}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold">{sensorReadings.length}</p>
          <p className="text-xs text-muted-foreground">Active Sensors</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-safe">
            {sensorReadings.filter(s => s.severity === 'safe').length}
          </p>
          <p className="text-xs text-muted-foreground">Safe Zones</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-hazardous">
            {userAlerts.filter(a => !a.acknowledged).length}
          </p>
          <p className="text-xs text-muted-foreground">Active Alerts</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className={cn(
            "text-2xl font-bold",
            userInDanger ? "text-hazardous" : "text-safe"
          )}>
            {userInDanger ? 'At Risk' : 'Safe'}
          </p>
          <p className="text-xs text-muted-foreground">Your Status</p>
        </div>
      </div>

      {/* Real-time Sensor Readings */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Real-Time Air Quality</h2>
        <SensorGrid readings={sensorReadings} isLoading={isLoading} />
      </section>
    </div>
  );
};

// Helper function to check if point is inside polygon
function checkPointInPolygon(point: [number, number], polygon: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    
    const intersect = ((yi > point[1]) !== (yj > point[1])) &&
      (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export default UserDashboard;
