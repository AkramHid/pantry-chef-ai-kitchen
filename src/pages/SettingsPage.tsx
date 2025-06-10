
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
  Zap,
  CreditCard,
  Users,
  Eye,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useEnhancedPreferences } from '@/hooks/use-enhanced-preferences';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import AccessibilitySettings from '@/components/settings/AccessibilitySettings';
import LoyaltyCardsSettings from '@/components/settings/LoyaltyCardsSettings';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { preferences, updatePreferences, isLoading, isSaving } = useEnhancedPreferences();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
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
      <div className="min-h-screen bg-kitchen-cream flex flex-col">
        <Header title="Settings" showBackButton={true} />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kitchen-green"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kitchen-cream flex flex-col">
      <Header title="Settings" showBackButton={true} />
      
      <main className="flex-1 p-3 md:p-6 mb-16">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
            {/* Mobile-Responsive Tab Navigation */}
            <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3 h-auto' : 'grid-cols-6'}`}>
              <TabsTrigger value="general" className={`flex ${isMobile ? 'flex-col py-2' : 'flex-row'} items-center gap-1 md:gap-2 text-xs md:text-sm`}>
                <User className="h-3 w-3 md:h-4 md:w-4" />
                <span className={isMobile ? 'text-xs' : ''}>General</span>
              </TabsTrigger>
              <TabsTrigger value="accessibility" className={`flex ${isMobile ? 'flex-col py-2' : 'flex-row'} items-center gap-1 md:gap-2 text-xs md:text-sm`}>
                <Eye className="h-3 w-3 md:h-4 md:w-4" />
                <span className={isMobile ? 'text-xs' : ''}>Access</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className={`flex ${isMobile ? 'flex-col py-2' : 'flex-row'} items-center gap-1 md:gap-2 text-xs md:text-sm`}>
                <Bell className="h-3 w-3 md:h-4 md:w-4" />
                <span className={isMobile ? 'text-xs' : ''}>Notify</span>
              </TabsTrigger>
              {!isMobile && (
                <>
                  <TabsTrigger value="appearance" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="loyalty" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Loyalty Cards
                  </TabsTrigger>
                  <TabsTrigger value="family" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Family
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            {/* Mobile Additional Tabs */}
            {isMobile && (
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="appearance" className="flex flex-col items-center gap-1 py-2 text-xs">
                  <Palette className="h-3 w-3" />
                  <span>Theme</span>
                </TabsTrigger>
                <TabsTrigger value="loyalty" className="flex flex-col items-center gap-1 py-2 text-xs">
                  <CreditCard className="h-3 w-3" />
                  <span>Cards</span>
                </TabsTrigger>
                <TabsTrigger value="family" className="flex flex-col items-center gap-1 py-2 text-xs">
                  <Users className="h-3 w-3" />
                  <span>Family</span>
                </TabsTrigger>
              </TabsList>
            )}

            {/* Saving Indicator */}
            {isSaving && (
              <div className="flex items-center justify-center text-sm text-gray-600 py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-kitchen-green mr-2"></div>
                Saving...
              </div>
            )}

            {/* General Settings */}
            <TabsContent value="general" className="space-y-4 md:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg md:text-xl">
                      <User className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                      Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user ? (
                      <>
                        <div>
                          <Label className="text-sm text-gray-600">Email</Label>
                          <p className="font-medium break-all">{user.email}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => navigate('/profile')}
                            className="w-full justify-center"
                          >
                            <User className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={handleSignOut}
                            className="w-full justify-center"
                          >
                            Sign Out
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-600 mb-4 text-sm">Sign in to sync your data across devices</p>
                        <Button 
                          onClick={() => setShowAuthDialog(true)}
                          className="bg-kitchen-green hover:bg-kitchen-green/90 w-full"
                        >
                          Sign In / Sign Up
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Data & Privacy Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg md:text-xl">
                      <Database className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                      Data & Privacy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: 'Data Export',
                            description: 'Your data is being prepared for download...',
                          });
                        }}
                        className="w-full justify-center"
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
                        className="w-full justify-center"
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
                      className="w-full justify-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Accessibility Settings */}
            <TabsContent value="accessibility">
              <AccessibilitySettings />
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-4 md:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg md:text-xl">
                      <Bell className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3">
                        <Mail className="h-4 w-4 text-gray-500 mt-1" />
                        <div className="flex-1">
                          <Label className="text-sm font-medium">Email Notifications</Label>
                          <p className="text-xs text-gray-600">Receive notifications via email</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences?.notification_email ?? true}
                        onCheckedChange={(checked) => handlePreferenceChange('notification_email', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3">
                        <Smartphone className="h-4 w-4 text-gray-500 mt-1" />
                        <div className="flex-1">
                          <Label className="text-sm font-medium">Push Notifications</Label>
                          <p className="text-xs text-gray-600">Receive push notifications in browser</p>
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
                        <Label className="text-sm font-medium">Expiry Reminder Days</Label>
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
                      <div className="flex items-start space-x-3">
                        <Zap className="h-4 w-4 text-gray-500 mt-1" />
                        <div className="flex-1">
                          <Label className="text-sm font-medium">Auto-add Expiring Items</Label>
                          <p className="text-xs text-gray-600">Automatically add expiring items to shopping list</p>
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
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-4 md:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg md:text-xl">
                      <Palette className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                      Appearance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center text-sm font-medium">
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
                      <Label className="flex items-center text-sm font-medium">
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
            </TabsContent>

            {/* Loyalty Cards */}
            <TabsContent value="loyalty">
              <LoyaltyCardsSettings />
            </TabsContent>

            {/* Family Settings */}
            <TabsContent value="family" className="space-y-4 md:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg md:text-xl">
                      <Users className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                      Family Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Family Features</h3>
                      <p className="text-gray-600 mb-4 text-sm">Manage family members, permissions, and shared shopping lists</p>
                      <Button onClick={() => navigate('/family')} className="w-full">
                        Go to Family Page
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </div>
  );
};

export default SettingsPage;
