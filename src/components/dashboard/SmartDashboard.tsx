
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  ChefHat, Clock, TrendingUp, Sparkles, Users, 
  ShoppingCart, AlertCircle, Heart, Calendar 
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { usePantry } from '@/hooks/use-pantry';
import { useShoppingList } from '@/hooks/use-shopping-list';
import { format } from 'date-fns';

const SmartDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items } = usePantry();
  const { shoppingItems } = useShoppingList();
  const [greeting, setGreeting] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Load user profile from onboarding
    const savedProfile = localStorage.getItem('pantryChef_userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Calculate smart insights
  const expiringSoonItems = items.filter(item => {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  });

  const lowStockItems = items.filter(item => item.quantity <= 2);
  const favoriteIngredients = items.slice(0, 5); // Mock data for now
  const weeklyShoppingValue = shoppingItems.length * 3.5; // Mock calculation

  // Smart recommendations based on user profile
  const getSmartRecommendations = () => {
    if (!userProfile) return [];
    
    const recommendations = [];
    
    if (expiringSoonItems.length > 0) {
      recommendations.push({
        type: 'urgent',
        title: 'Use Expiring Ingredients',
        description: `${expiringSoonItems.length} items expire soon`,
        action: 'Get Recipes',
        onClick: () => navigate('/recipes?filter=expiring')
      });
    }

    if (userProfile.cookingStyle.healthFocus && items.length > 5) {
      recommendations.push({
        type: 'health',
        title: 'Healthy Recipe Match',
        description: 'Perfect healthy recipes for your pantry',
        action: 'View Suggestions',
        onClick: () => navigate('/recipes?filter=healthy')
      });
    }

    if (userProfile.chefPreferences.frequency !== 'rare') {
      recommendations.push({
        type: 'chef',
        title: 'Chef Available This Week',
        description: 'Top-rated chefs in your area',
        action: 'Browse Chefs',
        onClick: () => navigate('/rent-chef')
      });
    }

    return recommendations;
  };

  const smartRecommendations = getSmartRecommendations();

  return (
    <div className="space-y-6">
      {/* Personalized Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-kitchen-green to-kitchen-blue text-white p-6 rounded-xl"
      >
        <h1 className="text-2xl font-bold mb-2">
          {greeting}, {user?.user_metadata?.full_name || 'Chef'}! 👋
        </h1>
        <p className="opacity-90">
          {userProfile 
            ? `Ready to cook something ${userProfile.cookingStyle.cuisinePreferences[0]?.toLowerCase() || 'delicious'}?`
            : 'Your smart kitchen is ready to help you create amazing meals!'
          }
        </p>
      </motion.div>

      {/* Smart Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pantry Status */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-kitchen-green" />
              Pantry Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{items.length}</div>
              <p className="text-sm text-gray-600">Total Items</p>
              {lowStockItems.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {lowStockItems.length} running low
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expiring Soon */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-kitchen-orange" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-kitchen-orange">
                {expiringSoonItems.length}
              </div>
              <p className="text-sm text-gray-600">Items this week</p>
              {expiringSoonItems.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/recipes?filter=expiring')}
                  className="text-xs"
                >
                  Get Recipes
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Shopping List */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-kitchen-blue" />
              Shopping List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{shoppingItems.length}</div>
              <p className="text-sm text-gray-600">Items to buy</p>
              <p className="text-xs text-gray-500">~${weeklyShoppingValue.toFixed(0)} estimated</p>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-kitchen-sage" />
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">12</div>
              <p className="text-sm text-gray-600">Meals this week</p>
              <Badge variant="secondary" className="text-xs">
                +3 from last week
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Recommendations */}
      {smartRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-kitchen-orange" />
              Smart Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {smartRecommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      rec.type === 'urgent' ? 'bg-red-500' :
                      rec.type === 'health' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`} />
                    <div>
                      <h4 className="font-medium text-sm">{rec.title}</h4>
                      <p className="text-xs text-gray-600">{rec.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={rec.onClick}
                    className="text-xs"
                  >
                    {rec.action}
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/pantry')}>
          <CardContent className="p-6 text-center">
            <ChefHat className="w-8 h-8 text-kitchen-green mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Manage Pantry</h3>
            <p className="text-sm text-gray-600">Add items, check expiry dates</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/recipes')}>
          <CardContent className="p-6 text-center">
            <Sparkles className="w-8 h-8 text-kitchen-orange mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Recipe Ideas</h3>
            <p className="text-sm text-gray-600">AI-powered suggestions</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/rent-chef')}>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-kitchen-blue mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Hire a Chef</h3>
            <p className="text-sm text-gray-600">Book cooking services</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmartDashboard;
