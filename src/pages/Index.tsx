
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ActionTile from "@/components/home/ActionTile";
import ExpiringSoonSection from "@/components/home/ExpiringSoonSection";
import ChefTile from "@/components/home/ChefTile";
import FloatingGrabAndGoButton from "@/components/home/FloatingGrabAndGoButton";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import {
  UtensilsCrossed,
  Package,
  ShoppingCart,
  ChefHat,
  Users,
  Calendar,
  CreditCard,
  Gift,
  Home as HomeIcon,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createNotification } = useNotifications();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleNavigateWithAuth = (path: string, requiresAuth = true) => {
    if (requiresAuth && !user) {
      setShowAuthDialog(true);
      return;
    }
    navigate(path);
  };

  // Mock data for expiring items - in a real app this would come from the database
  const expiringItems = user ? [
    { id: '1', name: 'Milk', daysLeft: 1, image: undefined },
    { id: '2', name: 'Bread', daysLeft: 2, image: undefined },
    { id: '3', name: 'Yogurt', daysLeft: 3, image: undefined },
  ] : [];

  const tiles = [
    {
      icon: UtensilsCrossed,
      title: "Recipes",
      description: "AI-powered recipe suggestions based on your pantry",
      bgColor: "bg-gradient-to-br from-orange-400 to-red-500",
      path: "/recipes",
      requiresAuth: false
    },
    {
      icon: Package,
      title: "My Pantry",
      description: "Track your ingredients and expiration dates",
      bgColor: "bg-gradient-to-br from-green-400 to-emerald-600",
      path: "/pantry",
      requiresAuth: true
    },
    {
      icon: ShoppingCart,
      title: "Shopping List",
      description: "Smart shopping lists with store optimization",
      bgColor: "bg-gradient-to-br from-blue-400 to-indigo-600",
      path: "/shopping-list",
      requiresAuth: true
    },
    {
      icon: ChefHat,
      title: "Rent a Chef",
      description: "Book professional chefs for home cooking",
      bgColor: "bg-gradient-to-br from-purple-400 to-pink-500",
      path: "/rent-chef",
      requiresAuth: false
    },
    {
      icon: HomeIcon,
      title: "Spaces",
      description: "Organize your kitchen spaces efficiently",
      bgColor: "bg-gradient-to-br from-teal-400 to-cyan-500",
      path: "/spaces",
      requiresAuth: true
    },
    {
      icon: Users,
      title: "Family",
      description: "Share lists and coordinate with family",
      bgColor: "bg-gradient-to-br from-yellow-400 to-orange-500",
      path: "/family",
      requiresAuth: true
    },
    {
      icon: CreditCard,
      title: "Loyalty Cards",
      description: "Manage your store loyalty cards digitally",
      bgColor: "bg-gradient-to-br from-indigo-400 to-purple-500",
      path: "/loyalty-cards",
      requiresAuth: true
    },
    {
      icon: Gift,
      title: "Refer Friends",
      description: "Invite friends and earn rewards",
      bgColor: "bg-gradient-to-br from-pink-400 to-rose-500",
      path: "/refer",
      requiresAuth: true
    },
  ];

  // Show a welcome notification for new users
  React.useEffect(() => {
    if (user && createNotification) {
      // Check if it's a returning user or new user
      const hasSeenWelcome = localStorage.getItem(`welcome_${user.id}`);
      if (!hasSeenWelcome) {
        createNotification({
          title: 'Welcome to Kitchen Assistant!',
          message: 'Start by adding items to your pantry or creating your first shopping list.',
          type: 'system',
          action_url: '/pantry',
          metadata: { isWelcome: true }
        });
        localStorage.setItem(`welcome_${user.id}`, 'true');
      }
    }
  }, [user, createNotification]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-kitchen-cream via-white to-kitchen-cream">
      <Header title="Kitchen Assistant" />
      
      <main className="pb-20">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-4 py-8 md:py-12 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-kitchen-dark mb-4 md:mb-6">
              Your Smart
              <span className="text-kitchen-green block md:inline md:ml-3">
                Kitchen Assistant
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Organize your pantry, plan meals with AI, and streamline your cooking experience
            </p>
            
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-kitchen-green/10 border border-kitchen-green/20 rounded-lg p-4 mb-8 max-w-md mx-auto"
              >
                <p className="text-kitchen-green font-medium">
                  Sign in to sync your data across devices and unlock all features!
                </p>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Expiring Soon Section - Only show for authenticated users */}
        {user && expiringItems.length > 0 && (
          <section className="px-4 mb-8">
            <div className="max-w-6xl mx-auto">
              <ExpiringSoonSection items={expiringItems} />
            </div>
          </section>
        )}

        {/* Main Features Grid */}
        <section className="px-4 mb-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {tiles.map((tile, index) => (
                <motion.div
                  key={tile.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                >
                  <ActionTile
                    icon={tile.icon}
                    title={tile.title}
                    description={tile.description}
                    bgColor={tile.bgColor}
                    onClick={() => handleNavigateWithAuth(tile.path, tile.requiresAuth)}
                    disabled={tile.requiresAuth && !user}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Chef Spotlight */}
        <section className="px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <ChefTile />
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingGrabAndGoButton />
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </div>
  );
};

export default Index;
