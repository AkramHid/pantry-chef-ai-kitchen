
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Minus, 
  Trash2, 
  Edit3, 
  Calendar as CalendarIcon,
  MoreVertical,
  Tag,
  MapPin,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';
import { PantryItemData, CustomListType } from '@/types/pantry';
import { EnhancedImageDisplay } from './EnhancedImageDisplay';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

interface EnhancedPantryItemProps {
  item: PantryItemData;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<PantryItemData>) => void;
  customLists: CustomListType[];
  onAddToList: (itemId: string, listId: string) => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

const EnhancedPantryItem: React.FC<EnhancedPantryItemProps> = ({
  item,
  onIncrement,
  onDecrement,
  onDelete,
  onUpdate,
  customLists,
  onAddToList,
  isSelected,
  onToggleSelect
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(item);
  const isMobile = useIsMobile();

  const isExpiringSoon = item.expiry_date && new Date(item.expiry_date) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const isExpired = item.expiry_date && new Date(item.expiry_date) < new Date();

  const handleSave = () => {
    onUpdate(item.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(item);
    setIsEditing(false);
  };

  const getStatusColor = () => {
    if (isExpired) return 'bg-red-100 border-red-200';
    if (isExpiringSoon) return 'bg-yellow-100 border-yellow-200';
    return 'bg-white border-gray-200';
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`relative ${isMobile ? 'mb-2' : 'mb-3'}`}
      >
        <Card className={`transition-all duration-200 hover:shadow-md ${getStatusColor()} ${isSelected ? 'ring-2 ring-kitchen-green' : ''}`}>
          <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
            {/* Mobile Layout */}
            {isMobile ? (
              <div className="space-y-3">
                {/* Top Row - Checkbox, Image, Name, Actions */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleSelect(item.id)}
                    className="mt-1"
                  />
                  
                  <div className="w-12 h-12 flex-shrink-0">
                    <EnhancedImageDisplay 
                      item={item}
                      size="sm"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-kitchen-dark truncate">{item.name}</h3>
                    {item.brand && (
                      <p className="text-xs text-gray-600 truncate">{item.brand}</p>
                    )}
                    {item.location && (
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin size={10} className="mr-1" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Edit3 size={14} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {customLists.length > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          {customLists.map((list) => (
                            <DropdownMenuItem
                              key={list.id}
                              onClick={() => onAddToList(item.id, list.id)}
                            >
                              <Tag size={14} className="mr-2" />
                              Add to {list.name}
                            </DropdownMenuItem>
                          ))}
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(item.id)}
                        className="text-red-600"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Middle Row - Quantity Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDecrement(item.id)}
                      disabled={item.quantity <= 1}
                      className="h-8 w-8"
                    >
                      <Minus size={14} />
                    </Button>
                    <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onIncrement(item.id)}
                      className="h-8 w-8"
                    >
                      <Plus size={14} />
                    </Button>
                    <span className="text-sm text-gray-600 ml-2">{item.unit}</span>
                  </div>
                  
                  {item.expiry_date && (
                    <div className="flex items-center">
                      {(isExpired || isExpiringSoon) && (
                        <AlertTriangle 
                          size={14} 
                          className={`mr-1 ${isExpired ? 'text-red-500' : 'text-yellow-500'}`} 
                        />
                      )}
                      <span className={`text-xs ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-yellow-600' : 'text-gray-600'}`}>
                        Expires {format(new Date(item.expiry_date), 'MMM dd')}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Bottom Row - Category and Tags */}
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                  
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          +{item.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Desktop Layout */
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggleSelect(item.id)}
                />
                
                <div className="w-16 h-16 flex-shrink-0">
                  <EnhancedImageDisplay 
                    item={item}
                    size="md"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-kitchen-dark">{item.name}</h3>
                      {item.brand && (
                        <p className="text-sm text-gray-600">{item.brand}</p>
                      )}
                      {item.location && (
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin size={14} className="mr-1" />
                          {item.location}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDecrement(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="text-lg font-semibold w-12 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onIncrement(item.id)}
                      >
                        <Plus size={16} />
                      </Button>
                      <span className="text-sm text-gray-600 ml-2">{item.unit}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{item.category}</Badge>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {item.expiry_date && (
                        <div className="flex items-center">
                          {(isExpired || isExpiringSoon) && (
                            <AlertTriangle 
                              size={16} 
                              className={`mr-1 ${isExpired ? 'text-red-500' : 'text-yellow-500'}`} 
                            />
                          )}
                          <span className={`text-sm ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-yellow-600' : 'text-gray-600'}`}>
                            Expires {format(new Date(item.expiry_date), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setIsEditing(true)}>
                            <Edit3 size={14} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {customLists.length > 0 && (
                            <>
                              <DropdownMenuSeparator />
                              {customLists.map((list) => (
                                <DropdownMenuItem
                                  key={list.id}
                                  onClick={() => onAddToList(item.id, list.id)}
                                >
                                  <Tag size={14} className="mr-2" />
                                  Add to {list.name}
                                </DropdownMenuItem>
                              ))}
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(item.id)}
                            className="text-red-600"
                          >
                            <Trash2 size={14} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh]' : 'max-w-md'} overflow-y-auto`}>
          <DialogHeader>
            <DialogTitle>Edit {item.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label>Brand</Label>
                <Input
                  value={editData.brand || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, brand: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={editData.quantity}
                  onChange={(e) => setEditData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Unit</Label>
                <Select
                  value={editData.unit}
                  onValueChange={(value) => setEditData(prev => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="kg">Kg</SelectItem>
                    <SelectItem value="lbs">Lbs</SelectItem>
                    <SelectItem value="liters">Liters</SelectItem>
                    <SelectItem value="cups">Cups</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                    <SelectItem value="cans">Cans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Category</Label>
              <Select
                value={editData.category}
                onValueChange={(value) => setEditData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produce">Produce</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="meat">Meat</SelectItem>
                  <SelectItem value="pantry">Pantry</SelectItem>
                  <SelectItem value="frozen">Frozen</SelectItem>
                  <SelectItem value="beverages">Beverages</SelectItem>
                  <SelectItem value="snacks">Snacks</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editData.expiry_date ? format(new Date(editData.expiry_date), 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={editData.expiry_date ? new Date(editData.expiry_date) : undefined}
                    onSelect={(date) => setEditData(prev => ({ ...prev, expiry_date: date?.toISOString() }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Location</Label>
              <Input
                value={editData.location || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Pantry, Fridge, Freezer"
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={editData.notes || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                <X size={16} className="mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Check size={16} className="mr-2" />
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnhancedPantryItem;
