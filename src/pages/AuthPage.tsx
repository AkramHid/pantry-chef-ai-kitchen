
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ChefHat, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password, firstName, lastName);
      }
    } catch (error) {
      // Error handling is done in the auth hook
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setShowPassword(false);
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kitchen-cream via-white to-kitchen-green/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-kitchen-green rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <ChefHat className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-kitchen-dark mb-2"
          >
            Welcome to Kitchen Assistant
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 flex items-center justify-center"
          >
            <Sparkles className="w-4 h-4 mr-2 text-kitchen-green" />
            Your smart kitchen companion
          </motion.p>
        </div>

        <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/90">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <Label htmlFor="firstName" className="flex items-center text-sm font-medium">
                        <User className="w-4 h-4 mr-2 text-kitchen-green" />
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="flex items-center text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="mt-1"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <Label htmlFor="email" className="flex items-center text-sm font-medium">
                  <Mail className="w-4 h-4 mr-2 text-kitchen-green" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center text-sm font-medium">
                  <Lock className="w-4 h-4 mr-2 text-kitchen-green" />
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-kitchen-green hover:bg-kitchen-green/90 text-white font-medium py-3 rounded-lg transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <span className="flex items-center justify-center">
                      {mode === 'signin' ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>

            <div className="mt-6 text-center">
              <Button
                type="button"
                variant="link"
                onClick={switchMode}
                className="text-kitchen-green hover:text-kitchen-green/80 font-medium"
              >
                {mode === 'signin'
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'
                }
              </Button>
            </div>
          </CardContent>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          Secure authentication powered by Supabase
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
