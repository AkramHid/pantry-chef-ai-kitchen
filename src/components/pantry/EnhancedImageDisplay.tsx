
import React, { useState } from 'react';
import { Package, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface EnhancedImageDisplayProps {
  src?: string;
  alt: string;
  category: 'fridge' | 'freezer' | 'pantry';
  className?: string;
  fallbackClassName?: string;
}

const EnhancedImageDisplay: React.FC<EnhancedImageDisplayProps> = ({
  src,
  alt,
  category,
  className = '',
  fallbackClassName = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getCategoryPlaceholder = () => {
    const placeholders = {
      fridge: '🥛',
      freezer: '🧊', 
      pantry: '🥫'
    };
    return placeholders[category];
  };

  const getCategoryColor = () => {
    const colors = {
      fridge: 'bg-blue-50 text-blue-600',
      freezer: 'bg-cyan-50 text-cyan-600',
      pantry: 'bg-orange-50 text-orange-600'
    };
    return colors[category];
  };

  if (imageError || !src) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${className} ${fallbackClassName} ${getCategoryColor()} flex flex-col items-center justify-center`}
      >
        <span className="text-2xl mb-1">{getCategoryPlaceholder()}</span>
        <Package size={16} className="opacity-50" />
      </motion.div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden`}>
      {imageLoading && (
        <div className={`absolute inset-0 ${getCategoryColor()} flex items-center justify-center`}>
          <div className="animate-pulse">
            <Package size={20} className="opacity-50" />
          </div>
        </div>
      )}
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoading ? 0 : 1 }}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
      />
    </div>
  );
};

export default EnhancedImageDisplay;
