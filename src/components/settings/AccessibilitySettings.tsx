
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Eye, Volume2, Smartphone, Heart } from 'lucide-react';
import { useEnhancedPreferences } from '@/hooks/use-enhanced-preferences';

const AccessibilitySettings: React.FC = () => {
  const { preferences, updatePreferences, templates, applyTemplate, getRecommendedTemplates } = useEnhancedPreferences();

  if (!preferences) return null;

  const recommendedTemplates = getRecommendedTemplates();

  return (
    <div className="space-y-6">
      {/* Quick Templates */}
      {recommendedTemplates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Recommended for You
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendedTemplates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => applyTemplate(template.id)}
                  className="bg-kitchen-green hover:bg-kitchen-green/90"
                >
                  Apply
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Age Group */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Age Group</Label>
            <Select
              value={preferences.age_group}
              onValueChange={(value) => updatePreferences({ age_group: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="child">Child (Under 13)</SelectItem>
                <SelectItem value="teen">Teen (13-17)</SelectItem>
                <SelectItem value="adult">Adult (18-64)</SelectItem>
                <SelectItem value="senior">Senior (65+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Visual Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Visual Accessibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Font Size: {Math.round(preferences.font_scale * 100)}%</Label>
            <Slider
              value={[preferences.font_scale]}
              onValueChange={([value]) => updatePreferences({ font_scale: value })}
              min={0.8}
              max={2.0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Small (80%)</span>
              <span>Normal (100%)</span>
              <span>Extra Large (200%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>High Contrast Mode</Label>
              <p className="text-sm text-gray-600">Enhanced contrast for better visibility</p>
            </div>
            <Switch
              checked={preferences.high_contrast_mode}
              onCheckedChange={(checked) => updatePreferences({ high_contrast_mode: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>Touch Target Size</Label>
            <Select
              value={preferences.touch_target_size}
              onValueChange={(value) => updatePreferences({ touch_target_size: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="extra_large">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audio & Motion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Volume2 className="h-5 w-5 mr-2" />
            Audio & Motion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Voice Guidance</Label>
              <p className="text-sm text-gray-600">Audio instructions and confirmations</p>
            </div>
            <Switch
              checked={preferences.voice_guidance}
              onCheckedChange={(checked) => updatePreferences({ voice_guidance: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Reduce Motion</Label>
              <p className="text-sm text-gray-600">Minimize animations and transitions</p>
            </div>
            <Switch
              checked={preferences.reduce_motion}
              onCheckedChange={(checked) => updatePreferences({ reduce_motion: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Interface Simplification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="h-5 w-5 mr-2" />
            Interface
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Simplified Interface</Label>
              <p className="text-sm text-gray-600">Hide advanced features for easier use</p>
            </div>
            <Switch
              checked={preferences.simplified_ui}
              onCheckedChange={(checked) => updatePreferences({ simplified_ui: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Mobile Optimized Layout</Label>
              <p className="text-sm text-gray-600">Optimize interface for mobile devices</p>
            </div>
            <Switch
              checked={preferences.mobile_optimized_layout}
              onCheckedChange={(checked) => updatePreferences({ mobile_optimized_layout: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {templates.filter(t => t.is_system_template).map((template) => (
            <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{template.name}</p>
                <p className="text-sm text-gray-600">{template.description}</p>
                {template.target_age_group && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                    {template.target_age_group}
                  </span>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => applyTemplate(template.id)}
              >
                Apply
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilitySettings;
