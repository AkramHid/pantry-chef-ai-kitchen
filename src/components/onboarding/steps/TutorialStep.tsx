
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChefHat, Utensils, ShoppingCart, Users, Sparkles, PlayCircle } from 'lucide-react';

interface TutorialStepProps {
  onNext: () => void;
  onBack: () => void;
}

const TutorialStep: React.FC<TutorialStepProps> = ({ onNext, onBack }) => {
  const [currentTutorial, setCurrentTutorial] = useState(0);

  const tutorials = [
    {
      icon: Utensils,
      title: 'Managing Your Pantry',
      description: 'Add items, track expiry dates, and get smart suggestions for what to cook with ingredients you already have.',
      features: [
        'Scan barcodes to add items quickly',
        'Set expiry date reminders',
        'Create custom ingredient lists',
        'Track quantity and usage patterns'
      ]
    },
    {
      icon: ShoppingCart,
      title: 'Smart Shopping Lists',
      description: 'Create organized shopping lists that optimize your store visits and help you never forget an ingredient.',
      features: [
        'Auto-organize by store layout',
        'Share lists with family members',
        'Add missing recipe ingredients',
        'Track prices and find deals'
      ]
    },
    {
      icon: ChefHat,
      title: 'AI Recipe Suggestions',
      description: 'Get personalized recipe recommendations based on your pantry contents, preferences, and dietary needs.',
      features: [
        'Recipes using your ingredients',
        'Difficulty level matching',
        'Cuisine preference filtering',
        'Nutritional information'
      ]
    },
    {
      icon: Users,
      title: 'Chef Rental Service',
      description: 'Connect with talented chefs for special occasions, cooking lessons, or regular meal preparation.',
      features: [
        'Browse chef profiles and ratings',
        'Book for events or lessons',
        'View signature dishes',
        'Direct communication with chefs'
      ]
    }
  ];

  const currentTutorialData = tutorials[currentTutorial];
  const TutorialIcon = currentTutorialData.icon;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-kitchen-dark mb-2">
          Quick Tutorial
        </h2>
        <p className="text-gray-600">
          Learn how to make the most of your kitchen assistant
        </p>
      </div>

      {/* Tutorial Navigation */}
      <div className="flex justify-center space-x-2 mb-6">
        {tutorials.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentTutorial
                ? 'bg-kitchen-green'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => setCurrentTutorial(index)}
          />
        ))}
      </div>

      {/* Tutorial Content */}
      <motion.div
        key={currentTutorial}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-kitchen-green/5 to-kitchen-blue/5">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="inline-flex p-4 bg-kitchen-green/10 rounded-full mb-4">
                <TutorialIcon size={40} className="text-kitchen-green" />
              </div>
              <h3 className="text-xl font-bold text-kitchen-dark mb-2">
                {currentTutorialData.title}
              </h3>
              <p className="text-gray-600">
                {currentTutorialData.description}
              </p>
            </div>

            <div className="space-y-3">
              {currentTutorialData.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg"
                >
                  <Sparkles size={16} className="text-kitchen-green flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => {
                  // In a real app, this would open a video tutorial
                  console.log('Opening video tutorial for:', currentTutorialData.title);
                }}
              >
                <PlayCircle size={16} />
                Watch Tutorial
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tutorial Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            if (currentTutorial > 0) {
              setCurrentTutorial(currentTutorial - 1);
            } else {
              onBack();
            }
          }}
        >
          {currentTutorial === 0 ? 'Back' : 'Previous'}
        </Button>
        
        <Button
          onClick={() => {
            if (currentTutorial < tutorials.length - 1) {
              setCurrentTutorial(currentTutorial + 1);
            } else {
              onNext();
            }
          }}
          className="bg-kitchen-green hover:bg-kitchen-green/90"
        >
          {currentTutorial === tutorials.length - 1 ? 'Finish Tutorial' : 'Next'}
        </Button>
      </div>

      <div className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onNext}
          className="text-gray-500"
        >
          Skip Tutorial
        </Button>
      </div>
    </div>
  );
};

export default TutorialStep;
