
import { Chef, ChefTier } from '@/types/chef';

export const CHEFS: Chef[] = [
  {
    id: '1',
    name: 'Chef Maria Rodriguez',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
    rating: 4.9,
    reviewCount: 127,
    categories: ['mexican', 'spanish', 'mediterranean'],
    styles: ['traditional', 'modern'],
    hourlyRate: 150,
    experience: 8,
    availability: ['weekends', 'evenings'],
    description: 'Professional chef with 8 years of experience in Mexican and Mediterranean cuisine.',
    specialties: ['mexican', 'spanish', 'mediterranean'],
    languages: ['English', 'Spanish'],
    location: 'Downtown',
    gallery: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600'
    ],
    tier: 'professional',
    certifications: [
      {
        id: 'cert-1',
        name: 'Culinary Arts Degree',
        issuer: 'Johnson & Wales University',
        dateObtained: '2016-05-15',
        verified: true
      },
      {
        id: 'cert-2',
        name: 'Mediterranean Cuisine Specialist',
        issuer: 'Italian Culinary Institute',
        dateObtained: '2018-08-20',
        verified: true
      }
    ],
    testimonials: [
      {
        id: 'test-1',
        clientName: 'Sarah Johnson',
        rating: 5,
        comment: 'Maria created an unforgettable Spanish-themed dinner party for us!',
        eventType: 'Private Dinner',
        date: '2024-05-15',
        verified: true
      }
    ],
    signatureDishes: [
      {
        id: 'dish-1',
        name: 'Paella Valenciana',
        description: 'Traditional Spanish paella with saffron, seafood, and bomba rice',
        images: ['https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=600'],
        ingredients: ['bomba rice', 'saffron', 'seafood', 'vegetables'],
        dietaryTags: ['gluten-free', 'pescatarian'],
        preparationTime: 45,
        difficulty: 'medium'
      }
    ],
    serviceCount: 127,
    satisfactionScore: 98,
    peerRecommendations: 45,
    brandPartnerships: ['Casa Bonita Restaurant', 'Spanish Cultural Center'],
    specializations: ['Spanish Tapas', 'Mediterranean Seafood', 'Paella Mastery'],
    sourcingPreferences: ['local', 'organic', 'sustainable seafood'],
    culturalExpertise: ['Spanish', 'Catalan', 'Andalusian'],
    availabilityCalendar: [],
    basePricing: {
      homeEvents: 150,
      corporateEvents: 200,
      privateEvents: 180,
      mealPrep: 120
    },
    isDynamicPricing: true
  },
  {
    id: '2',
    name: 'Chef James Wilson',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    rating: 4.8,
    reviewCount: 89,
    categories: ['italian', 'french'],
    styles: ['fine-dining', 'traditional'],
    hourlyRate: 180,
    experience: 12,
    availability: ['weekdays', 'weekends'],
    description: 'Expert in Italian and French cuisine with 12 years of professional experience.',
    specialties: ['italian', 'french'],
    languages: ['English', 'Italian', 'French'],
    location: 'Midtown',
    gallery: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600'
    ],
    tier: 'professional',
    certifications: [
      {
        id: 'cert-3',
        name: 'Le Cordon Bleu Certificate',
        issuer: 'Le Cordon Bleu Paris',
        dateObtained: '2012-06-10',
        verified: true
      }
    ],
    testimonials: [
      {
        id: 'test-2',
        clientName: 'Michael Chen',
        rating: 5,
        comment: 'James delivered a Michelin-star quality experience in our home.',
        eventType: 'Anniversary Dinner',
        date: '2024-04-20',
        verified: true
      }
    ],
    signatureDishes: [
      {
        id: 'dish-2',
        name: 'Osso Buco Milanese',
        description: 'Braised veal shanks with saffron risotto and gremolata',
        images: ['https://images.unsplash.com/photo-1555244162-803834f70033?w=600'],
        ingredients: ['veal shanks', 'arborio rice', 'saffron', 'white wine'],
        dietaryTags: ['gluten-free'],
        preparationTime: 120,
        difficulty: 'hard'
      }
    ],
    serviceCount: 89,
    satisfactionScore: 96,
    peerRecommendations: 38,
    brandPartnerships: ['Ristorante Italiano', 'French Bistro Union'],
    specializations: ['Northern Italian', 'French Bistro', 'Wine Pairing'],
    sourcingPreferences: ['local', 'artisanal', 'imported specialty'],
    culturalExpertise: ['Milanese', 'Tuscan', 'Provence'],
    availabilityCalendar: [],
    basePricing: {
      homeEvents: 180,
      corporateEvents: 250,
      privateEvents: 220,
      mealPrep: 140
    },
    isDynamicPricing: true
  },
  {
    id: '3',
    name: 'Chef Marco Rossi',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
    rating: 5.0,
    reviewCount: 45,
    categories: ['italian', 'mediterranean'],
    styles: ['fine-dining', 'modern'],
    hourlyRate: 350,
    experience: 15,
    availability: ['weekends', 'special events'],
    description: 'Elite private chef specializing in luxury dining experiences and yacht catering.',
    specialties: ['italian', 'mediterranean'],
    languages: ['English', 'Italian'],
    location: 'Harbor District',
    gallery: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600',
      'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=600',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600'
    ],
    tier: 'elite',
    certifications: [
      {
        id: 'cert-4',
        name: 'Elite Private Chef Certification',
        issuer: 'International Private Chef Association',
        dateObtained: '2019-03-15',
        verified: true
      },
      {
        id: 'cert-5',
        name: 'Yacht Catering Specialist',
        issuer: 'Maritime Culinary Institute',
        dateObtained: '2020-07-22',
        verified: true
      }
    ],
    testimonials: [
      {
        id: 'test-3',
        clientName: 'Anonymous Celebrity Client',
        rating: 5,
        comment: 'Marco transformed our yacht event into a culinary masterpiece.',
        eventType: 'Private Yacht Event',
        date: '2024-03-10',
        verified: true,
        isAnonymized: true
      }
    ],
    signatureDishes: [
      {
        id: 'dish-3',
        name: 'Truffle Risotto Oro',
        description: 'Black truffle risotto with 24k gold flakes and aged Parmigiano',
        images: ['https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600'],
        ingredients: ['carnaroli rice', 'black truffle', '24k gold', 'aged parmigiano'],
        dietaryTags: ['vegetarian', 'luxury'],
        preparationTime: 30,
        difficulty: 'hard'
      }
    ],
    serviceCount: 45,
    satisfactionScore: 100,
    peerRecommendations: 25,
    industryAwards: ['James Beard Outstanding Chef Nominee', 'Private Chef of the Year 2023'],
    specializations: ['Luxury Events', 'Yacht Catering', 'Molecular Gastronomy'],
    sourcingPreferences: ['premium', 'exclusive suppliers', 'rare ingredients'],
    culturalExpertise: ['Northern Italian', 'Modern European', 'Molecular'],
    availabilityCalendar: [],
    basePricing: {
      homeEvents: 350,
      corporateEvents: 500,
      privateEvents: 450,
      mealPrep: 280
    },
    isDynamicPricing: true
  },
  {
    id: '4',
    name: 'Chef Lisa Thompson',
    image: 'https://images.unsplash.com/photo-1594736797933-d0c53aff7865?w=400',
    rating: 4.3,
    reviewCount: 23,
    categories: ['breakfast', 'healthy'],
    styles: ['modern', 'Healthy'],
    hourlyRate: 85,
    experience: 3,
    availability: ['weekdays', 'mornings'],
    description: 'Home chef specializing in healthy breakfast and meal prep options.',
    specialties: ['breakfast', 'healthy'],
    languages: ['English'],
    location: 'Suburbs',
    gallery: [
      'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600'
    ],
    tier: 'home',
    certifications: [
      {
        id: 'cert-6',
        name: 'Nutrition and Culinary Arts',
        issuer: 'Community College',
        dateObtained: '2022-05-20',
        verified: true
      }
    ],
    testimonials: [
      {
        id: 'test-4',
        clientName: 'Jennifer Williams',
        rating: 4,
        comment: 'Lisa helped us establish healthy eating habits for our family.',
        eventType: 'Meal Prep Service',
        date: '2024-01-15',
        verified: true
      }
    ],
    signatureDishes: [
      {
        id: 'dish-4',
        name: 'Quinoa Power Bowl',
        description: 'Nutritious quinoa bowl with seasonal vegetables and tahini dressing',
        images: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600'],
        ingredients: ['quinoa', 'seasonal vegetables', 'tahini', 'hemp seeds'],
        dietaryTags: ['vegan', 'gluten-free', 'high-protein'],
        preparationTime: 25,
        difficulty: 'easy'
      }
    ],
    serviceCount: 23,
    satisfactionScore: 86,
    peerRecommendations: 8,
    specializations: ['Healthy Meal Prep', 'Family Nutrition', 'Plant-Based Cooking'],
    sourcingPreferences: ['organic', 'local', 'seasonal'],
    culturalExpertise: ['Modern American', 'Mediterranean-inspired'],
    availabilityCalendar: [],
    basePricing: {
      homeEvents: 85,
      corporateEvents: 110,
      privateEvents: 95,
      mealPrep: 75
    },
    isDynamicPricing: false
  }
];
