import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      // Try to find the main scrollable container
      const possibleScrollers = [
        document.querySelector('.layout-main'),
        document.querySelector('.App'),
        document.querySelector('#root'),
        document.body,
        document.documentElement
      ];

      for (const el of possibleScrollers) {
        if (el && el.scrollTop !== undefined) {
          el.scrollTo({ top: 0, behavior: 'auto' });
        }
      }
    };

    setTimeout(scrollToTop, 50); // Slight delay helps on mobile

  }, [pathname]);

  return null;
};

export default ScrollToTop;