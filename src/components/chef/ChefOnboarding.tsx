
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChefHat, MapPin, Calendar, CreditCard, Check, X } from 'lucide-react';

interface ChefOnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action?: string;
}

const onboardingSteps: ChefOnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Find Your Perfect Chef',
    description: 'Browse through our curated selection of professional chefs ready to cook for you.',
    icon: ChefHat,
  },
  {
    id: 'location',
    title: 'Set Your Location',
    description: 'We\'ll show you chefs available in your area for the best experience.',
    icon: MapPin,
    action: 'Set Location'
  },
  {
    id: 'booking',
    title: 'Easy Booking',
    description: 'Select your preferred date, time, and let us handle the rest.',
    icon: Calendar,
    action: 'Choose Date'
  },
  {
    id: 'payment',
    title: 'Secure Payment',
    description: 'Pay securely through our platform with full protection.',
    icon: CreditCard,
    action: 'Add Payment'
  }
];

interface ChefOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

const ChefOnboarding: React.FC<ChefOnboardingProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const handleNext = () => {
    const currentStepId = onboardingSteps[currentStep].id;
    setCompletedSteps(prev => [...prev, currentStepId]);
    
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('chefOnboardingComplete', 'true');
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('chefOnboardingComplete', 'true');
    onSkip();
  };

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
  const currentStepData = onboardingSteps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="overflow-hidden">
          <div className="bg-kitchen-green text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Chef Services</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkip}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </Button>
            </div>
            <Progress value={progress} className="h-2 bg-white/20" />
            <p className="text-sm opacity-90 mt-2">
              Step {currentStep + 1} of {onboardingSteps.length}
            </p>
          </div>

          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-kitchen-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent size={32} className="text-kitchen-green" />
                  </div>
                  <h3 className="text-xl font-bold text-kitchen-dark mb-2">
                    {currentStepData.title}
                  </h3>
                  <p className="text-gray-600">
                    {currentStepData.description}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
                    disabled={currentStep === 0}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-kitchen-green hover:bg-kitchen-green/90"
                  >
                    {currentStepData.action || (currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next')}
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="mt-3 text-gray-500 hover:text-gray-700"
                >
                  Skip tutorial
                </Button>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ChefOnboarding;
