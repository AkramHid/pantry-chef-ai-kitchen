
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChefHat, Sparkles, Users, ShoppingCart } from 'lucide-react';
import { OnboardingData } from '../IntelligentOnboarding';

interface WelcomeStepProps {
  data: OnboardingData;
  onUpdateData: (section: keyof OnboardingData, data: any) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  const features = [
    {
      icon: ChefHat,
      title: 'Smart Recipe Suggestions',
      description: 'AI-powered recipes based on your pantry and preferences'
    },
    {
      icon: ShoppingCart,
      title: 'Intelligent Shopping Lists',
      description: 'Organized by store layout with smart recommendations'
    },
    {
      icon: Users,
      title: 'Chef Rental Service',
      description: 'Connect with home cooks and professional chefs'
    },
    {
      icon: Sparkles,
      title: 'Pantry Management',
      description: 'Track ingredients, expiry dates, and usage patterns'
    }
  ];

  return (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center mb-6"
      >
        <div className="p-4 bg-kitchen-green/10 rounded-full">
          <ChefHat size={64} className="text-kitchen-green" />
        </div>
      </motion.div>

      <div>
        <h2 className="text-3xl font-bold text-kitchen-dark mb-4">
          Welcome to Your Smart Kitchen Assistant
        </h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Let's personalize your experience! We'll ask a few questions to understand
          your cooking style, preferences, and goals to provide the best recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="p-4 bg-gray-50 rounded-lg"
          >
            <feature.icon size={32} className="text-kitchen-green mx-auto mb-2" />
            <h3 className="font-semibold text-kitchen-dark mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          onClick={onNext}
          size="lg"
          className="bg-kitchen-green hover:bg-kitchen-green/90 px-8"
        >
          Let's Get Started! 🚀
        </Button>
        <p className="text-sm text-gray-500 mt-3">
          This will only take 2-3 minutes
        </p>
      </motion.div>
    </div>
  );
};

export default WelcomeStep;
