
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChefPageHero from '@/components/chef/ChefPageHero';
import ChefFilter from '@/components/chef/ChefFilter';
import ChefList from '@/components/chef/ChefList';
import ChefBookingSidebar from '@/components/chef/ChefBookingSidebar';
import { chefData } from '@/data/chefData';
import { useIsMobile } from '@/hooks/use-mobile';

export interface Chef {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  cuisine: string[];
  price: number;
  experience: number;
  availability: string[];
  bio: string;
  specialties: string[];
  languages: string[];
  location: string;
}

export interface ChefFilters {
  cuisine: string;
  priceRange: [number, number];
  rating: number;
  availability: string;
  location: string;
}

const RentChefPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
  const [filters, setFilters] = useState<ChefFilters>({
    cuisine: 'all',
    priceRange: [0, 500],
    rating: 0,
    availability: 'all',
    location: 'all'
  });

  const handleChefSelect = (chef: Chef) => {
    setSelectedChef(chef);
  };

  const handleCloseSidebar = () => {
    setSelectedChef(null);
  };

  const filteredChefs = chefData.filter((chef) => {
    const matchesCuisine = filters.cuisine === 'all' || chef.cuisine.includes(filters.cuisine);
    const matchesPrice = chef.price >= filters.priceRange[0] && chef.price <= filters.priceRange[1];
    const matchesRating = chef.rating >= filters.rating;
    const matchesAvailability = filters.availability === 'all' || chef.availability.includes(filters.availability);
    const matchesLocation = filters.location === 'all' || chef.location === filters.location;

    return matchesCuisine && matchesPrice && matchesRating && matchesAvailability && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm px-4 py-3 flex items-center md:hidden"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="mr-3"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold">Rent a Chef</h1>
      </motion.div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <ChefPageHero />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <ChefFilter
                filters={filters}
                onFiltersChange={setFilters}
                totalChefs={filteredChefs.length}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className={`${selectedChef && !isMobile ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Available Chefs
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {filteredChefs.length} chef{filteredChefs.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>

              <ChefList
                chefs={filteredChefs}
                onChefSelect={handleChefSelect}
                selectedChefId={selectedChef?.id}
              />
            </motion.div>
          </div>

          {/* Booking Sidebar - Desktop Only */}
          {selectedChef && !isMobile && (
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <ChefBookingSidebar
                  chef={selectedChef}
                  onClose={handleCloseSidebar}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Booking Modal */}
      {selectedChef && isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={handleCloseSidebar}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <ChefBookingSidebar
                chef={selectedChef}
                onClose={handleCloseSidebar}
                isMobile={true}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default RentChefPage;
