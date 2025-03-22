
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import MobileBottomNav from '@/components/navbar/MobileBottomNav';
import { useIsMobile } from '@/hooks/use-mobile';

const MainLayout = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className={`flex-grow ${isMobile ? 'pb-16' : ''}`}>
        <Outlet />
      </div>
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default MainLayout;
