
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useOffline } from "@/hooks/use-offline";
import { AuthProvider } from "@/hooks/use-auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import OfflineIndicator from "@/components/layout/OfflineIndicator";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
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
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute requireAuth={false}>
                <Index />
              </ProtectedRoute>
            } />
            
            <Route path="/pantry" element={
              <ProtectedRoute>
                <PantryPage />
              </ProtectedRoute>
            } />
            
            <Route path="/shopping-list" element={
              <ProtectedRoute>
                <ShoppingListPage />
              </ProtectedRoute>
            } />
            
            <Route path="/recipes" element={
              <ProtectedRoute>
                <RecipesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/spaces" element={
              <ProtectedRoute>
                <SpacesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/spaces/:spaceId" element={
              <ProtectedRoute>
                <SpaceDetailPage />
              </ProtectedRoute>
            } />
            
            <Route path="/grab-and-go" element={
              <ProtectedRoute>
                <GrabAndGoPage />
              </ProtectedRoute>
            } />
            
            <Route path="/rent-chef" element={
              <ProtectedRoute>
                <RentChefPage />
              </ProtectedRoute>
            } />
            
            <Route path="/family" element={
              <ProtectedRoute>
                <FamilyPage />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/notifications" element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/loyalty-cards" element={
              <ProtectedRoute>
                <LoyaltyCardsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/refer" element={
              <ProtectedRoute>
                <ReferPage />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
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
