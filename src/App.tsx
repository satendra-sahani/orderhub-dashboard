import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Orders from "./pages/dashboard/Orders";
import Stocks from "./pages/dashboard/Stocks";
import Revenue from "./pages/dashboard/Revenue";
import DeliveryBoys from "./pages/dashboard/DeliveryBoys";
import Shops from "./pages/dashboard/Shops";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Orders />} />
            <Route path="stocks" element={<Stocks />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="delivery" element={<DeliveryBoys />} />
            <Route path="shops" element={<Shops />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
