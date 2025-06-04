
export type ChefCategory = 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'event' | 'mexican' | 'spanish' | 'mediterranean' | 'italian' | 'french' | 'all';
export type ChefStyle = 'traditional' | 'modern' | 'fine-dining' | 'Mexican' | 'Italian' | 'Healthy' | 'Mediterranean' | 'Asian' | 'Meal Prep' | 'Brunch' | 'all';

export interface Chef {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  categories: ChefCategory[];
  styles: ChefStyle[];
  hourlyRate: number;
  experience: number;
  availability: string[];
  description: string;
  specialties: ChefCategory[];
  languages: string[];
  location: string;
  gallery: string[];
}
