
import React from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface GrabAndGoHeaderProps {
  onExit: () => void;
  itemCount: number;
}

const GrabAndGoHeader: React.FC<GrabAndGoHeaderProps> = ({ onExit, itemCount }) => {
  const isMobile = useIsMobile();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-kitchen-green text-white px-3 md:px-4 py-3 shadow-md sticky top-0 z-10"
    >
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center">
          <ShoppingBag size={24} className="mr-2" />
          <div>
            <h1 className="text-lg md:text-xl font-bold">Grab &amp; Go Mode</h1>
            <p className="text-sm text-white/80">
              {itemCount} items organized by store layout
            </p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExit}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Exit Grab &amp; Go mode"
        >
          <X size={isMobile ? 20 : 24} />
        </motion.button>
      </div>
    </motion.header>
  );
};

export default GrabAndGoHeader;
