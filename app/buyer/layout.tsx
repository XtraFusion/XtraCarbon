"use client"
import { ReactNode } from 'react';
import { 
  Home, 
  ShoppingCart, 
  Briefcase, 
  History, 
  User,
  LogOut,
  Menu
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { mockUser } from '@/data/mockData';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface BuyerLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/buyer/dashboard', icon: Home },
  { name: 'Marketplace', href: '/buyer/marketplace', icon: ShoppingCart },
  { name: 'Portfolio', href: '/buyer/portfolio', icon: Briefcase },
  { name: 'Transactions', href: '/buyer/transactions', icon: History },
  { name: 'Profile', href: '/buyer/profile', icon: User },
];

function BuyerSidebar() {
  const { state } = useSidebar();
  const location = usePathname();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          {state !== "collapsed" && (
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">
                Carbon Registry
              </h2>
              <p className="text-sm text-sidebar-foreground/70">
                {mockUser.organizationName}
              </p>
            </div>
          )}
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.href}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {state !== "collapsed" && <span>{item.name}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => {
              // TODO: Implement logout functionality
              console.log('Logout clicked');
            }}
          >
            <LogOut className="h-5 w-5" />
            {state !== "collapsed" && <span>Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default function BuyerLayout({ children }: BuyerLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <BuyerSidebar />
        
        <main className="flex-1 overflow-auto">
          <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-background">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-8 w-8" />
              <h1 className="text-xl font-semibold text-foreground">
                Carbon Credit Registry
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {mockUser.firstName} {mockUser.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {mockUser.role.charAt(0).toUpperCase() + mockUser.role.slice(1)}
                </p>
              </div>
            </div>
          </header>
          
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}