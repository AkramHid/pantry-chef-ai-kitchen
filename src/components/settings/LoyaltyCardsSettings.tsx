
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { CreditCard, Plus, Scan, Trash2, Edit, QrCode, Users, Wallet, Smartphone } from 'lucide-react';
import { useLoyaltyCards } from '@/hooks/use-loyalty-cards';

const LoyaltyCardsSettings: React.FC = () => {
  const { cards, addCard, updateCard, deleteCard, incrementUsage, isLoading } = useLoyaltyCards();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [newCard, setNewCard] = useState({
    store_name: '',
    card_number: '',
    category: 'grocery',
    points_balance: 0,
    notes: '',
    auto_scan_enabled: true,
    shared_with_family: false
  });

  const categories = [
    'grocery', 'pharmacy', 'retail', 'restaurant', 'gas', 'electronics', 'clothing', 'other'
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      grocery: 'from-green-500 to-green-600',
      pharmacy: 'from-blue-500 to-blue-600',
      retail: 'from-purple-500 to-purple-600',
      restaurant: 'from-orange-500 to-orange-600',
      gas: 'from-yellow-500 to-yellow-600',
      electronics: 'from-indigo-500 to-indigo-600',
      clothing: 'from-pink-500 to-pink-600',
      other: 'from-gray-500 to-gray-600'
    };
    return colors[category] || colors.other;
  };

  const handleAddCard = async () => {
    if (!newCard.store_name || !newCard.card_number) return;
    
    await addCard(newCard);
    setNewCard({
      store_name: '',
      card_number: '',
      category: 'grocery',
      points_balance: 0,
      notes: '',
      auto_scan_enabled: true,
      shared_with_family: false
    });
    setShowAddDialog(false);
  };

  const handleScanBarcode = async () => {
    // This would integrate with camera API for barcode scanning
    // For demo purposes, we'll simulate it
    try {
      // Simulated scan result
      const scannedData = {
        store_name: 'Scanned Store',
        card_number: '1234567890',
        category: 'grocery'
      };
      
      setNewCard(prev => ({ ...prev, ...scannedData }));
    } catch (error) {
      console.error('Barcode scan failed:', error);
    }
  };

  const formatCardNumber = (number: string) => {
    return number.replace(/(.{4})/g, '$1 ').trim();
  };

  const handleCardSelect = (card: any) => {
    setSelectedCard(card);
    incrementUsage(card.id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kitchen-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Loyalty Cards</h2>
          <p className="text-gray-600 text-sm">Manage your store loyalty cards and rewards</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-kitchen-green hover:bg-kitchen-green/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Loyalty Card</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleScanBarcode}
                  className="flex-1 text-xs"
                >
                  <Scan className="h-4 w-4 mr-1" />
                  Scan Barcode
                </Button>
                <Button
                  variant="outline"
                  onClick={handleScanBarcode}
                  className="flex-1 text-xs"
                >
                  <QrCode className="h-4 w-4 mr-1" />
                  Scan QR
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Store Name</Label>
                <Input
                  value={newCard.store_name}
                  onChange={(e) => setNewCard(prev => ({ ...prev, store_name: e.target.value }))}
                  placeholder="Enter store name"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Card Number</Label>
                <Input
                  value={newCard.card_number}
                  onChange={(e) => setNewCard(prev => ({ ...prev, card_number: e.target.value }))}
                  placeholder="Enter card number"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Category</Label>
                <Select
                  value={newCard.category}
                  onValueChange={(value) => setNewCard(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm">Share with family</Label>
                <Switch
                  checked={newCard.shared_with_family}
                  onCheckedChange={(checked) => setNewCard(prev => ({ ...prev, shared_with_family: checked }))}
                />
              </div>
              
              <Button onClick={handleAddCard} className="w-full">
                Add Card
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Apple Wallet Style Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleCardSelect(card)}
            className="cursor-pointer"
          >
            {/* Apple Wallet Style Card */}
            <div className={`relative h-48 rounded-2xl bg-gradient-to-br ${getCategoryColor(card.category)} text-white shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
              {/* Card Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-2 border-white/30"></div>
                <div className="absolute top-8 right-8 w-8 h-8 rounded-full border border-white/20"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full border border-white/20"></div>
              </div>
              
              {/* Card Content */}
              <div className="relative p-6 h-full flex flex-col justify-between">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{card.store_name}</h3>
                    <p className="text-white/80 text-sm capitalize">{card.category}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Wallet className="h-5 w-5" />
                    {card.shared_with_family && (
                      <Users className="h-4 w-4" />
                    )}
                  </div>
                </div>
                
                {/* Middle - Points/Balance */}
                {card.points_balance > 0 && (
                  <div className="text-center py-2">
                    <p className="text-2xl font-bold">{card.points_balance.toLocaleString()}</p>
                    <p className="text-white/80 text-xs">Points Available</p>
                  </div>
                )}
                
                {/* Bottom - Card Number */}
                <div>
                  <p className="text-white/80 text-xs mb-1">Card Number</p>
                  <p className="font-mono text-sm tracking-wider">
                    {formatCardNumber(card.card_number)}
                  </p>
                </div>
                
                {/* Actions Overlay */}
                <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-white hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCard(card);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-white hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCard(card.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {cards.length === 0 && (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-kitchen-green/10 rounded-full flex items-center justify-center">
              <Wallet className="h-8 w-8 text-kitchen-green" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Digital Wallet</h3>
              <p className="text-gray-600 mb-4 text-sm">Add your loyalty cards and use them like Apple Wallet</p>
              <Button onClick={() => setShowAddDialog(true)} className="bg-kitchen-green hover:bg-kitchen-green/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Card
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Selected Card Modal - Full Screen Display */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Smartphone className="h-5 w-5 mr-2" />
              Use Card
            </DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4">
              {/* Large Card Display */}
              <div className={`relative h-56 rounded-2xl bg-gradient-to-br ${getCategoryColor(selectedCard.category)} text-white shadow-xl overflow-hidden`}>
                <div className="relative p-6 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{selectedCard.store_name}</h3>
                    <p className="text-white/80 capitalize">{selectedCard.category}</p>
                  </div>
                  
                  {selectedCard.points_balance > 0 && (
                    <div className="text-center">
                      <p className="text-3xl font-bold">{selectedCard.points_balance.toLocaleString()}</p>
                      <p className="text-white/80 text-sm">Points Available</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-white/80 text-sm mb-2">Card Number</p>
                    <p className="font-mono text-lg tracking-wider">
                      {formatCardNumber(selectedCard.card_number)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* QR Code Placeholder */}
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <QrCode className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 text-sm">QR Code would appear here</p>
                <p className="text-xs text-gray-500 mt-1">Show this to cashier</p>
              </div>
              
              <div className="text-center text-xs text-gray-500">
                Used {selectedCard.usage_count} times
                {selectedCard.last_used_at && (
                  <span className="block">Last used: {new Date(selectedCard.last_used_at).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingCard} onOpenChange={() => setEditingCard(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Loyalty Card</DialogTitle>
          </DialogHeader>
          {editingCard && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Store Name</Label>
                <Input
                  value={editingCard.store_name}
                  onChange={(e) => setEditingCard(prev => ({ ...prev, store_name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Points Balance</Label>
                <Input
                  type="number"
                  value={editingCard.points_balance}
                  onChange={(e) => setEditingCard(prev => ({ ...prev, points_balance: parseInt(e.target.value) || 0 }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Notes</Label>
                <Textarea
                  value={editingCard.notes || ''}
                  onChange={(e) => setEditingCard(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm">Share with family</Label>
                <Switch
                  checked={editingCard.shared_with_family}
                  onCheckedChange={(checked) => setEditingCard(prev => ({ ...prev, shared_with_family: checked }))}
                />
              </div>
              
              <Button onClick={() => {
                updateCard(editingCard.id, editingCard);
                setEditingCard(null);
              }} className="w-full">
                Update Card
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoyaltyCardsSettings;
