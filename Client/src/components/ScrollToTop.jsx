import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // `useLocation` se humein current URL ka path milta hai
  const { pathname } = useLocation();

  // Jab bhi 'pathname' badlega, yeh effect chalega
  useEffect(() => {
    // Page ko top (0, 0) par scroll kar do
    window.scrollTo(0, 0);
  }, [pathname]); // Dependency array mein pathname daalne se yeh sirf URL change par chalta hai

  return null; // Yeh component UI mein kuch bhi render nahi karta
};

export default ScrollToTop;