
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Measures from "./pages/management/Measures";
import MeasureDetails from "./pages/management/MeasureDetails";
import MeasureEdit from "./pages/management/MeasureEdit";
import FacilityMeasures from "./pages/management/FacilityMeasures";
import CostEstimate from "./pages/management/CostEstimate";
import RegionalPrograms from "./pages/management/RegionalPrograms";
import ProgramDetails from "./pages/management/ProgramDetails";
import ProgramEdit from "./pages/management/ProgramEdit";
import { RouteGuard } from "./components/management/RouteGuard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/management/measures" element={<Measures />} />
          <Route 
            path="/management/measures/:id" 
            element={
              <RouteGuard paramName="id" defaultPath="/management/measures">
                <MeasureDetails />
              </RouteGuard>
            } 
          />
          <Route 
            path="/management/measures/:id/edit" 
            element={
              <RouteGuard paramName="id" defaultPath="/management/measures">
                <MeasureEdit />
              </RouteGuard>
            } 
          />
          <Route 
            path="/management/facilities/:id/measures" 
            element={
              <RouteGuard paramName="id" defaultPath="/">
                <FacilityMeasures />
              </RouteGuard>
            } 
          />
          <Route path="/management/cost-estimate" element={<CostEstimate />} />
          <Route path="/management/programs" element={<RegionalPrograms />} />
          <Route 
            path="/management/programs/:id" 
            element={
              <RouteGuard paramName="id" defaultPath="/management/programs">
                <ProgramDetails />
              </RouteGuard>
            } 
          />
          <Route 
            path="/management/programs/:id/edit" 
            element={
              <RouteGuard paramName="id" defaultPath="/management/programs">
                <ProgramEdit />
              </RouteGuard>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
