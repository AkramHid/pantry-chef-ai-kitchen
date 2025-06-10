
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePantry } from '@/hooks/use-pantry';
import { usePantryLists } from '@/hooks/use-pantry-lists';
import { usePantryShoppingActions } from '@/hooks/use-pantry-shopping';
import PantryPageHeader from '@/components/pantry/PantryPageHeader';
import PantryPageContent from '@/components/pantry/PantryPageContent';
import AddItemDialog from '@/components/pantry/AddItemDialog';
import TutorialOverlay from '@/components/onboarding/TutorialOverlay';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/layout/PageTransition';
import { useIsMobile } from '@/hooks/use-mobile';

const PantryPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    items,
    selectedItems,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    incrementQuantity,
    decrementQuantity,
    toggleSelectItem,
  } = usePantry();

  const {
    lists,
    isLoading: listsLoading,
    createList,
    deleteList,
    renameList,
    addItemToList,
    removeItemFromList
  } = usePantryLists();

  const { sendToShopping, sendMissingToShopping } = usePantryShoppingActions();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedList, setSelectedList] = useState<string | undefined>();

  const handleSendToShopping = async () => {
    const success = await sendToShopping(items, selectedItems);
    if (success) {
      // Clear selections after sending
      selectedItems.forEach(itemId => toggleSelectItem(itemId));
    }
  };

  const handleSendMissingToShopping = async (listId: string) => {
    await sendMissingToShopping(listId, lists, items);
  };

  const handleToggleSelectItem = (itemId: string) => {
    toggleSelectItem(itemId);
  };

  if (isLoading || listsLoading) {
    return (
      <PageTransition className="bg-kitchen-cream">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kitchen-green mx-auto mb-4"></div>
            <p className="text-kitchen-green font-medium">Loading your pantry...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="bg-kitchen-cream">
      <Header title="My Pantry" showBackButton={true} />
      
      <main className={`container mx-auto px-3 md:px-4 py-4 md:py-6 pb-20 ${isMobile ? 'max-w-full' : 'max-w-7xl'}`}>
        {/* Action Bar - Mobile Optimized */}
        <div className={`mb-4 md:mb-6 ${isMobile ? 'space-y-3' : ''}`}>
          <PantryPageHeader
            selectedItems={selectedItems}
            onAddNew={() => setShowAddDialog(true)}
            onSendToShopping={handleSendToShopping}
          />
        </div>

        {/* Main Content - Mobile Optimized */}
        <div className={isMobile ? 'space-y-4' : ''}>
          <PantryPageContent
            items={items}
            lists={lists}
            selectedItems={selectedItems}
            isLoading={isLoading}
            onIncrement={incrementQuantity}
            onDecrement={decrementQuantity}
            onDelete={deleteItem}
            onUpdate={updateItem}
            onAddNew={() => setShowAddDialog(true)}
            onAddToList={addItemToList}
            onToggleSelectItem={handleToggleSelectItem}
            onCreateList={createList}
            onDeleteList={deleteList}
            onRenameList={renameList}
            onRemoveFromList={removeItemFromList}
            onSendMissingToShopping={handleSendMissingToShopping}
          />
        </div>
      </main>

      <Footer />
      
      <AddItemDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddItem={addItem}
        selectedList={selectedList}
      />

      {/* Tutorial Overlay */}
      <TutorialOverlay pageName="pantry" />
    </PageTransition>
  );
};

export default PantryPage;
