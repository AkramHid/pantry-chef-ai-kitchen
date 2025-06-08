
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Utensils, 
  ShoppingCart, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  ChefHat,
  Calendar,
  BarChart3,
  Heart,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useInterfacePreferences } from '@/hooks/use-interface-preferences';
import { usePantry } from '@/hooks/use-pantry';
import { useShoppingList } from '@/hooks/use-shopping-list';
import ExpiringSoonSection from '@/components/home/ExpiringSoonSection';
import TutorialOverlay from '@/components/onboarding/TutorialOverlay';

const EnhancedSmartDashboard: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { preferences } = useInterfacePreferences();
  const { items: pantryItems } = usePantry();
  const { shoppingItems } = useShoppingList();
  
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // Calculate dashboard metrics
  const totalPantryItems = pantryItems.length;
  const uncheckedShoppingItems = shoppingItems.filter(item => !item.isChecked).length;
  const expiringItems = pantryItems.filter(item => {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  });

  const quickActions = [
    {
      title: 'Add to Pantry',
      icon: Plus,
      action: () => navigate('/pantry'),
      color: 'bg-kitchen-green',
      description: 'Quick add items'
    },
    {
      title: 'Shopping List',
      icon: ShoppingCart,
      action: () => navigate('/shopping-list'),
      color: 'bg-kitchen-berry',
      description: `${uncheckedShoppingItems} items`,
      badge: uncheckedShoppingItems > 0 ? uncheckedShoppingItems : undefined
    },
    {
      title: 'Find Recipe',
      icon: ChefHat,
      action: () => navigate('/recipes'),
      color: 'bg-kitchen-wood',
      description: 'AI suggestions'
    },
    {
      title: 'Rent Chef',
      icon: Utensils,
      action: () => navigate('/rent-chef'),
      color: 'bg-kitchen-stone',
      description: 'Book expert'
    }
  ];

  const widgets = [
    {
      id: 'pantry_summary',
      title: 'Pantry Overview',
      icon: BarChart3,
      value: totalPantryItems,
      subtitle: 'Total items',
      trend: '+12% this week',
      color: 'text-kitchen-green'
    },
    {
      id: 'expiring_items',
      title: 'Expiring Soon',
      icon: AlertTriangle,
      value: expiringItems.length,
      subtitle: 'Items to use',
      trend: expiringItems.length > 0 ? 'Action needed' : 'All good',
      color: expiringItems.length > 0 ? 'text-red-500' : 'text-kitchen-green'
    },
    {
      id: 'recent_recipes',
      title: 'Recipe Ideas',
      icon: Heart,
      value: 5,
      subtitle: 'New suggestions',
      trend: 'Based on pantry',
      color: 'text-kitchen-berry'
    },
    {
      id: 'cooking_streak',
      title: 'Cooking Streak',
      icon: Zap,
      value: 7,
      subtitle: 'Days in a row',
      trend: 'Keep it up!',
      color: 'text-kitchen-wood'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!preferences.gesture_controls_enabled) return;
    
    setSwipeDirection(direction);
    setTimeout(() => setSwipeDirection(null), 300);
    
    // Add haptic feedback if enabled
    if (preferences.haptic_feedback_enabled && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kitchen-cream via-white to-kitchen-green/5">
      <TutorialOverlay pageName="dashboard" />
      
      <div className="dashboard-header p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-kitchen-dark mb-2">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
          </h1>
          <p className="text-gray-600">Here's what's happening in your kitchen</p>
        </motion.div>
      </div>

      <div className="px-4 md:px-6 pb-20 md:pb-6">
        {/* Quick Actions */}
        <motion.div 
          className="quick-actions mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-lg font-semibold text-kitchen-dark mb-4">Quick Actions</h2>
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-4'}`}>
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-kitchen-green/20"
                  onClick={action.action}
                >
                  <CardContent className={`p-4 ${isMobile ? 'text-center' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${action.color} text-white relative`}>
                        <action.icon size={isMobile ? 18 : 20} />
                        {action.badge && (
                          <Badge 
                            variant="destructive" 
                            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0"
                          >
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <h3 className={`font-medium text-kitchen-dark ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {action.title}
                    </h3>
                    <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Widgets Grid */}
        <motion.div 
          className="widget-grid mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-lg font-semibold text-kitchen-dark mb-4">Kitchen Insights</h2>
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-2 lg:grid-cols-4 gap-4'}`}>
            {widgets.map((widget) => (
              <motion.div
                key={widget.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <widget.icon size={20} className={widget.color} />
                      <TrendingUp size={14} className="text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      <p className={`text-2xl font-bold ${widget.color}`}>
                        {widget.value}
                      </p>
                      <p className={`font-medium text-kitchen-dark ${isMobile ? 'text-sm' : 'text-base'}`}>
                        {widget.title}
                      </p>
                      <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {widget.subtitle}
                      </p>
                      <p className={`text-xs ${widget.color} font-medium`}>
                        {widget.trend}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Expiring Items Section */}
        {expiringItems.length > 0 && (
          <ExpiringSoonSection 
            items={expiringItems.map(item => ({
              id: item.id,
              name: item.name,
              daysLeft: Math.ceil((new Date(item.expiryDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
              image: item.image
            }))}
          />
        )}

        {/* Recent Activity */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={20} />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'Added milk to pantry', time: '2 hours ago', icon: Plus },
                  { action: 'Completed shopping list', time: '1 day ago', icon: ShoppingCart },
                  { action: 'Generated pasta recipe', time: '2 days ago', icon: ChefHat }
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-kitchen-green/10 rounded-full">
                      <activity.icon size={16} className="text-kitchen-green" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium text-kitchen-dark ${isMobile ? 'text-sm' : 'text-base'}`}>
                        {activity.action}
                      </p>
                      <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedSmartDashboard;
