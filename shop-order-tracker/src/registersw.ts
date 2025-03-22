// Service worker registration with update handling

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        
        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, notify the user if needed
                console.log('New content is available; please refresh.');
                // You could show a notification to the user here
              }
            });
          }
        });
        
        // Check for updates on page load
        if (registration.waiting) {
          console.log('New service worker waiting to activate');
          // You could show a notification to the user here
        }
        
        // Add periodic update checks
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check for updates every hour
        
      } catch (error) {
        console.error('ServiceWorker registration failed: ', error);
      }
    });
    
    // Handle controller change (when a new service worker takes over)
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload(); // Reload the page when the new service worker takes control
      }
    });
  }
}