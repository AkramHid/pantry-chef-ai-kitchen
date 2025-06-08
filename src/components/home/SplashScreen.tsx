
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ship, Users, Home, Sofa } from 'lucide-react';

const lifestyleMessages = [
  {
    title: "Yacht Management",
    description: "Plan your sea journeys with ease. Manage crew, inventory and provisions in one place.",
    icon: Ship,
  },
  {
    title: "Family Coordination",
    description: "Keep everyone on the same page with shared lists, meal planning, and activity schedules.",
    icon: Users,
  },
  {
    title: "Home Organization",
    description: "Never run out of essentials. Track pantry inventory and automate shopping lists.",
    icon: Home,
  },
  {
    title: "Majlis Hosting",
    description: "Entertain guests effortlessly. Plan menus, manage catering and organize gatherings with style.",
    icon: Sofa,
  },
];

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Skip splash if user has seen it before
  useEffect(() => {
    const hasSeenSplash = localStorage.getItem('hasSeenSplash');
    if (hasSeenSplash === 'true') {
      onComplete();
      return;
    }
  }, [onComplete]);

  // Logo animation completes after 2 seconds
  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2000);

    return () => clearTimeout(logoTimer);
  }, []);

  // Rotate through messages every 2.5 seconds
  useEffect(() => {
    if (!isAppLoading) {
      const messageInterval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          
          // After showing all messages, complete the splash screen
          if (nextIndex >= lifestyleMessages.length) {
            clearInterval(messageInterval);
            setTimeout(() => {
              onComplete();
            }, 1000);
            return prevIndex;
          }
          
          return nextIndex;
        });
      }, 2500);
      
      return () => clearInterval(messageInterval);
    }
  }, [isAppLoading, onComplete]);

  const currentMessage = lifestyleMessages[currentMessageIndex];
  const IconComponent = currentMessage?.icon || Ship;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-b from-kitchen-green to-kitchen-green/80 z-50 flex flex-col items-center justify-center p-6 text-white"
      >
        {isAppLoading ? (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center mb-8 shadow-xl">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="w-24 h-24 relative"
              >
                <img 
                  src="/lovable-uploads/bbdbcad8-e50a-4414-9f49-1ad548d5a3ce.png" 
                  alt="KOFFA Logo" 
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </div>
            <h1 className="text-3xl font-bold font-heading mb-2">KOFFA</h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ duration: 1.5, delay: 0.4 }}
              className="h-1 bg-white rounded-full max-w-xs"
            />
          </motion.div>
        ) : (
          <motion.div 
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md"
          >
            <div className="flex justify-center mb-6">
              <IconComponent size={56} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold font-heading mb-3">{currentMessage.title}</h2>
            <p className="text-lg text-white/90">{currentMessage.description}</p>
          </motion.div>
        )}
        
        {!isAppLoading && (
          <div className="absolute bottom-14 flex space-x-2">
            {lifestyleMessages.map((_, index) => (
              <motion.div 
                key={index}
                className={`w-2 h-2 rounded-full ${currentMessageIndex === index ? 'bg-white' : 'bg-white/40'}`}
                animate={{ scale: currentMessageIndex === index ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </div>
        )}
        
        {!isAppLoading && currentMessageIndex === lifestyleMessages.length - 1 && (
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 px-8 py-3 bg-white text-kitchen-green font-bold rounded-full shadow-lg hover:bg-opacity-90 transition-all"
            onClick={onComplete}
          >
            Get Started
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
