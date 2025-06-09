import React, { useState, useEffect, useMemo } from 'react';
import EnhancedPantryItem from './EnhancedPantryItem';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Utensils, Snowflake, Archive, Clock, Plus, Grid, List as ListIcon, Search, Filter, SortAsc } from 'lucide-react';
import { CustomListType, PantryItemData } from '@/types/pantry';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewMode } from '@/components/ui/list-layout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnhancedPantryListProps {
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
  onUpdate?: (id: string, updates: Partial<PantryItemData>) => void;
}

const EnhancedPantryList: React.FC<EnhancedPantryListProps> = ({ 
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'expiry' | 'category'>('name');
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();
  
  // Count items in each category
  const countByCategory = useMemo(() => ({
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
  }), [items]);
  
  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items;
    
    // Filter by category
    switch (activeTab) {
      case "fridge":
        filtered = items.filter(item => item.category === "fridge");
        break;
      case "freezer":
        filtered = items.filter(item => item.category === "freezer");
        break;
      case "pantry":
        filtered = items.filter(item => item.category === "pantry");
        break;
      case "expiring":
        filtered = items.filter(item => {
          if (!item.expiryDate) return false;
          const today = new Date();
          const expiry = new Date(item.expiryDate);
          const diffTime = expiry.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7;
        });
        break;
      default:
        filtered = items;
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort items
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'quantity':
          return b.quantity - a.quantity;
        case 'expiry':
          if (!a.expiryDate && !b.expiryDate) return 0;
          if (!a.expiryDate) return 1;
          if (!b.expiryDate) return -1;
          return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [items, activeTab, searchTerm, sortBy]);
  
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
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 pb-4 rounded-lg shadow-sm mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2 px-4 pt-4">
            <h2 className="text-xl font-bold text-kitchen-dark">My Pantry</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-md transition-all bg-white shadow-sm"
                  aria-label="Grid view"
                >
                  <Grid size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-md transition-all hover:bg-white/60"
                  aria-label="List view"
                >
                  <ListIcon size={16} />
                </Button>
              </div>
              <Button
                onClick={onAddNew}
                className="bg-kitchen-green hover:bg-kitchen-green/90 text-white"
                size="sm"
              >
                <Plus size={16} className="mr-1" /> Add Item
              </Button>
            </div>
          </div>
          <div className="px-4 mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search items..."
                  className="pl-10 bg-white border-gray-200"
                />
              </div>
              <Button
                variant="outline"
                className="border-gray-200"
              >
                <Filter className="h-4 w-4 mr-1" />
                Filters
              </Button>
            </div>
          </div>
          <div className="w-full overflow-x-auto hide-scrollbar">
            <Tabs defaultValue="all" className="px-4">
              <TabsList className="w-full flex p-1 h-auto overflow-visible bg-gray-100">
                <TabsTrigger value="all" className="flex items-center justify-center gap-2 flex-shrink-0 data-[state=active]:bg-white">
                  {getCategoryIcon("all")}
                  <span className="hidden xs:inline">All</span>
                  <Badge variant="outline" className="bg-kitchen-cream border-kitchen-green/20">
                    0
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="fridge" className="flex items-center justify-center gap-2 flex-shrink-0 data-[state=active]:bg-white">
                  {getCategoryIcon("fridge")}
                  <span className="hidden xs:inline">Fridge</span>
                  <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                    {countByCategory.fridge}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="freezer" className="flex items-center justify-center gap-2 flex-shrink-0 data-[state=active]:bg-white">
                  {getCategoryIcon("freezer")}
                  <span className="hidden xs:inline">Freezer</span>
                  <Badge variant="outline" className="bg-cyan-50 border-cyan-200 text-cyan-700">
                    {countByCategory.freezer}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="pantry" className="flex items-center justify-center gap-2 flex-shrink-0 data-[state=active]:bg-white">
                  {getCategoryIcon("pantry")}
                  <span className="hidden xs:inline">Pantry</span>
                  <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
                    {countByCategory.pantry}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="expiring" className="flex items-center justify-center gap-2 flex-shrink-0 data-[state=active]:bg-white">
                  {getCategoryIcon("expiring")}
                  <span className="hidden xs:inline">Use Soon</span>
                  <Badge variant="outline" className="bg-kitchen-berry/10 border-kitchen-berry/30 text-kitchen-berry">
                    {countByCategory.expiring}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white rounded-lg shadow border border-muted overflow-hidden">
                <div className="aspect-[4/3] bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
      {/* Enhanced Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 pb-4 rounded-lg shadow-sm mb-6 border border-gray-100">
        {/* Title and View Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 px-4 pt-4">
          <h2 className="text-xl font-bold text-kitchen-dark">My Pantry</h2>
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('grid')}
                className={`h-8 w-8 rounded-md transition-all ${viewMode === 'grid' ? "bg-white shadow-sm" : "hover:bg-white/60"}`}
                aria-label="Grid view"
              >
                <Grid size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('list')}
                className={`h-8 w-8 rounded-md transition-all ${viewMode === 'list' ? "bg-white shadow-sm" : "hover:bg-white/60"}`}
                aria-label="List view"
              >
                <ListIcon size={16} />
              </Button>
            </div>
            
            <Button 
              onClick={onAddNew} 
              className="bg-kitchen-green hover:bg-kitchen-green/90 text-white"
              size="sm"
            >
              <Plus size={16} className="mr-1" /> Add Item
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-4 mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200"
              />
            </div>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-32 bg-white">
                <SortAsc className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="quantity">Quantity</SelectItem>
                <SelectItem value="expiry">Expiry</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className="w-full overflow-x-auto hide-scrollbar">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
            <TabsList className="w-full flex p-1 h-auto overflow-visible bg-gray-100">
              <TabsTrigger value="all" className="flex items-center justify-center gap-2 flex-shrink-0 data-[state=active]:bg-white">
                {getCategoryIcon("all")}
                <span className="hidden xs:inline">All</span>
                <Badge variant="outline" className="bg-kitchen-cream border-kitchen-green/20">
                  {countByCategory.all}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="fridge" className="flex items-center justify-center gap-2 flex-shrink-0 data-[state=active]:bg-white">
                {getCategoryIcon("fridge")}
                <span className="hidden xs:inline">Fridge</span>
                <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                  {countByCategory.fridge}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="freezer" className="flex items-center justify-center gap-2 flex-shrink-0 data-[state=active]:bg-white">
                {getCategoryIcon("freezer")}
                <span className="hidden xs:inline">Freezer</span>
                <Badge variant="outline" className="bg-cyan-50 border-cyan-200 text-cyan-700">
                  {countByCategory.freezer}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="pantry" className="flex items-center justify-center gap-2 flex-shrink-0 data-[state=active]:bg-white">
                {getCategoryIcon("pantry")}
                <span className="hidden xs:inline">Pantry</span>
                <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
                  {countByCategory.pantry}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="expiring" className="flex items-center justify-center gap-2 flex-shrink-0 data-[state=active]:bg-white">
                {getCategoryIcon("expiring")}
                <span className="hidden xs:inline">Use Soon</span>
                <Badge variant="outline" className="bg-kitchen-berry/10 border-kitchen-berry/30 text-kitchen-berry">
                  {countByCategory.expiring}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Items Grid/List */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab + viewMode + searchTerm + sortBy}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={`px-4 ${viewMode === 'grid' 
            ? 'grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
            : 'space-y-3'
          }`}
        >
          {filteredAndSortedItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="col-span-full p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-100"
            >
              {searchTerm ? (
                <>
                  <p className="mb-4">No items found matching "{searchTerm}"</p>
                  <Button 
                    onClick={() => setSearchTerm('')} 
                    variant="outline"
                    className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green hover:text-white"
                  >
                    Clear Search
                  </Button>
                </>
              ) : (
                <>
                  <p className="mb-4">No items found in this category.</p>
                  <Button 
                    onClick={onAddNew} 
                    variant="outline"
                    className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green hover:text-white"
                  >
                    <Plus size={18} className="mr-1" /> Add Your First Item
                  </Button>
                </>
              )}
            </motion.div>
          ) : (
            filteredAndSortedItems.map((item, index) => (
              <EnhancedPantryItem
                key={item.id}
                item={item}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
                onDelete={onDelete}
                viewMode={viewMode}
                customLists={customLists}
                onAddToList={onAddToList}
                isSelected={selectedItems.includes(item.id)}
                onToggleSelect={onToggleSelectItem}
                index={index}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EnhancedPantryList;
