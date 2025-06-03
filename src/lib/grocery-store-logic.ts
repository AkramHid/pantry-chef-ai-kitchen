
// Grocery store category ordering logic
export const GROCERY_STORE_CATEGORIES = [
  'Produce',
  'Dairy',
  'Meat & Seafood', 
  'Deli',
  'Bakery',
  'Grains & Pasta',
  'Canned Goods',
  'Condiments & Sauces',
  'Snacks',
  'Beverages',
  'Frozen',
  'General'
] as const;

export type GroceryCategory = typeof GROCERY_STORE_CATEGORIES[number];

// Map common categories to grocery store categories
export const CATEGORY_MAPPING: Record<string, GroceryCategory> = {
  'fridge': 'Dairy',
  'freezer': 'Frozen',
  'pantry': 'Grains & Pasta',
  'dairy': 'Dairy',
  'meat': 'Meat & Seafood',
  'produce': 'Produce',
  'vegetables': 'Produce',
  'fruits': 'Produce',
  'beverages': 'Beverages',
  'snacks': 'Snacks',
  'canned': 'Canned Goods',
  'condiments': 'Condiments & Sauces',
  'bakery': 'Bakery',
  'deli': 'Deli',
  'general': 'General'
};

export function mapToGroceryCategory(category: string): GroceryCategory {
  const normalizedCategory = category.toLowerCase().trim();
  return CATEGORY_MAPPING[normalizedCategory] || 'General';
}

export function sortItemsByGroceryLogic<T extends { category: string }>(items: T[]): T[] {
  return items.sort((a, b) => {
    const categoryA = mapToGroceryCategory(a.category);
    const categoryB = mapToGroceryCategory(b.category);
    
    const indexA = GROCERY_STORE_CATEGORIES.indexOf(categoryA);
    const indexB = GROCERY_STORE_CATEGORIES.indexOf(categoryB);
    
    return indexA - indexB;
  });
}

export function groupItemsByGroceryCategory<T extends { category: string }>(items: T[]): Record<GroceryCategory, T[]> {
  const grouped: Record<GroceryCategory, T[]> = {} as Record<GroceryCategory, T[]>;
  
  // Initialize all categories
  GROCERY_STORE_CATEGORIES.forEach(category => {
    grouped[category] = [];
  });
  
  items.forEach(item => {
    const groceryCategory = mapToGroceryCategory(item.category);
    grouped[groceryCategory].push(item);
  });
  
  return grouped;
}
