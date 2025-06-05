
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePantry } from '@/hooks/use-pantry';
import { usePantryLists } from '@/hooks/use-pantry-lists';
import PantryList from '@/components/pantry/PantryList';
import CustomLists from '@/components/pantry/CustomLists';
import AddItemDialog from '@/components/pantry/AddItemDialog';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { ShoppingItemData } from '@/components/shopping/ShoppingItem';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

const PantryPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { user } = useAuth();

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

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedList, setSelectedList] = useState<string | undefined>();

  const handleSendToShopping = async () => {
    if (!user || selectedItems.length === 0) return;

    try {
      const itemsToSend = items.filter(item => selectedItems.includes(item.id));
      
      const shoppingItems = itemsToSend.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: 'General',
        ischecked: false,
        user_id: user.id
      }));

      const { error } = await supabase
        .from('shopping_list')
        .insert(shoppingItems);

      if (error) throw error;

      toast({
        title: 'Items sent to shopping list',
        description: `${selectedItems.length} items added to your shopping list`,
      });

      // Clear selections after sending
      selectedItems.forEach(itemId => toggleSelectItem(itemId));
    } catch (error) {
      console.error('Error sending items to shopping list:', error);
      toast({
        title: 'Error sending items',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleSendMissingToShopping = async (listId: string) => {
    if (!user) return;

    const list = lists.find(l => l.id === listId);
    if (!list) return;

    const missingItems = list.items.filter(itemId => {
      const item = items.find(i => i.id === itemId);
      return !item || item.quantity === 0;
    });

    if (missingItems.length === 0) {
      toast({
        title: 'No missing items',
        description: 'All items in this list are available in your pantry',
      });
      return;
    }

    try {
      const itemsToAdd = missingItems.map(itemId => {
        const item = items.find(i => i.id === itemId);
        return {
          name: item?.name || 'Unknown Item',
          quantity: 1,
          unit: item?.unit || 'pc',
          category: 'General',
          ischecked: false,
          user_id: user.id
        };
      });

      const { error } = await supabase
        .from('shopping_list')
        .insert(itemsToAdd);

      if (error) throw error;

      toast({
        title: 'Missing items sent to shopping list',
        description: `${missingItems.length} missing items added to your shopping list`,
      });
    } catch (error) {
      console.error('Error sending missing items:', error);
      toast({
        title: 'Error sending missing items',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="bg-kitchen-green hover:bg-kitchen-green/90"
              >
                <Plus size={18} className="mr-2" />
                Add Item
              </Button>
              
              {selectedItems.length > 0 && (
                <Button 
                  onClick={handleSendToShopping}
                  variant="outline"
                  className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green/10"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Send to Shopping ({selectedItems.length})
                </Button>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
            {/* Pantry Items */}
            <div className={isMobile ? 'order-1' : 'lg:col-span-2 order-1'}>
              <PantryList
                items={items}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
                onDelete={deleteItem}
                onAddNew={() => setShowAddDialog(true)}
                customLists={lists}
                onAddToList={addItemToList}
                selectedItems={selectedItems}
                onToggleSelectItem={toggleSelectItem}
                isLoading={isLoading}
                onUpdate={updateItem}
              />
            </div>

            {/* Custom Lists */}
            <div className={isMobile ? 'order-2' : 'order-2'}>
              <CustomLists
                lists={lists}
                pantryItems={items}
                onCreateList={createList}
                onDeleteList={deleteList}
                onRenameList={renameList}
                onRemoveFromList={removeItemFromList}
                onSendMissingToShopping={handleSendMissingToShopping}
              />
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
      
      <AddItemDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddItem={addItem}
        selectedList={selectedList}
      />
    </div>
  );
};

export default PantryPage;
