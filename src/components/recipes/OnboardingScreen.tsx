
import React from 'react';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

interface OnboardingScreenProps {
  steps: {
    title: string;
    description: string;
    content: React.ReactNode;
  }[];
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  steps,
  currentStep,
  onNext,
  onBack,
  onComplete,
}) => {
  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-kitchen-cream flex flex-col">
      <Header
        title="Welcome to Recipe Ideas"
        showBackButton={true}
      />
      <main className="flex-1 px-4 py-6 flex flex-col items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-center mb-2">{step.title}</h2>
          <p className="text-center text-gray-600 mb-4">{step.description}</p>
          <div>{step.content}</div>
          
          <div className="flex justify-between mt-6">
            {currentStep > 0 && (
              <Button
                onClick={onBack}
                variant="ghost"
              >
                Back
              </Button>
            )}
            
            <Button
              onClick={currentStep === steps.length - 1 ? onComplete : onNext}
              className="ml-auto"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OnboardingScreen;
