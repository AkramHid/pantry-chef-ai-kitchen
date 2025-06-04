
import React from 'react';
import { WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OfflineIndicatorProps {
  isOnline: boolean;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <Badge variant="destructive" className="fixed top-4 right-4 z-50 flex items-center gap-1">
      <WifiOff size={12} />
      Offline
    </Badge>
  );
};

export default OfflineIndicator;
