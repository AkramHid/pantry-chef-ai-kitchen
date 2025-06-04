
import { Chef } from '@/types/chef';

// Updated CHEFS array with all required properties
export const CHEFS: Chef[] = [
  {
    id: '1',
    name: 'Carla Rodriguez',
    image: 'https://images.unsplash.com/photo-1583394550880-082575469405?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 127,
    categories: ['breakfast', 'lunch', 'dinner'],
    specialties: ['breakfast', 'lunch', 'dinner'],
    styles: ['Mexican', 'Mediterranean'],
    hourlyRate: 75,
    experience: 8,
    availability: ['weekends', 'evenings'],
    location: 'New York, NY',
    description: 'Experienced chef specializing in Mexican cuisine with a modern twist. I love creating authentic dishes that tell a story.',
    languages: ['English', 'Spanish'],
    gallery: [
      'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551504734-5ee1c4a3479c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: '2',
    name: 'Jenny Chang',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 89,
    categories: ['dinner', 'dessert'],
    specialties: ['dinner', 'dessert'],
    styles: ['Asian', 'Healthy'],
    hourlyRate: 85,
    experience: 12,
    availability: ['weekdays', 'evenings'],
    location: 'Los Angeles, CA',
    description: 'Specialized in fusion Asian cuisine with a healthy focus. My desserts combine Eastern and Western techniques for unique flavors.',
    languages: ['English', 'Chinese'],
    gallery: [
      'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1563245738-2e66f2ed75a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1574484184081-afea8a62f9c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: '3',
    name: 'Marco Rossi',
    image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 156,
    categories: ['lunch', 'dinner'],
    specialties: ['lunch', 'dinner'],
    styles: ['Italian', 'Mediterranean'],
    hourlyRate: 80,
    experience: 15,
    availability: ['weekdays', 'weekends'],
    location: 'Chicago, IL',
    description: 'Italian cuisine expert with 15+ years of experience. I bring authentic Italian flavors directly to your home.',
    languages: ['English', 'Italian'],
    gallery: [
      'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598866594230-a7c12756260f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: '4',
    name: 'Sofia Patel',
    image: 'https://images.unsplash.com/photo-1556911073-38141963c9e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 203,
    categories: ['breakfast', 'lunch', 'event'],
    specialties: ['breakfast', 'lunch', 'event'],
    styles: ['Brunch', 'Meal Prep'],
    hourlyRate: 70,
    experience: 10,
    availability: ['weekends', 'mornings'],
    location: 'Boston, MA',
    description: 'I specialize in brunch and meal preparation services. Perfect for busy families who want healthy, pre-planned meals.',
    languages: ['English', 'Hindi'],
    gallery: [
      'https://images.unsplash.com/photo-1590368755807-9b6a24eecc72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: '5',
    name: 'David Kim',
    image: 'https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewCount: 98,
    categories: ['dinner', 'event'],
    specialties: ['dinner', 'event'],
    styles: ['Asian', 'Healthy'],
    hourlyRate: 90,
    experience: 14,
    availability: ['evenings', 'weekends'],
    location: 'Seattle, WA',
    description: 'Experienced in catering events and private dinners. I create memorable dining experiences with a focus on healthy ingredients.',
    languages: ['English', 'Korean'],
    gallery: [
      'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1557872943-16a5ac26437e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1529042410759-befb1204b468?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: '6',
    name: 'Emma Wilson',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 142,
    categories: ['dessert', 'breakfast'],
    specialties: ['dessert', 'breakfast'],
    styles: ['Brunch', 'Italian'],
    hourlyRate: 65,
    experience: 9,
    availability: ['mornings', 'weekends'],
    location: 'Denver, CO',
    description: 'Pastry chef specialized in Italian desserts and breakfast pastries. I bring the taste of European bakeries to your home.',
    languages: ['English', 'French'],
    gallery: [
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1546554137-f86b9593a222?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1579372786545-666a77c4f321?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1619743358116-050db12c2fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    ]
  }
];
