
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Share, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const ReferPage = () => {
  const navigate = useNavigate();
  const referralCode = 'KOFFA-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  
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

  return (
    <div className="min-h-screen bg-kitchen-cream kitchen-texture flex flex-col">
      <Header title="Refer Friends" />
      
      <main className="flex-1 px-4 py-6 mb-16">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-kitchen-wood/10 mb-4">
            <Gift className="h-12 w-12 text-kitchen-wood" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-kitchen-dark mb-2">Recommend to Friends</h2>
          <p className="text-muted-foreground">Share KOFFA with your friends and you'll both get rewards!</p>
        </div>
        
        <div className="bg-white rounded-lg border border-muted p-6 mb-8">
          <h3 className="font-medium mb-3">Your Referral Benefits</h3>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-kitchen-green">✓</span>
              <span>For each friend who joins, you get <span className="font-semibold">6 months of Urban Point for free</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-kitchen-green">✓</span>
              <span>Your friend gets <span className="font-semibold">3 months of Urban Point for free</span></span>
            </li>
          </ul>
          
          <div className="mb-6">
            <p className="text-sm mb-2">Your Referral Code</p>
            <div className="flex">
              <div className="flex-1 bg-muted p-3 rounded-l-md font-mono font-medium text-center">
                {referralCode}
              </div>
              <Button variant="outline" onClick={copyReferralCode} className="rounded-l-none">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            onClick={shareApp}
            className="w-full flex items-center justify-center gap-2"
          >
            <Share className="h-4 w-4" />
            Share with Friends
          </Button>
        </div>
        
        <div className="rounded-lg border border-muted bg-white p-4">
          <h3 className="font-medium mb-2">Your Referrals</h3>
          <div className="text-center py-6 text-muted-foreground">
            <p>You haven't referred anyone yet</p>
            <p className="text-sm mt-1">Share your code to start earning rewards!</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReferPage;
