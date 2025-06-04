
export interface CustomListType {
  id: string;
  name: string;
  items: string[];
  createdAt: string;
}

export interface PantryItemData {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'fridge' | 'freezer' | 'pantry';
  expiryDate?: string;
  addedDate: string;
  image?: string;
  user_id?: string;
  location?: string;
}
