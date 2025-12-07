import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield, LogOut, MapPin, Bell } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { alerts } = useSensors();
  
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">AirGuard</h1>
              <p className="text-xs text-muted-foreground">Real-Time Monitoring</p>
            </div>
          </div>

          {/* User Info & Actions */}
          {user && (
            <div className="flex items-center gap-4">
              {/* Alert indicator */}
              <div className="relative">
                <Bell className={cn(
                  "w-5 h-5",
                  unacknowledgedAlerts > 0 ? "text-hazardous" : "text-muted-foreground"
                )} />
                {unacknowledgedAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-hazardous text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unacknowledgedAlerts}
                  </span>
                )}
              </div>

              {/* Location */}
              <div className="hidden md:flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground truncate max-w-[200px]">
                  {user.location.address}
                </span>
              </div>

              {/* User info */}
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-secondary/50">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  user.role === 'industry' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                )}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
