
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChefPageHero from '@/components/chef/ChefPageHero';
import { ChefFilter } from '@/components/chef/ChefFilter';
import ChefList from '@/components/chef/ChefList';
import ChefBookingSidebar from '@/components/chef/ChefBookingSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChefCategory, ChefStyle, Chef } from '@/types/chef';

// Mock chef data that matches the Chef interface from types/chef.ts
const mockChefs: Chef[] = [
  {
    id: '1',
    name: 'Chef Maria Rodriguez',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
    rating: 4.9,
    reviewCount: 127,
    categories: ['mexican', 'spanish', 'mediterranean'],
    styles: ['traditional', 'modern'],
    hourlyRate: 150,
    experience: 8,
    availability: ['weekends', 'evenings'],
    description: 'Professional chef with 8 years of experience in Mexican and Mediterranean cuisine.',
    specialties: ['mexican', 'spanish', 'mediterranean'],
    languages: ['English', 'Spanish'],
    location: 'Downtown',
    gallery: []
  },
  {
    id: '2',
    name: 'Chef James Wilson',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    rating: 4.8,
    reviewCount: 89,
    categories: ['italian', 'french'],
    styles: ['fine-dining', 'traditional'],
    hourlyRate: 180,
    experience: 12,
    availability: ['weekdays', 'weekends'],
    description: 'Expert in Italian and French cuisine with 12 years of professional experience.',
    specialties: ['italian', 'french'],
    languages: ['English', 'Italian', 'French'],
    location: 'Midtown',
    gallery: []
  }
];

const RentChefPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ChefCategory>('all');
  const [selectedStyle, setSelectedStyle] = useState<ChefStyle>('all');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('');

  const handleChefSelect = (chef: Chef) => {
    setSelectedChef(chef);
  };

  const handleCloseSidebar = () => {
    setSelectedChef(null);
  };

  const filteredChefs = mockChefs.filter((chef) => {
    const matchesCategory = selectedCategory === 'all' || chef.categories.includes(selectedCategory);
    const matchesStyle = selectedStyle === 'all' || chef.styles.includes(selectedStyle);
    return matchesCategory && matchesStyle;
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
        <ChefPageHero 
          title="Rent a Chef"
          subtitle="Professional chefs available for your events and daily cooking needs"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <ChefFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedStyle={selectedStyle}
                onStyleChange={setSelectedStyle}
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
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedStyle={selectedStyle}
                setSelectedStyle={setSelectedStyle}
                onBookNow={handleChefSelect}
                onViewGallery={handleChefSelect}
              />
            </motion.div>
          </div>

          {/* Booking Sidebar - Desktop Only */}
          {selectedChef && !isMobile && (
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <ChefBookingSidebar
                  date={date}
                  setDate={setDate}
                  time={time}
                  setTime={setTime}
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
                date={date}
                setDate={setDate}
                time={time}
                setTime={setTime}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default RentChefPage;
