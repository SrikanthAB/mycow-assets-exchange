
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/navbar/MobileBottomNav';
import { useIsMobile } from '@/hooks/use-mobile';

const HomeLayout = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className={`flex-grow ${isMobile ? 'pb-16' : ''}`}>
        <Outlet />
      </div>
      {isMobile ? <MobileBottomNav /> : <Footer />}
    </div>
  );
};

export default HomeLayout;
