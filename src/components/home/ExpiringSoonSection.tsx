
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface ExpiringSoonItem {
  id: string;
  name: string;
  daysLeft: number;
  image?: string;
}

interface ExpiringSoonSectionProps {
  items: ExpiringSoonItem[];
}

const ExpiringSoonSection: React.FC<ExpiringSoonSectionProps> = ({ items }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAddToGrabAndGo = async (item: ExpiringSoonItem) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('shopping_list')
        .insert({
          name: item.name,
          quantity: 1,
          unit: 'pc',
          category: 'General',
          ischecked: false,
          note: `Expiring in ${item.daysLeft} day${item.daysLeft !== 1 ? 's' : ''}`,
          user_id: user.id
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: "Added to Grab & Go",
        description: `${item.name} has been added to your Grab & Go list`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding item to Grab & Go:', error);
      toast({
        title: 'Failed to add item',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const getDaysLeftColor = (daysLeft: number) => {
    if (daysLeft <= 1) return 'bg-red-500';
    if (daysLeft <= 3) return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  const getDaysLeftText = (daysLeft: number) => {
    if (daysLeft <= 0) return 'Expired';
    if (daysLeft === 1) return '1 day';
    return `${daysLeft} days`;
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/90 shadow-lg backdrop-blur-sm border-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg font-semibold text-kitchen-dark">
            <Calendar className="mr-2 h-5 w-5 text-orange-500" />
            Expiring Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.slice(0, 3).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <Badge 
                      variant="secondary" 
                      className={`${getDaysLeftColor(item.daysLeft)} text-white text-xs`}
                    >
                      {getDaysLeftText(item.daysLeft)}
                    </Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddToGrabAndGo(item)}
                  className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green hover:text-white"
                >
                  <Plus size={14} className="mr-1" />
                  Add to Grab & Go
                </Button>
              </motion.div>
            ))}
          </div>
          
          {items.length > 3 && (
            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/pantry')}
                className="text-kitchen-green hover:bg-kitchen-green/10"
              >
                View all {items.length} expiring items
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExpiringSoonSection;
