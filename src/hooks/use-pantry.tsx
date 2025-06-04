
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

export interface PantryItemData {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'fridge' | 'freezer' | 'pantry';
  expiryDate?: string;
  addedDate: string;
  image?: string;
  user_id?: string;
}

export function usePantry() {
  const [items, setItems] = useState<PantryItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchItems();
    } else {
      setItems([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchItems = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('pantry_items')
        .select('*')
        .eq('user_id', user.id)
        .order('added_date', { ascending: false });

      if (error) throw error;

      const mappedItems: PantryItemData[] = (data || []).map(item => ({
        id: item.id.toString(),
        name: item.name || '',
        quantity: item.quantity || 1,
        unit: item.unit || 'pc',
        category: (item.category as 'fridge' | 'freezer' | 'pantry') || 'pantry',
        expiryDate: item.expiry_date || undefined,
        addedDate: item.added_date || item.created_at,
        image: item.image_url || undefined,
        user_id: item.user_id || undefined
      }));

      setItems(mappedItems);
    } catch (error) {
      console.error('Error fetching pantry items:', error);
      toast({
        title: 'Error loading pantry items',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (newItem: Omit<PantryItemData, 'id' | 'addedDate'>) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to add items',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('pantry_items')
        .insert([{
          name: newItem.name,
          quantity: newItem.quantity,
          unit: newItem.unit,
          category: newItem.category,
          expiry_date: newItem.expiryDate || null,
          image_url: newItem.image || null,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      const mappedItem: PantryItemData = {
        id: data.id.toString(),
        name: data.name,
        quantity: data.quantity,
        unit: data.unit,
        category: data.category,
        expiryDate: data.expiry_date || undefined,
        addedDate: data.added_date || data.created_at,
        image: data.image_url || undefined,
        user_id: data.user_id
      };

      setItems(prev => [mappedItem, ...prev]);
      
      toast({
        title: 'Item added',
        description: `${newItem.name} has been added to your pantry`,
      });
    } catch (error) {
      console.error('Error adding pantry item:', error);
      toast({
        title: 'Error adding item',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const updateItem = async (id: string, updates: Partial<PantryItemData>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('pantry_items')
        .update({
          name: updates.name,
          quantity: updates.quantity,
          unit: updates.unit,
          category: updates.category,
          expiry_date: updates.expiryDate || null,
          image_url: updates.image || null
        })
        .eq('id', parseInt(id))
        .eq('user_id', user.id);

      if (error) throw error;

      setItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      );

      toast({
        title: 'Item updated',
        description: 'Changes have been saved',
      });
    } catch (error) {
      console.error('Error updating pantry item:', error);
      toast({
        title: 'Error updating item',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('pantry_items')
        .delete()
        .eq('id', parseInt(id))
        .eq('user_id', user.id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: 'Item removed',
        description: 'Item has been removed from your pantry',
      });
    } catch (error) {
      console.error('Error deleting pantry item:', error);
      toast({
        title: 'Error removing item',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const incrementQuantity = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      await updateItem(id, { quantity: item.quantity + 1 });
    }
  };

  const decrementQuantity = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (item && item.quantity > 0) {
      await updateItem(id, { quantity: item.quantity - 1 });
    }
  };

  return {
    items,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    incrementQuantity,
    decrementQuantity,
    fetchItems
  };
}
