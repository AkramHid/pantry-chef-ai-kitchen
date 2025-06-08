
import { useState, useEffect } from 'react';
import { supabase, OnboardingProgress, PageTutorial } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export function useOnboarding(pageName: string) {
  const [tutorials, setTutorials] = useState<PageTutorial[]>([]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadTutorials();
      loadProgress();
    }
  }, [user, pageName]);

  const loadTutorials = async () => {
    try {
      const { data, error } = await supabase
        .from('page_tutorials')
        .select('*')
        .eq('page_name', pageName)
        .eq('is_active', true)
        .order('step_order');

      if (error) throw error;
      setTutorials(data || []);
    } catch (error) {
      console.error('Error loading tutorials:', error);
    }
  };

  const loadProgress = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('step_completed')
        .eq('user_id', user.id)
        .eq('page_name', pageName);

      if (error) throw error;
      
      const completed = data?.map(p => p.step_completed) || [];
      setCompletedSteps(completed);
      
      // Check if user has completed all steps for this page
      const allStepsCompleted = tutorials.length > 0 && 
        tutorials.every(tutorial => completed.includes(tutorial.step_name));
      
      setIsOnboardingActive(!allStepsCompleted && tutorials.length > 0);
      
      // Find current step (first incomplete step)
      const firstIncompleteIndex = tutorials.findIndex(
        tutorial => !completed.includes(tutorial.step_name)
      );
      setCurrentStep(firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0);
      
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeStep = async (stepName: string) => {
    if (!user || completedSteps.includes(stepName)) return;

    try {
      const { error } = await supabase
        .from('onboarding_progress')
        .insert({
          user_id: user.id,
          page_name: pageName,
          step_completed: stepName
        });

      if (error) throw error;

      setCompletedSteps(prev => [...prev, stepName]);
      
      // Move to next step
      const nextStepIndex = currentStep + 1;
      if (nextStepIndex < tutorials.length) {
        setCurrentStep(nextStepIndex);
      } else {
        setIsOnboardingActive(false);
        toast({
          title: 'Tutorial Complete! 🎉',
          description: `You've mastered the ${pageName} page!`,
        });
      }
    } catch (error) {
      console.error('Error completing step:', error);
      toast({
        title: 'Error saving progress',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const skipOnboarding = async () => {
    if (!user) return;

    try {
      // Mark all steps as completed
      const insertData = tutorials.map(tutorial => ({
        user_id: user.id,
        page_name: pageName,
        step_completed: tutorial.step_name
      }));

      const { error } = await supabase
        .from('onboarding_progress')
        .upsert(insertData);

      if (error) throw error;

      setIsOnboardingActive(false);
      setCompletedSteps(tutorials.map(t => t.step_name));
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    }
  };

  const resetOnboarding = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('onboarding_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('page_name', pageName);

      if (error) throw error;

      setCompletedSteps([]);
      setCurrentStep(0);
      setIsOnboardingActive(true);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  return {
    tutorials,
    currentTutorial: tutorials[currentStep],
    currentStep,
    isOnboardingActive,
    isLoading,
    completedSteps,
    completeStep,
    skipOnboarding,
    resetOnboarding,
    setCurrentStep
  };
}
