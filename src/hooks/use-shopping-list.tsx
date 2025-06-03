import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ShoppingItemData } from '@/components/shopping/ShoppingItem';
import { mockShoppingItems } from '@/lib/data';
import { supabase, getIdAsString } from '@/integrations/supabase/client';
import { sortItemsByGroceryLogic } from '@/lib/grocery-store-logic';

export function useShoppingList() {
  const { toast } = useToast();
  const location = useLocation();
  
  const [shoppingItems, setShoppingItems] = useState<ShoppingItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Handle items passed from Grab & Go mode or other routes
  useEffect(() => {
    if (location.state) {
      if (location.state.newList) {
        const { newList } = location.state;
        
        if (newList.items && newList.items.length > 0) {
          // Set the new shopping list items from the passed state (already sorted by grocery logic)
          setShoppingItems(prev => {
            // Merge with existing items, avoid duplicates by name
            const existingNames = new Set(prev.map(item => item.name.toLowerCase()));
            const newItems = newList.items.filter(item => !existingNames.has(item.name.toLowerCase()));
            
            // Add new items to database asynchronously
            newItems.forEach(async (item) => {
              try {
                const { error } = await supabase
                  .from('shopping_list')
                  .insert({
                    name: item.name.trim(),
                    quantity: Number(item.quantity) || 1,
                    unit: item.unit || 'pc',
                    category: item.category || 'General',
                    ischecked: item.isChecked || false,
                    note: item.note || null
                  });
                
                if (error) {
                  console.error('Error adding item to shopping list:', error);
                }
              } catch (err) {
                console.error('Error adding item to shopping list:', err);
              }
            });
            
            // Return sorted items by grocery store logic
            return sortItemsByGroceryLogic([...prev, ...newItems]);
          });
          
          toast({
            title: `List "${newList.name}" loaded`,
            description: `Added ${newList.items.length} items organized by store layout`,
            duration: 3000,
          });
        }
      }
    }
  }, [location.state, toast]);
  
  // Fetch items from Supabase
  useEffect(() => {
    const fetchShoppingItems = async () => {
      try {
        const { data, error } = await supabase
          .from('shopping_list')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Database error:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          console.log('Shopping items from DB:', data);
          
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
          console.log('No shopping items found in DB, using mock data fallback');
          // Use mock data as fallback and sort by grocery logic
          const sortedMockItems = sortItemsByGroceryLogic(mockShoppingItems);
          setShoppingItems(sortedMockItems);
        }
      } catch (error) {
        console.error('Error fetching shopping items:', error);
        toast({
          title: 'Failed to load shopping list',
          description: 'Using demo data instead',
          variant: 'destructive',
        });
        const sortedMockItems = sortItemsByGroceryLogic(mockShoppingItems);
        setShoppingItems(sortedMockItems);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShoppingItems();
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
      
      // Update in database if Supabase is available
      const { error } = await supabase
        .from('shopping_list')
        .update({ ischecked: updatedItem.isChecked })
        .eq('id', id);
        
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
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
  
  const handleDelete = async (id: string) => {
    // Define deletedItem outside the try-catch block so it's accessible in both blocks
    let deletedItem: ShoppingItemData | undefined;
    
    try {
      // Store the item to be deleted before removing it from the state
      deletedItem = shoppingItems.find(item => item.id === id);
      if (!deletedItem) return;
      
      // Optimistic UI update
      setShoppingItems(items => items.filter(item => item.id !== id));
      
      // Delete from database if Supabase is available
      const { error } = await supabase
        .from('shopping_list')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      toast({
        title: "Item removed",
        description: "The item has been removed from your shopping list",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Failed to delete item',
        description: 'Please try again',
        variant: 'destructive',
      });
      
      // Revert the optimistic update on error if we have the deletedItem
      if (deletedItem) {
        setShoppingItems(prev => [...prev, deletedItem as ShoppingItemData]);
      }
    }
  };
  
  const handleAddNew = async (newItemData: Partial<ShoppingItemData>) => {
    try {
      // Create a new item with the provided data
      const newItem: ShoppingItemData = {
        id: `temp-${Date.now()}`, // Temporary ID that will be replaced by DB ID
        name: newItemData.name || 'New Item',
        quantity: newItemData.quantity || 1,
        unit: newItemData.unit || 'pc',
        category: newItemData.category || 'General',
        isChecked: newItemData.isChecked || false,
        note: newItemData.note
      };
      
      // Optimistic UI update - add to the list immediately and sort by grocery logic
      setShoppingItems(items => sortItemsByGroceryLogic([newItem, ...items]));
      
      // Add to database
      const { data, error } = await supabase
        .from('shopping_list')
        .insert({
          name: newItem.name.trim(),
          quantity: Number(newItem.quantity) || 1,
          unit: newItem.unit || 'pc',
          category: newItem.category || 'General',
          ischecked: newItem.isChecked,
          note: newItem.note || null
        })
        .select('*')
        .single();
        
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      // Use the returned item with the proper database ID
      if (data) {
        const dbItem: ShoppingItemData = {
          id: getIdAsString(data.id),
          name: data.name,
          quantity: data.quantity || 1,
          unit: data.unit || 'pc',
          category: data.category || 'General',
          isChecked: data.ischecked || false,
          note: data.note
        };
        
        // Replace temp item with DB item and maintain grocery store sorting
        setShoppingItems(items => 
          sortItemsByGroceryLogic(
            items.map(item => 
              item.id === newItem.id ? dbItem : item
            )
          )
        );
      }
      
      toast({
        title: "Item added",
        description: `${newItem.name} has been added to your shopping list`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding item to shopping list:', error);
      toast({
        title: 'Failed to add item',
        description: 'Please try again',
        variant: 'destructive',
      });
      
      // Remove the temporary item if saving fails
      setShoppingItems(items => items.filter(item => item.id !== `temp-${Date.now()}`));
    }
  };
  
  const handleClearChecked = async () => {
    try {
      // Get the checked items before removing them
      const checkedItems = shoppingItems.filter(item => item.isChecked);
      const checkedItemIds = checkedItems.map(item => item.id);
      
      if (checkedItemIds.length === 0) return;
        
      // Optimistic UI update
      setShoppingItems(items => items.filter(item => !item.isChecked));
      
      // Delete from database if Supabase is available
      // Note: For UUID columns we need to make sure the string is a valid UUID
      const { error } = await supabase
        .from('shopping_list')
        .delete()
        .in('id', checkedItemIds);
        
      if (error) throw error;
      
      toast({
        title: "Checked items cleared",
        description: "All checked items have been removed from your list",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error clearing checked items:', error);
      toast({
        title: 'Failed to clear checked items',
        description: 'Please try again',
        variant: 'destructive',
      });
      
      // If there's an error, we should reload the list
      const { data } = await supabase.from('shopping_list').select('*');
      if (data) {
        const mappedData: ShoppingItemData[] = data.map(item => ({
          id: getIdAsString(item.id),
          name: item.name,
          quantity: item.quantity || 1,
          unit: item.unit || 'pc',
          category: item.category || 'General',
          isChecked: item.ischecked || false, // Map from ischecked (DB) to isChecked (UI)
          note: item.note
        }));
        setShoppingItems(sortItemsByGroceryLogic(mappedData));
      }
    }
  };
  
  const handleShare = async () => {
    try {
      toast({
        title: "Sharing shopping list",
        description: "Preparing to share with family members...",
        duration: 3000,
      });
      
      // In a real implementation, we would share the list with family members
      // For now, we'll simulate this with a timeout
      setTimeout(() => {
        toast({
          title: "List shared",
          description: "Shopping list has been shared with family members",
          duration: 3000,
        });
      }, 1000);
    } catch (error) {
      console.error('Error sharing list:', error);
      toast({
        title: 'Failed to share list',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  return {
    shoppingItems,
    isLoading,
    handleToggle,
    handleDelete,
    handleAddNew,
    handleClearChecked,
    handleShare
  };
}
