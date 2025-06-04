
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Heart, ChefHat, Utensils } from 'lucide-react';
import { KitchenStyle } from './KitchenStyleSelector';

export interface GeneratedRecipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  cookTime: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  kitchenStyle?: KitchenStyle;
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface RecipeDetailProps {
  recipe: GeneratedRecipe;
  onTryAnother: () => void;
  kitchenStyle: KitchenStyle;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  onTryAnother,
  kitchenStyle,
  isFavorite = false,
  onToggleFavorite,
}) => {
  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-kitchen-orange" />
              {recipe.title}
            </CardTitle>
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFavorite}
                className="text-red-500 hover:text-red-600"
              >
                <Heart 
                  size={20} 
                  className={isFavorite ? 'fill-current' : ''} 
                />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{recipe.cookTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{recipe.servings} servings</span>
            </div>
            <Badge variant="outline">{recipe.difficulty}</Badge>
            <Badge variant="outline">{recipe.cuisine}</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Utensils size={18} />
              Ingredients
            </h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-kitchen-green rounded-full"></span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Instructions</h3>
            <ol className="space-y-3">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-kitchen-green text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
          
          {recipe.nutritionInfo && (
            <div>
              <h3 className="font-semibold mb-3">Nutrition Info</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-kitchen-cream rounded-lg">
                  <div className="text-lg font-bold text-kitchen-green">{recipe.nutritionInfo.calories}</div>
                  <div className="text-sm text-muted-foreground">Calories</div>
                </div>
                <div className="text-center p-3 bg-kitchen-cream rounded-lg">
                  <div className="text-lg font-bold text-kitchen-green">{recipe.nutritionInfo.protein}g</div>
                  <div className="text-sm text-muted-foreground">Protein</div>
                </div>
                <div className="text-center p-3 bg-kitchen-cream rounded-lg">
                  <div className="text-lg font-bold text-kitchen-green">{recipe.nutritionInfo.carbs}g</div>
                  <div className="text-sm text-muted-foreground">Carbs</div>
                </div>
                <div className="text-center p-3 bg-kitchen-cream rounded-lg">
                  <div className="text-lg font-bold text-kitchen-green">{recipe.nutritionInfo.fat}g</div>
                  <div className="text-sm text-muted-foreground">Fat</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <Button 
              onClick={onTryAnother}
              variant="outline"
              className="w-full"
            >
              Try Another Recipe
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeDetail;
