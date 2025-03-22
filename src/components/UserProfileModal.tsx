
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/auth';
import { Button } from './ui/button';
import { Mail, User, LogOut, Calendar } from 'lucide-react';

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const UserProfileModal = ({ open, onClose }: UserProfileModalProps) => {
  const { user, signOut } = useAuth();
  
  if (!user) return null;
  
  // Get initials from email for the avatar fallback
  const getInitials = () => {
    const email = user.email || '';
    return email.substring(0, 2).toUpperCase();
  };
  
  // Format the date string
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            Your account details and information
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-4">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="text-xl bg-primary text-primary-foreground">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-2xl font-bold">
            {user.user_metadata?.full_name || user.email?.split('@')[0]}
          </h2>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">User ID: {user.id.substring(0, 8)}...</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Member since: {formatDate(user.created_at)}</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button 
              variant="destructive" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
