
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Home, Clock, ChefHat } from 'lucide-react';
import { OnboardingData } from '../IntelligentOnboarding';

interface KitchenProfileStepProps {
  data: OnboardingData;
  onUpdateData: (section: keyof OnboardingData, data: any) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const KitchenProfileStep: React.FC<KitchenProfileStepProps> = ({
  data,
  onUpdateData,
  onNext,
  onBack
}) => {
  const { kitchenProfile } = data;

  const familySizes = [1, 2, 3, 4, 5, 6];
  const skillLevels = [
    { value: 'beginner', label: 'Beginner', icon: '🌱', description: 'Just starting out' },
    { value: 'intermediate', label: 'Intermediate', icon: '👨‍🍳', description: 'Comfortable cooking' },
    { value: 'advanced', label: 'Advanced', icon: '⭐', description: 'Experienced chef' }
  ];
  const kitchenSizes = [
    { value: 'small', label: 'Small', description: 'Apartment kitchen' },
    { value: 'medium', label: 'Medium', description: 'Standard home kitchen' },
    { value: 'large', label: 'Large', description: 'Spacious or commercial' }
  ];
  const frequencies = [
    { value: 'daily', label: 'Daily', icon: '🍳' },
    { value: 'weekly', label: '2-3 times/week', icon: '📅' },
    { value: 'occasionally', label: 'Occasionally', icon: '✨' }
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-free', 'Keto', 'Paleo', 
    'Dairy-free', 'Nut allergies', 'Low-sodium', 'Diabetic-friendly'
  ];

  const updateProfile = (updates: Partial<typeof kitchenProfile>) => {
    onUpdateData('kitchenProfile', updates);
  };

  const toggleDietaryRestriction = (restriction: string) => {
    const current = kitchenProfile.dietaryRestrictions;
    const updated = current.includes(restriction)
      ? current.filter(r => r !== restriction)
      : [...current, restriction];
    updateProfile({ dietaryRestrictions: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-kitchen-dark mb-2">
          Tell us about your kitchen
        </h2>
        <p className="text-gray-600">
          This helps us personalize your cooking experience
        </p>
      </div>

      {/* Family Size */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-3">
          <Users size={16} />
          How many people do you typically cook for?
        </label>
        <div className="flex flex-wrap gap-2">
          {familySizes.map(size => (
            <Button
              key={size}
              variant={kitchenProfile.familySize === size ? "default" : "outline"}
              size="sm"
              onClick={() => updateProfile({ familySize: size })}
              className={kitchenProfile.familySize === size ? "bg-kitchen-green" : ""}
            >
              {size} {size === 1 ? 'person' : 'people'}
            </Button>
          ))}
        </div>
      </div>

      {/* Cooking Skill Level */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-3">
          <ChefHat size={16} />
          What's your cooking skill level?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {skillLevels.map(skill => (
            <Card
              key={skill.value}
              className={`cursor-pointer transition-all ${
                kitchenProfile.cookingSkillLevel === skill.value
                  ? 'ring-2 ring-kitchen-green bg-kitchen-green/5'
                  : 'hover:shadow-md'
              }`}
              onClick={() => updateProfile({ cookingSkillLevel: skill.value as any })}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{skill.icon}</div>
                <h3 className="font-semibold">{skill.label}</h3>
                <p className="text-sm text-gray-500">{skill.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Kitchen Size */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-3">
          <Home size={16} />
          How would you describe your kitchen size?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {kitchenSizes.map(size => (
            <Button
              key={size.value}
              variant={kitchenProfile.kitchenSize === size.value ? "default" : "outline"}
              className={`h-auto p-4 flex flex-col ${
                kitchenProfile.kitchenSize === size.value ? "bg-kitchen-green" : ""
              }`}
              onClick={() => updateProfile({ kitchenSize: size.value as any })}
            >
              <span className="font-semibold">{size.label}</span>
              <span className="text-xs opacity-80">{size.description}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Cooking Frequency */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-3">
          <Clock size={16} />
          How often do you cook at home?
        </label>
        <div className="flex flex-wrap gap-3">
          {frequencies.map(freq => (
            <Button
              key={freq.value}
              variant={kitchenProfile.cookingFrequency === freq.value ? "default" : "outline"}
              className={`flex items-center gap-2 ${
                kitchenProfile.cookingFrequency === freq.value ? "bg-kitchen-green" : ""
              }`}
              onClick={() => updateProfile({ cookingFrequency: freq.value as any })}
            >
              <span>{freq.icon}</span>
              {freq.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Dietary Restrictions */}
      <div>
        <label className="text-sm font-medium mb-3 block">
          Any dietary restrictions or preferences? (optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map(option => (
            <Badge
              key={option}
              variant={kitchenProfile.dietaryRestrictions.includes(option) ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                kitchenProfile.dietaryRestrictions.includes(option)
                  ? "bg-kitchen-green hover:bg-kitchen-green/90"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => toggleDietaryRestriction(option)}
            >
              {option}
            </Badge>
          ))}
        </div>
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

export default KitchenProfileStep;
