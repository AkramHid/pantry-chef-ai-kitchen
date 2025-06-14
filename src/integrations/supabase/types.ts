export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      family_members: {
        Row: {
          accessibility_needs: Json | null
          age_group: string | null
          created_at: string
          email: string
          emergency_contact: string | null
          id: string
          last_activity: string | null
          member_user_id: string | null
          name: string
          permissions: Json | null
          role: string
          status: string
          user_id: string
        }
        Insert: {
          accessibility_needs?: Json | null
          age_group?: string | null
          created_at?: string
          email: string
          emergency_contact?: string | null
          id?: string
          last_activity?: string | null
          member_user_id?: string | null
          name: string
          permissions?: Json | null
          role?: string
          status?: string
          user_id: string
        }
        Update: {
          accessibility_needs?: Json | null
          age_group?: string | null
          created_at?: string
          email?: string
          emergency_contact?: string | null
          id?: string
          last_activity?: string | null
          member_user_id?: string | null
          name?: string
          permissions?: Json | null
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      family_messages: {
        Row: {
          content: string
          created_at: string | null
          expires_at: string | null
          family_id: string
          id: string
          message_type: string
          metadata: Json | null
          priority: string | null
          read_by: Json | null
          sender_user_id: string
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          expires_at?: string | null
          family_id: string
          id?: string
          message_type: string
          metadata?: Json | null
          priority?: string | null
          read_by?: Json | null
          sender_user_id: string
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          expires_at?: string | null
          family_id?: string
          id?: string
          message_type?: string
          metadata?: Json | null
          priority?: string | null
          read_by?: Json | null
          sender_user_id?: string
          title?: string
        }
        Relationships: []
      }
      kitchen_styles: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      loyalty_cards: {
        Row: {
          auto_scan_enabled: boolean | null
          barcode_data: string | null
          card_number: string
          category: string | null
          created_at: string
          expiry_date: string | null
          id: string
          is_active: boolean
          last_used_at: string | null
          notes: string | null
          points_balance: number | null
          qr_code_data: string | null
          shared_with_family: boolean | null
          store_logo_url: string | null
          store_name: string
          usage_count: number | null
          user_id: string
        }
        Insert: {
          auto_scan_enabled?: boolean | null
          barcode_data?: string | null
          card_number: string
          category?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          notes?: string | null
          points_balance?: number | null
          qr_code_data?: string | null
          shared_with_family?: boolean | null
          store_logo_url?: string | null
          store_name: string
          usage_count?: number | null
          user_id: string
        }
        Update: {
          auto_scan_enabled?: boolean | null
          barcode_data?: string | null
          card_number?: string
          category?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          notes?: string | null
          points_balance?: number | null
          qr_code_data?: string | null
          shared_with_family?: boolean | null
          store_logo_url?: string | null
          store_name?: string
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          message: string
          metadata: Json | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_progress: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          page_name: string
          step_completed: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          page_name: string
          step_completed: string
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          page_name?: string
          step_completed?: string
          user_id?: string
        }
        Relationships: []
      }
      page_tutorials: {
        Row: {
          animation_type: string | null
          created_at: string
          description: string
          id: string
          is_active: boolean
          page_name: string
          step_name: string
          step_order: number
          target_element: string | null
          title: string
        }
        Insert: {
          animation_type?: string | null
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          page_name: string
          step_name: string
          step_order: number
          target_element?: string | null
          title: string
        }
        Update: {
          animation_type?: string | null
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          page_name?: string
          step_name?: string
          step_order?: number
          target_element?: string | null
          title?: string
        }
        Relationships: []
      }
      pantry_items: {
        Row: {
          added_date: string | null
          category: string | null
          created_at: string
          expiry_date: string | null
          id: number
          image_url: string | null
          name: string | null
          quantity: number | null
          unit: string | null
          user_id: string | null
        }
        Insert: {
          added_date?: string | null
          category?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: number
          image_url?: string | null
          name?: string | null
          quantity?: number | null
          unit?: string | null
          user_id?: string | null
        }
        Update: {
          added_date?: string | null
          category?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: number
          image_url?: string | null
          name?: string | null
          quantity?: number | null
          unit?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      settings_audit: {
        Row: {
          change_reason: string | null
          changed_by_user_id: string
          created_at: string | null
          id: string
          new_value: Json | null
          old_value: Json | null
          setting_category: string
          setting_key: string
          user_id: string
        }
        Insert: {
          change_reason?: string | null
          changed_by_user_id: string
          created_at?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          setting_category: string
          setting_key: string
          user_id: string
        }
        Update: {
          change_reason?: string | null
          changed_by_user_id?: string
          created_at?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          setting_category?: string
          setting_key?: string
          user_id?: string
        }
        Relationships: []
      }
      settings_templates: {
        Row: {
          created_at: string | null
          created_by_user_id: string | null
          description: string | null
          id: string
          is_system_template: boolean | null
          name: string
          target_accessibility_needs: string[] | null
          target_age_group: string | null
          template_data: Json
        }
        Insert: {
          created_at?: string | null
          created_by_user_id?: string | null
          description?: string | null
          id?: string
          is_system_template?: boolean | null
          name: string
          target_accessibility_needs?: string[] | null
          target_age_group?: string | null
          template_data: Json
        }
        Update: {
          created_at?: string | null
          created_by_user_id?: string | null
          description?: string | null
          id?: string
          is_system_template?: boolean | null
          name?: string
          target_accessibility_needs?: string[] | null
          target_age_group?: string | null
          template_data?: Json
        }
        Relationships: []
      }
      shopping_list: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          ischecked: boolean | null
          name: string
          note: string | null
          quantity: number | null
          unit: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          ischecked?: boolean | null
          name: string
          note?: string | null
          quantity?: number | null
          unit?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          ischecked?: boolean | null
          name?: string
          note?: string | null
          quantity?: number | null
          unit?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_interface_preferences: {
        Row: {
          animation_level: string
          created_at: string
          dashboard_layout: Json
          gesture_controls_enabled: boolean
          haptic_feedback_enabled: boolean
          id: string
          mobile_view_preference: string
          tutorial_hints_enabled: boolean
          updated_at: string
          user_id: string
          voice_commands_enabled: boolean
        }
        Insert: {
          animation_level?: string
          created_at?: string
          dashboard_layout?: Json
          gesture_controls_enabled?: boolean
          haptic_feedback_enabled?: boolean
          id?: string
          mobile_view_preference?: string
          tutorial_hints_enabled?: boolean
          updated_at?: string
          user_id: string
          voice_commands_enabled?: boolean
        }
        Update: {
          animation_level?: string
          created_at?: string
          dashboard_layout?: Json
          gesture_controls_enabled?: boolean
          haptic_feedback_enabled?: boolean
          id?: string
          mobile_view_preference?: string
          tutorial_hints_enabled?: boolean
          updated_at?: string
          user_id?: string
          voice_commands_enabled?: boolean
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          accessibility_mode: boolean
          age_group: string | null
          auto_add_expiring: boolean
          created_at: string
          expiry_reminder_days: number
          font_scale: number | null
          grocery_store_layout: string
          high_contrast_mode: boolean | null
          id: string
          mobile_optimized_layout: boolean
          notification_email: boolean
          notification_push: boolean
          onboarding_completed: boolean
          reduce_motion: boolean | null
          simplified_ui: boolean | null
          theme: string
          touch_target_size: string | null
          tutorial_mode: string
          updated_at: string
          user_id: string
          voice_guidance: boolean | null
        }
        Insert: {
          accessibility_mode?: boolean
          age_group?: string | null
          auto_add_expiring?: boolean
          created_at?: string
          expiry_reminder_days?: number
          font_scale?: number | null
          grocery_store_layout?: string
          high_contrast_mode?: boolean | null
          id?: string
          mobile_optimized_layout?: boolean
          notification_email?: boolean
          notification_push?: boolean
          onboarding_completed?: boolean
          reduce_motion?: boolean | null
          simplified_ui?: boolean | null
          theme?: string
          touch_target_size?: string | null
          tutorial_mode?: string
          updated_at?: string
          user_id: string
          voice_guidance?: boolean | null
        }
        Update: {
          accessibility_mode?: boolean
          age_group?: string | null
          auto_add_expiring?: boolean
          created_at?: string
          expiry_reminder_days?: number
          font_scale?: number | null
          grocery_store_layout?: string
          high_contrast_mode?: boolean | null
          id?: string
          mobile_optimized_layout?: boolean
          notification_email?: boolean
          notification_push?: boolean
          onboarding_completed?: boolean
          reduce_motion?: boolean | null
          simplified_ui?: boolean | null
          theme?: string
          touch_target_size?: string | null
          tutorial_mode?: string
          updated_at?: string
          user_id?: string
          voice_guidance?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_expiry_notifications: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
