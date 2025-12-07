import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocationInput } from '@/components/LocationInput';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { Shield, Factory, User, Loader2, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState<{ address: string; latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Please select a login type');
      return;
    }

    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    if (!location) {
      setError('Please enter and verify your location');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(username, password, selectedRole, location);
      
      if (success) {
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${username}!`,
        });
        
        navigate(selectedRole === 'industry' ? '/industry/dashboard' : '/user/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 mb-4">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AirGuard</h1>
          <p className="text-muted-foreground mt-2">
            Real-Time Harmful Gas Monitoring & AI Prediction
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-6 animate-slide-up">
          {/* Role Selection */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Select Login Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('industry')}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2',
                  selectedRole === 'industry'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 hover:bg-primary/5'
                )}
              >
                <Factory className="w-8 h-8" />
                <span className="font-medium">Industry</span>
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedRole('user')}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2',
                  selectedRole === 'user'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 hover:bg-primary/5'
                )}
              >
                <User className="w-8 h-8" />
                <span className="font-medium">User</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Location Input */}
            <LocationInput onLocationSet={setLocation} />

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={isLoading || !selectedRole || !location}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-3 rounded-lg bg-muted/50 text-center">
            <p className="text-xs text-muted-foreground">
              Demo: Enter any username/password and set a location to login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
