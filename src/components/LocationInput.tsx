import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2, Search, CheckCircle } from 'lucide-react';
import { api } from '@/api/mockData';
import { cn } from '@/lib/utils';

interface LocationInputProps {
  onLocationSet: (location: { address: string; latitude: number; longitude: number }) => void;
}

export const LocationInput: React.FC<LocationInputProps> = ({ onLocationSet }) => {
  const [address, setAddress] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodedLocation, setGeocodedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState('');

  const handleGeocode = async () => {
    if (!address.trim()) {
      setError('Please enter an address');
      return;
    }

    setIsGeocoding(true);
    setError('');

    try {
      const coords = await api.geocodeAddress(address);
      setGeocodedLocation(coords);
      onLocationSet({
        address,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    } catch (err) {
      setError('Failed to geocode address. Please try again.');
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address" className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Location Address
        </Label>
        <div className="relative">
          <Input
            id="address"
            placeholder="Enter address, area, district, or landmark..."
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setGeocodedLocation(null);
            }}
            className={cn(
              "pr-24",
              geocodedLocation && "border-safe/50 focus:ring-safe"
            )}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleGeocode}
            disabled={isGeocoding || !address.trim()}
            className="absolute right-1 top-1 h-8"
          >
            {isGeocoding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : geocodedLocation ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>

      {geocodedLocation && (
        <div className="glass-card p-3 border border-safe/30 bg-safe/5 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-safe" />
            <span className="text-sm font-medium text-safe">Location Found</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Latitude:</span>
              <span className="ml-2 font-mono">{geocodedLocation.latitude.toFixed(6)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Longitude:</span>
              <span className="ml-2 font-mono">{geocodedLocation.longitude.toFixed(6)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
