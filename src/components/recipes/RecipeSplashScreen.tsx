
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';

interface RecipeSplashScreenProps {
  onComplete: () => void;
}

const RecipeSplashScreen: React.FC<RecipeSplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-kitchen-green via-kitchen-sage to-kitchen-blue flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center text-white"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-flex p-4 rounded-full bg-white/20 mb-6"
        >
          <ChefHat size={64} />
        </motion.div>
        <h1 className="text-4xl font-bold mb-4">Recipe Ideas</h1>
        <p className="text-xl opacity-90">Discover amazing recipes...</p>
      </motion.div>
    </div>
  );
};

export default RecipeSplashScreen;
