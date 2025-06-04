import { PantryItemData } from "@/types/pantry";
import { RecipeData } from "@/types/recipe";
import { ShoppingItemData } from "@/types/shopping";

// Mock pantry data
export const mockPantryItems: PantryItemData[] = [
  {
    id: '1',
    name: 'Chicken Breast',
    quantity: 2,
    unit: 'pcs',
    category: 'fridge',
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    addedDate: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Pasta',
    quantity: 1,
    unit: 'pkg',
    category: 'pantry',
    addedDate: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Tomatoes',
    quantity: 4,
    unit: 'pcs',
    category: 'fridge',
    expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    addedDate: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=800&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Frozen Peas',
    quantity: 1,
    unit: 'bag',
    category: 'freezer',
    addedDate: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1656949346309-ea99f30c1b58?w=800&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Milk',
    quantity: 1,
    unit: 'L',
    category: 'fridge',
    expiryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
    addedDate: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Bread',
    quantity: 1,
    unit: 'loaf',
    category: 'pantry',
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    addedDate: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&auto=format&fit=crop'
  },
  {
    id: '7',
    name: 'Eggs',
    quantity: 6,
    unit: 'pcs',
    category: 'fridge',
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    addedDate: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800&auto=format&fit=crop'
  },
  {
    id: '8',
    name: 'Bell Peppers',
    quantity: 3,
    unit: 'pcs',
    category: 'fridge',
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    addedDate: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1594292312128-5d1d8d3fab56?w=800&auto=format&fit=crop'
  },
  {
    id: '9',
    name: 'Frozen Berries',
    quantity: 1,
    unit: 'bag',
    category: 'freezer',
    addedDate: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1463489995677-c1d9f65c332a?w=800&auto=format&fit=crop'
  },
  {
    id: '10',
    name: 'Rice',
    quantity: 2,
    unit: 'kg',
    category: 'pantry',
    addedDate: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1594489573188-e588f387a782?w=800&auto=format&fit=crop'
  },
  {
    id: '11',
    name: 'Canned Beans',
    quantity: 3,
    unit: 'cans',
    category: 'pantry',
    addedDate: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1612187279149-41671afde701?w=800&auto=format&fit=crop'
  },
  {
    id: '12',
    name: 'Spinach',
    quantity: 1,
    unit: 'bag',
    category: 'fridge',
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    addedDate: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop'
  },
  {
    id: '13',
    name: 'Frozen Pizza',
    quantity: 2,
    unit: 'pcs',
    category: 'freezer',
    addedDate: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1513104890138-7c74965c332a?w=800&auto=format&fit=crop'
  },
  {
    id: '14',
    name: 'Olive Oil',
    quantity: 1,
    unit: 'bottle',
    category: 'pantry',
    addedDate: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop'
  }
];

// Mock recipe data
export const mockRecipes: RecipeData[] = [
  {
    id: '1',
    title: 'Tunisian Couscous with Vegetables',
    image: 'https://source.unsplash.com/random/800x600/?couscous,tunisian',
    cookTime: 45,
    ingredients: ['Couscous', 'Chickpeas', 'Carrots', 'Zucchini', 'Tomatoes', 'Harissa'],
    matchingIngredients: 3,
    difficulty: 'Medium',
    cuisine: 'Tunisian'
  },
  {
    id: '2',
    title: 'French Ratatouille',
    image: 'https://source.unsplash.com/random/800x600/?ratatouille,french',
    cookTime: 60,
    ingredients: ['Eggplant', 'Zucchini', 'Tomatoes', 'Bell Peppers', 'Onions', 'Herbs'],
    matchingIngredients: 2,
    difficulty: 'Medium',
    cuisine: 'French'
  },
  {
    id: '3',
    title: 'Oriental Shawarma',
    image: 'https://source.unsplash.com/random/800x600/?shawarma,middle-eastern',
    cookTime: 90,
    ingredients: ['Chicken', 'Pita Bread', 'Tahini', 'Garlic', 'Vegetables'],
    matchingIngredients: 2,
    difficulty: 'Hard',
    cuisine: 'Oriental'
  },
  {
    id: '4',
    title: 'Tunisian Shakshuka',
    image: 'https://source.unsplash.com/random/800x600/?shakshuka,eggs',
    cookTime: 25,
    ingredients: ['Eggs', 'Tomatoes', 'Bell Peppers', 'Onions', 'Spices'],
    matchingIngredients: 3,
    difficulty: 'Easy',
    cuisine: 'Tunisian'
  }
];

// Mock shopping list data
export const mockShoppingItems: ShoppingItemData[] = [
  {
    id: '1',
    name: 'Onions',
    quantity: 3,
    unit: 'pcs',
    category: 'Produce',
    isChecked: false
  },
  {
    id: '2',
    name: 'Garlic',
    quantity: 1,
    unit: 'bulb',
    category: 'Produce',
    isChecked: false
  },
  {
    id: '3',
    name: 'Chicken Stock',
    quantity: 1,
    unit: 'L',
    category: 'Canned & Packaged',
    isChecked: true
  },
  {
    id: '4',
    name: 'Parmesan Cheese',
    quantity: 200,
    unit: 'g',
    category: 'Dairy',
    isChecked: false,
    note: 'Get the grated one if available'
  },
  {
    id: '5',
    name: 'Arborio Rice',
    quantity: 1,
    unit: 'kg',
    category: 'Grains & Pasta',
    isChecked: false
  }
];

// Mock shopping lists data
export const mockShoppingLists = [
  {
    id: 'list1',
    name: 'Weekly Groceries',
    items: ['1', '2', '4'] // IDs reference mockShoppingItems
  },
  {
    id: 'list2',
    name: 'Party Supplies',
    items: ['3', '5'] // IDs reference mockShoppingItems
  },
  {
    id: 'list3',
    name: 'Essentials',
    items: ['1', '3'] // IDs reference mockShoppingItems
  }
];

// Generate a list of expiring items for the home page
export const getExpiringSoonItems = (days: number = 7) => {
  return mockPantryItems
    .filter(item => {
      if (!item.expiryDate) return false;
      
      const today = new Date();
      const expiry = new Date(item.expiryDate);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays <= days;
    })
    .sort((a, b) => {
      const dateA = new Date(a.expiryDate!).getTime();
      const dateB = new Date(b.expiryDate!).getTime();
      return dateA - dateB;
    })
    .map(item => ({
      id: item.id,
      name: item.name,
      daysLeft: Math.ceil((new Date(item.expiryDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    }));
};
