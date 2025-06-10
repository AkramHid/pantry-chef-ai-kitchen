
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingItemData } from '@/components/shopping/ShoppingItem';
import { useIsMobile } from '@/hooks/use-mobile';
import { useShoppingList } from '@/hooks/use-shopping-list';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package } from 'lucide-react';

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
  const { shoppingItems } = useShoppingList();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Group items by category
  const groupedItems = shoppingItems.reduce((acc, item) => {
    const category = item.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItemData[]>);

  const toggleSelectAll = () => {
    if (selectedItems.length === shoppingItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(shoppingItems.map(item => item.id));
    }
  };

  const toggleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleImport = () => {
    const itemsToImport = shoppingItems.filter(item => selectedItems.includes(item.id));
    onImportList(itemsToImport);
    setSelectedItems([]);
    onOpenChange(false);
  };

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
      <DialogContent className={isMobile ? "max-w-[95%] max-h-[80vh] p-4" : "max-w-2xl max-h-[80vh]"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package size={20} />
            Import from Shopping List
          </DialogTitle>
          <DialogDescription>
            Select items from your shopping list to import into Grab & Go mode for quick organization.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {shoppingItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No items in your shopping list.</p>
              <p className="text-sm">Add items to your shopping list first.</p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-600">
                  {selectedItems.length} of {shoppingItems.length} items selected
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleSelectAll}
                >
                  {selectedItems.length === shoppingItems.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>

              {Object.entries(groupedItems).map(([category, items]) => (
                <motion.div key={category} variants={itemVariants} className="space-y-2">
                  <h4 className="font-medium text-kitchen-dark flex items-center gap-2">
                    {category}
                    <Badge variant="secondary" className="text-xs">
                      {items.length}
                    </Badge>
                  </h4>
                  <div className="space-y-1">
                    {items.map(item => (
                      <motion.button
                        key={item.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-3 rounded-lg border transition-colors text-left ${
                          selectedItems.includes(item.id)
                            ? 'bg-kitchen-green/10 border-kitchen-green'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => toggleSelectItem(item.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className={`font-medium ${item.isChecked ? 'line-through text-gray-500' : ''}`}>
                              {item.quantity} {item.unit} {item.name}
                            </span>
                            {item.note && (
                              <p className="text-xs text-gray-500 mt-1">{item.note}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {item.isChecked && (
                              <Badge variant="outline" className="text-xs">
                                Completed
                              </Badge>
                            )}
                            <div className={`w-4 h-4 rounded border-2 ${
                              selectedItems.includes(item.id)
                                ? 'bg-kitchen-green border-kitchen-green'
                                : 'border-gray-300'
                            }`}>
                              {selectedItems.includes(item.id) && (
                                <div className="w-2 h-2 bg-white rounded-sm m-0.5" />
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <DialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className={isMobile ? "w-full" : ""}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleImport}
            disabled={selectedItems.length === 0}
            className={`${isMobile ? "w-full" : ""} bg-kitchen-green hover:bg-kitchen-green/90`}
          >
            Import {selectedItems.length} Item{selectedItems.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GrabAndGoImportDialog;
