
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
import { GeneratedRecipe } from '@/components/recipes/RecipeDetail';
import { KitchenStyle } from '@/components/recipes/KitchenStyleSelector';
import { useToast } from '@/hooks/use-toast';

const onboardingSteps = [
  {
    title: "Welcome to Recipe Ideas!",
    description: "Discover amazing recipes based on what you have in your pantry.",
    content: <div className="w-full h-48 bg-gradient-to-br from-kitchen-green to-kitchen-sage rounded-lg flex items-center justify-center text-white text-xl font-bold">Welcome!</div>
  },
  {
    title: "AI-Powered Suggestions",
    description: "Our AI creates personalized recipes from your ingredients.",
    content: <div className="w-full h-48 bg-gradient-to-br from-kitchen-orange to-kitchen-berry rounded-lg flex items-center justify-center text-white text-xl font-bold">AI Magic!</div>
  },
  {
    title: "Save Your Favorites",
    description: "Keep track of recipes you love for easy access later.",
    content: <div className="w-full h-48 bg-gradient-to-br from-kitchen-blue to-kitchen-sage rounded-lg flex items-center justify-center text-white text-xl font-bold">Favorites!</div>
  }
];

const mockRecipes = [
  {
    id: '1',
    title: 'Mediterranean Pasta Salad',
    cookTime: 25,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'Mediterranean',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '2',
    title: 'Asian Stir Fry',
    cookTime: 15,
    servings: 2,
    difficulty: 'Medium',
    cuisine: 'Asian',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '3',
    title: 'Classic Chicken Soup',
    cookTime: 45,
    servings: 6,
    difficulty: 'Easy',
    cuisine: 'American',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
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
  const [selectedStyle, setSelectedStyle] = useState<KitchenStyle>('modern');
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<GeneratedRecipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState<string[]>([]);

  // Check if this is first visit
  useEffect(() => {
    const hasVisitedRecipes = localStorage.getItem('hasVisitedRecipes');
    if (!hasVisitedRecipes) {
      setShowSplash(true);
      localStorage.setItem('hasVisitedRecipes', 'true');
    }
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('pantryChef_favoriteRecipes');
    if (savedFavorites) {
      setFavoriteRecipes(JSON.parse(savedFavorites));
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

  const generateRecipe = async (ingredients: string[]) => {
    setIsGenerating(true);
    try {
      // Simulate AI recipe generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockRecipe: GeneratedRecipe = {
        id: `recipe-${Date.now()}`,
        title: `${selectedStyle} Recipe with ${ingredients.slice(0, 2).join(' and ')}`,
        description: `A delicious ${selectedStyle.toLowerCase()} recipe using your selected ingredients.`,
        ingredients: ingredients.map(ing => `1 cup ${ing}`),
        instructions: [
          'Prepare all ingredients',
          'Heat a pan over medium heat',
          'Combine ingredients according to your style preference',
          'Cook until done',
          'Serve and enjoy!'
        ],
        cookTime: 30,
        servings: 4,
        difficulty: 'Medium',
        cuisine: selectedStyle === 'traditional' ? 'Traditional' : 'Modern',
        kitchenStyle: selectedStyle,
        nutritionInfo: {
          calories: 250,
          protein: 15,
          carbs: 30,
          fat: 10
        }
      };

      setGeneratedRecipe(mockRecipe);
      toast({
        title: "Recipe generated!",
        description: "Your personalized recipe is ready.",
      });
    } catch (error) {
      toast({
        title: "Error generating recipe",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTryAnother = () => {
    setGeneratedRecipe(null);
    setSelectedRecipe(null);
  };

  const handleToggleFavorite = (id: string) => {
    setFavoriteRecipes(prev => {
      const newFavorites = prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id];
      localStorage.setItem('pantryChef_favoriteRecipes', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  if (showSplash) {
    return <RecipeSplashScreen onComplete={handleSplashComplete} />;
  }

  if (showOnboarding) {
    return (
      <OnboardingScreen
        steps={onboardingSteps}
        currentStep={onboardingStep}
        onNext={() => setOnboardingStep(prev => prev + 1)}
        onBack={() => setOnboardingStep(prev => prev - 1)}
        onComplete={handleOnboardingComplete}
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
            generatedRecipe={generatedRecipe}
            setGeneratedRecipe={setGeneratedRecipe}
            selectedRecipe={selectedRecipe}
            setSelectedRecipe={setSelectedRecipe}
            isGenerating={isGenerating}
            generateRecipe={generateRecipe}
            handleTryAnother={handleTryAnother}
            favoriteRecipes={favoriteRecipes}
            onToggleFavorite={handleToggleFavorite}
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
                {mockRecipes.map((recipe) => (
                  <Card key={recipe.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div 
                        className="aspect-video rounded-lg mb-3 bg-cover bg-center"
                        style={{ backgroundImage: `url(${recipe.image})` }}
                      ></div>
                      <h3 className="font-medium mb-2">{recipe.title}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{recipe.cookTime} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{recipe.servings} servings</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleFavorite(recipe.id)}
                        >
                          <Heart 
                            size={14} 
                            className={favoriteRecipes.includes(recipe.id) ? 'fill-red-500 text-red-500' : ''} 
                          />
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
