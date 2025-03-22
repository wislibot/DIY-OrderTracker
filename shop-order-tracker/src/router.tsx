import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { OrderList } from './components/orders/OrderList';
import { OrderForm } from './components/orders/OrderForm';
import { useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { Statistics } from './components/statistics/Statistics';

// Create the router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout><OrderList /></AppLayout>,
  },
  {
    path: '/orders/new',
    element: <AppLayout><OrderForm /></AppLayout>,
  },
  {
    path: '/orders/edit/:id',
    element: <AppLayout><OrderForm /></AppLayout>,
  },
  {
    path: '/stats',
    element: <AppLayout><Statistics /></AppLayout>,
  },
]);

// Router provider component
export const Router = () => {
  // Effect to handle screen size detection and responsive adjustments
  useEffect(() => {
    // Function to handle resize events
    const handleResize = () => {
      // Set CSS custom properties based on viewport size
      document.documentElement.style.setProperty('--viewport-width', `${window.innerWidth}px`);
      document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
      
      // Add device type classes for more specific styling
      const root = document.documentElement;
      
      // Remove existing device classes
      root.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
      
      // Add appropriate device class based on width
      if (window.innerWidth < 600) {
        root.classList.add('device-mobile');
      } else if (window.innerWidth < 960) {
        root.classList.add('device-tablet');
      } else {
        root.classList.add('device-desktop');
      }
    };

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <RouterProvider router={router} />;
};