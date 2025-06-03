
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ShoppingItemData } from '@/components/shopping/ShoppingItem';
import { supabase, getIdAsString } from '@/integrations/supabase/client';
import { sortItemsByGroceryLogic } from '@/lib/grocery-store-logic';

export function useGrabAndGo() {
  const { toast } = useToast();
  const location = useLocation();
  
  const [shoppingItems, setShoppingItems] = useState<ShoppingItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Handle items passed from other pages
  useEffect(() => {
    if (location.state) {
      if (location.state.selectedItems) {
        const newItems = location.state.selectedItems as ShoppingItemData[];
        const existingIds = new Set(shoppingItems.map(i => i.id));
        const itemsToAdd = newItems.filter(item => !existingIds.has(item.id));
        
        if (itemsToAdd.length > 0) {
          setShoppingItems(prev => sortItemsByGroceryLogic([...prev, ...itemsToAdd]));
          toast({
            title: "Items Added",
            description: `Added ${itemsToAdd.length} item${itemsToAdd.length > 1 ? 's' : ''} to Grab & Go`,
            duration: 2000,
          });
        }
      }
    }
  }, [location.state, shoppingItems, toast]);
  
  // Fetch unchecked shopping items from Supabase for Grab & Go
  useEffect(() => {
    const fetchGrabAndGoItems = async () => {
      try {
        const { data, error } = await supabase
          .from('shopping_list')
          .select('*')
          .eq('ischecked', false)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          console.log('Grab & Go items from DB:', data);
          
          // Map the data to ShoppingItemData format
          const mappedData: ShoppingItemData[] = data.map(item => ({
            id: getIdAsString(item.id),
            name: item.name,
            quantity: item.quantity || 1,
            unit: item.unit || 'pc',
            category: item.category || 'General',
            isChecked: item.ischecked || false,
            note: item.note
          }));
          
          // Sort by grocery store logic
          const sortedItems = sortItemsByGroceryLogic(mappedData);
          setShoppingItems(sortedItems);
        } else {
          console.log('No Grab & Go items found in DB');
          setShoppingItems([]);
        }
      } catch (error) {
        console.error('Error fetching Grab & Go items:', error);
        toast({
          title: 'Failed to load items',
          description: 'Please try again',
          variant: 'destructive',
        });
        setShoppingItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGrabAndGoItems();
  }, [toast]);

  // Handler functions
  const handleToggle = async (id: string) => {
    try {
      // Find the item to toggle
      const item = shoppingItems.find(item => item.id === id);
      if (!item) return;
      
      const updatedItem = { ...item, isChecked: !item.isChecked };
      
      // Optimistic UI update
      setShoppingItems(items =>
        items.map(item =>
          item.id === id ? updatedItem : item
        )
      );
      
      // Update in database
      const { error } = await supabase
        .from('shopping_list')
        .update({ ischecked: updatedItem.isChecked })
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error toggling item:', error);
      toast({
        title: 'Failed to update item',
        description: 'Please try again',
        variant: 'destructive',
      });
      
      // Revert the optimistic update on error
      setShoppingItems(items =>
        items.map(item =>
          item.id === id ? { ...item, isChecked: !item.isChecked } : item
        )
      );
    }
  };

  const handleImportFromList = async (listItems: ShoppingItemData[]) => {
    try {
      // Add new items to database
      const itemsToAdd = listItems.filter(item => 
        !shoppingItems.some(existing => existing.name.toLowerCase() === item.name.toLowerCase())
      );
      
      if (itemsToAdd.length === 0) {
        toast({
          title: "No new items imported",
          description: "All items are already in Grab & Go mode.",
          duration: 2000,
        });
        return;
      }
      
      // Insert new items into database
      const { data, error } = await supabase
        .from('shopping_list')
        .insert(
          itemsToAdd.map(item => ({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            category: item.category,
            ischecked: false,
            note: item.note
          }))
        )
        .select('*');
        
      if (error) throw error;
      
      if (data) {
        const newItems: ShoppingItemData[] = data.map(item => ({
          id: getIdAsString(item.id),
          name: item.name,
          quantity: item.quantity || 1,
          unit: item.unit || 'pc',
          category: item.category || 'General',
          isChecked: item.ischecked || false,
          note: item.note
        }));
        
        // Update local state with sorted items
        setShoppingItems(prev => sortItemsByGroceryLogic([...prev, ...newItems]));
        
        toast({
          title: "Items imported successfully",
          description: `Added ${itemsToAdd.length} item${itemsToAdd.length > 1 ? 's' : ''} to Grab & Go mode.`,
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error importing items:', error);
      toast({
        title: 'Failed to import items',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleCreateShoppingList = async () => {
    const checkedItems = shoppingItems.filter(item => item.isChecked);
    if (checkedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please check some items to create a list",
        variant: "destructive",
        duration: 2000,
      });
      return null;
    }
    
    // Sort the checked items by grocery store logic for optimal shopping flow
    const sortedCheckedItems = sortItemsByGroceryLogic(checkedItems);
    
    const newListName = `Shopping List - ${new Date().toLocaleDateString()}`;
    const listData = {
      items: sortedCheckedItems,
      name: newListName,
      creator: "You",
      date: new Date().toISOString(),
    };
    
    toast({
      title: "List Created",
      description: `Created "${newListName}" with ${checkedItems.length} items organized by store layout`,
      duration: 3000,
    });
    
    return listData;
  };

  return {
    shoppingItems,
    isLoading,
    handleToggle,
    handleImportFromList,
    handleCreateShoppingList
  };
}
