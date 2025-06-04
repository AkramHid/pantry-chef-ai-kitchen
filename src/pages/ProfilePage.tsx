
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, Camera, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone?: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create a new profile if it doesn't exist
        setProfile({
          id: user.id,
          first_name: '',
          last_name: '',
          avatar_url: '',
          phone: ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error loading profile',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: profile.first_name?.trim() || null,
          last_name: profile.last_name?.trim() || null,
          phone: profile.phone?.trim() || null,
          avatar_url: profile.avatar_url || null,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Profile updated',
        description: 'Your profile has been saved successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error updating profile',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Profile, value: string) => {
    if (!profile) return;
    setProfile(prev => prev ? { ...prev, [field]: value } : null);
  };

  const getInitials = () => {
    if (!profile) return 'U';
    const first = profile.first_name?.charAt(0) || '';
    const last = profile.last_name?.charAt(0) || '';
    return (first + last).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';
  };

  if (!user) {
    navigate('/');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-kitchen-cream">
        <div className="bg-white shadow-sm px-4 py-3 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-3"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kitchen-green"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kitchen-cream">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white shadow-sm px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-3"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-kitchen-green hover:bg-kitchen-green/90"
        >
          <Save size={16} className="mr-2" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </motion.div>

      <div className="p-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="text-lg bg-kitchen-green text-white">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: 'Photo upload',
                      description: 'Photo upload feature coming soon!',
                    });
                  }}
                >
                  <Camera size={16} className="mr-2" />
                  Change Photo
                </Button>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile?.first_name || ''}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile?.last_name || ''}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed here. Contact support for email changes.
                </p>
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile?.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Account Information */}
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Account Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Account created:</strong>{' '}
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Last sign in:</strong>{' '}
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleDateString()
                      : 'Never'
                    }
                  </p>
                  <p>
                    <strong>Email verified:</strong>{' '}
                    {user.email_confirmed_at ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
