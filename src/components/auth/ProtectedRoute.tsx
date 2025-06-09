
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'framer-motion';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-kitchen-cream via-white to-kitchen-green/5 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center space-y-4"
    >
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kitchen-green"></div>
        <div className="absolute inset-0 rounded-full h-12 w-12 border-t-2 border-kitchen-green/30 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-kitchen-green font-medium"
      >
        Loading your kitchen...
      </motion.p>
    </motion.div>
  </div>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (requireAuth && !user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export default ProtectedRoute;
