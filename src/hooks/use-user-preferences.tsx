
import { useEnhancedPreferences } from './use-enhanced-preferences';

// Backward compatibility wrapper
export function useUserPreferences() {
  const {
    preferences,
    isLoading,
    updatePreferences,
    fetchPreferences
  } = useEnhancedPreferences();

  // Transform enhanced preferences to match old interface
  const legacyPreferences = preferences ? {
    id: preferences.id,
    user_id: preferences.user_id,
    notification_email: preferences.notification_email,
    notification_push: preferences.notification_push,
    expiry_reminder_days: preferences.expiry_reminder_days,
    theme: preferences.theme,
    grocery_store_layout: preferences.grocery_store_layout,
    auto_add_expiring: preferences.auto_add_expiring,
    onboarding_completed: preferences.onboarding_completed,
    mobile_optimized_layout: preferences.mobile_optimized_layout,
    tutorial_mode: preferences.tutorial_mode,
    accessibility_mode: preferences.accessibility_mode,
    created_at: preferences.created_at,
    updated_at: preferences.updated_at
  } : null;

  return {
    preferences: legacyPreferences,
    isLoading,
    updatePreferences,
    fetchPreferences
  };
}
