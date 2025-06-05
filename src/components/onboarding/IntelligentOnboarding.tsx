
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import WelcomeStep from './steps/WelcomeStep';
import KitchenProfileStep from './steps/KitchenProfileStep';
import PantrySetupStep from './steps/PantrySetupStep';
import CookingStyleStep from './steps/CookingStyleStep';
import ChefPreferencesStep from './steps/ChefPreferencesStep';
import TutorialStep from './steps/TutorialStep';
import CompletionStep from './steps/CompletionStep';

export interface OnboardingData {
  kitchenProfile: {
    familySize: number;
    dietaryRestrictions: string[];
    cookingSkillLevel: 'beginner' | 'intermediate' | 'advanced';
    kitchenSize: 'small' | 'medium' | 'large';
    cookingFrequency: 'daily' | 'weekly' | 'occasionally';
  };
  pantryPreferences: {
    preferredStores: string[];
    organicPreference: boolean;
    budgetRange: 'low' | 'medium' | 'high';
    bulkBuying: boolean;
  };
  cookingStyle: {
    cuisinePreferences: string[];
    mealTypes: string[];
    cookingTime: 'quick' | 'moderate' | 'elaborate';
    healthFocus: boolean;
  };
  chefPreferences: {
    preferredChefTypes: ('home' | 'professional' | 'elite')[];
    budgetRange: 'budget' | 'moderate' | 'premium';
    eventTypes: string[];
    frequency: 'rare' | 'occasional' | 'regular';
  };
}

interface IntelligentOnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

const IntelligentOnboarding: React.FC<IntelligentOnboardingProps> = ({
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    kitchenProfile: {
      familySize: 1,
      dietaryRestrictions: [],
      cookingSkillLevel: 'beginner',
      kitchenSize: 'medium',
      cookingFrequency: 'weekly'
    },
    pantryPreferences: {
      preferredStores: [],
      organicPreference: false,
      budgetRange: 'medium',
      bulkBuying: false
    },
    cookingStyle: {
      cuisinePreferences: [],
      mealTypes: [],
      cookingTime: 'moderate',
      healthFocus: false
    },
    chefPreferences: {
      preferredChefTypes: [],
      budgetRange: 'moderate',
      eventTypes: [],
      frequency: 'occasional'
    }
  });
  const { toast } = useToast();

  const steps = [
    { component: WelcomeStep, title: 'Welcome to Pantry Chef AI' },
    { component: KitchenProfileStep, title: 'Your Kitchen Profile' },
    { component: PantrySetupStep, title: 'Pantry Preferences' },
    { component: CookingStyleStep, title: 'Cooking Style' },
    { component: ChefPreferencesStep, title: 'Chef Preferences' },
    { component: TutorialStep, title: 'Quick Tutorial' },
    { component: CompletionStep, title: 'All Set!' }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('pantryChef_onboardingComplete', 'true');
    localStorage.setItem('pantryChef_userProfile', JSON.stringify(onboardingData));
    toast({
      title: 'Welcome to Pantry Chef AI! 🎉',
      description: 'Your personalized kitchen assistant is ready to help.',
    });
    onComplete(onboardingData);
  };

  const updateOnboardingData = (section: keyof OnboardingData, data: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-kitchen-cream via-white to-kitchen-green/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden"
      >
        {/* Progress Header */}
        <div className="bg-kitchen-green text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{steps[currentStep].title}</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              Skip Setup
            </Button>
          </div>
          <Progress value={progress} className="h-2 bg-white/20" />
          <p className="text-sm opacity-90 mt-2">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Step Content */}
        <div className="p-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent
                data={onboardingData}
                onUpdateData={updateOnboardingData}
                onNext={handleNext}
                onBack={handleBack}
                isFirst={currentStep === 0}
                isLast={currentStep === steps.length - 1}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default IntelligentOnboarding;
