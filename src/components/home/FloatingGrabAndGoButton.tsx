
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

const FloatingGrabAndGoButton = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [itemCount, setItemCount] = useState(0);

  // Fetch count of unchecked items in Grab & Go
  useEffect(() => {
    const fetchGrabAndGoCount = async () => {
      try {
        const { count, error } = await supabase
          .from('shopping_list')
          .select('*', { count: 'exact', head: true })
          .eq('ischecked', false);
        
        if (error) throw error;
        setItemCount(count || 0);
      } catch (error) {
        console.error('Error fetching Grab & Go count:', error);
        setItemCount(0);
      }
    };

    fetchGrabAndGoCount();

    // Set up real-time subscription for changes
    const subscription = supabase
      .channel('grab-and-go-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shopping_list'
        },
        () => {
          fetchGrabAndGoCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: "spring" }}
      className="relative"
    >
      <Button
        onClick={() => navigate('/grab-and-go')}
        className={`fixed ${isMobile ? 'bottom-20 right-4 w-12 h-12' : 'bottom-16 right-6 w-14 h-14'} rounded-full bg-kitchen-green shadow-lg hover:bg-kitchen-green/90 hover:scale-105 hover:shadow-xl transition-all duration-300 z-50`}
        size="icon"
        aria-label="Enter Grab & Go mode"
      >
        <ShoppingBag className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
      </Button>
      
      {/* Notification badge */}
      {itemCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`absolute ${isMobile ? '-top-1 -right-1' : '-top-2 -right-2'} bg-kitchen-berry text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-lg`}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </motion.div>
      )}
    </motion.div>
  );
};

export default FloatingGrabAndGoButton;
