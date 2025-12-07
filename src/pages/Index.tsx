import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Shield, ArrowRight, Factory, User, Activity, Brain, Bell, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'industry' ? '/industry/dashboard' : '/user/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const features = [
    {
      icon: Activity,
      title: 'Real-Time Monitoring',
      description: 'Track NH₃, CO₂, CH₄, SO₂, and PM2.5 levels with live sensor data.',
    },
    {
      icon: Brain,
      title: 'AI Prediction',
      description: 'Advanced AI models predict gas spread patterns and affected areas.',
    },
    {
      icon: Bell,
      title: 'Instant Alerts',
      description: 'Get immediate notifications when air quality becomes hazardous.',
    },
    {
      icon: Map,
      title: 'Interactive Maps',
      description: 'Visualize sensor locations and predicted spread zones.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold">AirGuard</span>
            </div>
            <Button onClick={() => navigate('/login')}>
              Login
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Real-Time Air Quality Monitoring</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-up">
            Protect Your Community with
            <span className="text-primary block mt-2">AI-Powered Gas Monitoring</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
            AirGuard provides real-time harmful gas detection, AI-powered spread prediction, 
            and instant alerts to keep industries and communities safe.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Button size="lg" onClick={() => navigate('/login')} className="text-lg px-8">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="relative z-10 py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Portal</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8 text-center hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => navigate('/login')}>
              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 mb-6">
                <Factory className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Industry Portal</h3>
              <p className="text-muted-foreground mb-6">
                Complete monitoring dashboard with sensor management, historical data analysis, 
                AI predictions, and comprehensive alert management.
              </p>
              <ul className="text-left space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Real-time sensor readings
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Historical data & trends
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  AI spread prediction
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Alert center
                </li>
              </ul>
            </div>

            <div className="glass-card p-8 text-center hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => navigate('/login')}>
              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-accent/10 mb-6">
                <User className="w-12 h-12 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">User Portal</h3>
              <p className="text-muted-foreground mb-6">
                Stay informed about air quality in your area with location-based monitoring, 
                personalized alerts, and safety recommendations.
              </p>
              <ul className="text-left space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Location-based monitoring
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Interactive area map
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Personal safety alerts
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Danger zone warnings
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-4">Powerful Features</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Advanced technology to monitor, predict, and protect against harmful gas emissions.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="glass-card p-6 text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold">AirGuard</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Real-Time Harmful Gas Monitoring & AI Prediction System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
