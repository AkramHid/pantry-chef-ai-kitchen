
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Merge, BarChart3, Tag, X } from 'lucide-react';
import { SmartSuggestion } from '@/lib/grab-and-go-intelligence';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface GrabAndGoSmartSuggestionsProps {
  suggestions: SmartSuggestion[];
  onApplySuggestion: (suggestion: SmartSuggestion) => void;
  onDismissSuggestion: (suggestion: SmartSuggestion) => void;
}

const GrabAndGoSmartSuggestions: React.FC<GrabAndGoSmartSuggestionsProps> = ({
  suggestions,
  onApplySuggestion,
  onDismissSuggestion
}) => {
  const isMobile = useIsMobile();

  if (suggestions.length === 0) return null;

  const getIcon = (type: SmartSuggestion['type']) => {
    switch (type) {
      case 'duplicate':
        return <Merge size={18} />;
      case 'quantity':
        return <BarChart3 size={18} />;
      case 'category':
        return <Tag size={18} />;
      case 'missing':
        return <AlertTriangle size={18} />;
      default:
        return <AlertTriangle size={18} />;
    }
  };

  const getPriorityColor = (priority: SmartSuggestion['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-kitchen-dark flex items-center">
          <AlertTriangle size={20} className="mr-2 text-kitchen-green" />
          Smart Suggestions
        </h3>
        <p className="text-sm text-gray-600">AI-powered recommendations to optimize your list</p>
      </div>
      
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={`${suggestion.type}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${getPriorityColor(suggestion.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="mt-1 text-kitchen-green">
                  {getIcon(suggestion.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-kitchen-dark mb-1">
                    {suggestion.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {suggestion.description}
                  </p>
                  <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-row'}`}>
                    <Button
                      size="sm"
                      onClick={() => onApplySuggestion(suggestion)}
                      className="bg-kitchen-green hover:bg-kitchen-green/90"
                    >
                      {suggestion.action}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDismissSuggestion(suggestion)}
                      className="text-gray-600"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDismissSuggestion(suggestion)}
                className="text-gray-400 hover:text-gray-600 p-1 h-auto"
              >
                <X size={16} />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default GrabAndGoSmartSuggestions;
