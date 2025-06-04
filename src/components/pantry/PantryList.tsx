
import React, { useState, useEffect } from 'react';
import PantryItem from './PantryItem';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Utensils, Snowflake, Archive, Clock, Plus, MoreHorizontal, Grid, List as ListIcon } from 'lucide-react';
import { CustomListType, PantryItemData } from '@/types/pantry';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ViewMode } from '@/components/ui/list-layout';

interface PantryListProps {
  items: PantryItemData[];
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  customLists?: CustomListType[];
  onAddToList?: (itemId: string, listId: string) => void;
  selectedItems?: string[];
  onToggleSelectItem?: (itemId: string, isSelected: boolean) => void;
  isLoading?: boolean;
  viewMode?: ViewMode;
  onUpdate?: (id: string, updates: Partial<PantryItemData>) => void;
}

const PantryList: React.FC<PantryListProps> = ({ 
  items, 
  onIncrement, 
  onDecrement, 
  onDelete,
  onAddNew,
  customLists = [],
  onAddToList,
  selectedItems = [],
  onToggleSelectItem,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const isMobile = useIsMobile();
  
  // Count items in each category
  const countByCategory = {
    all: items.length,
    fridge: items.filter(item => item.category === "fridge").length,
    freezer: items.filter(item => item.category === "freezer").length,
    pantry: items.filter(item => item.category === "pantry").length,
    expiring: items.filter(item => {
      if (!item.expiryDate) return false;
      const today = new Date();
      const expiry = new Date(item.expiryDate);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length,
  };
  
  // Filter items based on active tab
  const getFilteredItems = () => {
    switch (activeTab) {
      case "fridge":
        return items.filter(item => item.category === "fridge");
      case "freezer":
        return items.filter(item => item.category === "freezer");
      case "pantry":
        return items.filter(item => item.category === "pantry");
      case "expiring":
        return items.filter(item => {
          if (!item.expiryDate) return false;
          const today = new Date();
          const expiry = new Date(item.expiryDate);
          const diffTime = expiry.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7;
        }).sort((a, b) => {
          const dateA = a.expiryDate ? new Date(a.expiryDate).getTime() : Infinity;
          const dateB = b.expiryDate ? new Date(b.expiryDate).getTime() : Infinity;
          return dateA - dateB;
        });
      default:
        return items;
    }
  };
  
  const filteredItems = getFilteredItems();
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "all":
        return <Utensils className="h-4 w-4" />;
      case "fridge":
        return <Snowflake className="h-4 w-4" />;
      case "freezer":
        return <Snowflake className="h-4 w-4" />;
      case "pantry":
        return <Archive className="h-4 w-4" />;
      case "expiring":
        return <Clock className="h-4 w-4" />;
      default:
        return <Utensils className="h-4 w-4" />;
    }
  };

  // Auto-switch to list view on mobile if there are many items
  useEffect(() => {
    if (isMobile && items.length > 6) {
      setViewMode('list');
    }
  }, [isMobile, items.length]);

  if (isLoading) {
    return (
      <div className="pb-20">
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 pb-2 rounded-lg shadow-sm mb-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-2 px-2 md:px-4 pt-4">
            <h2 className="text-xl font-bold">My Pantry</h2>
            <div className="flex items-center gap-2 justify-between w-full md:w-auto md:justify-end">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button variant="ghost" size="icon" className="rounded-md transition-all bg-white shadow-sm">
                  <Grid size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-md transition-all hover:bg-white/60">
                  <ListIcon size={16} />
                </Button>
              </div>
              <Button size="sm" className="bg-kitchen-green hover:bg-kitchen-green/90 whitespace-nowrap">
                <Plus size={16} className="mr-1" /> Add Item
              </Button>
            </div>
          </div>
          
          <div className="w-full overflow-x-auto hide-scrollbar">
            <Tabs defaultValue="all" className="px-2 md:px-4">
              <TabsList className="w-full flex p-1 h-auto overflow-visible">
                <TabsTrigger value="all" className="flex items-center justify-center gap-1 flex-shrink-0">
                  {getCategoryIcon("all")}
                  All
                  <Badge variant="outline" className="ml-1 bg-kitchen-cream">
                    0
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="fridge" className="flex items-center justify-center gap-1 flex-shrink-0">
                  {getCategoryIcon("fridge")}
                  Fridge
                  <Badge variant="outline" className="ml-1 bg-kitchen-cream">
                    {countByCategory.fridge}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="freezer" className="flex items-center justify-center gap-1 flex-shrink-0">
                  {getCategoryIcon("freezer")}
                  Freezer
                  <Badge variant="outline" className="ml-1 bg-kitchen-cream">
                    {countByCategory.freezer}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="pantry" className="flex items-center justify-center gap-1 flex-shrink-0">
                  {getCategoryIcon("pantry")}
                  Pantry
                  <Badge variant="outline" className="ml-1 bg-kitchen-cream">
                    {countByCategory.pantry}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="expiring" className="flex items-center justify-center gap-1 flex-shrink-0 text-kitchen-berry">
                  {getCategoryIcon("expiring")}
                  Use Soon
                  <Badge variant="outline" className="ml-1 bg-kitchen-berry/10 text-kitchen-berry">
                    {countByCategory.expiring}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white rounded-lg shadow border border-muted overflow-hidden">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-2">
                      <div className="h-7 w-7 rounded-full bg-gray-200"></div>
                      <div className="h-7 w-10 bg-gray-200 rounded"></div>
                      <div className="h-7 w-7 rounded-full bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 pb-2 rounded-lg shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-2 px-2 md:px-4 pt-4">
          <h2 className="text-xl font-bold">My Pantry</h2>
          <div className="flex items-center gap-2 justify-between w-full md:w-auto md:justify-end">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('grid')}
                className={`rounded-md transition-all ${viewMode === 'grid' ? "bg-white shadow-sm" : "hover:bg-white/60"}`}
                aria-label="Grid view"
              >
                <Grid size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('list')}
                className={`rounded-md transition-all ${viewMode === 'list' ? "bg-white shadow-sm" : "hover:bg-white/60"}`}
                aria-label="List view"
              >
                <ListIcon size={16} />
              </Button>
            </div>
            <Button 
              onClick={onAddNew} 
              className="bg-kitchen-green hover:bg-kitchen-green/90 whitespace-nowrap"
              size="sm"
            >
              <Plus size={16} className="mr-1" /> Add Item
            </Button>
          </div>
        </div>
      
        <div className="w-full overflow-x-auto hide-scrollbar">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="px-2 md:px-4">
            <TabsList className="w-full flex p-1 h-auto overflow-visible">
              <TabsTrigger value="all" className="flex items-center justify-center gap-1 flex-shrink-0">
                {getCategoryIcon("all")}
                All
                <Badge variant="outline" className="ml-1 bg-kitchen-cream">
                  {countByCategory.all}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="fridge" className="flex items-center justify-center gap-1 flex-shrink-0">
                {getCategoryIcon("fridge")}
                Fridge
                <Badge variant="outline" className="ml-1 bg-kitchen-cream">
                  {countByCategory.fridge}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="freezer" className="flex items-center justify-center gap-1 flex-shrink-0">
                {getCategoryIcon("freezer")}
                Freezer
                <Badge variant="outline" className="ml-1 bg-kitchen-cream">
                  {countByCategory.freezer}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="pantry" className="flex items-center justify-center gap-1 flex-shrink-0">
                {getCategoryIcon("pantry")}
                Pantry
                <Badge variant="outline" className="ml-1 bg-kitchen-cream">
                  {countByCategory.pantry}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="expiring" className="flex items-center justify-center gap-1 flex-shrink-0 text-kitchen-berry">
                {getCategoryIcon("expiring")}
                Use Soon
                <Badge variant="outline" className="ml-1 bg-kitchen-berry/10 text-kitchen-berry">
                  {countByCategory.expiring}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab + viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4' : 'space-y-3'}`}
        >
          {filteredItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="col-span-full p-4 md:p-8 text-center text-gray-500 bg-white rounded-lg border border-muted"
            >
              <p className="mb-4">No items found in this category.</p>
              <Button 
                onClick={onAddNew} 
                variant="outline"
                className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green hover:text-white"
              >
                <Plus size={18} className="mr-1" /> Add Your First Item
              </Button>
            </motion.div>
          ) : (
            filteredItems.map((item, index) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={viewMode === 'grid' ? '' : 'w-full'}
                whileHover={{ scale: 1.01 }}
              >
                <PantryItem
                  item={item}
                  onIncrement={onIncrement}
                  onDecrement={onDecrement}
                  onDelete={onDelete}
                  viewMode={viewMode}
                  customLists={customLists}
                  onAddToList={onAddToList}
                  isSelected={selectedItems.includes(item.id)}
                  onToggleSelect={onToggleSelectItem}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PantryList;
