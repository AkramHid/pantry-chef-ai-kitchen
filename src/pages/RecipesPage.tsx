
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChefHat, Sparkles, Heart, Clock, Users, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import RecipeGeneratorContainer from '@/components/recipes/RecipeGeneratorContainer';
import OnboardingScreen from '@/components/recipes/OnboardingScreen';
import RecipeSplashScreen from '@/components/recipes/RecipeSplashScreen';
import { useToast } from '@/hooks/use-toast';

const onboardingSteps = [
  {
    title: "Welcome to Recipe Ideas!",
    description: "Discover amazing recipes based on what you have in your pantry.",
    image: "/lovable-uploads/recipes-welcome.jpg"
  },
  {
    title: "AI-Powered Suggestions",
    description: "Our AI creates personalized recipes from your ingredients.",
    image: "/lovable-uploads/ai-recipes.jpg"
  },
  {
    title: "Save Your Favorites",
    description: "Keep track of recipes you love for easy access later.",
    image: "/lovable-uploads/favorite-recipes.jpg"
  }
];

const RecipesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [showSplash, setShowSplash] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('');

  // Check if this is first visit
  useEffect(() => {
    const hasVisitedRecipes = localStorage.getItem('hasVisitedRecipes');
    if (!hasVisitedRecipes) {
      setShowSplash(true);
      localStorage.setItem('hasVisitedRecipes', 'true');
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    toast({
      title: "Welcome to Recipe Ideas! 🍳",
      description: "Start discovering amazing recipes tailored to your pantry!",
    });
  };

  const handleBack = () => {
    if (showOnboarding && onboardingStep > 0) {
      setOnboardingStep(onboardingStep - 1);
    } else {
      navigate('/');
    }
  };

  if (showSplash) {
    return <RecipeSplashScreen />;
  }

  if (showOnboarding) {
    return (
      <OnboardingScreen
        onboardingStep={onboardingStep}
        onboardingSteps={onboardingSteps}
        setOnboardingStep={setOnboardingStep}
        setShowOnboarding={setShowOnboarding}
        handleBack={handleBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-kitchen-cream">
      <Header title="Recipe Ideas" />
      
      <main className="pb-20">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-kitchen-green via-kitchen-sage to-kitchen-blue text-white py-8 px-4"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex p-3 rounded-full bg-white/20 mb-4"
            >
              <ChefHat size={40} />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              AI-Powered Recipe Ideas
            </h1>
            <p className="text-lg opacity-90 mb-6">
              Discover personalized recipes based on your pantry ingredients
            </p>
          </div>
        </motion.section>

        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          <RecipeGeneratorContainer 
            showGenerator={showGenerator}
            setShowGenerator={setShowGenerator}
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
            selectedIngredients={[]}
            setSelectedIngredients={() => {}}
            selectedDifficulty=""
            setSelectedDifficulty={() => {}}
            selectedTime=""
            setSelectedTime={() => {}}
            selectedDiet=""
            setSelectedDiet={() => {}}
            isGenerating={false}
            generatedRecipes={[]}
            onGenerateRecipes={() => {}}
          />
          
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-kitchen-orange" />
                Recipe Discovery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Input
                  placeholder="Search for recipes, ingredients, or cuisines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1"
                >
                  <Filter size={16} />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gradient-to-br from-kitchen-orange to-kitchen-berry rounded-lg mb-3"></div>
                      <h3 className="font-medium mb-2">Recipe {i}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>30 min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>4 servings</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Heart size={14} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipesPage;
