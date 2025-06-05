
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ShoppingCart, DollarSign, Leaf, Package } from 'lucide-react';
import { OnboardingData } from '../IntelligentOnboarding';

interface PantrySetupStepProps {
  data: OnboardingData;
  onUpdateData: (section: keyof OnboardingData, data: any) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const PantrySetupStep: React.FC<PantrySetupStepProps> = ({
  data,
  onUpdateData,
  onNext,
  onBack
}) => {
  const { pantryPreferences } = data;

  const stores = [
    'Walmart', 'Target', 'Kroger', 'Safeway', 'Whole Foods',
    'Trader Joe\'s', 'Costco', 'Sam\'s Club', 'Aldi', 'Other'
  ];

  const budgetRanges = [
    { value: 'low', label: 'Budget-friendly', icon: '💰', description: 'Focus on savings' },
    { value: 'medium', label: 'Moderate', icon: '🛒', description: 'Quality & value' },
    { value: 'high', label: 'Premium', icon: '⭐', description: 'Best quality' }
  ];

  const updatePreferences = (updates: Partial<typeof pantryPreferences>) => {
    onUpdateData('pantryPreferences', updates);
  };

  const toggleStore = (store: string) => {
    const current = pantryPreferences.preferredStores;
    const updated = current.includes(store)
      ? current.filter(s => s !== store)
      : [...current, store];
    updatePreferences({ preferredStores: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-kitchen-dark mb-2">
          Shopping Preferences
        </h2>
        <p className="text-gray-600">
          Help us optimize your shopping experience
        </p>
      </div>

      {/* Preferred Stores */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-3">
          <ShoppingCart size={16} />
          Where do you usually shop for groceries?
        </label>
        <div className="flex flex-wrap gap-2">
          {stores.map(store => (
            <Badge
              key={store}
              variant={pantryPreferences.preferredStores.includes(store) ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                pantryPreferences.preferredStores.includes(store)
                  ? "bg-kitchen-green hover:bg-kitchen-green/90"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => toggleStore(store)}
            >
              {store}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Select multiple stores to optimize your shopping lists
        </p>
      </div>

      {/* Budget Range */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-3">
          <DollarSign size={16} />
          What's your typical grocery budget approach?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {budgetRanges.map(budget => (
            <Card
              key={budget.value}
              className={`cursor-pointer transition-all ${
                pantryPreferences.budgetRange === budget.value
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

      {/* Preferences */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Leaf className="text-kitchen-green" size={20} />
            <div>
              <h3 className="font-medium">Organic Preference</h3>
              <p className="text-sm text-gray-600">Prefer organic ingredients when available</p>
            </div>
          </div>
          <Switch
            checked={pantryPreferences.organicPreference}
            onCheckedChange={(checked) => updatePreferences({ organicPreference: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Package className="text-kitchen-green" size={20} />
            <div>
              <h3 className="font-medium">Bulk Buying</h3>
              <p className="text-sm text-gray-600">Buy in bulk to save money and reduce trips</p>
            </div>
          </div>
          <Switch
            checked={pantryPreferences.bulkBuying}
            onCheckedChange={(checked) => updatePreferences({ bulkBuying: checked })}
          />
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

export default PantrySetupStep;
