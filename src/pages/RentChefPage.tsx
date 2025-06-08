
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChefPageHero from '@/components/chef/ChefPageHero';
import { ChefFilter } from '@/components/chef/ChefFilter';
import ChefBookingSidebar from '@/components/chef/ChefBookingSidebar';
import { ChefCard } from '@/components/chef/ChefCard';
import ChefOnboarding from '@/components/chef/ChefOnboarding';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChefCategory, ChefStyle, Chef } from '@/types/chef';
import { CHEFS } from '@/data/chefData';

const RentChefPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ChefCategory>('all');
  const [selectedStyle, setSelectedStyle] = useState<ChefStyle>('all');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('chefOnboardingComplete');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleChefSelect = (chef: Chef) => {
    setSelectedChef(chef);
  };

  const handleCloseSidebar = () => {
    setSelectedChef(null);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('chefOnboardingComplete', 'true');
  };

  const filteredChefs = CHEFS.filter((chef) => {
    const matchesCategory = selectedCategory === 'all' || chef.categories.includes(selectedCategory);
    const matchesStyle = selectedStyle === 'all' || chef.styles.includes(selectedStyle);
    return matchesCategory && matchesStyle;
  });

  if (showOnboarding) {
    return (
      <ChefOnboarding 
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm px-4 py-3 flex items-center justify-between md:hidden"
      >
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="mr-3"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Rent a Chef</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Settings size={20} />
        </Button>
      </motion.div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <ChefPageHero 
          title="Rent a Chef"
          subtitle="Find the perfect chef for your culinary needs"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters || !isMobile ? 'block' : 'hidden'}`}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredChefs.map((chef) => (
                <motion.div
                  key={chef.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <ChefCard
                    chef={chef}
                    onBookNow={() => handleChefSelect(chef)}
                    onViewGallery={() => handleChefSelect(chef)}
                  />
                </motion.div>
              ))}
            </div>
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
