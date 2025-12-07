import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SensorProvider } from "@/context/SensorContext";
import { RoleProtectedRoute } from "@/components/RoleProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Industry Pages
import IndustryDashboard from "./pages/industry/Dashboard";
import IndustryHistory from "./pages/industry/History";
import IndustryPrediction from "./pages/industry/Prediction";
import IndustryAlerts from "./pages/industry/Alerts";

// User Pages
import UserDashboard from "./pages/user/Dashboard";
import UserMap from "./pages/user/Map";
import UserAlerts from "./pages/user/Alerts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SensorProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />

              {/* Industry Routes */}
              <Route
                element={
                  <RoleProtectedRoute allowedRoles={['industry']}>
                    <DashboardLayout />
                  </RoleProtectedRoute>
                }
              >
                <Route path="/industry/dashboard" element={<IndustryDashboard />} />
                <Route path="/industry/history" element={<IndustryHistory />} />
                <Route path="/industry/prediction" element={<IndustryPrediction />} />
                <Route path="/industry/alerts" element={<IndustryAlerts />} />
              </Route>

              {/* User Routes */}
              <Route
                element={
                  <RoleProtectedRoute allowedRoles={['user']}>
                    <DashboardLayout />
                  </RoleProtectedRoute>
                }
              >
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/user/map" element={<UserMap />} />
                <Route path="/user/alerts" element={<UserAlerts />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SensorProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
