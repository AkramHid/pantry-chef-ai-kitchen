
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Crown, DollarSign, MapPin, Star, Utensils, Award, Users, ChefHat } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Chef } from "@/types/chef";
import { motion } from 'framer-motion';

interface EnhancedChefCardProps {
  chef: Chef;
  onBookNow: () => void;
  onViewProfile: () => void;
  matchScore?: number;
  reasons?: string[];
}

const getTierIcon = (tier: string) => {
  switch (tier) {
    case 'elite':
      return <Crown className="h-4 w-4 text-yellow-500" />;
    case 'professional':
      return <Award className="h-4 w-4 text-blue-500" />;
    case 'home':
      return <ChefHat className="h-4 w-4 text-green-500" />;
    default:
      return <ChefHat className="h-4 w-4" />;
  }
};

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'elite':
      return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    case 'professional':
      return 'bg-gradient-to-r from-blue-400 to-blue-600';
    case 'home':
      return 'bg-gradient-to-r from-green-400 to-green-600';
    default:
      return 'bg-gray-400';
  }
};

export const EnhancedChefCard: React.FC<EnhancedChefCardProps> = ({ 
  chef, 
  onBookNow, 
  onViewProfile,
  matchScore,
  reasons = []
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-kitchen-green/20">
        <div className="relative">
          <img 
            src={chef.image} 
            alt={chef.name} 
            className="w-full h-48 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://images.unsplash.com/photo-1556911073-38141963c9e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
            }}
          />
          
          {/* Tier Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={`${getTierColor(chef.tier)} text-white font-semibold capitalize flex items-center gap-1`}>
              {getTierIcon(chef.tier)}
              {chef.tier}
            </Badge>
          </div>
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-kitchen-dark font-medium flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {chef.rating.toFixed(1)}
            </Badge>
          </div>
          
          {/* Match Score */}
          {matchScore && matchScore > 70 && (
            <div className="absolute bottom-3 right-3">
              <Badge className="bg-kitchen-green text-white font-bold">
                {matchScore}% Match
              </Badge>
            </div>
          )}
        </div>
        
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-bold line-clamp-1">{chef.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {chef.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Users className="h-4 w-4 mr-1" />
                {chef.serviceCount} services • {chef.satisfactionScore}% satisfaction
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center font-bold text-kitchen-green">
                <DollarSign className="h-4 w-4" />
                {chef.hourlyRate}/hr
              </div>
              {chef.tier === 'elite' && (
                <span className="text-xs text-yellow-600 font-medium">Premium Chef</span>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <p className="text-sm line-clamp-2 text-gray-600">{chef.description}</p>
          
          {/* Match Reasons */}
          {reasons.length > 0 && (
            <div className="space-y-1">
              <span className="text-xs font-medium text-green-600">Why this chef matches:</span>
              {reasons.slice(0, 2).map((reason, index) => (
                <div key={index} className="text-xs text-gray-600 flex items-center">
                  <div className="w-1 h-1 bg-green-400 rounded-full mr-2"></div>
                  {reason}
                </div>
              ))}
            </div>
          )}
          
          {/* Specializations */}
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Specializations</span>
            <div className="flex flex-wrap gap-1">
              {chef.specializations.slice(0, 3).map((spec) => (
                <Badge key={spec} variant="outline" className="text-xs py-0">
                  {spec}
                </Badge>
              ))}
              {chef.specializations.length > 3 && (
                <Badge variant="outline" className="text-xs py-0">
                  +{chef.specializations.length - 3} more
                </Badge>
              )}
            </div>
          </div>
          
          {/* Certifications */}
          {chef.certifications.length > 0 && (
            <div>
              <span className="text-xs text-muted-foreground block mb-1">Certifications</span>
              <div className="flex items-center text-xs text-blue-600">
                <Award className="h-3 w-3 mr-1" />
                {chef.certifications.length} verified certification{chef.certifications.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t pt-4 flex justify-between gap-2">
          <Button variant="outline" className="flex-1" onClick={onViewProfile}>
            <Utensils className="h-4 w-4 mr-2" />
            View Profile
          </Button>
          <Button className="flex-1 bg-kitchen-green hover:bg-kitchen-green/90" onClick={onBookNow}>
            <Calendar className="h-4 w-4 mr-2" />
            Book Now
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
