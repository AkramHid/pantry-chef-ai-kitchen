
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Sparkles, ChefHat, Gift } from 'lucide-react';

interface CompletionStepProps {
  onNext: () => void;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ onNext }) => {
  const achievements = [
    { icon: CheckCircle, label: 'Profile Complete', description: 'Kitchen preferences set' },
    { icon: Sparkles, label: 'AI Ready', description: 'Personalized recommendations enabled' },
    { icon: ChefHat, label: 'Chef Network', description: 'Access to our chef community' },
    { icon: Gift, label: 'Welcome Bonus', description: 'First recipe suggestion ready!' }
  ];

  return (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center mb-6"
      >
        <div className="p-6 bg-gradient-to-br from-kitchen-green to-kitchen-blue rounded-full">
          <CheckCircle size={64} className="text-white" />
        </div>
      </motion.div>

      <div>
        <h2 className="text-3xl font-bold text-kitchen-dark mb-4">
          Welcome to Your Smart Kitchen! 🎉
        </h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          You're all set! Your personalized kitchen assistant is ready to help you 
          discover amazing recipes, manage your pantry, and connect with talented chefs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card className="bg-gradient-to-r from-kitchen-green/5 to-kitchen-blue/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <achievement.icon size={24} className="text-kitchen-green" />
                  <div className="text-left">
                    <h3 className="font-semibold text-kitchen-dark">{achievement.label}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-kitchen-orange/10 to-kitchen-berry/10 p-6 rounded-lg mb-8"
      >
        <h3 className="font-semibold text-kitchen-dark mb-2">What's Next?</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>✨ Get your first personalized recipe suggestions</li>
          <li>📱 Add items to your digital pantry</li>
          <li>🛒 Create smart shopping lists</li>
          <li>👨‍🍳 Explore our chef community</li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <Button
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-kitchen-green to-kitchen-blue hover:from-kitchen-green/90 hover:to-kitchen-blue/90 px-8 text-white"
        >
          Enter My Kitchen 🚀
        </Button>
        <p className="text-sm text-gray-500 mt-3">
          Let's start cooking something amazing!
        </p>
      </motion.div>
    </div>
  );
};

export default CompletionStep;
