

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface FamilyMember {
  id: string;
  user_id: string;
  member_user_id?: string;
  email: string;
  name: string;
  role: 'admin' | 'parent' | 'caregiver' | 'member' | 'child';
  status: 'pending' | 'accepted' | 'declined';
  age_group: 'child' | 'teen' | 'adult' | 'senior';
  permissions: {
    pantry: { view: boolean; edit: boolean; delete: boolean };
    shopping: { view: boolean; edit: boolean; delete: boolean };
    recipes: { view: boolean; edit: boolean; delete: boolean };
    settings: { view: boolean; edit: boolean; delete: boolean };
    family: { view: boolean; edit: boolean; delete: boolean };
    loyalty_cards: { view: boolean; edit: boolean; delete: boolean };
  };
  accessibility_needs: any;
  emergency_contact?: string;
  last_activity?: string;
  created_at: string;
}

interface FamilyMessage {
  id: string;
  family_id: string;
  sender_user_id: string;
  message_type: 'shopping_request' | 'recipe_share' | 'general' | 'emergency';
  title: string;
  content: string;
  metadata: any;
  read_by: any;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  expires_at?: string;
  created_at: string;
}

export function useFamilySettings() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [messages, setMessages] = useState<FamilyMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFamilyMembers();
      fetchFamilyMessages();
    } else {
      setMembers([]);
      setMessages([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchFamilyMembers = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');

      if (error) throw error;
      
      // Type cast the data to match our interface
      const typedMembers: FamilyMember[] = (data || []).map(member => ({
        ...member,
        role: member.role as 'admin' | 'parent' | 'caregiver' | 'member' | 'child',
        status: member.status as 'pending' | 'accepted' | 'declined',
        age_group: member.age_group as 'child' | 'teen' | 'adult' | 'senior',
        permissions: member.permissions as FamilyMember['permissions']
      }));
      
      setMembers(typedMembers);
    } catch (error) {
      console.error('Error fetching family members:', error);
      toast({
        title: 'Error loading family',
        description: 'Could not load family members',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFamilyMessages = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('family_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Type cast the data to match our interface
      const typedMessages: FamilyMessage[] = (data || []).map(message => ({
        ...message,
        message_type: message.message_type as 'shopping_request' | 'recipe_share' | 'general' | 'emergency',
        priority: message.priority as 'low' | 'normal' | 'high' | 'urgent'
      }));
      
      setMessages(typedMessages);
    } catch (error) {
      console.error('Error fetching family messages:', error);
    }
  };

  const inviteFamilyMember = async (email: string, name: string, role: string, ageGroup: string) => {
    if (!user) return;

    try {
      const defaultPermissions = getDefaultPermissions(role);
      
      const { data, error } = await supabase
        .from('family_members')
        .insert({
          user_id: user.id,
          email,
          name,
          role,
          age_group: ageGroup,
          status: 'pending',
          permissions: defaultPermissions
        })
        .select()
        .single();

      if (error) throw error;

      // Type cast the response data
      const typedMember: FamilyMember = {
        ...data,
        role: data.role as 'admin' | 'parent' | 'caregiver' | 'member' | 'child',
        status: data.status as 'pending' | 'accepted' | 'declined',
        age_group: data.age_group as 'child' | 'teen' | 'adult' | 'senior',
        permissions: data.permissions as FamilyMember['permissions']
      };

      setMembers(prev => [...prev, typedMember]);
      
      toast({
        title: 'Invitation sent',
        description: `Invitation sent to ${name}`,
      });
      
      return typedMember;
    } catch (error) {
      console.error('Error inviting family member:', error);
      toast({
        title: 'Error sending invitation',
        description: 'Could not send family invitation',
        variant: 'destructive',
      });
    }
  };

  const updateMemberPermissions = async (memberId: string, permissions: any) => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .update({ permissions })
        .eq('id', memberId)
        .select()
        .single();

      if (error) throw error;

      setMembers(prev => prev.map(member => 
        member.id === memberId ? { ...member, permissions } : member
      ));
      
      toast({
        title: 'Permissions updated',
        description: 'Family member permissions updated',
      });
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast({
        title: 'Error updating permissions',
        description: 'Could not update member permissions',
        variant: 'destructive',
      });
    }
  };

  const removeFamilyMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setMembers(prev => prev.filter(member => member.id !== memberId));
      
      toast({
        title: 'Member removed',
        description: 'Family member removed successfully',
      });
    } catch (error) {
      console.error('Error removing family member:', error);
      toast({
        title: 'Error removing member',
        description: 'Could not remove family member',
        variant: 'destructive',
      });
    }
  };

  const sendFamilyMessage = async (
    messageType: string,
    title: string,
    content: string,
    priority: string = 'normal',
    metadata: any = {}
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('family_messages')
        .insert({
          family_id: user.id, // Using user.id as family_id for simplicity
          sender_user_id: user.id,
          message_type: messageType,
          title,
          content,
          priority,
          metadata
        })
        .select()
        .single();

      if (error) throw error;

      // Type cast the response data
      const typedMessage: FamilyMessage = {
        ...data,
        message_type: data.message_type as 'shopping_request' | 'recipe_share' | 'general' | 'emergency',
        priority: data.priority as 'low' | 'normal' | 'high' | 'urgent'
      };

      setMessages(prev => [typedMessage, ...prev]);
      
      toast({
        title: 'Message sent',
        description: 'Family message sent successfully',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error sending message',
        description: 'Could not send family message',
        variant: 'destructive',
      });
    }
  };

  const getDefaultPermissions = (role: string) => {
    const permissionSets = {
      admin: {
        pantry: { view: true, edit: true, delete: true },
        shopping: { view: true, edit: true, delete: true },
        recipes: { view: true, edit: true, delete: true },
        settings: { view: true, edit: true, delete: true },
        family: { view: true, edit: true, delete: true },
        loyalty_cards: { view: true, edit: true, delete: true }
      },
      parent: {
        pantry: { view: true, edit: true, delete: true },
        shopping: { view: true, edit: true, delete: true },
        recipes: { view: true, edit: true, delete: false },
        settings: { view: true, edit: true, delete: false },
        family: { view: true, edit: true, delete: false },
        loyalty_cards: { view: true, edit: true, delete: false }
      },
      caregiver: {
        pantry: { view: true, edit: true, delete: false },
        shopping: { view: true, edit: true, delete: false },
        recipes: { view: true, edit: false, delete: false },
        settings: { view: true, edit: false, delete: false },
        family: { view: true, edit: false, delete: false },
        loyalty_cards: { view: true, edit: false, delete: false }
      },
      member: {
        pantry: { view: true, edit: true, delete: false },
        shopping: { view: true, edit: true, delete: false },
        recipes: { view: true, edit: false, delete: false },
        settings: { view: false, edit: false, delete: false },
        family: { view: true, edit: false, delete: false },
        loyalty_cards: { view: true, edit: false, delete: false }
      },
      child: {
        pantry: { view: true, edit: false, delete: false },
        shopping: { view: true, edit: false, delete: false },
        recipes: { view: true, edit: false, delete: false },
        settings: { view: false, edit: false, delete: false },
        family: { view: false, edit: false, delete: false },
        loyalty_cards: { view: false, edit: false, delete: false }
      }
    };
    
    return permissionSets[role] || permissionSets.member;
  };

  return {
    members,
    messages,
    isLoading,
    inviteFamilyMember,
    updateMemberPermissions,
    removeFamilyMember,
    sendFamilyMessage,
    fetchFamilyMembers,
    fetchFamilyMessages
  };
}

