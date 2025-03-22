
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
