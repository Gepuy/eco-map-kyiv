
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/management/measures" element={<Measures />} />
          <Route path="/management/measures/:id" element={<MeasureDetails />} />
          <Route path="/management/measures/:id/edit" element={<MeasureEdit />} />
          <Route path="/management/facilities/:id/measures" element={<FacilityMeasures />} />
          <Route path="/management/cost-estimate" element={<CostEstimate />} />
          <Route path="/management/programs" element={<RegionalPrograms />} />
          <Route path="/management/programs/:id" element={<ProgramDetails />} />
          <Route path="/management/programs/:id/edit" element={<ProgramEdit />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
