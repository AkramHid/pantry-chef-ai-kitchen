
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OfflineIndicator from '@/components/layout/OfflineIndicator';
import FloatingGrabAndGoButton from '@/components/home/FloatingGrabAndGoButton';
import SplashScreen from '@/components/home/SplashScreen';
import IntelligentOnboarding from '@/components/onboarding/IntelligentOnboarding';
import EnhancedSmartDashboard from '@/components/dashboard/EnhancedSmartDashboard';
import { useOffline } from '@/hooks/use-offline';
import { useAuth } from '@/hooks/use-auth';
import { useUserPreferences } from '@/hooks/use-user-preferences';

const Index = () => {
  const { isOnline } = useOffline();
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Only check onboarding status once when user is loaded
    if (user) {
      const hasCompletedOnboarding = localStorage.getItem('pantryChef_onboardingComplete') === 'true';
      const hasSeenAppBefore = localStorage.getItem('hasSeenSplash') === 'true';
      
      // Show onboarding only if user hasn't completed it AND hasn't seen the app before
      if (!hasCompletedOnboarding && !hasSeenAppBefore && !preferences?.onboarding_completed) {
        setShowOnboarding(true);
      }
    }
  }, [user]); // Only depend on user, not preferences to avoid re-triggering

  const handleSplashComplete = () => {
    setShowSplash(false);
    localStorage.setItem('hasSeenSplash', 'true');
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('pantryChef_onboardingComplete', 'true');
    localStorage.setItem('hasCompletedFullOnboarding', 'true');
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('pantryChef_onboardingComplete', 'true');
    localStorage.setItem('hasCompletedFullOnboarding', 'true');
  };

  // Show splash only on first visit
  if (showSplash && localStorage.getItem('hasSeenSplash') !== 'true') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Show onboarding only once for new users
  if (showOnboarding && user && localStorage.getItem('hasCompletedFullOnboarding') !== 'true') {
    return (
      <IntelligentOnboarding 
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kitchen-cream via-white to-kitchen-green/5">
      <OfflineIndicator isOnline={isOnline} />
      <Header title="Kitchen Assistant" />
      
      <main className="pt-16 pb-20">
        <EnhancedSmartDashboard />
      </main>
      
      <Footer />
      <FloatingGrabAndGoButton />
    </div>
  );
};

export default Index;
