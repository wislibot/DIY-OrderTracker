import { useState, useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';

/**
 * NetworkStatus component that displays a notification when the user goes offline or comes back online
 */
export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);

  useEffect(() => {
    // Function to handle online status change
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineMessage(true);
      // Auto-hide the online message after 3 seconds
      setTimeout(() => setShowOnlineMessage(false), 3000);
    };

    // Function to handle offline status change
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    // Add event listeners for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle closing the offline message
  const handleCloseOfflineMessage = () => {
    setShowOfflineMessage(false);
  };

  // Handle closing the online message
  const handleCloseOnlineMessage = () => {
    setShowOnlineMessage(false);
  };

  return (
    <>
      {/* Offline notification */}
      <Snackbar
        open={!isOnline && showOfflineMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          icon={<WifiOffIcon />}
          severity="warning" 
          onClose={handleCloseOfflineMessage}
          sx={{ width: '100%' }}
        >
          You are offline. Some features may be limited.
        </Alert>
      </Snackbar>

      {/* Online notification */}
      <Snackbar
        open={isOnline && showOnlineMessage}
        autoHideDuration={3000}
        onClose={handleCloseOnlineMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          icon={<WifiIcon />}
          severity="success" 
          onClose={handleCloseOnlineMessage}
          sx={{ width: '100%' }}
        >
          You are back online!
        </Alert>
      </Snackbar>
    </>
  );
}