
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import EmissionInput from "./pages/EmissionInput";
import CarbonSink from "./pages/CarbonSink";
import Strategy from "./pages/Strategy";
import Reports from "./pages/Reports";
import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
            <SidebarProvider>
              <Layout>
                <Dashboard />
              </Layout>
            </SidebarProvider>
          } />
          <Route path="/emissions" element={
            <SidebarProvider>
              <Layout>
                <EmissionInput />
              </Layout>
            </SidebarProvider>
          } />
          <Route path="/carbon-sink" element={
            <SidebarProvider>
              <Layout>
                <CarbonSink />
              </Layout>
            </SidebarProvider>
          } />
          <Route path="/strategy" element={
            <SidebarProvider>
              <Layout>
                <Strategy />
              </Layout>
            </SidebarProvider>
          } />
          <Route path="/reports" element={
            <SidebarProvider>
              <Layout>
                <Reports />
              </Layout>
            </SidebarProvider>
          } />
          <Route path="/admin" element={
            <SidebarProvider>
              <Layout>
                <Admin />
              </Layout>
            </SidebarProvider>
          } />
          <Route path="/leaderboard" element={
            <SidebarProvider>
              <Layout>
                <Leaderboard />
              </Layout>
            </SidebarProvider>
          } />
          <Route path="/settings" element={
            <SidebarProvider>
              <Layout>
                <Settings />
              </Layout>
            </SidebarProvider>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
