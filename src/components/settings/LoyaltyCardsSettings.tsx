
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
import { CreditCard, Plus, Scan, Trash2, Edit, QrCode, Users } from 'lucide-react';
import { useLoyaltyCards } from '@/hooks/use-loyalty-cards';

const LoyaltyCardsSettings: React.FC = () => {
  const { cards, addCard, updateCard, deleteCard, incrementUsage, isLoading } = useLoyaltyCards();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
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

  const handleEditCard = (card: any) => {
    setEditingCard(card);
  };

  const handleUpdateCard = async () => {
    if (!editingCard) return;
    
    await updateCard(editingCard.id, editingCard);
    setEditingCard(null);
  };

  const formatCardNumber = (number: string) => {
    return number.replace(/(.{4})/g, '$1 ').trim();
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
          <h2 className="text-2xl font-bold">Loyalty Cards</h2>
          <p className="text-gray-600">Manage your store loyalty cards and rewards</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-kitchen-green hover:bg-kitchen-green/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Loyalty Card</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleScanBarcode}
                  className="flex items-center gap-2"
                >
                  <Scan className="h-4 w-4" />
                  Scan Barcode
                </Button>
                <Button
                  variant="outline"
                  onClick={handleScanBarcode}
                  className="flex items-center gap-2"
                >
                  <QrCode className="h-4 w-4" />
                  Scan QR Code
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Store Name</Label>
                <Input
                  value={newCard.store_name}
                  onChange={(e) => setNewCard(prev => ({ ...prev, store_name: e.target.value }))}
                  placeholder="Enter store name"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Card Number</Label>
                <Input
                  value={newCard.card_number}
                  onChange={(e) => setNewCard(prev => ({ ...prev, card_number: e.target.value }))}
                  placeholder="Enter card number"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Category</Label>
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
              
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  value={newCard.notes}
                  onChange={(e) => setNewCard(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes about this card"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Auto-scan enabled</Label>
                <Switch
                  checked={newCard.auto_scan_enabled}
                  onCheckedChange={(checked) => setNewCard(prev => ({ ...prev, auto_scan_enabled: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Share with family</Label>
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

      {/* Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-kitchen-green" />
                    <CardTitle className="text-lg">{card.store_name}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEditCard(card)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteCard(card.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Card Number</p>
                  <p className="font-mono text-sm">{formatCardNumber(card.card_number)}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">{card.category}</Badge>
                  {card.shared_with_family && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Family
                    </Badge>
                  )}
                </div>
                
                {card.points_balance > 0 && (
                  <div>
                    <p className="text-sm text-gray-600">Points Balance</p>
                    <p className="font-semibold text-kitchen-green">{card.points_balance.toLocaleString()}</p>
                  </div>
                )}
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Used {card.usage_count} times</span>
                  {card.last_used_at && (
                    <span>Last used: {new Date(card.last_used_at).toLocaleDateString()}</span>
                  )}
                </div>
                
                {card.notes && (
                  <div>
                    <p className="text-xs text-gray-600 line-clamp-2">{card.notes}</p>
                  </div>
                )}
                
                <Button
                  size="sm"
                  onClick={() => incrementUsage(card.id)}
                  className="w-full"
                >
                  Mark as Used
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {cards.length === 0 && (
        <Card className="p-8 text-center">
          <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No loyalty cards yet</h3>
          <p className="text-gray-600 mb-4">Add your first loyalty card to get started</p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Card
          </Button>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingCard} onOpenChange={() => setEditingCard(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Loyalty Card</DialogTitle>
          </DialogHeader>
          {editingCard && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Store Name</Label>
                <Input
                  value={editingCard.store_name}
                  onChange={(e) => setEditingCard(prev => ({ ...prev, store_name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Points Balance</Label>
                <Input
                  type="number"
                  value={editingCard.points_balance}
                  onChange={(e) => setEditingCard(prev => ({ ...prev, points_balance: parseInt(e.target.value) || 0 }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={editingCard.notes || ''}
                  onChange={(e) => setEditingCard(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Auto-scan enabled</Label>
                <Switch
                  checked={editingCard.auto_scan_enabled}
                  onCheckedChange={(checked) => setEditingCard(prev => ({ ...prev, auto_scan_enabled: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Share with family</Label>
                <Switch
                  checked={editingCard.shared_with_family}
                  onCheckedChange={(checked) => setEditingCard(prev => ({ ...prev, shared_with_family: checked }))}
                />
              </div>
              
              <Button onClick={handleUpdateCard} className="w-full">
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
