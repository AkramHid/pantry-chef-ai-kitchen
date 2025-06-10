
-- Add age group tracking and enhanced accessibility preferences
ALTER TABLE user_preferences 
ADD COLUMN age_group text DEFAULT 'adult' CHECK (age_group IN ('child', 'teen', 'adult', 'senior')),
ADD COLUMN font_scale numeric DEFAULT 1.0 CHECK (font_scale >= 0.8 AND font_scale <= 2.0),
ADD COLUMN high_contrast_mode boolean DEFAULT false,
ADD COLUMN reduce_motion boolean DEFAULT false,
ADD COLUMN voice_guidance boolean DEFAULT false,
ADD COLUMN simplified_ui boolean DEFAULT false,
ADD COLUMN touch_target_size text DEFAULT 'normal' CHECK (touch_target_size IN ('small', 'normal', 'large', 'extra_large'));

-- Enhance family_members table with more granular permissions
ALTER TABLE family_members 
DROP COLUMN permissions,
ADD COLUMN permissions jsonb DEFAULT '{
  "pantry": {"view": true, "edit": false, "delete": false},
  "shopping": {"view": true, "edit": true, "delete": false},
  "recipes": {"view": true, "edit": false, "delete": false},
  "settings": {"view": false, "edit": false, "delete": false},
  "family": {"view": true, "edit": false, "delete": false},
  "loyalty_cards": {"view": true, "edit": false, "delete": false}
}'::jsonb,
ADD COLUMN age_group text DEFAULT 'adult' CHECK (age_group IN ('child', 'teen', 'adult', 'senior')),
ADD COLUMN accessibility_needs jsonb DEFAULT '{}'::jsonb,
ADD COLUMN emergency_contact text,
ADD COLUMN last_activity timestamp with time zone DEFAULT now();

-- Create settings audit trail
CREATE TABLE settings_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  changed_by_user_id uuid NOT NULL,
  setting_category text NOT NULL,
  setting_key text NOT NULL,
  old_value jsonb,
  new_value jsonb,
  change_reason text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create family communication table
CREATE TABLE family_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id text NOT NULL,
  sender_user_id uuid NOT NULL,
  message_type text NOT NULL CHECK (message_type IN ('shopping_request', 'recipe_share', 'general', 'emergency')),
  title text NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  read_by jsonb DEFAULT '{}'::jsonb,
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enhance loyalty_cards table with more features
ALTER TABLE loyalty_cards
ADD COLUMN store_logo_url text,
ADD COLUMN category text DEFAULT 'grocery',
ADD COLUMN points_balance numeric DEFAULT 0,
ADD COLUMN expiry_date timestamp with time zone,
ADD COLUMN auto_scan_enabled boolean DEFAULT true,
ADD COLUMN shared_with_family boolean DEFAULT false,
ADD COLUMN usage_count integer DEFAULT 0,
ADD COLUMN last_used_at timestamp with time zone;

-- Create settings templates table
CREATE TABLE settings_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  target_age_group text CHECK (target_age_group IN ('child', 'teen', 'adult', 'senior')),
  target_accessibility_needs text[],
  template_data jsonb NOT NULL,
  is_system_template boolean DEFAULT false,
  created_by_user_id uuid,
  created_at timestamp with time zone DEFAULT now()
);

-- Insert default accessibility templates
INSERT INTO settings_templates (name, description, target_age_group, template_data, is_system_template) VALUES
('Senior Friendly', 'Large text, high contrast, simplified interface', 'senior', '{
  "font_scale": 1.5,
  "high_contrast_mode": true,
  "simplified_ui": true,
  "touch_target_size": "extra_large",
  "reduce_motion": true,
  "voice_guidance": true,
  "tutorial_mode": "guided"
}'::jsonb, true),
('Child Safe', 'Simplified interface with parental controls', 'child', '{
  "simplified_ui": true,
  "touch_target_size": "large",
  "tutorial_mode": "guided",
  "voice_guidance": true
}'::jsonb, true),
('Low Vision', 'High contrast and large text for vision accessibility', 'adult', '{
  "font_scale": 1.8,
  "high_contrast_mode": true,
  "touch_target_size": "large",
  "voice_guidance": true
}'::jsonb, true);

-- Enable RLS on new tables
ALTER TABLE settings_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies for settings_audit
CREATE POLICY "Users can view their own audit trail" ON settings_audit FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can view changes they made" ON settings_audit FOR SELECT USING (changed_by_user_id = auth.uid());

-- RLS policies for family_messages
CREATE POLICY "Family members can view messages" ON family_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM family_members fm 
    WHERE fm.user_id = auth.uid() 
    AND fm.status = 'accepted'
  )
);

CREATE POLICY "Family members can create messages" ON family_messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM family_members fm 
    WHERE fm.user_id = auth.uid() 
    AND fm.status = 'accepted'
  )
);

-- RLS policies for settings_templates
CREATE POLICY "Anyone can view system templates" ON settings_templates FOR SELECT USING (is_system_template = true);
CREATE POLICY "Users can view their own templates" ON settings_templates FOR SELECT USING (created_by_user_id = auth.uid());
CREATE POLICY "Users can create templates" ON settings_templates FOR INSERT WITH CHECK (created_by_user_id = auth.uid());
