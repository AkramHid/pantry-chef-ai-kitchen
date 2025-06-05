
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { PantryItemData } from '@/types/pantry';

export function usePantryShoppingActions() {
  const { toast } = useToast();
  const { user } = useAuth();

  const sendToShopping = async (items: PantryItemData[], selectedItems: string[]) => {
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

      return true;
    } catch (error) {
      console.error('Error sending items to shopping list:', error);
      toast({
        title: 'Error sending items',
        description: 'Please try again',
        variant: 'destructive',
      });
      return false;
    }
  };

  const sendMissingToShopping = async (listId: string, lists: any[], items: PantryItemData[]) => {
    if (!user) return;

    const list = lists.find(l => l.id === listId);
    if (!list) return;

    const missingItems = list.items.filter((itemId: string) => {
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
      const itemsToAdd = missingItems.map((itemId: string) => {
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

  return {
    sendToShopping,
    sendMissingToShopping
  };
}
