
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, DollarSign, Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Chef } from '@/types/chef';
import { ChefGalleryModal } from './ChefGalleryModal';
import UberStyleBooking from './UberStyleBooking';

interface ChefCardProps {
  chef: Chef;
  onBookNow: (chef: Chef) => void;
  onViewGallery?: (chef: Chef) => void;
}

export const ChefCard: React.FC<ChefCardProps> = ({ 
  chef, 
  onBookNow,
  onViewGallery 
}) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleViewGallery = () => {
    setIsGalleryOpen(true);
    if (onViewGallery) {
      onViewGallery(chef);
    }
  };

  const handleBookNow = () => {
    setIsBookingOpen(true);
    onBookNow(chef);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img 
            src={chef.image} 
            alt={chef.name} 
            className="w-full h-48 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://images.unsplash.com/photo-1556911073-38141963c9e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
            }}
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-kitchen-green text-white">
              {chef.rating} ⭐
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="text-xl font-bold text-kitchen-dark mb-2">{chef.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{chef.description}</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={14} className="mr-1" />
              {chef.location}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign size={14} className="mr-1" />
              ${chef.hourlyRate}/hour
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock size={14} className="mr-1" />
              {chef.availability.join(', ')}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex flex-wrap gap-1 mb-2">
              {chef.specialties.slice(0, 3).map((specialty, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {chef.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{chef.specialties.length - 3} more
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleViewGallery}
              variant="outline" 
              size="sm" 
              className="flex-1"
            >
              <Eye size={16} className="mr-1" />
              Gallery
            </Button>
            <Button 
              onClick={handleBookNow}
              size="sm" 
              className="flex-1 bg-kitchen-green hover:bg-kitchen-green/90"
            >
              Book Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <ChefGalleryModal
        chef={chef}
        open={isGalleryOpen}
        onOpenChange={setIsGalleryOpen}
      />

      <UberStyleBooking
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedChef={chef}
      />
    </>
  );
};
