
import React from 'react';
import { Calendar, Minus, Plus, Trash2, MoreHorizontal, Snowflake, Archive, MoveVertical, Check } from 'lucide-react';
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

export interface PantryItemData {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate?: string;
  addedDate: string;
  image?: string;
}

interface PantryItemProps {
  item: PantryItemData;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onDelete: (id: string) => void;
  viewMode?: 'grid' | 'list';
  customLists?: CustomListType[];
  onAddToList?: (itemId: string, listId: string) => void;
  isSelected?: boolean;
  onToggleSelect?: (itemId: string, isSelected: boolean) => void;
}

const PantryItem: React.FC<PantryItemProps> = ({ 
  item, 
  onIncrement, 
  onDecrement, 
  onDelete,
  viewMode = 'grid',
  customLists = [],
  onAddToList,
  isSelected = false,
  onToggleSelect
}) => {
  // Calculate days until expiry
  const getDaysUntilExpiry = () => {
    if (!item.expiryDate) return null;
    
    const today = new Date();
    const expiry = new Date(item.expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const daysUntilExpiry = getDaysUntilExpiry();
  
  // Determine expiry status styling
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

  // Get a placeholder image based on category - fixing potential URI issues
  const getPlaceholderImage = () => {
    // Using direct string literals instead of potentially problematic URLs
    const categoryImages = {
      fridge: '/lovable-uploads/fridge-placeholder.jpg',
      freezer: '/lovable-uploads/freezer-placeholder.jpg',
      pantry: '/lovable-uploads/pantry-placeholder.jpg',
    };
    
    // If item has an image, ensure it's properly encoded if needed
    if (item.image) {
      try {
        // Check if the URL is valid
        new URL(item.image);
        return item.image;
      } catch (e) {
        // If URL is invalid, return a fallback
        console.warn("Invalid image URL detected:", item.image);
        return categoryImages[item.category as keyof typeof categoryImages] || '/lovable-uploads/default-placeholder.jpg';
      }
    }
    
    return categoryImages[item.category as keyof typeof categoryImages] || '/lovable-uploads/default-placeholder.jpg';
  };

  const getCategoryIcon = () => {
    switch (item.category) {
      case "fridge":
        return <Snowflake size={16} className="mr-1" />;
      case "freezer":
        return <Snowflake size={16} className="mr-1" />;
      case "pantry":
        return <Archive size={16} className="mr-1" />;
      default:
        return null;
    }
  };

  const getCategoryColor = () => {
    const colors = {
      fridge: 'bg-blue-100 text-blue-800',
      freezer: 'bg-cyan-100 text-cyan-800',
      pantry: 'bg-orange-100 text-orange-800',
    };
    
    return colors[item.category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (onToggleSelect) {
      onToggleSelect(item.id, checked);
    }
  };
  
  if (viewMode === 'grid') {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 h-full">
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <img 
            src={getPlaceholderImage()} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
          />
          <div className="absolute top-2 right-2 flex gap-2">
            {onToggleSelect && (
              <div className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white flex items-center justify-center">
                <Checkbox 
                  checked={isSelected}
                  onCheckedChange={handleCheckboxChange}
                  aria-label={`Select ${item.name}`}
                  className="data-[state=checked]:bg-kitchen-green data-[state=checked]:text-white"
                />
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white">
                  <MoreHorizontal size={15} />
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
                      >
                        <MoveVertical className="mr-2 h-4 w-4" />
                        {list.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-kitchen-berry focus:text-kitchen-berry">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Item
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {expiryStatus && (
            <Badge className={`absolute bottom-2 left-2 ${expiryStatus.color}`}>
              {expiryStatus.indicator} {expiryStatus.text}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-kitchen-dark text-lg">{item.name}</h3>
            <Badge variant="outline" className={`${getCategoryColor()} flex items-center`}>
              {getCategoryIcon()}
              {item.category}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => onDecrement(item.id)}
                size="icon" 
                variant="outline"
                className="h-7 w-7 rounded-full"
                aria-label="Decrease quantity"
                disabled={item.quantity <= 1}
              >
                <Minus size={14} />
              </Button>
              
              <span className="font-medium">
                {item.quantity} {item.unit}
              </span>
              
              <Button
                onClick={() => onIncrement(item.id)}
                size="icon"
                variant="outline"
                className="h-7 w-7 rounded-full"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // List view
  return (
    <div className="flex items-center justify-between p-4 border border-muted rounded-lg bg-white hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-center flex-1">
        {onToggleSelect && (
          <div className="mr-3">
            <Checkbox 
              checked={isSelected}
              onCheckedChange={handleCheckboxChange}
              aria-label={`Select ${item.name}`}
              className="data-[state=checked]:bg-kitchen-green data-[state=checked]:text-white"
            />
          </div>
        )}
        <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 mr-4 flex-shrink-0">
          <img 
            src={getPlaceholderImage()} 
            alt={item.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-kitchen-dark">{item.name}</h3>
            <Badge variant="outline" className={getCategoryColor()}>
              {getCategoryIcon()}
              {item.category}
            </Badge>
          </div>
          
          {expiryStatus && (
            <span className={`text-xs font-medium inline-flex items-center mt-1 px-2 py-0.5 rounded-full ${expiryStatus.color}`}>
              <Calendar size={12} className="mr-1" />
              {expiryStatus.text}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => onDecrement(item.id)}
          size="icon"
          variant="outline"
          className="h-8 w-8 rounded-full"
          aria-label="Decrease quantity"
          disabled={item.quantity <= 1}
        >
          <Minus size={14} />
        </Button>
        
        <span className="w-12 text-center font-medium">
          {item.quantity} {item.unit}
        </span>
        
        <Button
          onClick={() => onIncrement(item.id)}
          size="icon"
          variant="outline"
          className="h-8 w-8 rounded-full"
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
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
                  >
                    <MoveVertical className="mr-2 h-4 w-4" />
                    {list.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-kitchen-berry focus:text-kitchen-berry">
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default PantryItem;
