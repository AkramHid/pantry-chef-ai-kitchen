import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomListType, PantryItemData } from '@/types/pantry';
import { Plus, Edit, Trash2, X, Check, ListPlus } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';

interface CustomListsProps {
  lists: CustomListType[];
  pantryItems: PantryItemData[];
  onCreateList: (name: string) => void;
  onDeleteList: (id: string) => void;
  onRenameList: (id: string, newName: string) => void;
  onRemoveFromList: (itemId: string, listId: string) => void;
}

const CustomLists: React.FC<CustomListsProps> = ({
  lists,
  pantryItems,
  onCreateList,
  onDeleteList,
  onRenameList,
  onRemoveFromList,
}) => {
  const [newListName, setNewListName] = useState('');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleSubmitNewList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      onCreateList(newListName.trim());
      setNewListName('');
    }
  };

  const startEditing = (list: CustomListType) => {
    setEditingListId(list.id);
    setEditingName(list.name);
  };

  const submitEdit = () => {
    if (editingListId && editingName.trim()) {
      onRenameList(editingListId, editingName.trim());
      setEditingListId(null);
    }
  };

  const cancelEdit = () => {
    setEditingListId(null);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <ListPlus size={20} className="mr-2" />
          Custom Lists
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitNewList} className="mb-4 flex gap-2">
          <Input
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list name..."
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!newListName.trim()}
            size="sm"
          >
            <Plus size={16} className="mr-1" /> Add
          </Button>
        </form>

        {lists.length === 0 ? (
          <div className="text-center p-4 text-gray-500 bg-muted/30 rounded-lg">
            <p>Create your first custom list to organize ingredients for specific meals or purposes.</p>
          </div>
        ) : (
          <Accordion type="multiple" className="w-full">
            {lists.map((list) => (
              <AccordionItem key={list.id} value={list.id}>
                <AccordionTrigger className="py-3 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-2">
                    {editingListId === list.id ? (
                      <div className="flex items-center gap-1 flex-1">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-7 text-sm"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            submitEdit();
                          }}
                        >
                          <Check size={14} />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelEdit();
                          }}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="font-medium text-kitchen-dark">{list.name}</span>
                        <Badge variant="outline" className="ml-2 bg-muted/50">
                          {list.items.length}
                        </Badge>
                      </div>
                    )}
                    
                    {editingListId !== list.id && (
                      <div className="flex items-center ml-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(list);
                          }}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6 text-kitchen-berry" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteList(list.id);
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="py-2 px-1 space-y-2">
                    {list.items.length === 0 ? (
                      <div className="text-sm text-gray-500 italic p-2">
                        No items in this list yet. Add items from your pantry.
                      </div>
                    ) : (
                      list.items.map(itemId => {
                        const item = pantryItems.find(i => i.id === itemId);
                        if (!item) return null;
                        
                        return (
                          <div 
                            key={item.id} 
                            className="flex items-center justify-between p-2 bg-muted/30 rounded"
                          >
                            <div className="text-sm font-medium">{item.name}</div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {item.quantity} {item.unit}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-gray-400 hover:text-kitchen-berry"
                                onClick={() => onRemoveFromList(item.id, list.id)}
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomLists;
