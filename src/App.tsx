
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useOffline } from "@/hooks/use-offline";
import { AuthProvider } from "@/hooks/use-auth";
import OfflineIndicator from "@/components/layout/OfflineIndicator";
import Index from "./pages/Index";
import PantryPage from "./pages/PantryPage";
import ShoppingListPage from "./pages/ShoppingListPage";
import RecipesPage from "./pages/RecipesPage";
import SpacesPage from "./pages/SpacesPage";
import SpaceDetailPage from "./pages/SpaceDetailPage";
import GrabAndGoPage from "./pages/GrabAndGoPage";
import RentChefPage from "./pages/RentChefPage";
import FamilyPage from "./pages/FamilyPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import LoyaltyCardsPage from "./pages/LoyaltyCardsPage";
import ReferPage from "./pages/ReferPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry if offline
        if (!navigator.onLine) return false;
        return failureCount < 3;
      },
    },
  },
});

const AppContent = () => {
  const { isOnline } = useOffline();

  return (
    <>
      <Toaster />
      <Sonner />
      <OfflineIndicator isOnline={isOnline} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pantry" element={<PantryPage />} />
          <Route path="/shopping-list" element={<ShoppingListPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/spaces" element={<SpacesPage />} />
          <Route path="/spaces/:spaceId" element={<SpaceDetailPage />} />
          <Route path="/grab-and-go" element={<GrabAndGoPage />} />
          <Route path="/rent-chef" element={<RentChefPage />} />
          <Route path="/family" element={<FamilyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/loyalty-cards" element={<LoyaltyCardsPage />} />
          <Route path="/refer" element={<ReferPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
