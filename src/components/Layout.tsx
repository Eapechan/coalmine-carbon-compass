
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-white/50 backdrop-blur-sm flex items-center px-4 sticky top-0 z-40">
          <SidebarTrigger className="mr-4" />
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg sustainability-gradient flex items-center justify-center">
                <span className="text-white font-bold text-sm">CM</span>
              </div>
              <h1 className="text-xl font-bold text-primary">CoalMineNetZero</h1>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Welcome, Mine Operator
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 bg-gradient-to-br from-green-50/50 to-emerald-50/30">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
