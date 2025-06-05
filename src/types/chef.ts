
export type ChefCategory = 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'event' | 'mexican' | 'spanish' | 'mediterranean' | 'italian' | 'french' | 'all';
export type ChefStyle = 'traditional' | 'modern' | 'fine-dining' | 'Mexican' | 'Italian' | 'Healthy' | 'Mediterranean' | 'Asian' | 'Meal Prep' | 'Brunch' | 'all';

export type ChefTier = 'home' | 'professional' | 'elite';

export interface ChefCertification {
  id: string;
  name: string;
  issuer: string;
  dateObtained: string;
  verified: boolean;
  imageUrl?: string;
}

export interface ChefTestimonial {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  eventType: string;
  date: string;
  verified: boolean;
  isAnonymized?: boolean;
}

export interface SignatureDish {
  id: string;
  name: string;
  description: string;
  images: string[];
  video?: string;
  ingredients: string[];
  dietaryTags: string[];
  preparationTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ChefAvailability {
  date: string;
  slots: {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    price: number;
  }[];
}

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
  
  // New Phase 3 properties
  tier: ChefTier;
  certifications: ChefCertification[];
  testimonials: ChefTestimonial[];
  signatureDishes: SignatureDish[];
  serviceCount: number;
  satisfactionScore: number;
  peerRecommendations: number;
  brandPartnerships?: string[];
  industryAwards?: string[];
  specializations: string[];
  sourcingPreferences: string[];
  culturalExpertise: string[];
  availabilityCalendar: ChefAvailability[];
  basePricing: {
    homeEvents: number;
    corporateEvents: number;
    privateEvents: number;
    mealPrep: number;
  };
  isDynamicPricing: boolean;
}

export interface ChefMatchingCriteria {
  dietaryRestrictions: string[];
  budgetRange: {
    min: number;
    max: number;
  };
  eventType: string;
  eventSize: number;
  preferredCuisines: string[];
  date: string;
  timeSlot: string;
  pantryIngredients?: string[];
  previousChefs?: string[];
}

export interface ChefRecommendation {
  chef: Chef;
  matchScore: number;
  reasons: string[];
  estimatedPrice: number;
  availableSlots: string[];
}
