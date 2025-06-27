
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  BarChart,
  Settings,
  Users,
  FileText,
  Calendar,
  ChartPie,
  LogIn,
  Folder,
  ArrowUp,
  ArrowDown
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Emissions Input", url: "/emissions", icon: BarChart },
  { title: "Carbon Sink", url: "/carbon-sink", icon: ArrowDown },
  { title: "Strategy", url: "/strategy", icon: ArrowUp },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Admin Panel", url: "/admin", icon: Users },
  { title: "Leaderboard", url: "/leaderboard", icon: ChartPie },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} carbon-neutral-bg text-white border-r-0`}
      collapsible="icon"
    >
      <SidebarContent className="bg-transparent">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold">CM</span>
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-lg">CoalMineNetZero</h2>
                <p className="text-xs text-green-200">Carbon Neutral Platform</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-green-200 px-4">
            {!collapsed && "Main Navigation"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 transition-colors ${getNavCls({ isActive })}`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="text-xs text-green-200">
              <p>Made for Indian Coal Mines</p>
              <p className="mt-1">Carbon Neutrality Mission</p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
