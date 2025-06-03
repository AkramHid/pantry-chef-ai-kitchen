
import React from 'react';
import { Check, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingItemData } from '@/components/shopping/ShoppingItem';
import { useIsMobile } from '@/hooks/use-mobile';
import { groupItemsByGroceryCategory, GROCERY_STORE_CATEGORIES } from '@/lib/grocery-store-logic';
import { ListLayout, ViewMode } from '@/components/ui/list-layout';
import { Button } from '@/components/ui/button';

interface GrabAndGoItemsListProps {
  items: ShoppingItemData[];
  viewMode: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  onToggle: (itemId: string) => void;
  onQuickAdd: () => void;
}

const GrabAndGoItemsList: React.FC<GrabAndGoItemsListProps> = ({
  items,
  viewMode,
  onViewModeChange,
  onToggle,
  onQuickAdd
}) => {
  const isMobile = useIsMobile();

  // Group items by grocery store categories
  const groupedItems = groupItemsByGroceryCategory(items);
  
  // Only show categories that have items
  const categoriesWithItems = GROCERY_STORE_CATEGORIES.filter(
    category => groupedItems[category].length > 0
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  if (items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center py-6 md:py-10 bg-white/80 rounded-xl shadow-sm mt-4 backdrop-blur-sm"
      >
        <p className="text-lg md:text-xl mb-4">Your Grab &amp; Go list is empty</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={onQuickAdd}
            className="bg-kitchen-green hover:bg-kitchen-green/90 text-base md:text-lg py-4 md:py-6 px-6 md:px-8 transition-transform duration-200"
          >
            <Plus size={isMobile ? 20 : 24} className="mr-2" />
            Import Items
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <ListLayout
      title="Grab & Go Items"
      viewMode={viewMode}
      onViewModeChange={!isMobile ? onViewModeChange : undefined}
      className="mt-4"
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 md:space-y-6 pb-16"
      >
        {categoriesWithItems.map(category => (
          <motion.div key={category} className="mb-4 md:mb-6" variants={itemVariants}>
            <div className="flex items-center justify-between mb-2 md:mb-3 px-2">
              <h2 className="text-lg md:text-xl font-bold text-kitchen-dark">{category}</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {groupedItems[category].length} item{groupedItems[category].length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className={`${viewMode === 'list' ? 'space-y-2' : 'grid grid-cols-1 sm:grid-cols-2 gap-3'}`}>
              <AnimatePresence>
                {groupedItems[category].map(item => (
                  <motion.div 
                    key={item.id}
                    className={`
                      bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden
                      ${viewMode === 'list' ? 'flex items-center p-3 md:p-4' : 'p-3 md:p-4 flex flex-col items-center text-center'}
                    `}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onToggle(item.id)}
                      className={`
                        flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center
                        transition-colors duration-300
                        ${viewMode === 'list' ? 'mr-3 md:mr-4' : 'mb-2 md:mb-3'}
                        ${item.isChecked 
                          ? 'bg-kitchen-green border-kitchen-green text-white' 
                          : 'border-gray-300 hover:border-gray-400 transition-colors'}
                      `}
                      aria-label={item.isChecked ? "Uncheck item" : "Check item"}
                    >
                      {item.isChecked && <Check size={isMobile ? 14 : 18} />}
                    </motion.button>
                    
                    <div className={viewMode === 'list' ? 'flex-1' : 'w-full'}>
                      <h3 className={`text-base md:text-lg font-medium ${item.isChecked ? 'text-gray-400 line-through' : 'text-kitchen-dark'}`}>
                        {item.name}
                      </h3>
                      
                      {item.note && (
                        <p className="text-xs md:text-sm text-gray-500 mt-1">{item.note}</p>
                      )}
                    </div>
                    
                    <span className={`text-sm md:text-base ${item.isChecked ? 'text-gray-400' : 'text-kitchen-dark'} ${viewMode === 'grid' ? 'mt-2' : ''}`}>
                      {item.quantity} {item.unit}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </ListLayout>
  );
};

export default GrabAndGoItemsList;
