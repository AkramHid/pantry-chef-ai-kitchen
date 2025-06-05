
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChefHat, DollarSign, Calendar } from 'lucide-react';
import { OnboardingData } from '../IntelligentOnboarding';

interface ChefPreferencesStepProps {
  data: OnboardingData;
  onUpdateData: (section: keyof OnboardingData, data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const ChefPreferencesStep: React.FC<ChefPreferencesStepProps> = ({
  data,
  onUpdateData,
  onNext,
  onBack
}) => {
  const { chefPreferences } = data;

  const chefTypes = [
    { value: 'home', label: 'Home Chefs', icon: '🏠', description: 'Community cooks with great ratings' },
    { value: 'professional', label: 'Restaurant Chefs', icon: '👨‍🍳', description: 'Certified professionals' },
    { value: 'elite', label: 'Private Chefs', icon: '⭐', description: 'Luxury event specialists' }
  ];

  const budgetRanges = [
    { value: 'budget', label: 'Budget-friendly', icon: '💰', description: '$25-50/meal' },
    { value: 'moderate', label: 'Moderate', icon: '🍽️', description: '$50-100/meal' },
    { value: 'premium', label: 'Premium', icon: '✨', description: '$100+/meal' }
  ];

  const eventTypes = [
    'Date Night', 'Family Dinner', 'Birthday Party', 'Holiday Meals',
    'Dinner Party', 'Cooking Lessons', 'Meal Prep', 'Special Occasions',
    'Corporate Events', 'Romantic Dinner'
  ];

  const frequencies = [
    { value: 'rare', label: 'Rarely', icon: '✨', description: 'Special occasions only' },
    { value: 'occasional', label: 'Occasionally', icon: '📅', description: 'Few times a year' },
    { value: 'regular', label: 'Regularly', icon: '🔄', description: 'Monthly or more' }
  ];

  const updatePreferences = (updates: Partial<typeof chefPreferences>) => {
    onUpdateData('chefPreferences', updates);
  };

  const toggleChefType = (type: 'home' | 'professional' | 'elite') => {
    const current = chefPreferences.preferredChefTypes;
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    updatePreferences({ preferredChefTypes: updated });
  };

  const toggleEventType = (eventType: string) => {
    const current = chefPreferences.eventTypes;
    const updated = current.includes(eventType)
      ? current.filter(e => e !== eventType)
      : [...current, eventType];
    updatePreferences({ eventTypes: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-kitchen-dark mb-2">
          Chef Service Preferences
        </h2>
        <p className="text-gray-600">
          Help us match you with the perfect chef for your needs
        </p>
      </div>

      {/* Chef Types */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-3">
          <ChefHat size={16} />
          What type of chefs interest you?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {chefTypes.map(chef => (
            <Card
              key={chef.value}
              className={`cursor-pointer transition-all ${
                chefPreferences.preferredChefTypes.includes(chef.value as any)
                  ? 'ring-2 ring-kitchen-green bg-kitchen-green/5'
                  : 'hover:shadow-md'
              }`}
              onClick={() => toggleChefType(chef.value as any)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{chef.icon}</div>
                <h3 className="font-semibold">{chef.label}</h3>
                <p className="text-sm text-gray-500">{chef.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          You can select multiple types
        </p>
      </div>

      {/* Budget Range */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-3">
          <DollarSign size={16} />
          What's your preferred budget range for chef services?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {budgetRanges.map(budget => (
            <Card
              key={budget.value}
              className={`cursor-pointer transition-all ${
                chefPreferences.budgetRange === budget.value
                  ? 'ring-2 ring-kitchen-green bg-kitchen-green/5'
                  : 'hover:shadow-md'
              }`}
              onClick={() => updatePreferences({ budgetRange: budget.value as any })}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{budget.icon}</div>
                <h3 className="font-semibold">{budget.label}</h3>
                <p className="text-sm text-gray-500">{budget.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Event Types */}
      <div>
        <label className="text-sm font-medium mb-3 block">
          What types of events would you hire a chef for?
        </label>
        <div className="flex flex-wrap gap-2">
          {eventTypes.map(eventType => (
            <Badge
              key={eventType}
              variant={chefPreferences.eventTypes.includes(eventType) ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                chefPreferences.eventTypes.includes(eventType)
                  ? "bg-kitchen-green hover:bg-kitchen-green/90"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => toggleEventType(eventType)}
            >
              {eventType}
            </Badge>
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-3">
          <Calendar size={16} />
          How often would you consider hiring a chef?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {frequencies.map(freq => (
            <Card
              key={freq.value}
              className={`cursor-pointer transition-all ${
                chefPreferences.frequency === freq.value
                  ? 'ring-2 ring-kitchen-green bg-kitchen-green/5'
                  : 'hover:shadow-md'
              }`}
              onClick={() => updatePreferences({ frequency: freq.value as any })}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{freq.icon}</div>
                <h3 className="font-semibold">{freq.label}</h3>
                <p className="text-sm text-gray-500">{freq.description}</p>
              </CardContent>
            </Card>
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

export default ChefPreferencesStep;
