import { Chef, ChefMatchingCriteria, ChefRecommendation, ChefTier } from '@/types/chef';

export class ChefMatchingService {
  static calculateMatchScore(chef: Chef, criteria: ChefMatchingCriteria): number {
    let score = 0;
    const factors: { [key: string]: number } = {};

    // Budget compatibility (30% weight)
    const avgPrice = this.estimatePrice(chef, criteria);
    const budgetFit = this.calculateBudgetScore(avgPrice, criteria.budgetRange);
    factors.budget = budgetFit * 0.3;
    score += factors.budget;

    // Cuisine preference match (25% weight)
    const cuisineMatch = this.calculateCuisineMatch(chef, criteria.preferredCuisines);
    factors.cuisine = cuisineMatch * 0.25;
    score += factors.cuisine;

    // Experience and tier match (20% weight)
    const tierScore = this.calculateTierScore(chef, criteria.eventType);
    factors.tier = tierScore * 0.2;
    score += factors.tier;

    // Availability match (15% weight)
    const availabilityScore = this.calculateAvailabilityScore(chef, criteria.date, criteria.timeSlot);
    factors.availability = availabilityScore * 0.15;
    score += factors.availability;

    // Dietary restrictions compatibility (10% weight)
    const dietaryScore = this.calculateDietaryScore(chef, criteria.dietaryRestrictions);
    factors.dietary = dietaryScore * 0.1;
    score += factors.dietary;

    return Math.min(100, Math.max(0, score));
  }

  static estimatePrice(chef: Chef, criteria: ChefMatchingCriteria): number {
    let basePrice = chef.basePricing.homeEvents;

    // Adjust base price based on event type
    switch (criteria.eventType.toLowerCase()) {
      case 'corporate':
        basePrice = chef.basePricing.corporateEvents;
        break;
      case 'private':
      case 'luxury':
        basePrice = chef.basePricing.privateEvents;
        break;
      case 'meal prep':
        basePrice = chef.basePricing.mealPrep;
        break;
    }

    // Dynamic pricing adjustments
    if (chef.isDynamicPricing) {
      // High-demand periods (weekends, holidays)
      const eventDate = new Date(criteria.date);
      const isWeekend = eventDate.getDay() === 0 || eventDate.getDay() === 6;
      if (isWeekend) basePrice *= 1.2;

      // Party size multiplier
      if (criteria.eventSize > 10) basePrice *= 1.1;
      if (criteria.eventSize > 20) basePrice *= 1.2;

      // Elite chef premium
      if (chef.tier === 'elite') basePrice *= 1.5;
      else if (chef.tier === 'professional') basePrice *= 1.2;
    }

    return basePrice;
  }

  private static calculateBudgetScore(estimatedPrice: number, budgetRange: { min: number; max: number }): number {
    if (estimatedPrice < budgetRange.min) return 60; // Too cheap might indicate lower quality
    if (estimatedPrice > budgetRange.max) return 0; // Too expensive
    
    const midpoint = (budgetRange.min + budgetRange.max) / 2;
    const distance = Math.abs(estimatedPrice - midpoint);
    const range = budgetRange.max - budgetRange.min;
    
    return Math.max(0, 100 - (distance / range) * 100);
  }

  private static calculateCuisineMatch(chef: Chef, preferredCuisines: string[]): number {
    if (preferredCuisines.length === 0) return 100;
    
    const chefCuisines = [...chef.specialties, ...chef.culturalExpertise].map(c => c.toLowerCase());
    const matches = preferredCuisines.filter(pref => 
      chefCuisines.some(cuisine => cuisine.includes(pref.toLowerCase()))
    );
    
    return (matches.length / preferredCuisines.length) * 100;
  }

  private static calculateTierScore(chef: Chef, eventType: string): number {
    const eventTypeMap: { [key: string]: ChefTier[] } = {
      'casual': ['home', 'professional'],
      'family': ['home', 'professional'],
      'corporate': ['professional', 'elite'],
      'luxury': ['elite'],
      'private': ['professional', 'elite'],
      'wedding': ['professional', 'elite'],
      'yacht': ['elite'],
      'celebrity': ['elite']
    };

    const suitableTiers = eventTypeMap[eventType.toLowerCase()] || ['home', 'professional', 'elite'];
    
    if (suitableTiers.includes(chef.tier)) {
      // Bonus points for exact tier match
      if (eventType.toLowerCase() === 'luxury' && chef.tier === 'elite') return 100;
      if (eventType.toLowerCase() === 'family' && chef.tier === 'home') return 100;
      return 80;
    }
    
    return 40; // Partial match
  }

  private static calculateAvailabilityScore(chef: Chef, date: string, timeSlot: string): number {
    // Simplified availability check - in real implementation, would check chef.availabilityCalendar
    const eventDate = new Date(date);
    const dayOfWeek = eventDate.getDay();
    
    // Check general availability patterns
    if (chef.availability.includes('weekends') && (dayOfWeek === 0 || dayOfWeek === 6)) return 100;
    if (chef.availability.includes('weekdays') && dayOfWeek >= 1 && dayOfWeek <= 5) return 100;
    if (chef.availability.includes('evenings') && timeSlot.includes('evening')) return 100;
    
    return 60; // Default moderate availability
  }

  private static calculateDietaryScore(chef: Chef, dietaryRestrictions: string[]): number {
    if (dietaryRestrictions.length === 0) return 100;
    
    // Check if chef's signature dishes can accommodate dietary restrictions
    const accommodatableRestrictions = chef.signatureDishes
      .flatMap(dish => dish.dietaryTags)
      .filter(tag => dietaryRestrictions.some(restriction => 
        tag.toLowerCase().includes(restriction.toLowerCase())
      ));
    
    const accommodationRate = accommodatableRestrictions.length / dietaryRestrictions.length;
    return Math.min(100, accommodationRate * 100 + 20); // Base score for flexibility
  }

  static generateRecommendations(
    chefs: Chef[], 
    criteria: ChefMatchingCriteria,
    limit: number = 5
  ): ChefRecommendation[] {
    return chefs
      .map(chef => ({
        chef,
        matchScore: this.calculateMatchScore(chef, criteria),
        reasons: this.generateMatchReasons(chef, criteria),
        estimatedPrice: this.estimatePrice(chef, criteria),
        availableSlots: this.getAvailableSlots(chef, criteria.date)
      }))
      .filter(rec => rec.matchScore > 30) // Filter out very poor matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  private static generateMatchReasons(chef: Chef, criteria: ChefMatchingCriteria): string[] {
    const reasons: string[] = [];
    
    // Cuisine match
    const cuisineMatches = criteria.preferredCuisines.filter(pref => 
      chef.specialties.some(specialty => specialty.toLowerCase().includes(pref.toLowerCase()))
    );
    if (cuisineMatches.length > 0) {
      reasons.push(`Specializes in ${cuisineMatches.join(', ')} cuisine`);
    }
    
    // Tier appropriateness
    if (chef.tier === 'elite' && criteria.eventType.toLowerCase().includes('luxury')) {
      reasons.push('Elite chef perfect for luxury events');
    } else if (chef.tier === 'home' && criteria.eventType.toLowerCase().includes('family')) {
      reasons.push('Home chef ideal for family gatherings');
    }
    
    // High ratings
    if (chef.rating >= 4.8) {
      reasons.push(`Exceptional ${chef.rating} star rating`);
    }
    
    // Experience
    if (chef.experience >= 10) {
      reasons.push(`${chef.experience} years of professional experience`);
    }
    
    // Special certifications
    if (chef.certifications.length > 0) {
      reasons.push('Professionally certified and verified');
    }
    
    return reasons.slice(0, 3); // Limit to top 3 reasons
  }

  private static getAvailableSlots(chef: Chef, date: string): string[] {
    // Simplified - in real implementation would check actual calendar
    return ['Morning (9AM-12PM)', 'Afternoon (1PM-5PM)', 'Evening (6PM-10PM)'];
  }
}
