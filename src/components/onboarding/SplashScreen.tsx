
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Utensils, ShoppingCart } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: ChefHat,
      title: "Welcome to Pantry Chef",
      subtitle: "Your AI-powered kitchen assistant"
    },
    {
      icon: Utensils,
      title: "Manage Your Pantry",
      subtitle: "Track ingredients and expiry dates"
    },
    {
      icon: ShoppingCart,
      title: "Smart Shopping Lists",
      subtitle: "Organized by store layout"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setTimeout(onComplete, 1000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  const IconComponent = steps[currentStep].icon;

  return (
    <motion.div 
      className="fixed inset-0 bg-kitchen-green flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center text-white">
        <motion.div
          key={currentStep}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <IconComponent size={80} className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">{steps[currentStep].title}</h1>
          <p className="text-xl opacity-90">{steps[currentStep].subtitle}</p>
        </motion.div>
        
        <div className="flex justify-center space-x-2 mt-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentStep ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
