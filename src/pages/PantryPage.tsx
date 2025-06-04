
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Grid3X3, List, Calendar, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PantryList from '@/components/pantry/PantryList';
import CustomLists from '@/components/pantry/CustomLists';
import { useToast } from '@/hooks/use-toast';
import { usePantry } from '@/hooks/use-pantry';
import { useAuth } from '@/hooks/use-auth';
import { ViewMode } from '@/components/ui/list-layout';
import { CustomListType } from '@/types/pantry';
import { Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit: z.string().default("pc"),
  category: z.string().default("General"),
  location: z.string().default("pantry"),
  expiryDate: z.string().optional(),
  note: z.string().optional(),
});

const PantryPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const {
    items,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    incrementQuantity,
    decrementQuantity
  } = usePantry();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [customLists, setCustomLists] = useState<CustomListType[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: 1,
      unit: "pc",
      category: "General",
      location: "pantry",
      expiryDate: "",
      note: "",
    },
  });

  // Load custom lists from localStorage
  useEffect(() => {
    const savedLists = localStorage.getItem('pantryChef_customLists');
    if (savedLists) {
      setCustomLists(JSON.parse(savedLists));
    }
  }, []);

  // Save custom lists to localStorage
  useEffect(() => {
    localStorage.setItem('pantryChef_customLists', JSON.stringify(customLists));
  }, [customLists]);

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to access your pantry',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [user, navigate, toast]);

  // Auto-open add dialog if action=add in URL
  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setIsAddDialogOpen(true);
    }
  }, [searchParams]);

  const handleAddItem = async (values: z.infer<typeof formSchema>) => {
    try {
      await addItem({
        name: values.name,
        quantity: values.quantity,
        unit: values.unit,
        category: values.category as "fridge" | "freezer" | "pantry",
        expiryDate: values.expiryDate || undefined,
      });
      
      form.reset();
      setIsAddDialogOpen(false);
      toast({
        title: "Item added successfully",
        description: `${values.name} has been added to your pantry`,
      });
    } catch (error) {
      toast({
        title: "Error adding item",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleCreateList = (name: string) => {
    const newList: CustomListType = {
      id: `list-${Date.now()}`,
      name,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCustomLists(prev => [...prev, newList]);
    toast({
      title: "List created",
      description: `${name} list has been created`,
    });
  };

  const handleDeleteList = (id: string) => {
    setCustomLists(prev => prev.filter(list => list.id !== id));
    toast({
      title: "List deleted",
      description: "List has been removed",
    });
  };

  const handleRenameList = (id: string, newName: string) => {
    setCustomLists(prev => prev.map(list => 
      list.id === id ? { ...list, name: newName, updatedAt: new Date().toISOString() } : list
    ));
  };

  const handleRemoveFromList = (itemId: string, listId: string) => {
    setCustomLists(prev => prev.map(list =>
      list.id === listId 
        ? { ...list, items: list.items.filter(id => id !== itemId), updatedAt: new Date().toISOString() }
        : list
    ));
  };

  // Filter items based on search and category
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))];
  
  // Calculate expiring soon count
  const expiringSoonCount = items.filter(item => {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  }).length;

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-kitchen-cream kitchen-texture flex flex-col">
      <Header title="My Pantry" />
      
      <main className="flex-1 px-4 py-6 mb-16">
        <div className="max-w-6xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-2xl font-bold font-heading text-kitchen-dark">My Pantry</h1>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-muted-foreground">
                  {items.length} total items
                </p>
                {expiringSoonCount > 0 && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle size={12} />
                    {expiringSoonCount} expiring soon
                  </Badge>
                )}
              </div>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-kitchen-green hover:bg-kitchen-green/90">
                  <Plus size={18} className="mr-1" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Pantry Item</DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter item name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <FormControl>
                              <Input placeholder="pc, kg, lbs" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date (Optional)</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex gap-4 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1">Add Item</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </motion.div>

          <Tabs defaultValue="items" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="items">All Items</TabsTrigger>
              <TabsTrigger value="lists">Custom Lists</TabsTrigger>
            </TabsList>
            
            <TabsContent value="items">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex flex-col lg:flex-row gap-4 w-full">
                    <div className="relative flex-grow">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search pantry items..."
                        className="pl-8 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category === 'all' ? 'All Categories' : category}
                          </option>
                        ))}
                      </select>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className={viewMode === 'grid' ? 'bg-muted' : ''} 
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid3X3 size={18} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className={viewMode === 'list' ? 'bg-muted' : ''} 
                        onClick={() => setViewMode('list')}
                      >
                        <List size={18} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kitchen-green mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">Loading pantry items...</p>
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🥫</div>
                      <h3 className="text-lg font-medium mb-2">
                        {searchQuery || filterCategory !== 'all' ? 'No matching items found' : 'Your pantry is empty'}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery || filterCategory !== 'all' 
                          ? 'Try adjusting your search or filter'
                          : 'Add your first item to get started tracking your pantry'
                        }
                      </p>
                      {!searchQuery && filterCategory === 'all' && (
                        <Button 
                          onClick={() => setIsAddDialogOpen(true)}
                          className="bg-kitchen-green hover:bg-kitchen-green/90"
                        >
                          <Plus size={18} className="mr-1" />
                          Add Your First Item
                        </Button>
                      )}
                    </div>
                  ) : (
                    <PantryList
                      items={filteredItems}
                      onIncrement={incrementQuantity}
                      onDecrement={decrementQuantity}
                      onDelete={deleteItem}
                      onAddNew={() => setIsAddDialogOpen(true)}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="lists">
              <CustomLists
                lists={customLists}
                pantryItems={items}
                onCreateList={handleCreateList}
                onDeleteList={handleDeleteList}
                onRenameList={handleRenameList}
                onRemoveFromList={handleRemoveFromList}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PantryPage;
