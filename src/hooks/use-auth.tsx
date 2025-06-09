
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Clear app state on sign out
        if (event === 'SIGNED_OUT') {
          // Clear all localStorage and sessionStorage
          localStorage.removeItem('globalOnboardingComplete');
          localStorage.removeItem('chefOnboardingComplete');
          sessionStorage.clear();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: 'Error signing in',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }

    toast({
      title: 'Welcome back!',
      description: 'You have successfully signed in.',
    });
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      toast({
        title: 'Error signing up',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }

    toast({
      title: 'Account created!',
      description: 'Please check your email to verify your account.',
    });
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        title: 'Error signing out',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }

    // Clear all app data
    localStorage.clear();
    sessionStorage.clear();

    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully.',
    });
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      toast({
        title: 'Error resetting password',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }

    toast({
      title: 'Password reset email sent',
      description: 'Check your email for password reset instructions.',
    });
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
