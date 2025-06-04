
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

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
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPreferences();
    } else {
      setPreferences(null);
      setIsLoading(false);
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          id: data.id,
          user_id: data.user_id,
          notification_email: data.notification_email,
          notification_push: data.notification_push,
          expiry_reminder_days: data.expiry_reminder_days,
          theme: data.theme as 'light' | 'dark' | 'auto',
          grocery_store_layout: data.grocery_store_layout,
          auto_add_expiring: data.auto_add_expiring,
          created_at: data.created_at,
          updated_at: data.updated_at
        });
      }
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
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setPreferences({
          id: data.id,
          user_id: data.user_id,
          notification_email: data.notification_email,
          notification_push: data.notification_push,
          expiry_reminder_days: data.expiry_reminder_days,
          theme: data.theme as 'light' | 'dark' | 'auto',
          grocery_store_layout: data.grocery_store_layout,
          auto_add_expiring: data.auto_add_expiring,
          created_at: data.created_at,
          updated_at: data.updated_at
        });
      }
      
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
