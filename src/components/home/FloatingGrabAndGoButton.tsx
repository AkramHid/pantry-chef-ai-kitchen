
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const FloatingGrabAndGoButton = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: "spring" }}
    >
      <Button
        onClick={() => navigate('/grab-and-go')}
        className={`fixed ${isMobile ? 'bottom-20 right-4 w-12 h-12' : 'bottom-16 right-6 w-14 h-14'} rounded-full bg-kitchen-green shadow-lg hover:bg-kitchen-green/90 hover:scale-105 hover:shadow-xl transition-all duration-300 z-50`}
        size="icon"
        aria-label="Enter Grab & Go mode"
      >
        <ShoppingBag className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
      </Button>
    </motion.div>
  );
};

export default FloatingGrabAndGoButton;
