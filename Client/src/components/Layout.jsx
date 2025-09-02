import React from 'react';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom'; // Outlet ko import karein
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

const Layout = () => {
  const location = useLocation();

  // Pages jahan footer hide karna hai
  const pathsWithoutFooter = ['/auth'];
  const isAdminRoute = location.pathname.startsWith('/admin');
  const showFooter = !pathsWithoutFooter.includes(location.pathname) && !isAdminRoute;

  return (
    <>
      <Navbar />
      <ScrollToTop />
      
      {/* Outlet yahan render hoga, jo aapke current route ka component dikhayega */}
      <Outlet /> 
      
      {showFooter && <Footer />}
    </>
  );
};

export default Layout;