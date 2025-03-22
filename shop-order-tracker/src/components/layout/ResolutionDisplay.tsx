import { Box, Typography, Chip } from '@mui/material';
import { useEffect, useState } from 'react';

/**
 * Component that displays the current screen resolution in the top-left corner
 * and updates when the window is resized.
 */
export const ResolutionDisplay = () => {
  const [resolution, setResolution] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    deviceType: getDeviceType(window.innerWidth)
  });

  // Function to determine device type based on width
  function getDeviceType(width: number): string {
    if (width < 600) return 'mobile';
    if (width < 960) return 'tablet';
    return 'desktop';
  }

  useEffect(() => {
    // Function to update resolution state
    const updateResolution = () => {
      setResolution({
        width: window.innerWidth,
        height: window.innerHeight,
        deviceType: getDeviceType(window.innerWidth)
      });
    };

    // Add event listener for resize events
    window.addEventListener('resize', updateResolution);

    // Cleanup function to remove event listener
    return () => window.removeEventListener('resize', updateResolution);
  }, []);

  // Get color for device type chip
  const getDeviceColor = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return 'primary';
      case 'tablet': return 'secondary';
      case 'desktop': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '5px',
        left: '5px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 10000,
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.8)'
        }
      }}
    >
      <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
        {resolution.width} × {resolution.height}
      </Typography>
      <Chip 
        label={resolution.deviceType}
        color={getDeviceColor(resolution.deviceType) as "primary" | "secondary" | "success" | "default"}
        size="small"
        sx={{ height: '20px', '& .MuiChip-label': { fontSize: '10px', padding: '0 6px' } }}
      />
    </Box>
  );
};