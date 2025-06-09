
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { PantryItemData, CustomListType } from '@/types/pantry';
import EnhancedPantryList from './EnhancedPantryList';
import CustomLists from './CustomLists';

interface PantryPageContentProps {
  items: PantryItemData[];
  lists: CustomListType[];
  selectedItems: string[];
  isLoading: boolean;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<PantryItemData>) => void;
  onAddNew: () => void;
  onAddToList: (itemId: string, listId: string) => void;
  onToggleSelectItem: (itemId: string) => void;
  onCreateList: (name: string) => void;
  onDeleteList: (listId: string) => void;
  onRenameList: (listId: string, newName: string) => void;
  onRemoveFromList: (listId: string, itemId: string) => void;
  onSendMissingToShopping: (listId: string) => void;
}

const PantryPageContent: React.FC<PantryPageContentProps> = ({
  items,
  lists,
  selectedItems,
  isLoading,
  onIncrement,
  onDecrement,
  onDelete,
  onUpdate,
  onAddNew,
  onAddToList,
  onToggleSelectItem,
  onCreateList,
  onDeleteList,
  onRenameList,
  onRemoveFromList,
  onSendMissingToShopping
}) => {
  const isMobile = useIsMobile();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Enhanced Grid Layout */}
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-4'}`}>
        {/* Custom Lists - Sidebar on desktop, top on mobile */}
        <div className={`${isMobile ? 'order-1' : 'xl:col-span-1 order-1'}`}>
          <CustomLists
            lists={lists}
            pantryItems={items}
            onCreateList={onCreateList}
            onDeleteList={onDeleteList}
            onRenameList={onRenameList}
            onRemoveFromList={onRemoveFromList}
            onSendMissingToShopping={onSendMissingToShopping}
          />
        </div>

        {/* Main Pantry Items - Full width on mobile, main area on desktop */}
        <div className={`${isMobile ? 'order-2' : 'xl:col-span-3 order-2'}`}>
          <EnhancedPantryList
            items={items}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onDelete={onDelete}
            onAddNew={onAddNew}
            customLists={lists}
            onAddToList={onAddToList}
            selectedItems={selectedItems}
            onToggleSelectItem={onToggleSelectItem}
            isLoading={isLoading}
            onUpdate={onUpdate}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PantryPageContent;
