
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/layout/PageTransition';
import { FamilyMembersSection } from '@/components/family/FamilyMembersSection';

const FamilyPage = () => {
  const navigate = useNavigate();

  return (
    <PageTransition className="min-h-screen bg-kitchen-cream kitchen-texture flex flex-col">
      <Header title="Family Sharing" />
      
      <main className="flex-1 px-4 py-6 mb-16">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold font-heading text-kitchen-dark">Family Sharing</h1>
            <p className="text-muted-foreground">Share your kitchen data with family members</p>
          </div>

          <FamilyMembersSection />
        </div>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

export default FamilyPage;
