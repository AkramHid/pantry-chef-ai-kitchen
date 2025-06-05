
import { ShoppingItemData } from '@/components/shopping/ShoppingItem';

export interface DuplicateGroup {
  items: ShoppingItemData[];
  suggestedQuantity: number;
  suggestedUnit: string;
}

export interface SmartSuggestion {
  type: 'duplicate' | 'quantity' | 'category' | 'missing';
  title: string;
  description: string;
  action: string;
  items: string[];
  priority: 'high' | 'medium' | 'low';
}

// Detect similar items that might be duplicates
export function detectDuplicates(items: ShoppingItemData[]): DuplicateGroup[] {
  const duplicateGroups: DuplicateGroup[] = [];
  const processed = new Set<string>();

  items.forEach((item, index) => {
    if (processed.has(item.id)) return;

    const similar = items.filter((other, otherIndex) => {
      if (otherIndex <= index || processed.has(other.id)) return false;
      return areSimilarItems(item, other);
    });

    if (similar.length > 0) {
      const group = [item, ...similar];
      const totalQuantity = group.reduce((sum, i) => sum + i.quantity, 0);
      
      duplicateGroups.push({
        items: group,
        suggestedQuantity: totalQuantity,
        suggestedUnit: getMostCommonUnit(group)
      });

      // Mark all items in this group as processed
      group.forEach(i => processed.add(i.id));
    }
  });

  return duplicateGroups;
}

// Check if two items are similar (potential duplicates)
function areSimilarItems(item1: ShoppingItemData, item2: ShoppingItemData): boolean {
  const name1 = item1.name.toLowerCase().trim();
  const name2 = item2.name.toLowerCase().trim();
  
  // Exact match
  if (name1 === name2) return true;
  
  // Similar names (edit distance)
  if (calculateSimilarity(name1, name2) > 0.8) return true;
  
  // Common variations
  const variations = [
    [/\bbananas?\b/i, /\bbanana\b/i],
    [/\btomatoes?\b/i, /\btomato\b/i],
    [/\bapples?\b/i, /\bapple\b/i],
    [/\boranges?\b/i, /\borange\b/i],
    [/\bpotatoes?\b/i, /\bpotato\b/i],
    [/\bonions?\b/i, /\bonion\b/i],
  ];
  
  return variations.some(([pattern1, pattern2]) => 
    (pattern1.test(name1) && pattern2.test(name2)) ||
    (pattern2.test(name1) && pattern1.test(name2))
  );
}

// Calculate string similarity using Levenshtein distance
function calculateSimilarity(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  const maxLength = Math.max(str1.length, str2.length);
  return maxLength === 0 ? 1 : (maxLength - matrix[str2.length][str1.length]) / maxLength;
}

// Get the most common unit from a group of items
function getMostCommonUnit(items: ShoppingItemData[]): string {
  const unitCounts = items.reduce((acc, item) => {
    acc[item.unit] = (acc[item.unit] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(unitCounts).reduce((a, b) => 
    unitCounts[a[0]] > unitCounts[b[0]] ? a : b
  )[0];
}

// Generate smart suggestions for the Grab & Go list
export function generateSmartSuggestions(items: ShoppingItemData[]): SmartSuggestion[] {
  const suggestions: SmartSuggestion[] = [];
  
  // Duplicate detection suggestions
  const duplicates = detectDuplicates(items);
  duplicates.forEach(group => {
    suggestions.push({
      type: 'duplicate',
      title: 'Duplicate Items Detected',
      description: `Found ${group.items.length} similar items: ${group.items.map(i => i.name).join(', ')}`,
      action: 'Merge items',
      items: group.items.map(i => i.id),
      priority: 'high'
    });
  });
  
  // Quantity optimization suggestions
  const quantitySuggestions = analyzeQuantities(items);
  suggestions.push(...quantitySuggestions);
  
  // Category organization suggestions
  const categorySuggestions = analyzeCategoryOptimization(items);
  suggestions.push(...categorySuggestions);
  
  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

// Analyze quantities for optimization suggestions
function analyzeQuantities(items: ShoppingItemData[]): SmartSuggestion[] {
  const suggestions: SmartSuggestion[] = [];
  
  items.forEach(item => {
    if (item.quantity > 10 && item.unit === 'pc') {
      suggestions.push({
        type: 'quantity',
        title: 'Large Quantity Detected',
        description: `${item.name}: ${item.quantity} pieces might be better measured in bulk`,
        action: 'Optimize unit',
        items: [item.id],
        priority: 'medium'
      });
    }
  });
  
  return suggestions;
}

// Analyze category organization for suggestions
function analyzeCategoryOptimization(items: ShoppingItemData[]): SmartSuggestion[] {
  const suggestions: SmartSuggestion[] = [];
  const categoryCount = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Suggest category reorganization if too many items in General
  if (categoryCount['General'] > 5) {
    const generalItems = items.filter(item => item.category === 'General');
    suggestions.push({
      type: 'category',
      title: 'Improve Category Organization',
      description: `${categoryCount['General']} items in General category could be better organized`,
      action: 'Categorize items',
      items: generalItems.map(i => i.id),
      priority: 'low'
    });
  }
  
  return suggestions;
}

// Smart merge function for duplicate items
export function mergeItems(items: ShoppingItemData[], itemIds: string[]): ShoppingItemData {
  const itemsToMerge = items.filter(item => itemIds.includes(item.id));
  const totalQuantity = itemsToMerge.reduce((sum, item) => sum + item.quantity, 0);
  const mostCommonUnit = getMostCommonUnit(itemsToMerge);
  const bestCategory = getBestCategory(itemsToMerge);
  
  // Use the first item as base and merge others into it
  const baseItem = itemsToMerge[0];
  
  return {
    ...baseItem,
    quantity: totalQuantity,
    unit: mostCommonUnit,
    category: bestCategory,
    note: itemsToMerge
      .map(item => item.note)
      .filter(Boolean)
      .join('; ') || undefined
  };
}

// Get the best category from a group of items
function getBestCategory(items: ShoppingItemData[]): string {
  const categoryCounts = items.reduce((acc, item) => {
    if (item.category !== 'General') {
      acc[item.category] = (acc[item.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  if (Object.keys(categoryCounts).length === 0) return 'General';
  
  return Object.entries(categoryCounts).reduce((a, b) => 
    categoryCounts[a[0]] > categoryCounts[b[0]] ? a : b
  )[0];
}
