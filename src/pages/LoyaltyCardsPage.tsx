
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CreditCard, QrCode, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LoyaltyCardsPage = () => {
  const navigate = useNavigate();
  const [cards] = useState([
    { id: '1', storeName: 'Kroger', cardNumber: '**** 1234', isActive: true },
    { id: '2', storeName: 'Whole Foods', cardNumber: '**** 5678', isActive: true },
  ]);

  return (
    <div className="min-h-screen bg-kitchen-cream kitchen-texture flex flex-col">
      <Header title="Loyalty Cards" />
      
      <main className="flex-1 px-4 py-6 mb-16">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold font-heading text-kitchen-dark">Loyalty Cards</h1>
              <p className="text-muted-foreground">Manage your store loyalty cards</p>
            </div>
            <Button className="bg-kitchen-green hover:bg-kitchen-green/90">
              <Plus size={18} className="mr-1" />
              Add Card
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
              <Card key={card.id} className="bg-white shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>{card.storeName}</span>
                    <CreditCard className="w-5 h-5 text-kitchen-green" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{card.cardNumber}</p>
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      <QrCode size={16} className="mr-1" />
                      Show QR
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LoyaltyCardsPage;
