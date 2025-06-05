
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus } from 'lucide-react';

interface PantryPageHeaderProps {
  selectedItems: string[];
  onAddNew: () => void;
  onSendToShopping: () => void;
}

const PantryPageHeader: React.FC<PantryPageHeaderProps> = ({
  selectedItems,
  onAddNew,
  onSendToShopping
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={onAddNew}
          className="bg-kitchen-green hover:bg-kitchen-green/90"
        >
          <Plus size={18} className="mr-2" />
          Add Item
        </Button>
        
        {selectedItems.length > 0 && (
          <Button 
            onClick={onSendToShopping}
            variant="outline"
            className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green/10"
          >
            <ShoppingCart size={18} className="mr-2" />
            Send to Shopping ({selectedItems.length})
          </Button>
        )}
      </div>
    </div>
  );
};

export default PantryPageHeader;
