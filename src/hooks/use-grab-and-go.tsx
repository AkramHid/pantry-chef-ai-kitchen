import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ShoppingItemData } from '@/components/shopping/ShoppingItem';
import { supabase, getIdAsString } from '@/integrations/supabase/client';
import { sortItemsByGroceryLogic } from '@/lib/grocery-store-logic';
import { useAuth } from '@/hooks/use-auth';

export function useGrabAndGo() {
  const { toast } = useToast();
  const location = useLocation();
  const { user } = useAuth();
  
  const [shoppingItems, setShoppingItems] = useState<ShoppingItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Handle items passed from other pages
  useEffect(() => {
    if (location.state && user) {
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
  }, [location.state, shoppingItems, toast, user]);
  
  // Fetch unchecked shopping items from Supabase for Grab & Go
  useEffect(() => {
    if (user) {
      fetchGrabAndGoItems();
    } else {
      setShoppingItems([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchGrabAndGoItems = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('shopping_list')
        .select('*')
        .eq('ischecked', false)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log('Grab & Go items from DB:', data);
        
        const mappedData: ShoppingItemData[] = data.map(item => ({
          id: getIdAsString(item.id),
          name: item.name,
          quantity: item.quantity || 1,
          unit: item.unit || 'pc',
          category: item.category || 'General',
          isChecked: item.ischecked || false,
          note: item.note
        }));
        
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

  // Handler functions
  const handleToggle = async (id: string) => {
    if (!user) return;
    
    try {
      const item = shoppingItems.find(item => item.id === id);
      if (!item) return;
      
      const updatedItem = { ...item, isChecked: !item.isChecked };
      
      setShoppingItems(items =>
        items.map(item =>
          item.id === id ? updatedItem : item
        )
      );
      
      const { error } = await supabase
        .from('shopping_list')
        .update({ ischecked: updatedItem.isChecked })
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      console.log('Item toggled successfully:', id, updatedItem.isChecked);
    } catch (error) {
      console.error('Error toggling item:', error);
      toast({
        title: 'Failed to update item',
        description: 'Please try again',
        variant: 'destructive',
      });
      
      setShoppingItems(items =>
        items.map(item =>
          item.id === id ? { ...item, isChecked: !item.isChecked } : item
        )
      );
    }
  };

  const handleUpdateItem = async (id: string, updates: Partial<ShoppingItemData>) => {
    if (!user) return;
    
    try {
      const updatedItem = { ...shoppingItems.find(item => item.id === id), ...updates };
      
      setShoppingItems(items =>
        items.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      );
      
      const { error } = await supabase
        .from('shopping_list')
        .update({
          name: updatedItem.name?.trim(),
          quantity: Number(updatedItem.quantity) || 1,
          unit: updatedItem.unit || 'pc',
          category: updatedItem.category || 'General',
          ischecked: updatedItem.isChecked || false,
          note: updatedItem.note || null
        })
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      console.log('Item updated successfully:', id);
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: 'Failed to update item',
        description: 'Please try again',
        variant: 'destructive',
      });
      
      // Revert the optimistic update
      fetchGrabAndGoItems();
    }
  };

  const handleDeleteItems = async (itemIds: string[]) => {
    if (!user || itemIds.length === 0) return;
    
    try {
      // Optimistically remove items from state
      setShoppingItems(items => items.filter(item => !itemIds.includes(item.id)));
      
      const { error } = await supabase
        .from('shopping_list')
        .delete()
        .in('id', itemIds)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      console.log('Items deleted successfully:', itemIds);
    } catch (error) {
      console.error('Error deleting items:', error);
      toast({
        title: 'Failed to delete items',
        description: 'Please try again',
        variant: 'destructive',
      });
      
      // Revert by refetching
      fetchGrabAndGoItems();
    }
  };

  const handleImportFromList = async (listItems: ShoppingItemData[]) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to import items',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      console.log('Starting import of items:', listItems);
      
      const existingNames = new Set(
        shoppingItems.map(item => item.name.toLowerCase().trim())
      );
      
      const itemsToAdd = listItems.filter(item => 
        !existingNames.has(item.name.toLowerCase().trim())
      );
      
      console.log('Items to add after filtering:', itemsToAdd);
      
      if (itemsToAdd.length === 0) {
        toast({
          title: "No new items imported",
          description: "All items are already in Grab & Go mode.",
          duration: 2000,
        });
        return;
      }
      
      const itemsForDb = itemsToAdd.map(item => ({
        name: item.name.trim(),
        quantity: Number(item.quantity) || 1,
        unit: item.unit || 'pc',
        category: item.category || 'General',
        ischecked: false,
        note: item.note || null,
        user_id: user.id
      }));
      
      console.log('Inserting items to database:', itemsForDb);
      
      const { data, error } = await supabase
        .from('shopping_list')
        .insert(itemsForDb)
        .select('*');
        
      if (error) {
        console.error('Database insertion error:', error);
        throw error;
      }
      
      console.log('Database insertion successful:', data);
      
      if (data && data.length > 0) {
        const newItems: ShoppingItemData[] = data.map(item => ({
          id: getIdAsString(item.id),
          name: item.name,
          quantity: item.quantity || 1,
          unit: item.unit || 'pc',
          category: item.category || 'General',
          isChecked: item.ischecked || false,
          note: item.note
        }));
        
        setShoppingItems(prev => sortItemsByGroceryLogic([...prev, ...newItems]));
        
        toast({
          title: "Items imported successfully",
          description: `Added ${itemsToAdd.length} item${itemsToAdd.length > 1 ? 's' : ''} to Grab & Go mode.`,
          duration: 3000,
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
    handleCreateShoppingList,
    handleUpdateItem,
    handleDeleteItems
  };
}
