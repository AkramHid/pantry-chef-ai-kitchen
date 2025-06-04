
import React from 'react';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

interface OnboardingScreenProps {
  onboardingStep: number;
  onboardingSteps: {
    title: string;
    description: string;
    content: React.ReactNode;
  }[];
  setOnboardingStep: (step: number) => void;
  setShowOnboarding: (show: boolean) => void;
  handleBack: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onboardingStep,
  onboardingSteps,
  setOnboardingStep,
  setShowOnboarding,
  handleBack,
}) => {
  const step = onboardingSteps[onboardingStep];

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
          {onboardingStep > 0 && (
            <Button
              onClick={() => setOnboardingStep(onboardingStep - 1)}
              variant="ghost"
              className="mt-4"
            >
              Back
            </Button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OnboardingScreen;
