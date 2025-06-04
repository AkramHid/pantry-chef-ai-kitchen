
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CustomListType } from '@/types/pantry';
import { useAuth } from '@/hooks/use-auth';

export function usePantryLists() {
  const [lists, setLists] = useState<CustomListType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadLists();
    } else {
      setLists([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadLists = () => {
    try {
      const savedLists = localStorage.getItem(`pantryLists_${user?.id}`);
      if (savedLists) {
        setLists(JSON.parse(savedLists));
      }
    } catch (error) {
      console.error('Error loading lists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLists = (newLists: CustomListType[]) => {
    if (user) {
      localStorage.setItem(`pantryLists_${user.id}`, JSON.stringify(newLists));
      setLists(newLists);
    }
  };

  const createList = (name: string) => {
    const newList: CustomListType = {
      id: `list_${Date.now()}`,
      name,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedLists = [...lists, newList];
    saveLists(updatedLists);

    toast({
      title: 'List created',
      description: `"${name}" has been created`,
    });

    return newList;
  };

  const deleteList = (listId: string) => {
    const updatedLists = lists.filter(list => list.id !== listId);
    saveLists(updatedLists);

    toast({
      title: 'List deleted',
      description: 'The list has been removed',
    });
  };

  const renameList = (listId: string, newName: string) => {
    const updatedLists = lists.map(list => 
      list.id === listId 
        ? { ...list, name: newName, updatedAt: new Date().toISOString() }
        : list
    );
    saveLists(updatedLists);

    toast({
      title: 'List renamed',
      description: `List renamed to "${newName}"`,
    });
  };

  const addItemToList = (itemId: string, listId: string) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId && !list.items.includes(itemId)) {
        return {
          ...list,
          items: [...list.items, itemId],
          updatedAt: new Date().toISOString()
        };
      }
      return list;
    });
    saveLists(updatedLists);
  };

  const removeItemFromList = (itemId: string, listId: string) => {
    const updatedLists = lists.map(list => 
      list.id === listId 
        ? { 
            ...list, 
            items: list.items.filter(id => id !== itemId),
            updatedAt: new Date().toISOString()
          }
        : list
    );
    saveLists(updatedLists);
  };

  return {
    lists,
    isLoading,
    createList,
    deleteList,
    renameList,
    addItemToList,
    removeItemFromList
  };
}
