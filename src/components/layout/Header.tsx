
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { useNotifications } from '@/hooks/use-notifications';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { motion } from 'framer-motion';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export function Header({ title = "Kitchen Assistant", showBackButton = false }: HeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      // Error handling is done in the auth hook
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm border-b border-gray-200 px-4 py-3"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-3"
            >
              ←
            </Button>
          )}
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* Notifications Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate('/notifications')}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAuthDialog(true)}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </motion.header>
  );
}
