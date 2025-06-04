
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import SplashScreen from "./components/home/SplashScreen";
import Index from "./pages/Index";
import PantryPage from "./pages/PantryPage";
import RecipesPage from "./pages/RecipesPage";
import ShoppingListPage from "./pages/ShoppingListPage";
import GrabAndGoPage from "./pages/GrabAndGoPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import LoyaltyCardsPage from "./pages/LoyaltyCardsPage";
import FamilyPage from "./pages/FamilyPage";
import ReferPage from "./pages/ReferPage";
import SpacesPage from "./pages/SpacesPage";
import SpaceDetailPage from "./pages/SpaceDetailPage";
import RentChefPage from "./pages/RentChefPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Animated routes with framer-motion
const AnimatedRoutes = () => {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    // Check if the splash screen has been shown in this session
    const splashShown = sessionStorage.getItem('splashScreenShown');
    
    if (splashShown) {
      setShowSplash(false);
    }
  }, []);
  
  const handleSplashComplete = () => {
    sessionStorage.setItem('splashScreenShown', 'true');
    setShowSplash(false);
  };
  
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/pantry" element={<PantryPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/rent-chef" element={<RentChefPage />} />
        <Route path="/shopping-list" element={<ShoppingListPage />} />
        <Route path="/grab-and-go" element={<GrabAndGoPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/loyalty-cards" element={<LoyaltyCardsPage />} />
        <Route path="/family" element={<FamilyPage />} />
        <Route path="/refer" element={<ReferPage />} />
        <Route path="/spaces" element={<SpacesPage />} />
        <Route path="/spaces/:id" element={<SpaceDetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
