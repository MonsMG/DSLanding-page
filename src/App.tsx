import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/layout/ScrollToTop";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import IT from "./pages/IT";
import ITProjectDetail from "./pages/ITProjectDetail";
import ITArchive from "./pages/ITArchive";
import Production from "./pages/Production";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Dashboard />} />
            <Route path="/tasks" element={<Dashboard />} />
            <Route path="/team" element={<Dashboard />} />
            <Route path="/settings" element={<Dashboard />} />
            <Route path="/it" element={<IT />} />
            <Route path="/it/project/:projectId" element={<ITProjectDetail />} />
            <Route path="/it/archive" element={<ITArchive />} />
            <Route path="/production" element={<Production />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
