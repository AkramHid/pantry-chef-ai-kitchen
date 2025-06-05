
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Clock, Heart, Utensils } from 'lucide-react';
import { OnboardingData } from '../IntelligentOnboarding';

interface CookingStyleStepProps {
  data: OnboardingData;
  onUpdateData: (section: keyof OnboardingData, data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const CookingStyleStep: React.FC<CookingStyleStepProps> = ({
  data,
  onUpdateData,
  onNext,
  onBack
}) => {
  const { cookingStyle } = data;

  const cuisines = [
    'Italian', 'Mexican', 'Asian', 'American', 'Mediterranean',
    'Indian', 'French', 'Thai', 'Japanese', 'Middle Eastern',
    'Latin American', 'African', 'German', 'Korean'
  ];

  const mealTypes = [
    'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts',
    'Appetizers', 'Soups', 'Salads', 'Smoothies', 'Baking'
  ];

  const cookingTimes = [
    { value: 'quick', label: 'Quick & Easy', icon: '⚡', description: '15-30 minutes' },
    { value: 'moderate', label: 'Moderate', icon: '🍳', description: '30-60 minutes' },
    { value: 'elaborate', label: 'Elaborate', icon: '👨‍🍳', description: '1+ hours' }
  ];

  const updateStyle = (updates: Partial<typeof cookingStyle>) => {
    onUpdateData('cookingStyle', updates);
  };

  const toggleCuisine = (cuisine: string) => {
    const current = cookingStyle.cuisinePreferences;
    const updated = current.includes(cuisine)
      ? current.filter(c => c !== cuisine)
      : [...current, cuisine];
    updateStyle({ cuisinePreferences: updated });
  };

  const toggleMealType = (mealType: string) => {
    const current = cookingStyle.mealTypes;
    const updated = current.includes(mealType)
      ? current.filter(m => m !== mealType)
      : [...current, mealType];
    updateStyle({ mealTypes: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-kitchen-dark mb-2">
          Your Cooking Style
        </h2>
        <p className="text-gray-600">
          Help us suggest recipes that match your preferences
        </p>
      </div>

      {/* Cuisine Preferences */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-3">
          <Utensils size={16} />
          What cuisines do you enjoy?
        </label>
        <div className="flex flex-wrap gap-2">
          {cuisines.map(cuisine => (
            <Badge
              key={cuisine}
              variant={cookingStyle.cuisinePreferences.includes(cuisine) ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                cookingStyle.cuisinePreferences.includes(cuisine)
                  ? "bg-kitchen-green hover:bg-kitchen-green/90"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => toggleCuisine(cuisine)}
            >
              {cuisine}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Select your favorite cuisines for personalized suggestions
        </p>
      </div>

      {/* Meal Types */}
      <div>
        <label className="text-sm font-medium mb-3 block">
          What types of meals do you typically prepare?
        </label>
        <div className="flex flex-wrap gap-2">
          {mealTypes.map(mealType => (
            <Badge
              key={mealType}
              variant={cookingStyle.mealTypes.includes(mealType) ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                cookingStyle.mealTypes.includes(mealType)
                  ? "bg-kitchen-green hover:bg-kitchen-green/90"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => toggleMealType(mealType)}
            >
              {mealType}
            </Badge>
          ))}
        </div>
      </div>

      {/* Cooking Time Preference */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-3">
          <Clock size={16} />
          How much time do you typically spend cooking?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {cookingTimes.map(time => (
            <Card
              key={time.value}
              className={`cursor-pointer transition-all ${
                cookingStyle.cookingTime === time.value
                  ? 'ring-2 ring-kitchen-green bg-kitchen-green/5'
                  : 'hover:shadow-md'
              }`}
              onClick={() => updateStyle({ cookingTime: time.value as any })}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{time.icon}</div>
                <h3 className="font-semibold">{time.label}</h3>
                <p className="text-sm text-gray-500">{time.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Health Focus */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <Heart className="text-kitchen-green" size={20} />
          <div>
            <h3 className="font-medium">Health-focused Cooking</h3>
            <p className="text-sm text-gray-600">Prioritize nutritious, balanced meals</p>
          </div>
        </div>
        <Switch
          checked={cookingStyle.healthFocus}
          onCheckedChange={(checked) => updateStyle({ healthFocus: checked })}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onNext}
          className="bg-kitchen-green hover:bg-kitchen-green/90"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default CookingStyleStep;
