
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChefPageHero from '@/components/chef/ChefPageHero';
import { ChefFilter } from '@/components/chef/ChefFilter';
import ChefBookingSidebar from '@/components/chef/ChefBookingSidebar';
import { SmartChefRecommendations } from '@/components/chef/SmartChefRecommendations';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChefCategory, ChefStyle, Chef, ChefMatchingCriteria } from '@/types/chef';
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

  // Smart matching criteria
  const [matchingCriteria, setMatchingCriteria] = useState<ChefMatchingCriteria>({
    dietaryRestrictions: [],
    budgetRange: { min: 50, max: 500 },
    eventType: 'family',
    eventSize: 4,
    preferredCuisines: [],
    date: new Date().toISOString().split('T')[0],
    timeSlot: 'evening',
    pantryIngredients: [],
    previousChefs: []
  });

  const handleChefSelect = (chef: Chef) => {
    setSelectedChef(chef);
  };

  const handleCloseSidebar = () => {
    setSelectedChef(null);
  };

  const handleUpdateCriteria = (newCriteria: ChefMatchingCriteria) => {
    setMatchingCriteria(newCriteria);
  };

  const filteredChefs = CHEFS.filter((chef) => {
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
          title="Rent a Chef - AI Powered Matching"
          subtitle="Our intelligent system finds the perfect chef for your needs, budget, and preferences"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters || !isMobile ? 'block' : 'hidden'}`}>
            <div className="sticky top-4 space-y-4">
              <ChefFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedStyle={selectedStyle}
                onStyleChange={setSelectedStyle}
              />
              
              {/* Smart Matching Criteria */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg p-4 shadow-sm border"
              >
                <h3 className="font-semibold mb-3 text-kitchen-dark">Smart Matching</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Budget Range</label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="number"
                        placeholder="Min"
                        value={matchingCriteria.budgetRange.min}
                        onChange={(e) => setMatchingCriteria({
                          ...matchingCriteria,
                          budgetRange: { ...matchingCriteria.budgetRange, min: Number(e.target.value) }
                        })}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={matchingCriteria.budgetRange.max}
                        onChange={(e) => setMatchingCriteria({
                          ...matchingCriteria,
                          budgetRange: { ...matchingCriteria.budgetRange, max: Number(e.target.value) }
                        })}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Event Type</label>
                    <select
                      value={matchingCriteria.eventType}
                      onChange={(e) => setMatchingCriteria({ ...matchingCriteria, eventType: e.target.value })}
                      className="w-full px-2 py-1 border rounded text-sm mt-1"
                    >
                      <option value="family">Family Gathering</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="luxury">Luxury Event</option>
                      <option value="casual">Casual Dining</option>
                      <option value="wedding">Wedding</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Party Size</label>
                    <input
                      type="number"
                      value={matchingCriteria.eventSize}
                      onChange={(e) => setMatchingCriteria({ ...matchingCriteria, eventSize: Number(e.target.value) })}
                      className="w-full px-2 py-1 border rounded text-sm mt-1"
                      min="1"
                      max="50"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Main Content */}
          <div className={`${selectedChef && !isMobile ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <SmartChefRecommendations
              chefs={filteredChefs}
              criteria={matchingCriteria}
              onChefSelect={handleChefSelect}
              onUpdateCriteria={handleUpdateCriteria}
            />
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
