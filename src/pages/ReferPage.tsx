
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Share, Copy, Settings, Bell, Users, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';

const ReferPage = () => {
  const navigate = useNavigate();
  const referralCode = 'KOFFA-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  
  // Mock data
  const referralStats = {
    totalReferrals: 3,
    pendingReferrals: 1,
    completedReferrals: 2,
    totalEarnings: 180, // $90 per completed referral
    nextReward: 270 // At 3 completed referrals
  };
  
  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied to clipboard!');
  };
  
  const shareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me on KOFFA',
        text: `Use my referral code ${referralCode} to get started with KOFFA and receive a special welcome bonus!`,
        url: window.location.origin,
      })
      .catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      copyReferralCode();
    }
  };

  const progressToNextReward = (referralStats.completedReferrals % 3) / 3 * 100;

  return (
    <div className="min-h-screen bg-kitchen-cream kitchen-texture flex flex-col">
      <Header title="Refer Friends" showBackButton={true} />
      
      <main className="flex-1 px-4 py-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Hero Section */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex p-4 rounded-full bg-kitchen-wood/10 mb-4"
            >
              <Gift className="h-12 w-12 text-kitchen-wood" />
            </motion.div>
            <h2 className="text-2xl font-bold font-heading text-kitchen-dark mb-2">Refer & Earn</h2>
            <p className="text-muted-foreground">Share KOFFA with your friends and you'll both get rewards!</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-kitchen-green">{referralStats.totalReferrals}</div>
                <div className="text-xs text-gray-600">Total Referrals</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{referralStats.pendingReferrals}</div>
                <div className="text-xs text-gray-600">Pending</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{referralStats.completedReferrals}</div>
                <div className="text-xs text-gray-600">Completed</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">${referralStats.totalEarnings}</div>
                <div className="text-xs text-gray-600">Total Earned</div>
              </CardContent>
            </Card>
          </div>

          {/* Progress to Next Reward */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Award className="h-5 w-5 mr-2 text-kitchen-green" />
                Progress to Next Reward
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>{referralStats.completedReferrals % 3} of 3 referrals</span>
                  <span className="font-semibold">Next reward: $90</span>
                </div>
                <Progress value={progressToNextReward} className="h-2" />
                <p className="text-xs text-gray-600">
                  {3 - (referralStats.completedReferrals % 3)} more successful referrals to unlock your next reward!
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Referral Benefits */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="h-5 w-5 mr-2 text-kitchen-green" />
                Your Referral Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-kitchen-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">You get $90 credit</p>
                    <p className="text-xs text-gray-600">For each friend who completes their first chef booking</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Your friend gets $45 credit</p>
                    <p className="text-xs text-gray-600">Applied to their first chef booking automatically</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Bonus rewards</p>
                    <p className="text-xs text-gray-600">Extra $30 for every 3 successful referrals</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Your Code */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Share className="h-5 w-5 mr-2 text-kitchen-green" />
                Share Your Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm mb-2 font-medium">Your Referral Code</p>
                <div className="flex">
                  <div className="flex-1 bg-muted p-3 rounded-l-md font-mono font-medium text-center border">
                    {referralCode}
                  </div>
                  <Button variant="outline" onClick={copyReferralCode} className="rounded-l-none">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={shareApp}
                className="w-full flex items-center justify-center gap-2 bg-kitchen-green hover:bg-kitchen-green/90"
              >
                <Share className="h-4 w-4" />
                Share with Friends
              </Button>
            </CardContent>
          </Card>
          
          {/* Recent Referrals */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Users className="h-5 w-5 mr-2 text-kitchen-green" />
                Your Referrals
              </CardTitle>
            </CardHeader>
            <CardContent>
              {referralStats.totalReferrals > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Sarah Johnson</p>
                      <p className="text-xs text-gray-600">Joined 2 days ago</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Mike Chen</p>
                      <p className="text-xs text-gray-600">Joined 1 week ago</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Emma Wilson</p>
                      <p className="text-xs text-gray-600">Joined 3 days ago</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p>You haven't referred anyone yet</p>
                  <p className="text-sm mt-1">Share your code to start earning rewards!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/settings')}
              className="flex items-center justify-center gap-2 h-12"
            >
              <Settings className="h-4 w-4" />
              Referral Settings
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/notifications')}
              className="flex items-center justify-center gap-2 h-12"
            >
              <Bell className="h-4 w-4" />
              Referral Notifications
            </Button>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReferPage;
