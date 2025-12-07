import React from 'react';
import { useSensors } from '@/context/SensorContext';
import { useAuth } from '@/context/AuthContext';
import { MapComponent } from '@/components/MapComponent';
import { MapPin, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const UserMap: React.FC = () => {
  const { sensorReadings, prediction, isLoading } = useSensors();
  const { user } = useAuth();

  // Check if user is in predicted danger zone
  const userInDanger = prediction && user?.location ? 
    checkPointInPolygon(
      [user.location.longitude, user.location.latitude],
      prediction.affectedArea.geometry.coordinates[0]
    ) : false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
          <MapPin className="w-7 h-7 text-primary" />
          Area Map
        </h1>
        <p className="text-muted-foreground">View sensors and air quality in your area</p>
      </div>

      {/* User Status */}
      {user?.location && (
        <div className={cn(
          'glass-card p-4 border animate-slide-up',
          userInDanger 
            ? 'border-hazardous bg-hazardous/10' 
            : 'border-safe bg-safe/10'
        )}>
          <div className="flex items-center gap-3">
            {userInDanger ? (
              <AlertTriangle className="w-5 h-5 text-hazardous" />
            ) : (
              <Info className="w-5 h-5 text-safe" />
            )}
            <div>
              <p className="font-medium">
                {userInDanger 
                  ? 'Warning: You are in a predicted affected zone' 
                  : 'Your location is currently safe'}
              </p>
              <p className="text-sm text-muted-foreground">
                Location: {user.location.address}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <MapComponent
        sensors={sensorReadings}
        userLocation={user?.location ? {
          latitude: user.location.latitude,
          longitude: user.location.longitude,
          name: user.location.address,
        } : undefined}
        prediction={prediction}
        isLoading={isLoading}
        showUserInDanger={userInDanger}
      />

      {/* Sensor List */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Nearby Sensors</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensorReadings.map((sensor, index) => (
            <div 
              key={sensor.id} 
              className="glass-card p-4 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold">{sensor.sensorId}</p>
                  <p className="text-sm text-muted-foreground">{sensor.location.name}</p>
                </div>
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium capitalize',
                  sensor.severity === 'safe' && 'bg-safe/20 text-safe',
                  sensor.severity === 'moderate' && 'bg-moderate/20 text-moderate',
                  sensor.severity === 'unhealthy' && 'bg-unhealthy/20 text-unhealthy',
                  sensor.severity === 'hazardous' && 'bg-hazardous/20 text-hazardous',
                )}>
                  {sensor.severity}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">PM2.5:</span>
                  <span className="ml-2 font-mono">{sensor.pollutants.pm25.toFixed(1)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">CO₂:</span>
                  <span className="ml-2 font-mono">{sensor.pollutants.co2.toFixed(0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
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

export default UserMap;
