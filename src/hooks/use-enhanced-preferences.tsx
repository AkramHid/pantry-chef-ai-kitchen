
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface EnhancedUserPreferences {
  id: string;
  user_id: string;
  notification_email: boolean;
  notification_push: boolean;
  expiry_reminder_days: number;
  theme: 'light' | 'dark' | 'auto';
  grocery_store_layout: string;
  auto_add_expiring: boolean;
  onboarding_completed: boolean;
  mobile_optimized_layout: boolean;
  tutorial_mode: 'guided' | 'minimal' | 'off';
  accessibility_mode: boolean;
  age_group: 'child' | 'teen' | 'adult' | 'senior';
  font_scale: number;
  high_contrast_mode: boolean;
  reduce_motion: boolean;
  voice_guidance: boolean;
  simplified_ui: boolean;
  touch_target_size: 'small' | 'normal' | 'large' | 'extra_large';
  created_at: string;
  updated_at: string;
}

interface SettingsTemplate {
  id: string;
  name: string;
  description?: string;
  target_age_group?: 'child' | 'teen' | 'adult' | 'senior';
  target_accessibility_needs?: string[];
  template_data: any;
  is_system_template: boolean;
  created_by_user_id?: string;
  created_at: string;
}

export function useEnhancedPreferences() {
  const [preferences, setPreferences] = useState<EnhancedUserPreferences | null>(null);
  const [templates, setTemplates] = useState<SettingsTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPreferences();
      fetchTemplates();
    } else {
      setPreferences(null);
      setTemplates([]);
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
        setPreferences(data as EnhancedUserPreferences);
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

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('settings_templates')
        .select('*')
        .order('is_system_template', { ascending: false })
        .order('name');

      if (error) throw error;
      
      // Type cast the data to match our interface
      const typedTemplates: SettingsTemplate[] = (data || []).map(template => ({
        ...template,
        target_age_group: template.target_age_group as 'child' | 'teen' | 'adult' | 'senior' | undefined
      }));
      
      setTemplates(typedTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const updatePreferences = async (updates: Partial<EnhancedUserPreferences>, changeReason?: string) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Store old values for audit trail
      const oldValues = preferences ? { ...preferences } : {};
      
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
        setPreferences(data as EnhancedUserPreferences);
        
        // Create audit trail for significant changes
        if (changeReason) {
          await createAuditTrail(oldValues, updates, changeReason);
        }
      }
      
      toast({
        title: 'Settings updated',
        description: 'Your preferences have been saved',
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: 'Error updating settings',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const createAuditTrail = async (oldValues: any, newValues: any, reason: string) => {
    if (!user) return;

    try {
      await supabase
        .from('settings_audit')
        .insert({
          user_id: user.id,
          changed_by_user_id: user.id,
          setting_category: 'user_preferences',
          setting_key: 'bulk_update',
          old_value: oldValues,
          new_value: newValues,
          change_reason: reason
        });
    } catch (error) {
      console.error('Error creating audit trail:', error);
    }
  };

  const applyTemplate = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    await updatePreferences(
      template.template_data,
      `Applied template: ${template.name}`
    );

    toast({
      title: 'Template applied',
      description: `Applied ${template.name} settings`,
    });
  };

  const getRecommendedTemplates = () => {
    if (!preferences) return [];
    
    return templates.filter(template => {
      if (template.target_age_group === preferences.age_group) return true;
      if (preferences.accessibility_mode && template.name.includes('Vision')) return true;
      return false;
    });
  };

  return {
    preferences,
    templates,
    isLoading,
    isSaving,
    updatePreferences,
    applyTemplate,
    getRecommendedTemplates,
    fetchPreferences
  };
}
