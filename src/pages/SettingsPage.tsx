
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Bell,
  User,
  Palette,
  Shield,
  Database,
  Download,
  Upload,
  Trash2,
  Moon,
  Sun,
  Monitor,
  Mail,
  Smartphone,
  Clock,
  Store,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { useIsMobile } from '@/hooks/use-mobile';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { preferences, updatePreferences, isLoading } = useUserPreferences();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      // Error handling is done in the auth hook
    }
  };

  const handlePreferenceChange = (key: string, value: any) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    updatePreferences({ [key]: value });
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-kitchen-cream">
        <div className="bg-white shadow-sm px-4 py-3 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="mr-3"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Settings</h1>
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
        className="bg-white shadow-sm px-4 py-3 flex items-center"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="mr-3"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold">Settings</h1>
      </motion.div>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <>
                  <div>
                    <Label className="text-sm text-gray-600">Email</Label>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/profile')}
                      className="flex-1"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleSignOut}
                      className="flex-1"
                    >
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">Sign in to sync your data across devices</p>
                  <Button 
                    onClick={() => setShowAuthDialog(true)}
                    className="bg-kitchen-green hover:bg-kitchen-green/90"
                  >
                    Sign In / Sign Up
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                </div>
                <Switch
                  checked={preferences?.notification_email ?? true}
                  onCheckedChange={(checked) => handlePreferenceChange('notification_email', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-4 w-4 text-gray-500" />
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                  </div>
                </div>
                <Switch
                  checked={preferences?.notification_push ?? true}
                  onCheckedChange={(checked) => handlePreferenceChange('notification_push', checked)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <Label>Expiry Reminder Days</Label>
                </div>
                <Select
                  value={preferences?.expiry_reminder_days?.toString() ?? '3'}
                  onValueChange={(value) => handlePreferenceChange('expiry_reminder_days', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day before</SelectItem>
                    <SelectItem value="2">2 days before</SelectItem>
                    <SelectItem value="3">3 days before</SelectItem>
                    <SelectItem value="5">5 days before</SelectItem>
                    <SelectItem value="7">7 days before</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className="h-4 w-4 text-gray-500" />
                  <div>
                    <Label>Auto-add Expiring Items</Label>
                    <p className="text-sm text-gray-600">Automatically add expiring items to shopping list</p>
                  </div>
                </div>
                <Switch
                  checked={preferences?.auto_add_expiring ?? true}
                  onCheckedChange={(checked) => handlePreferenceChange('auto_add_expiring', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center">
                  {getThemeIcon(preferences?.theme ?? 'light')}
                  <span className="ml-2">Theme</span>
                </Label>
                <Select
                  value={preferences?.theme ?? 'light'}
                  onValueChange={(value) => handlePreferenceChange('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center">
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center">
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="auto">
                      <div className="flex items-center">
                        <Monitor className="h-4 w-4 mr-2" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center">
                  <Store className="h-4 w-4 mr-2" />
                  Grocery Store Layout
                </Label>
                <Select
                  value={preferences?.grocery_store_layout ?? 'standard'}
                  onValueChange={(value) => handlePreferenceChange('grocery_store_layout', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Layout</SelectItem>
                    <SelectItem value="costco">Costco Style</SelectItem>
                    <SelectItem value="whole_foods">Whole Foods Style</SelectItem>
                    <SelectItem value="kroger">Kroger Style</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data & Privacy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Data & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: 'Data Export',
                      description: 'Your data is being prepared for download...',
                    });
                  }}
                  className="flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: 'Data Import',
                      description: 'Feature coming soon!',
                    });
                  }}
                  className="flex items-center justify-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
              </div>

              <Separator />

              <Button
                variant="destructive"
                onClick={() => {
                  toast({
                    title: 'Delete Account',
                    description: 'This feature requires additional confirmation. Contact support for assistance.',
                    variant: 'destructive',
                  });
                }}
                className="w-full flex items-center justify-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/family')}
                  className="flex items-center justify-center"
                >
                  Family Settings
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/loyalty-cards')}
                  className="flex items-center justify-center"
                >
                  Loyalty Cards
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </div>
  );
};

export default SettingsPage;
