
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, MessageCircle, Send, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ShoppingItemData } from './ShoppingItem';

interface ShareListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: ShoppingItemData[];
}

export const ShareListDialog: React.FC<ShareListDialogProps> = ({
  open,
  onOpenChange,
  items
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const generateShoppingListText = () => {
    const uncheckedItems = items.filter(item => !item.isChecked);
    if (uncheckedItems.length === 0) return "Shopping list is empty";

    let text = "🛒 Shopping List\n\n";
    
    // Group by category
    const grouped = uncheckedItems.reduce((acc, item) => {
      const category = item.category || 'General';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {} as Record<string, ShoppingItemData[]>);

    Object.entries(grouped).forEach(([category, categoryItems]) => {
      text += `📁 ${category}\n`;
      categoryItems.forEach(item => {
        text += `• ${item.quantity} ${item.unit} ${item.name}`;
        if (item.note) text += ` (${item.note})`;
        text += '\n';
      });
      text += '\n';
    });

    text += `Total: ${uncheckedItems.length} items`;
    return text;
  };

  const copyToClipboard = async () => {
    const text = generateShoppingListText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Shopping list copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const shareViaWhatsApp = () => {
    const text = generateShoppingListText();
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const shareViaMessenger = () => {
    const text = generateShoppingListText();
    const encodedText = encodeURIComponent(text);
    window.open(`https://m.me/?text=${encodedText}`, '_blank');
  };

  const shareViaNativeShare = async () => {
    const text = generateShoppingListText();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shopping List',
          text: text,
        });
      } catch (error) {
        // User cancelled or error occurred
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 size={20} />
            Share Shopping List
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={shareViaWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle size={18} className="mr-2" />
              WhatsApp
            </Button>
            
            <Button
              onClick={shareViaMessenger}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send size={18} className="mr-2" />
              Messenger
            </Button>
          </div>
          
          <Button
            onClick={shareViaNativeShare}
            variant="outline"
            className="w-full"
          >
            <Share2 size={18} className="mr-2" />
            More Options
          </Button>
          
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="w-full"
          >
            {copied ? (
              <>
                <Check size={18} className="mr-2 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={18} className="mr-2" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <div className="text-xs text-gray-700 max-h-32 overflow-y-auto whitespace-pre-line">
            {generateShoppingListText()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
