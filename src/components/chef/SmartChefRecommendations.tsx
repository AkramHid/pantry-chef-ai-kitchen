
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedChefCard } from './EnhancedChefCard';
import { ChefMatchingService } from '@/lib/chef-matching-service';
import { Chef, ChefMatchingCriteria, ChefRecommendation } from '@/types/chef';

interface SmartChefRecommendationsProps {
  chefs: Chef[];
  criteria: ChefMatchingCriteria;
  onChefSelect: (chef: Chef) => void;
  onUpdateCriteria: (criteria: ChefMatchingCriteria) => void;
}

export const SmartChefRecommendations: React.FC<SmartChefRecommendationsProps> = ({
  chefs,
  criteria,
  onChefSelect,
  onUpdateCriteria
}) => {
  const [recommendations, setRecommendations] = useState<ChefRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateRecommendations = async () => {
      setIsLoading(true);
      
      // Simulate AI processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const recs = ChefMatchingService.generateRecommendations(chefs, criteria);
      setRecommendations(recs);
      setIsLoading(false);
    };

    generateRecommendations();
  }, [chefs, criteria]);

  const handleBookChef = (chef: Chef) => {
    onChefSelect(chef);
  };

  const handleViewProfile = (chef: Chef) => {
    onChefSelect(chef);
  };

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-kitchen-green animate-pulse" />
            AI Chef Matching
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Sparkles className="h-8 w-8 text-kitchen-green animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-600">Finding your perfect chef match...</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* AI Insights Header */}
      <Card className="border-kitchen-green/20 bg-gradient-to-r from-kitchen-green/5 to-kitchen-green/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-kitchen-green" />
            AI Chef Recommendations
            <Badge variant="secondary" className="ml-2">
              {recommendations.length} matches found
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-500 mx-auto mb-1" />
              <p className="text-sm font-medium">Average Match</p>
              <p className="text-lg font-bold text-blue-600">
                {recommendations.length > 0 ? Math.round(recommendations.reduce((acc, rec) => acc + rec.matchScore, 0) / recommendations.length) : 0}%
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <Filter className="h-6 w-6 text-green-500 mx-auto mb-1" />
              <p className="text-sm font-medium">Price Range</p>
              <p className="text-lg font-bold text-green-600">
                ${Math.min(...recommendations.map(r => r.estimatedPrice))} - ${Math.max(...recommendations.map(r => r.estimatedPrice))}
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <Sparkles className="h-6 w-6 text-purple-500 mx-auto mb-1" />
              <p className="text-sm font-medium">Top Tier</p>
              <p className="text-lg font-bold text-purple-600 capitalize">
                {recommendations[0]?.chef.tier || 'N/A'}
              </p>
            </div>
          </div>
          
          {recommendations.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-600">No chefs match your current criteria. Try adjusting your preferences.</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => onUpdateCriteria({
                  ...criteria,
                  budgetRange: { min: criteria.budgetRange.min * 0.8, max: criteria.budgetRange.max * 1.5 }
                })}
              >
                Expand Search Criteria
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chef Recommendations Grid */}
      {recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recommendation, index) => (
            <motion.div
              key={recommendation.chef.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <EnhancedChefCard
                chef={recommendation.chef}
                onBookNow={() => handleBookChef(recommendation.chef)}
                onViewProfile={() => handleViewProfile(recommendation.chef)}
                matchScore={recommendation.matchScore}
                reasons={recommendation.reasons}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
