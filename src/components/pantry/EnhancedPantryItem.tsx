
import React from 'react';
import { Calendar, Minus, Plus, Trash2, MoreHorizontal, Snowflake, Archive, MoveVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CustomListType, PantryItemData } from '@/types/pantry';
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from 'framer-motion';
import EnhancedImageDisplay from './EnhancedImageDisplay';
import { cn } from '@/lib/utils';

interface EnhancedPantryItemProps {
  item: PantryItemData;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onDelete: (id: string) => void;
  viewMode?: 'grid' | 'list';
  customLists?: CustomListType[];
  onAddToList?: (itemId: string, listId: string) => void;
  isSelected?: boolean;
  onToggleSelect?: (itemId: string, isSelected: boolean) => void;
  index?: number;
}

const EnhancedPantryItem: React.FC<EnhancedPantryItemProps> = ({ 
  item, 
  onIncrement, 
  onDecrement, 
  onDelete,
  viewMode = 'grid',
  customLists = [],
  onAddToList,
  isSelected = false,
  onToggleSelect,
  index = 0
}) => {
  const getDaysUntilExpiry = () => {
    if (!item.expiryDate) return null;
    
    const today = new Date();
    const expiry = new Date(item.expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const daysUntilExpiry = getDaysUntilExpiry();
  
  const getExpiryStatus = () => {
    if (daysUntilExpiry === null) return null;
    
    if (daysUntilExpiry <= 0) {
      return { color: 'bg-kitchen-berry text-white', text: 'Expired', indicator: '🔴' };
    } else if (daysUntilExpiry <= 3) {
      return { color: 'bg-kitchen-berry text-white', text: `${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''} left`, indicator: '🔴' };
    } else if (daysUntilExpiry <= 7) {
      return { color: 'bg-kitchen-yellow text-kitchen-dark', text: `${daysUntilExpiry} days left`, indicator: '🟠' };
    }
    
    return { color: 'bg-green-500 text-white', text: `Expires: ${new Date(item.expiryDate).toLocaleDateString()}`, indicator: '🟢' };
  };
  
  const expiryStatus = getExpiryStatus();

  const getCategoryIcon = () => {
    switch (item.category) {
      case "fridge":
      case "freezer":
        return <Snowflake size={14} className="mr-1" />;
      case "pantry":
        return <Archive size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  const getCategoryColor = () => {
    const colors = {
      fridge: 'bg-blue-100 text-blue-800 border-blue-200',
      freezer: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      pantry: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    
    return colors[item.category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (onToggleSelect) {
      onToggleSelect(item.id, checked);
    }
  };

  const QuantityControls = () => (
    <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full p-1 border border-white/20">
      <Button
        onClick={() => onDecrement(item.id)}
        size="icon" 
        variant="ghost"
        className="h-7 w-7 rounded-full hover:bg-kitchen-berry hover:text-white transition-all"
        aria-label="Decrease quantity"
        disabled={item.quantity <= 1}
      >
        <Minus size={12} />
      </Button>
      
      <span className="font-medium text-sm min-w-[3rem] text-center px-2">
        {item.quantity} {item.unit}
      </span>
      
      <Button
        onClick={() => onIncrement(item.id)}
        size="icon"
        variant="ghost"
        className="h-7 w-7 rounded-full hover:bg-kitchen-green hover:text-white transition-all"
        aria-label="Increase quantity"
      >
        <Plus size={12} />
      </Button>
    </div>
  );
  
  if (viewMode === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -2 }}
        className="h-full"
      >
        <Card className={cn(
          "overflow-hidden hover:shadow-lg transition-all duration-300 h-full bg-white",
          isSelected && "ring-2 ring-kitchen-green shadow-lg"
        )}>
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
            <EnhancedImageDisplay
              src={item.image}
              alt={item.name}
              category={item.category}
              className="w-full h-full"
              fallbackClassName="w-full h-full"
            />
            
            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300 group">
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onToggleSelect && (
                  <div className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center">
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={handleCheckboxChange}
                      aria-label={`Select ${item.name}`}
                      className="data-[state=checked]:bg-kitchen-green data-[state=checked]:border-kitchen-green h-4 w-4"
                    />
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white border-white/20">
                      <MoreHorizontal size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-sm">
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {customLists.length > 0 && onAddToList && (
                      <>
                        <DropdownMenuLabel className="text-xs text-muted-foreground">Add to List</DropdownMenuLabel>
                        {customLists.map(list => (
                          <DropdownMenuItem 
                            key={list.id}
                            onClick={() => onAddToList(item.id, list.id)}
                            className="cursor-pointer"
                          >
                            <MoveVertical className="mr-2 h-4 w-4" />
                            {list.name}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem 
                      onClick={() => onDelete(item.id)} 
                      className="text-kitchen-berry focus:text-kitchen-berry cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Item
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Quantity Controls - Bottom Center */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all">
                <QuantityControls />
              </div>
            </div>

            {/* Expiry Badge */}
            {expiryStatus && (
              <Badge className={`absolute top-2 left-2 ${expiryStatus.color} text-xs`}>
                {expiryStatus.indicator} {expiryStatus.text}
              </Badge>
            )}
          </div>

          <CardContent className="p-3">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-kitchen-dark text-sm line-clamp-2 flex-1">{item.name}</h3>
              <Badge variant="outline" className={`${getCategoryColor()} flex items-center text-xs ml-2 flex-shrink-0`}>
                {getCategoryIcon()}
                {item.category}
              </Badge>
            </div>
            
            <div className="flex items-center justify-center text-sm font-medium text-muted-foreground">
              {item.quantity} {item.unit}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  // Enhanced List view
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      className={cn(
        "flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-md transition-all duration-200",
        isSelected && "ring-2 ring-kitchen-green bg-kitchen-green/5"
      )}
    >
      <div className="flex items-center flex-1 min-w-0">
        {onToggleSelect && (
          <div className="mr-3 flex-shrink-0">
            <Checkbox 
              checked={isSelected}
              onCheckedChange={handleCheckboxChange}
              aria-label={`Select ${item.name}`}
              className="data-[state=checked]:bg-kitchen-green data-[state=checked]:border-kitchen-green"
            />
          </div>
        )}
        
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 mr-3 flex-shrink-0">
          <EnhancedImageDisplay
            src={item.image}
            alt={item.name}
            category={item.category}
            className="w-full h-full"
            fallbackClassName="w-full h-full"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-kitchen-dark text-sm truncate">{item.name}</h3>
            <Badge variant="outline" className={`${getCategoryColor()} flex items-center text-xs flex-shrink-0`}>
              {getCategoryIcon()}
              {item.category}
            </Badge>
          </div>
          
          {expiryStatus && (
            <div className={`text-xs font-medium inline-flex items-center px-2 py-0.5 rounded-full ${expiryStatus.color} mb-1`}>
              <Calendar size={10} className="mr-1" />
              {expiryStatus.text}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            {item.quantity} {item.unit}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-shrink-0">
        <QuantityControls />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {customLists.length > 0 && onAddToList && (
              <>
                <DropdownMenuLabel className="text-xs text-muted-foreground">Add to List</DropdownMenuLabel>
                {customLists.map(list => (
                  <DropdownMenuItem 
                    key={list.id}
                    onClick={() => onAddToList(item.id, list.id)}
                    className="cursor-pointer"
                  >
                    <MoveVertical className="mr-2 h-4 w-4" />
                    {list.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem 
              onClick={() => onDelete(item.id)} 
              className="text-kitchen-berry focus:text-kitchen-berry cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

export default EnhancedPantryItem;
