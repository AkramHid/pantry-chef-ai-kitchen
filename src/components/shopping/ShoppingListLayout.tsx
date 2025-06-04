
import React from 'react';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useIsMobile } from '@/hooks/use-mobile';

interface ShoppingListLayoutProps {
  children: React.ReactNode;
  title: string;
  onBack: () => void;
}

const ShoppingListLayout: React.FC<ShoppingListLayoutProps> = ({ 
  children, 
  title,
  onBack 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-kitchen-cream flex flex-col">
      <Header 
        title={title} 
        showBackButton={true}
      />
      
      <main className="flex-1 px-3 md:px-4 py-4 md:py-6 mx-auto w-full max-w-4xl">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default ShoppingListLayout;
