
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

const PantryPage = () => {
  const navigate = useNavigate();

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

  if (isLoading || listsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kitchen-green mx-auto mb-4"></div>
          <p className="text-kitchen-green">Loading your pantry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kitchen-cream">
      <Header title="My Pantry" showBackButton={true} />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        {/* Action Bar */}
        <PantryPageHeader
          selectedItems={selectedItems}
          onAddNew={() => setShowAddDialog(true)}
          onSendToShopping={handleSendToShopping}
        />

        {/* Main Content */}
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
          onToggleSelectItem={toggleSelectItem}
          onCreateList={createList}
          onDeleteList={deleteList}
          onRenameList={renameList}
          onRemoveFromList={removeItemFromList}
          onSendMissingToShopping={handleSendMissingToShopping}
        />
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
    </div>
  );
};

export default PantryPage;
