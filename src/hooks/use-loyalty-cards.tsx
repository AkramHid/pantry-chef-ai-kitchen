
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface LoyaltyCard {
  id: string;
  user_id: string;
  store_name: string;
  card_number: string;
  barcode_data?: string;
  qr_code_data?: string;
  store_logo_url?: string;
  category: string;
  points_balance: number;
  expiry_date?: string;
  auto_scan_enabled: boolean;
  shared_with_family: boolean;
  usage_count: number;
  last_used_at?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
}

export function useLoyaltyCards() {
  const [cards, setCards] = useState<LoyaltyCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCards();
    } else {
      setCards([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchCards = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('loyalty_cards')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('store_name');

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error('Error fetching loyalty cards:', error);
      toast({
        title: 'Error loading cards',
        description: 'Could not load your loyalty cards',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCard = async (cardData: Omit<LoyaltyCard, 'id' | 'user_id' | 'created_at' | 'usage_count' | 'is_active'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('loyalty_cards')
        .insert({
          ...cardData,
          user_id: user.id,
          usage_count: 0,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setCards(prev => [...prev, data]);
      toast({
        title: 'Card added',
        description: `${cardData.store_name} loyalty card added successfully`,
      });
      
      return data;
    } catch (error) {
      console.error('Error adding loyalty card:', error);
      toast({
        title: 'Error adding card',
        description: 'Could not add loyalty card',
        variant: 'destructive',
      });
    }
  };

  const updateCard = async (cardId: string, updates: Partial<LoyaltyCard>) => {
    try {
      const { data, error } = await supabase
        .from('loyalty_cards')
        .update(updates)
        .eq('id', cardId)
        .select()
        .single();

      if (error) throw error;

      setCards(prev => prev.map(card => card.id === cardId ? { ...card, ...data } : card));
      
      toast({
        title: 'Card updated',
        description: 'Loyalty card updated successfully',
      });
    } catch (error) {
      console.error('Error updating loyalty card:', error);
      toast({
        title: 'Error updating card',
        description: 'Could not update loyalty card',
        variant: 'destructive',
      });
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from('loyalty_cards')
        .update({ is_active: false })
        .eq('id', cardId);

      if (error) throw error;

      setCards(prev => prev.filter(card => card.id !== cardId));
      
      toast({
        title: 'Card removed',
        description: 'Loyalty card removed successfully',
      });
    } catch (error) {
      console.error('Error deleting loyalty card:', error);
      toast({
        title: 'Error removing card',
        description: 'Could not remove loyalty card',
        variant: 'destructive',
      });
    }
  };

  const incrementUsage = async (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    await updateCard(cardId, {
      usage_count: card.usage_count + 1,
      last_used_at: new Date().toISOString()
    });
  };

  const scanBarcode = async (barcodeData: string): Promise<any> => {
    // This would integrate with a barcode scanning library
    // For now, return mock data structure
    return {
      store_name: 'Auto-detected Store',
      card_number: barcodeData,
      barcode_data: barcodeData,
      category: 'grocery'
    };
  };

  return {
    cards,
    isLoading,
    addCard,
    updateCard,
    deleteCard,
    incrementUsage,
    scanBarcode,
    fetchCards
  };
}
