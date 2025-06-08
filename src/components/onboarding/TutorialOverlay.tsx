
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useIsMobile } from '@/hooks/use-mobile';

interface TutorialOverlayProps {
  pageName: string;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ pageName }) => {
  const { 
    tutorials, 
    currentTutorial, 
    currentStep, 
    isOnboardingActive,
    completeStep,
    skipOnboarding,
    setCurrentStep
  } = useOnboarding(pageName);
  
  const isMobile = useIsMobile();
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);

  useEffect(() => {
    if (currentTutorial?.target_element && isOnboardingActive) {
      const element = document.querySelector(currentTutorial.target_element);
      setHighlightedElement(element);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTutorial, isOnboardingActive]);

  const getAnimationVariants = (animationType: string) => {
    const variants = {
      pulse: {
        scale: [1, 1.05, 1],
        transition: { repeat: Infinity, duration: 1.5 }
      },
      bounce: {
        y: [0, -10, 0],
        transition: { repeat: Infinity, duration: 1 }
      },
      highlight: {
        boxShadow: ['0 0 0 2px rgba(34, 197, 94, 0.5)', '0 0 0 6px rgba(34, 197, 94, 0.2)', '0 0 0 2px rgba(34, 197, 94, 0.5)'],
        transition: { repeat: Infinity, duration: 2 }
      },
      slideInUp: {
        y: [20, 0],
        opacity: [0, 1],
        transition: { duration: 0.5 }
      },
      slideInRight: {
        x: [20, 0],
        opacity: [0, 1],
        transition: { duration: 0.5 }
      },
      fadeIn: {
        opacity: [0, 1],
        transition: { duration: 0.5 }
      },
      scaleIn: {
        scale: [0.9, 1],
        opacity: [0, 1],
        transition: { duration: 0.5 }
      }
    };
    return variants[animationType as keyof typeof variants] || variants.fadeIn;
  };

  const handleNext = () => {
    if (currentTutorial) {
      completeStep(currentTutorial.step_name);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = tutorials.length > 0 ? ((currentStep + 1) / tutorials.length) * 100 : 0;

  if (!isOnboardingActive || !currentTutorial) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      >
        {/* Highlight overlay for target element */}
        {highlightedElement && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              top: highlightedElement.getBoundingClientRect().top - 8,
              left: highlightedElement.getBoundingClientRect().left - 8,
              width: highlightedElement.getBoundingClientRect().width + 16,
              height: highlightedElement.getBoundingClientRect().height + 16,
            }}
            animate={getAnimationVariants(currentTutorial.animation_type || 'highlight')}
            className="border-2 border-kitchen-green rounded-lg bg-kitchen-green/10"
          />
        )}

        {/* Tutorial card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className={`absolute ${isMobile ? 'bottom-4 left-4 right-4' : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'}`}
        >
          <Card className="w-full max-w-md mx-auto shadow-2xl border-kitchen-green">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-kitchen-dark">
                  {currentTutorial.title}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={skipOnboarding}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </Button>
              </div>

              <p className="text-gray-600 mb-4">
                {currentTutorial.description}
              </p>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>Step {currentStep + 1} of {tutorials.length}</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  {isMobile ? '' : 'Previous'}
                </Button>

                <Button
                  variant="ghost"
                  onClick={skipOnboarding}
                  className="flex items-center gap-2 text-gray-500"
                >
                  <SkipForward size={16} />
                  Skip Tour
                </Button>

                <Button
                  onClick={handleNext}
                  className="bg-kitchen-green hover:bg-kitchen-green/90 flex items-center gap-2"
                >
                  {currentStep === tutorials.length - 1 ? 'Finish' : 'Next'}
                  <ArrowRight size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialOverlay;
