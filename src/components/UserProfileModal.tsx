
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
import { Mail, User, LogOut, Calendar, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const UserProfileModal = ({ open, onClose }: UserProfileModalProps) => {
  const { user, signOut } = useAuth();
  const [kycStatus, setKycStatus] = React.useState<'not_started' | 'pending' | 'verified'>('not_started');
  
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

  const handleStartKYC = () => {
    // In a real app, this would navigate to a KYC flow or open a KYC modal
    setKycStatus('pending');
    toast.success("KYC verification process started. Please complete the verification steps.");
  };

  const renderKYCStatus = () => {
    switch (kycStatus) {
      case 'not_started':
        return (
          <Button onClick={handleStartKYC} className="w-full mt-4">
            <Shield className="h-4 w-4 mr-2" />
            Start KYC Verification
          </Button>
        );
      case 'pending':
        return (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 p-3 rounded-md flex items-center mt-4">
            <Shield className="h-4 w-4 mr-2" />
            <span className="text-sm">KYC Verification in progress</span>
          </div>
        );
      case 'verified':
        return (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-3 rounded-md flex items-center mt-4">
            <Shield className="h-4 w-4 mr-2" />
            <span className="text-sm">KYC Verified ✓</span>
          </div>
        );
    }
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer">
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
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem onClick={handleStartKYC}>
                <Shield className="mr-2 h-4 w-4" />
                <span>KYC Verification</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">KYC Status: {kycStatus === 'not_started' ? 'Not Started' : kycStatus === 'pending' ? 'In Progress' : 'Verified'}</span>
              </div>
            </CardContent>
          </Card>
          
          {renderKYCStatus()}
          
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
