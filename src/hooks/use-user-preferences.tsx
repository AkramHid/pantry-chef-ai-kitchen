
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserPreferences {
  id: string;
  user_id: string;
  notification_email: boolean;
  notification_push: boolean;
  expiry_reminder_days: number;
  theme: 'light' | 'dark' | 'auto';
  grocery_store_layout: string;
  auto_add_expiring: boolean;
  created_at: string;
  updated_at: string;
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setPreferences(data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast({
        title: 'Error loading preferences',
        description: 'Using default settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          ...preferences,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setPreferences(data);
      toast({
        title: 'Preferences updated',
        description: 'Your settings have been saved',
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: 'Error updating preferences',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  return {
    preferences,
    isLoading,
    updatePreferences,
    fetchPreferences
  };
}
