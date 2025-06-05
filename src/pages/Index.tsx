import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Utensils, ShoppingCart, Users, ChefHat } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { usePantry } from '@/hooks/use-pantry';
import { useShoppingList } from '@/hooks/use-shopping-list';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChefTile from '@/components/home/ChefTile';
import FloatingGrabAndGoButton from '@/components/home/FloatingGrabAndGoButton';
import { format } from 'date-fns';
import { PantryItemData } from '@/types/pantry';
import SmartDashboard from '@/components/dashboard/SmartDashboard';

const IndexPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { items } = usePantry();
  const { shoppingItems } = useShoppingList();
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-kitchen-cream kitchen-texture flex flex-col">
      <Header title="My Kitchen" />

      <main className="flex-1 px-4 py-6 mb-16">
        <div className="max-w-6xl mx-auto">
          <SmartDashboard />
        </div>
      </main>

      {/* Floating Grab & Go Button */}
      <FloatingGrabAndGoButton />

      <Footer />
    </div>
  );
};

export default IndexPage;
