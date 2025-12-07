import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  History,
  Brain,
  Bell,
  Map,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const industryNav = [
  { path: '/industry/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/industry/history', icon: History, label: 'History' },
  { path: '/industry/prediction', icon: Brain, label: 'AI Prediction' },
  { path: '/industry/alerts', icon: Bell, label: 'Alerts' },
];

const userNav = [
  { path: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/user/map', icon: Map, label: 'Map' },
  { path: '/user/alerts', icon: Bell, label: 'My Alerts' },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { user } = useAuth();
  
  const navItems = user?.role === 'industry' ? industryNav : userNav;

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border transition-all duration-300 z-20',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  collapsed && 'justify-center'
                )
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Toggle button */}
        <div className="p-2 border-t border-sidebar-border">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm">Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
