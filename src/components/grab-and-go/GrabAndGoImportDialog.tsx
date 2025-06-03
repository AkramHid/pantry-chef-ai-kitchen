
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingItemData } from '@/components/shopping/ShoppingItem';
import { useIsMobile } from '@/hooks/use-mobile';
import { mockShoppingLists, mockShoppingItems } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface GrabAndGoImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportList: (items: ShoppingItemData[]) => void;
}

const GrabAndGoImportDialog: React.FC<GrabAndGoImportDialogProps> = ({
  open,
  onOpenChange,
  onImportList
}) => {
  const isMobile = useIsMobile();

  // Map itemIds to ShoppingItemData from mockShoppingItems
  const shoppingLists = mockShoppingLists.map(list => ({
    id: list.id,
    name: list.name,
    items: list.items
      .map(itemId => mockShoppingItems.find(i => i.id === itemId))
      .filter(Boolean) as ShoppingItemData[]
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={isMobile ? "max-w-[90%] p-4" : "max-w-sm"}>
        <DialogHeader>
          <DialogTitle>Quick Import to Grab &amp; Go</DialogTitle>
          <DialogDescription>
            Choose from your existing lists to quickly import items organized by store layout.
          </DialogDescription>
        </DialogHeader>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-3 py-2"
        >
          {shoppingLists.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No lists available to import from.
            </div>
          ) : (
            shoppingLists.map(list => (
              <motion.button
                key={list.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex justify-between items-center w-full p-3 rounded-lg bg-gray-100 hover:bg-kitchen-green/10 border border-gray-200 transition-colors mb-1 active:bg-kitchen-green/20"
                onClick={() => onImportList(list.items)}
                type="button"
              >
                <div className="text-left">
                  <span className="font-semibold text-kitchen-dark block">{list.name}</span>
                  <span className="text-xs text-gray-500">
                    Will be organized by grocery store layout
                  </span>
                </div>
                <span className="text-gray-500 text-xs">{list.items.length} item{list.items.length !== 1 ? 's' : ''}</span>
              </motion.button>
            ))
          )}
        </motion.div>
        <DialogFooter className={isMobile ? "flex-col" : ""}>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className={isMobile ? "w-full mt-2" : ""}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GrabAndGoImportDialog;
