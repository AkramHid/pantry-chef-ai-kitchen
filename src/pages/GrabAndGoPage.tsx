
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGrabAndGo } from '@/hooks/use-grab-and-go';
import { ViewMode } from '@/components/ui/list-layout';
import { Button } from '@/components/ui/button';

import GrabAndGoHeader from '@/components/grab-and-go/GrabAndGoHeader';
import GrabAndGoImportDialog from '@/components/grab-and-go/GrabAndGoImportDialog';
import GrabAndGoItemsList from '@/components/grab-and-go/GrabAndGoItemsList';

const GrabAndGoPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const {
    shoppingItems,
    isLoading,
    handleToggle,
    handleImportFromList,
    handleCreateShoppingList
  } = useGrabAndGo();

  const [viewMode, setViewMode] = useState<ViewMode>(isMobile ? 'list' : 'grid');
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Update viewMode based on screen size
  useEffect(() => {
    if (isMobile) {
      setViewMode('list');
    }
  }, [isMobile]);

  const handleExitGrabAndGo = () => {
    navigate('/shopping-list');
  };

  const handleQuickAdd = () => {
    setShowImportDialog(true);
  };

  const handleCreateList = async () => {
    const listData = await handleCreateShoppingList();
    if (listData) {
      // Navigate to shopping list with the new list data
      navigate('/shopping-list', { 
        state: { 
          newList: listData 
        }
      });
    }
  };

  const handleImportList = (items: any[]) => {
    handleImportFromList(items);
    setShowImportDialog(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-kitchen-cream flex flex-col">
        <GrabAndGoHeader onExit={handleExitGrabAndGo} itemCount={0} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kitchen-green mx-auto mb-4"></div>
            <p className="text-kitchen-green">Loading your Grab &amp; Go items...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kitchen-cream flex flex-col">
      <GrabAndGoHeader 
        onExit={handleExitGrabAndGo} 
        itemCount={shoppingItems.length} 
      />

      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex-1 px-3 md:px-4 py-4 md:py-6 mb-20 max-w-4xl mx-auto w-full overflow-hidden"
      >
        <GrabAndGoItemsList
          items={shoppingItems}
          viewMode={viewMode}
          onViewModeChange={!isMobile ? setViewMode : undefined}
          onToggle={handleToggle}
          onQuickAdd={handleQuickAdd}
        />
        
        {shoppingItems.some(item => item.isChecked) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 md:mt-8 flex justify-center"
          >
            <Button 
              onClick={handleCreateList}
              className="bg-kitchen-green hover:bg-kitchen-green/90 text-white py-2 px-6"
            >
              Create Organized Shopping List
            </Button>
          </motion.div>
        )}
      </motion.main>
      
      {/* Grab & Go quick add/import button */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="fixed bottom-20 md:bottom-8 right-4 md:right-6 drop-shadow-lg transition-all z-50"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={handleQuickAdd}
            className="bg-kitchen-green text-white w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center hover:bg-kitchen-green/90 transition-transform duration-300 shadow-2xl"
            size="icon"
            aria-label="Import items to Grab & Go"
            style={{ boxShadow: '0 8px 20px rgba(68, 130, 74, 0.15)' }}
          >
            <Plus size={isMobile ? 26 : 32} />
          </Button>
        </motion.div>
      </motion.div>
      
      {/* Import Dialog */}
      <GrabAndGoImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImportList={handleImportList}
      />
    </div>
  );
};

export default GrabAndGoPage;
