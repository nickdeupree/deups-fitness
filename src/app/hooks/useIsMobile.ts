"use client";

import { useState, useEffect } from 'react';

/**
 * Custom hook that determines if the current window width is considered mobile.
 *
 * @returns {boolean} `true` if the window width is less than 640 pixels, otherwise `false`.
 */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;