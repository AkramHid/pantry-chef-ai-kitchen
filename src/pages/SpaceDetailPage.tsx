import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Grid3X3, List, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PantryList from '@/components/pantry/PantryList';
import { usePantry } from '@/hooks/use-pantry';
import { useSpaces } from '@/hooks/use-spaces';
import { ViewMode } from '@/components/ui/list-layout';

const SpaceDetailPage = () => {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const { items, isLoading } = usePantry();
  const { spaces } = useSpaces();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const space = spaces.find(s => s.id === spaceId);
  const spaceItems = items.filter(item => item.category === space?.name);
  const filteredItems = spaceItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!space) {
    return (
      <div className="min-h-screen bg-kitchen-cream flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Space not found</h2>
          <Button onClick={() => navigate('/spaces')}>
            Back to Spaces
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kitchen-cream kitchen-texture flex flex-col">
      <Header title={space.name} />
      
      <main className="flex-1 px-4 py-6 mb-16">
        <div className="max-w-6xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/spaces')}
              >
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold font-heading text-kitchen-dark">
                  {space.name}
                </h1>
                <p className="text-muted-foreground">
                  {spaceItems.length} items • {space.description}
                </p>
              </div>
            </div>
            
            <Button className="bg-kitchen-green hover:bg-kitchen-green/90">
              <Plus size={18} className="mr-1" />
              Add Item
            </Button>
          </motion.div>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items in this space..."
                    className="pl-8 bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
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
                  <Button variant="outline" size="icon">
                    <Filter size={18} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kitchen-green mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading items...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">{space.icon}</div>
                  <h3 className="text-lg font-medium mb-2">
                    {searchQuery ? 'No matching items found' : 'No items in this space yet'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? 'Try adjusting your search terms'
                      : 'Add your first item to get started'
                    }
                  </p>
                  {!searchQuery && (
                    <Button className="bg-kitchen-green hover:bg-kitchen-green/90">
                      <Plus size={18} className="mr-1" />
                      Add First Item
                    </Button>
                  )}
                </div>
              ) : (
                <PantryList 
                  items={filteredItems}
                  viewMode={viewMode}
                  onIncrement={() => {}}
                  onDecrement={() => {}}
                  onDelete={() => {}}
                  onAddNew={() => {}}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SpaceDetailPage;
