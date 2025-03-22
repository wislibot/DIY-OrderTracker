import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

export const AppNavbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleClose();
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ 
        px: { xs: 2, sm: 3 }, // Add horizontal padding that increases with screen size
        '&.MuiToolbar-root': {
          minHeight: { xs: 56 }, // Ensure minimum height on mobile
        }
      }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }} 
          onClick={() => navigate('/')}
        >
          Shop Order Tracker
        </Typography>
        
        {isMobile ? (
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'flex-end',
            width: 'auto',
            mr: 0 // Changed from -1 to 0 to move the button left
          }}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
              sx={{ 
                padding: '8px',
                mr: 1.5 // Increased from 1 to 1.5 to ensure it's not cut off
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleNavigation('/')}>Orders</MenuItem>
              <MenuItem onClick={() => handleNavigation('/stats')}>Statistics</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" onClick={() => navigate('/')}>Orders</Button>
            <Button color="inherit" onClick={() => navigate('/stats')}>Statistics</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};