
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OfflineIndicator from '@/components/layout/OfflineIndicator';
import FloatingGrabAndGoButton from '@/components/home/FloatingGrabAndGoButton';
import SplashScreen from '@/components/home/SplashScreen';
import IntelligentOnboarding from '@/components/onboarding/IntelligentOnboarding';
import EnhancedSmartDashboard from '@/components/dashboard/EnhancedSmartDashboard';
import PageTransition from '@/components/layout/PageTransition';
import { useOffline } from '@/hooks/use-offline';
import { useAuth } from '@/hooks/use-auth';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Sparkles, LogIn, UserPlus } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isOnline } = useOffline();
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if we should show splash screen
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash') === 'true';
    if (hasSeenSplash) {
      setShowSplash(false);
    }

    // Only check onboarding status once when user is loaded
    if (user) {
      const hasCompletedGlobalOnboarding = localStorage.getItem('globalOnboardingComplete') === 'true';
      
      if (!hasCompletedGlobalOnboarding && !preferences?.onboarding_completed) {
        setShowOnboarding(true);
      }
    }
  }, [user, preferences]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasSeenSplash', 'true');
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('globalOnboardingComplete', 'true');
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('globalOnboardingComplete', 'true');
  };

  // Show splash only on first visit per session
  if (showSplash && sessionStorage.getItem('hasSeenSplash') !== 'true') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Show onboarding only once for new users
  if (showOnboarding && user && localStorage.getItem('globalOnboardingComplete') !== 'true') {
    return (
      <IntelligentOnboarding 
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  // Show sign-in page for unauthenticated users
  if (!user) {
    return (
      <PageTransition className="bg-gradient-to-br from-kitchen-cream via-white to-kitchen-green/5">
        <OfflineIndicator isOnline={isOnline} />
        
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-kitchen-green rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <ChefHat className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-kitchen-dark mb-4"
            >
              Welcome to Kitchen Assistant
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 mb-8 flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 mr-2 text-kitchen-green" />
              Your smart kitchen companion awaits
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <Card className="border-kitchen-green/20 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-kitchen-dark mb-2">🥘 Smart Pantry Management</h3>
                  <p className="text-sm text-gray-600">Track expiry dates, get smart suggestions, and never waste food again.</p>
                </CardContent>
              </Card>
              
              <Card className="border-kitchen-green/20 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-kitchen-dark mb-2">📝 Intelligent Shopping Lists</h3>
                  <p className="text-sm text-gray-600">Auto-generated lists based on your pantry and cooking habits.</p>
                </CardContent>
              </Card>
              
              <Card className="border-kitchen-green/20 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-kitchen-dark mb-2">👨‍🍳 Personal Chef Services</h3>
                  <p className="text-sm text-gray-600">Book professional chefs for special occasions.</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 space-y-3"
            >
              <Button
                onClick={() => navigate('/auth')}
                className="w-full bg-kitchen-green hover:bg-kitchen-green/90 text-white font-medium py-3 rounded-lg transition-all duration-200"
                size="lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In to Your Kitchen
              </Button>
              
              <Button
                onClick={() => navigate('/auth')}
                variant="outline"
                className="w-full border-kitchen-green text-kitchen-green hover:bg-kitchen-green hover:text-white font-medium py-3 rounded-lg transition-all duration-200"
                size="lg"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Create New Account
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  // Authenticated user view
  return (
    <PageTransition className="bg-gradient-to-br from-kitchen-cream via-white to-kitchen-green/5">
      <OfflineIndicator isOnline={isOnline} />
      <Header title="Kitchen Assistant" />
      
      <main className="pt-16 pb-20">
        <EnhancedSmartDashboard />
      </main>
      
      <Footer />
      <FloatingGrabAndGoButton />
    </PageTransition>
  );
};

export default Index;
