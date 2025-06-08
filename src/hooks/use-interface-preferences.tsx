
import { useState, useEffect } from 'react';
import { supabase, UserInterfacePreferences } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface InterfacePreferences {
  mobile_view_preference: 'adaptive' | 'compact' | 'spacious';
  dashboard_layout: {
    widgets: string[];
  };
  animation_level: 'minimal' | 'normal' | 'enhanced';
  gesture_controls_enabled: boolean;
  voice_commands_enabled: boolean;
  haptic_feedback_enabled: boolean;
  tutorial_hints_enabled: boolean;
}

export function useInterfacePreferences() {
  const [preferences, setPreferences] = useState<InterfacePreferences>({
    mobile_view_preference: 'adaptive',
    dashboard_layout: {
      widgets: ['pantry_summary', 'expiring_items', 'shopping_quick_add', 'recent_recipes']
    },
    animation_level: 'normal',
    gesture_controls_enabled: true,
    voice_commands_enabled: false,
    haptic_feedback_enabled: true,
    tutorial_hints_enabled: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_interface_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setPreferences({
          mobile_view_preference: data.mobile_view_preference as any,
          dashboard_layout: data.dashboard_layout as any,
          animation_level: data.animation_level as any,
          gesture_controls_enabled: data.gesture_controls_enabled,
          voice_commands_enabled: data.voice_commands_enabled,
          haptic_feedback_enabled: data.haptic_feedback_enabled,
          tutorial_hints_enabled: data.tutorial_hints_enabled
        });
      }
    } catch (error) {
      console.error('Error loading interface preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<InterfacePreferences>) => {
    if (!user) return;

    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);

    try {
      const { error } = await supabase
        .from('user_interface_preferences')
        .upsert({
          user_id: user.id,
          mobile_view_preference: newPreferences.mobile_view_preference,
          dashboard_layout: newPreferences.dashboard_layout,
          animation_level: newPreferences.animation_level,
          gesture_controls_enabled: newPreferences.gesture_controls_enabled,
          voice_commands_enabled: newPreferences.voice_commands_enabled,
          haptic_feedback_enabled: newPreferences.haptic_feedback_enabled,
          tutorial_hints_enabled: newPreferences.tutorial_hints_enabled,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Preferences updated',
        description: 'Your interface settings have been saved',
      });
    } catch (error) {
      console.error('Error updating interface preferences:', error);
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
    updatePreferences
  };
}
