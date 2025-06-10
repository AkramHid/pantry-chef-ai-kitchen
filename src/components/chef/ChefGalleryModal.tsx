
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Chef } from '@/types/chef';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface ChefGalleryModalProps {
  chef: Chef;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChefGalleryModal: React.FC<ChefGalleryModalProps> = ({ 
  chef, 
  open, 
  onOpenChange 
}) => {
  const [activeImage, setActiveImage] = useState(0);

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % chef.gallery.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + chef.gallery.length) % chef.gallery.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {chef.name}'s Recipe Gallery
            <Badge variant="secondary" className="ml-2">
              {chef.specialties.join(', ')}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {/* Main image display */}
          <div className="relative rounded-lg overflow-hidden mb-4">
            <div className="aspect-video relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={chef.gallery[activeImage]} 
                  alt={`${chef.name}'s dish ${activeImage + 1}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "https://images.unsplash.com/photo-1556911073-38141963c9e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                  }}
                />
              </AnimatePresence>
              
              {/* Navigation arrows */}
              {chef.gallery.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={prevImage}
                  >
                    <ChevronLeft size={24} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={nextImage}
                  >
                    <ChevronRight size={24} />
                  </Button>
                </>
              )}
              
              {/* Image counter */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {activeImage + 1} / {chef.gallery.length}
              </div>
            </div>
          </div>
          
          {/* Thumbnails */}
          {chef.gallery.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {chef.gallery.map((image, index) => (
                <motion.div 
                  key={index} 
                  className={`aspect-video overflow-hidden rounded-md cursor-pointer ${
                    activeImage === index ? 'ring-2 ring-kitchen-green' : 'ring-1 ring-gray-200'
                  }`}
                  onClick={() => setActiveImage(index)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img 
                    src={image} 
                    alt={`${chef.name}'s dish ${index + 1} (thumbnail)`} 
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      activeImage === index ? 'brightness-100' : 'brightness-90 hover:brightness-100'
                    }`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://images.unsplash.com/photo-1556911073-38141963c9e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Chef info */}
          <div className="mt-4 p-4 bg-kitchen-cream rounded-lg">
            <h3 className="font-bold text-kitchen-dark mb-2">{chef.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{chef.styles.join(', ')} cuisine specialist</p>
            <p className="text-sm text-gray-700">{chef.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
