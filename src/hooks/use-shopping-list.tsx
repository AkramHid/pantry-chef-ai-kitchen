
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ShoppingItemData } from '@/components/shopping/ShoppingItem';
import { supabase, getIdAsString } from '@/integrations/supabase/client';
import { sortItemsByGroceryLogic } from '@/lib/grocery-store-logic';
import { useAuth } from '@/hooks/use-auth';

export function useShoppingList() {
  const { toast } = useToast();
  const location = useLocation();
  const { user } = useAuth();
  
  const [shoppingItems, setShoppingItems] = useState<ShoppingItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Handle items passed from Grab & Go mode or other routes
  useEffect(() => {
    if (location.state && user) {
      if (location.state.newList) {
        const { newList } = location.state;
        
        if (newList.items && newList.items.length > 0) {
          setShoppingItems(prev => {
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
                    note: item.note || null,
                    user_id: user.id
                  });
                
                if (error) {
                  console.error('Error adding item to shopping list:', error);
                }
              } catch (err) {
                console.error('Error adding item to shopping list:', err);
              }
            });
            
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
  }, [location.state, toast, user]);
  
  // Fetch items from Supabase
  useEffect(() => {
    if (user) {
      fetchShoppingItems();
    } else {
      setShoppingItems([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchShoppingItems = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('shopping_list')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log('Shopping items from DB:', data);
        
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
        console.log('No shopping items found in DB');
        setShoppingItems([]);
      }
    } catch (error) {
      console.error('Error fetching shopping items:', error);
      toast({
        title: 'Failed to load shopping list',
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
  
  const handleDelete = async (id: string) => {
    if (!user) return;
    
    let deletedItem: ShoppingItemData | undefined;
    
    try {
      deletedItem = shoppingItems.find(item => item.id === id);
      if (!deletedItem) return;
      
      setShoppingItems(items => items.filter(item => item.id !== id));
      
      const { error } = await supabase
        .from('shopping_list')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
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
      
      if (deletedItem) {
        setShoppingItems(prev => [...prev, deletedItem as ShoppingItemData]);
      }
    }
  };
  
  const handleAddNew = async (newItemData: Partial<ShoppingItemData>) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to add items',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const newItem: ShoppingItemData = {
        id: `temp-${Date.now()}`,
        name: newItemData.name || 'New Item',
        quantity: newItemData.quantity || 1,
        unit: newItemData.unit || 'pc',
        category: newItemData.category || 'General',
        isChecked: newItemData.isChecked || false,
        note: newItemData.note
      };
      
      setShoppingItems(items => sortItemsByGroceryLogic([newItem, ...items]));
      
      const { data, error } = await supabase
        .from('shopping_list')
        .insert({
          name: newItem.name.trim(),
          quantity: Number(newItem.quantity) || 1,
          unit: newItem.unit || 'pc',
          category: newItem.category || 'General',
          ischecked: newItem.isChecked,
          note: newItem.note || null,
          user_id: user.id
        })
        .select('*')
        .single();
        
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
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
      
      setShoppingItems(items => items.filter(item => item.id !== `temp-${Date.now()}`));
    }
  };
  
  const handleClearChecked = async () => {
    if (!user) return;
    
    try {
      const checkedItems = shoppingItems.filter(item => item.isChecked);
      const checkedItemIds = checkedItems.map(item => item.id);
      
      if (checkedItemIds.length === 0) return;
        
      setShoppingItems(items => items.filter(item => !item.isChecked));
      
      const { error } = await supabase
        .from('shopping_list')
        .delete()
        .in('id', checkedItemIds)
        .eq('user_id', user.id);
        
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
      
      fetchShoppingItems();
    }
  };
  
  const handleShare = async () => {
    try {
      toast({
        title: "Sharing shopping list",
        description: "Preparing to share with family members...",
        duration: 3000,
      });
      
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
