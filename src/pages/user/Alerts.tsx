import React from 'react';
import { useSensors } from '@/context/SensorContext';
import { useAuth } from '@/context/AuthContext';
import { AlertList } from '@/components/AlertList';
import { Bell, Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const UserAlerts: React.FC = () => {
  const { alerts, prediction, acknowledgeAlert, isLoading } = useSensors();
  const { user } = useAuth();

  // Check if user is in predicted danger zone
  const userInDanger = prediction && user?.location ? 
    checkPointInPolygon(
      [user.location.longitude, user.location.latitude],
      prediction.affectedArea.geometry.coordinates[0]
    ) : false;

  // Filter alerts relevant to user (high severity or if user is in danger zone)
  const userAlerts = alerts.filter(a => 
    a.severity === 'hazardous' || 
    a.type === 'prediction' ||
    (userInDanger && a.severity === 'unhealthy')
  );

  const unacknowledgedCount = userAlerts.filter(a => !a.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Bell className="w-7 h-7 text-primary" />
            My Alerts
          </h1>
          <p className="text-muted-foreground">
            Personal alerts based on your location
          </p>
        </div>
      </div>

      {/* User Status Card */}
      <div className={cn(
        'glass-card p-6 border-2 animate-slide-up',
        userInDanger
          ? 'border-hazardous bg-hazardous/10'
          : 'border-safe bg-safe/10'
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            'p-4 rounded-xl',
            userInDanger ? 'bg-hazardous/20' : 'bg-safe/20'
          )}>
            {userInDanger ? (
              <AlertTriangle className="w-10 h-10 text-hazardous" />
            ) : (
              <Shield className="w-10 h-10 text-safe" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium opacity-70">Your Safety Status</p>
            <h2 className={cn(
              'text-2xl font-bold',
              userInDanger ? 'text-hazardous' : 'text-safe'
            )}>
              {userInDanger ? 'At Risk - Take Precautions' : 'You Are Safe'}
            </h2>
            <p className="text-sm opacity-80 mt-1">
              {userInDanger 
                ? 'Your location is within a predicted gas spread zone. Stay indoors and follow safety guidelines.'
                : 'No immediate threats detected in your area. Continue normal activities.'}
            </p>
          </div>
        </div>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold">{userAlerts.length}</p>
          <p className="text-sm text-muted-foreground">Total Alerts</p>
        </div>
        <div className="glass-card p-4 text-center border border-hazardous/30 bg-hazardous/5">
          <p className="text-3xl font-bold text-hazardous">{unacknowledgedCount}</p>
          <p className="text-sm text-muted-foreground">Unread</p>
        </div>
        <div className="glass-card p-4 text-center border border-safe/30 bg-safe/5">
          <p className="text-3xl font-bold text-safe">
            {userAlerts.filter(a => a.acknowledged).length}
          </p>
          <p className="text-sm text-muted-foreground">Acknowledged</p>
        </div>
      </div>

      {/* Alert List */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Recent Alerts</h2>
        <AlertList
          alerts={userAlerts}
          onAcknowledge={acknowledgeAlert}
          isLoading={isLoading}
        />
      </section>

      {/* Safety Tips */}
      {userInDanger && (
        <section className="glass-card p-6 border border-unhealthy/30 bg-unhealthy/5 animate-slide-up">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-unhealthy" />
            Safety Guidelines
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-unhealthy mt-2" />
              Stay indoors and keep windows closed
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-unhealthy mt-2" />
              Use air purifiers if available
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-unhealthy mt-2" />
              Avoid strenuous outdoor activities
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-unhealthy mt-2" />
              Keep emergency contacts handy
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-unhealthy mt-2" />
              Monitor official updates and follow evacuation orders if issued
            </li>
          </ul>
        </section>
      )}
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

export default UserAlerts;
