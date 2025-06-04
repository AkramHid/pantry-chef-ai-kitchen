
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ShoppingBag, ChefHat, Users, Bell, Calendar, Heart, Camera, Search, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ActionTile from '@/components/home/ActionTile';
import ChefTile from '@/components/home/ChefTile';
import ExpiringSoonSection from '@/components/home/ExpiringSoonSection';
import FloatingGrabAndGoButton from '@/components/home/FloatingGrabAndGoButton';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePantry } from '@/hooks/use-pantry';
import { useAuth } from '@/hooks/use-auth';
import { useNotifications } from '@/hooks/use-notifications';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { items: pantryItems, isLoading: pantryLoading } = usePantry();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  // Show welcome message for new users
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      toast({
        title: "Welcome to Kitchen Assistant! 🍳",
        description: "Manage your pantry, discover recipes, and more!",
        duration: 5000,
      });
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, [toast]);

  const handleTileClick = (path: string, requiresAuth: boolean = false) => {
    if (requiresAuth && !user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to access this feature',
        variant: 'destructive',
      });
      return;
    }
    navigate(path);
  };

  const handleAddToPantry = () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to access your pantry',
        variant: 'destructive',
      });
      return;
    }
    navigate('/pantry?action=add');
  };

  const quickActions = [
    {
      icon: Plus,
      title: 'Add to Pantry',
      subtitle: 'Quick add items',
      path: '/pantry?action=add',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      onClick: handleAddToPantry,
      requiresAuth: true
    },
    {
      icon: Search,
      title: 'Recipe Ideas',
      subtitle: 'Find inspiration',
      path: '/recipes',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      onClick: () => handleTileClick('/recipes'),
      requiresAuth: false
    },
    {
      icon: ShoppingBag,
      title: 'Shopping List',
      subtitle: 'Plan your shopping',
      path: '/shopping-list',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      onClick: () => handleTileClick('/shopping-list', true),
      requiresAuth: true
    },
    {
      icon: Camera,
      title: 'Grab & Go',
      subtitle: 'Quick shopping mode',
      path: '/grab-and-go',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      onClick: () => handleTileClick('/grab-and-go', true),
      requiresAuth: true
    }
  ];

  const mainFeatures = [
    {
      icon: Utensils,
      title: 'My Pantry',
      to: '/pantry',
      variant: 'primary' as const,
      requiresAuth: true
    },
    {
      icon: ChefHat,
      title: 'Recipe Ideas',
      to: '/recipes',
      variant: 'secondary' as const,
      requiresAuth: false
    },
    {
      icon: ShoppingBag,
      title: 'Shopping Lists',
      to: '/shopping-list',
      variant: 'accent' as const,
      requiresAuth: true
    },
    {
      icon: Users,
      title: 'Family Sharing',
      to: '/family',
      variant: 'primary' as const,
      requiresAuth: true
    }
  ];

  // Get expiring items for ExpiringSoonSection
  const expiringSoonItems = pantryItems
    .filter(item => {
      if (!item.expiry_date) return false;
      const expiryDate = new Date(item.expiry_date);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
    })
    .map(item => ({
      id: item.id,
      name: item.name,
      daysLeft: Math.ceil((new Date(item.expiry_date!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      image: item.image_url
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="min-h-screen bg-kitchen-cream">
      <Header title="Kitchen Assistant" />
      
      <main className="pb-24">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-kitchen-green via-kitchen-sage to-kitchen-blue text-white py-12 px-4"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              Your Smart Kitchen Assistant
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl opacity-90 mb-8"
            >
              Manage your pantry, discover recipes, and make cooking effortless
            </motion.p>
            
            {user && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-2xl mx-auto"
              >
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                  >
                    <Button
                      onClick={action.onClick}
                      className={`${action.color} ${action.hoverColor} text-white h-auto py-3 px-4 flex flex-col items-center gap-2 w-full transition-all duration-200 hover:scale-105 shadow-lg`}
                    >
                      <action.icon size={isMobile ? 20 : 24} />
                      <div className="text-center">
                        <div className="font-medium text-xs md:text-sm">{action.title}</div>
                        <div className="text-xs opacity-80">{action.subtitle}</div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Expiring Soon Section - Only show if user is signed in */}
        {user && !pantryLoading && expiringSoonItems.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="px-4 py-6"
          >
            <ExpiringSoonSection items={expiringSoonItems} />
          </motion.section>
        )}

        {/* Main Features */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="px-4 py-6"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-kitchen-dark mb-6 text-center">
              Kitchen Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mainFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                  onClick={() => handleTileClick(feature.to, feature.requiresAuth)}
                >
                  <ActionTile
                    icon={feature.icon}
                    title={feature.title}
                    to={feature.to}
                    variant={feature.variant}
                    className="hover:scale-105 transition-all duration-200 shadow-lg cursor-pointer"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Chef Services */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="px-4 py-6"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-kitchen-dark mb-6 text-center">
              Professional Chef Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChefTile />
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-kitchen-green" />
                    Cooking Classes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Learn new cooking techniques from professional chefs in hands-on classes.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => toast({
                      title: "Coming Soon",
                      description: "Cooking classes will be available soon!",
                    })}
                  >
                    View Classes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.section>
      </main>

      <FloatingGrabAndGoButton />
      <Footer />
    </div>
  );
};

export default Index;
