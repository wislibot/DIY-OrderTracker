import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ReactNode } from 'react';
import { AppNavbar } from './AppNavbar';
import { ResolutionDisplay } from './ResolutionDisplay';
import { NetworkStatus } from './NetworkStatus';

interface AppLayoutProps {
  children: ReactNode;
}

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ResolutionDisplay />
      <NetworkStatus />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        // Add safe area insets for notched devices
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingTop: 'env(safe-area-inset-top, 0px)'
      }}>
        <AppNavbar />
        <Container component="main" sx={{ 
          flexGrow: 1, 
          py: { xs: 2, sm: 3 }, 
          px: { xs: 2, sm: 3, md: 4 },
          maxWidth: { xs: '95%', sm: '90%', md: '85%', lg: '1200px' },
          overflowX: 'hidden',
          mx: 'auto',
          // Improve spacing on different devices
          '& > *': {
            mb: { xs: 2, sm: 3, md: 4 }
          }
        }}>
          {children}
        </Container>
      </Box>
    </ThemeProvider>
  );
};