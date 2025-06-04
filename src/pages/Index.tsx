import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Utensils, ShoppingCart, Users, ChefHat } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { usePantry } from '@/hooks/use-pantry';
import { useShoppingList } from '@/hooks/use-shopping-list';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { format } from 'date-fns';
import { PantryItemData } from '@/types/pantry';

const IndexPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { items } = usePantry();
  const { shoppingItems } = useShoppingList();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      return 'Good morning';
    } else if (hour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  // Calculate expiring soon items
  const expiringSoonItems = items.filter(item => {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }).slice(0, 3).map(item => ({
    id: item.id,
    name: item.name,
    expiryDate: item.expiryDate,
    image: item.image || '/lovable-uploads/default-placeholder.jpg'
  }));

  return (
    <div className="min-h-screen bg-kitchen-cream kitchen-texture flex flex-col">
      <Header title="My Kitchen" />

      <main className="flex-1 px-4 py-6 mb-16">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-kitchen-dark">
              {greeting()}, {user?.user_metadata?.full_name || 'User'}!
            </h2>
            <p className="text-muted-foreground">
              Here's a snapshot of your kitchen activity.
            </p>
          </motion.section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-kitchen-green" />
                  <h3 className="font-semibold text-kitchen-dark">My Pantry</h3>
                </div>
                <Button variant="link" size="sm" onClick={() => navigate('/pantry')}>
                  View All
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {items.length} items in your pantry
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-kitchen-blue" />
                  <h3 className="font-semibold text-kitchen-dark">Shopping List</h3>
                </div>
                <Button variant="link" size="sm" onClick={() => navigate('/shopping-list')}>
                  View All
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {shoppingItems.length} items on your list
              </p>
            </motion.section>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-kitchen-orange" />
                <h3 className="font-semibold text-kitchen-dark">Expiring Soon</h3>
              </div>
              <Button variant="link" size="sm" onClick={() => navigate('/pantry')}>
                View All
              </Button>
            </div>
            {expiringSoonItems.length > 0 ? (
              <ul className="space-y-3">
                {expiringSoonItems.map(item => (
                  <li key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.expiryDate && (
                        <p className="text-sm text-muted-foreground">
                          Expires {format(new Date(item.expiryDate), 'MMM dd, yyyy')}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No items expiring soon.
              </p>
            )}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-kitchen-berry" />
                <h3 className="font-semibold text-kitchen-dark">Recipe Ideas</h3>
              </div>
              <Button variant="link" size="sm" onClick={() => navigate('/recipes')}>
                Explore
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover new recipes based on your pantry ingredients.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-kitchen-wood" />
                <h3 className="font-semibold text-kitchen-dark">Family Sharing</h3>
              </div>
              <Button variant="link" size="sm" onClick={() => navigate('/family')}>
                Manage
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Share your kitchen and collaborate with family members.
            </p>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default IndexPage;
