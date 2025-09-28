"use client"
import { useState } from 'react';
import {
  Home,
  Users,
  FolderTree,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: Home,
    exact: true
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users
  },
  {
    title: 'Project Management',
    href: '/admin/projects',
    icon: FolderTree
  },
  {
    title: 'Audit Logs',
    href: '/admin/audit-logs',
    icon: FileText
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings
  }
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = usePathname();

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return location === href;
    }
    return location.startsWith(href);
  };

  return (
    <div className={cn(
      "bg-card border-r border-border transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Logo and Collapse Button */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-foreground">NCCR Admin</h2>
              <p className="text-xs text-muted-foreground">Carbon Registry</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive(item.href, item.exact)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* System Status */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm">
            <Activity className="h-4 w-4 text-success" />
            <span className="text-muted-foreground">System Status:</span>
            <span className="text-success font-medium">Online</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Uptime: 99.97%
          </div>
        </div>
      )}
    </div>
  );
}