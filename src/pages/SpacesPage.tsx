
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Home as HomeIcon, Grid3X3, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SpacesList from '@/components/spaces/SpacesList';
import CreateSpaceDialog from '@/components/spaces/CreateSpaceDialog';
import { useSpaces } from '@/hooks/use-spaces';
import { ViewMode } from '@/components/ui/list-layout';

const SpacesPage = () => {
  const navigate = useNavigate();
  const { spaces, addSpace, updateSpace, deleteSpace } = useSpaces();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  const filteredSpaces = spaces.filter(
    space => space.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-kitchen-cream kitchen-texture flex flex-col">
      <Header title="Spaces" />
      
      <main className="flex-1 px-4 py-6 mb-16">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold font-heading text-kitchen-dark">My Spaces</h1>
              <p className="text-muted-foreground">Organize your pantry items by space</p>
            </div>
            
            <Button 
              onClick={() => setIsCreateDialogOpen(true)} 
              className="w-full sm:w-auto bg-kitchen-green hover:bg-kitchen-green/90"
            >
              <Plus size={18} className="mr-1" />
              Create New Space
            </Button>
          </div>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search spaces..."
                    className="pl-8 bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
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
                    <PenSquare size={18} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {filteredSpaces.length === 0 ? (
                <div className="text-center py-12">
                  <HomeIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No spaces found</h3>
                  <p className="mt-2 text-muted-foreground">
                    Create your first space to organize your pantry items
                  </p>
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)} 
                    className="mt-4 bg-kitchen-green hover:bg-kitchen-green/90"
                  >
                    <Plus size={18} className="mr-1" />
                    Create New Space
                  </Button>
                </div>
              ) : (
                <SpacesList 
                  spaces={filteredSpaces} 
                  viewMode={viewMode}
                  onUpdate={updateSpace}
                  onDelete={deleteSpace}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <CreateSpaceDialog 
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateSpace={addSpace}
      />
      
      <Footer />
    </div>
  );
};

export default SpacesPage;
