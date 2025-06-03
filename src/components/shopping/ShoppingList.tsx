
import React, { useState } from 'react';
import ShoppingItem, { ShoppingItemData } from './ShoppingItem';
import { Button } from '@/components/ui/button';
import { Plus, Share2, Trash2 } from 'lucide-react';
import { ListLayout, ViewMode } from '@/components/ui/list-layout';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { groupItemsByGroceryCategory, GROCERY_STORE_CATEGORIES } from '@/lib/grocery-store-logic';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface ShoppingListProps {
  items: ShoppingItemData[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddNew: (item: Partial<ShoppingItemData>) => void;
  onClearChecked: () => void;
  onShare: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit: z.string().default("pc"),
  category: z.string().default("General"),
  note: z.string().optional(),
});

const ShoppingList: React.FC<ShoppingListProps> = ({ 
  items, 
  onToggle, 
  onDelete, 
  onAddNew,
  onClearChecked,
  onShare
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: 1,
      unit: "pc",
      category: "General",
      note: "",
    },
  });

  const handleAddItem = (values: z.infer<typeof formSchema>) => {
    onAddNew({
      name: values.name,
      quantity: values.quantity,
      unit: values.unit,
      category: values.category,
      note: values.note || undefined,
      isChecked: false,
    });
    
    form.reset();
    setIsAddDialogOpen(false);
  };
  
  // Group items by grocery store categories
  const groupedItems = groupItemsByGroceryCategory(items);
  
  // Only show categories that have items
  const categoriesWithItems = GROCERY_STORE_CATEGORIES.filter(
    category => groupedItems[category].length > 0
  );
  
  // Separate checked and unchecked items
  const hasCheckedItems = items.some(item => item.isChecked);
  
  // Automatically switch to list view on small screens
  React.useEffect(() => {
    if (isMobile) {
      setViewMode('list');
    }
  }, [isMobile]);
  
  return (
    <div className="pb-20 md:pb-16">
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 pb-2">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <div className="flex space-x-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-kitchen-green hover:bg-kitchen-green/90"
                  size={isMobile ? "sm" : "default"}
                >
                  <Plus size={isMobile ? 16 : 18} className="mr-1" /> Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className={isMobile ? "px-3 py-4 w-[95%] max-w-md" : ""}>
                <DialogHeader>
                  <DialogTitle>Add Shopping Item</DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-4 py-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter item name" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex gap-4 flex-wrap sm:flex-nowrap">
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem className="flex-1 min-w-[120px]">
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem className="flex-1 min-w-[120px]">
                            <FormLabel>Unit</FormLabel>
                            <FormControl>
                              <Input placeholder="pc, kg, lbs" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Produce, Dairy, Meat, etc." 
                              {...field} 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Note (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Any special notes" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddDialogOpen(false)}
                        className={isMobile ? "w-full" : ""}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className={isMobile ? "w-full" : ""}>Add to List</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "icon"} 
              onClick={onShare}
              className="border-kitchen-green text-kitchen-green"
            >
              <Share2 size={isMobile ? 14 : 16} className={isMobile ? "mr-1" : ""} />
              {isMobile && "Share"}
            </Button>
          </div>
          
          {hasCheckedItems && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearChecked}
              className="text-gray-500 hover:text-kitchen-berry hover:bg-kitchen-berry/10"
            >
              <Trash2 size={14} className="mr-1" />
              Clear Checked
            </Button>
          )}
        </div>
      </div>
      
      <ListLayout
        title="Shopping List (Organized by Store Layout)"
        viewMode={viewMode}
        onViewModeChange={!isMobile ? setViewMode : undefined}
        className="bg-gradient-to-br from-kitchen-cream to-white"
      >
        {items.length === 0 ? (
          <div className="p-4 md:p-8 text-center text-gray-500">
            <p className="mb-4">Your shopping list is empty.</p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              variant="outline"
              className="border-kitchen-green text-kitchen-green hover:bg-kitchen-green hover:text-white"
            >
              <Plus size={18} className="mr-1" /> Add Your First Item
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4' : ''}>
            {categoriesWithItems.map(category => {
              const categoryItems = groupedItems[category].filter(item => !item.isChecked);
              if (categoryItems.length === 0) return null;
              
              return (
                <div key={category} className="mb-2">
                  <div className="px-3 md:px-4 py-2 bg-muted/50 font-medium text-sm text-gray-600 uppercase flex justify-between items-center">
                    <span>{category}</span>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                      {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className={viewMode === 'grid' ? 'grid gap-2' : ''}>
                    {categoryItems.map(item => (
                      <ShoppingItem
                        key={item.id}
                        item={item}
                        onToggle={onToggle}
                        onDelete={onDelete}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/* Checked items section */}
            {hasCheckedItems && (
              <div className="mt-4 col-span-full">
                <div className="px-3 md:px-4 py-2 bg-muted/50 font-medium text-sm text-gray-600 uppercase flex items-center">
                  <Trash2 size={14} className="mr-2" />
                  Completed Items
                </div>
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-2' : ''}>
                  {items
                    .filter(item => item.isChecked)
                    .map(item => (
                      <ShoppingItem
                        key={item.id}
                        item={item}
                        onToggle={onToggle}
                        onDelete={onDelete}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </ListLayout>
    </div>
  );
};

export default ShoppingList;
