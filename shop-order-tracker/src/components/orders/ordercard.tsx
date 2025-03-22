import { Card, CardContent, Typography, Box, Chip, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Order } from '../../db/database';
import dayjs from 'dayjs';

interface OrderCardProps {
  order: Order;
  onDelete: (id: number) => void;
}

export const OrderCard = ({ order, onDelete }: OrderCardProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    navigate(`/orders/edit/${order.id}`);
    handleClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      onDelete(order.id!);
    }
    handleClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ 
      mb: 2, 
      position: 'relative', 
      width: '100%', 
      overflow: 'hidden',
      '& .MuiCardContent-root:last-child': { 
        pb: { xs: 1.5, sm: 2 } // Reduce bottom padding
      },
      // Adjust card layout based on orientation
      display: 'flex',
      flexDirection: 'column',
      ...(isLandscape && {
        maxWidth: isMobile ? '100%' : '100%',
      })
    }}>
      <CardContent sx={{ 
        p: { xs: 1.5, sm: 2 },
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        ...(isLandscape && {
          flexDirection: isMobile ? 'column' : 'column',
        })
      }}>
        {/* Header row with buyer name, status and menu button */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'row', // Always use row layout for header
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: { xs: 0.5, sm: 1 },
          flexWrap: 'wrap',
          gap: 0.5
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            maxWidth: isMobile ? 'calc(100% - 80px)' : 'auto', // Reserve space for buttons on mobile
            flexGrow: 1
          }}>
            <Typography 
              variant="h6" 
              component="div"
              sx={{ 
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                lineHeight: 1.2,
                textAlign: 'left',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {order.buyerName}
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexShrink: 0, // Prevent shrinking
            position: 'static', // Remove sticky positioning that might cause cutoff
            pr: { xs: 1.5, sm: 2 }, // Increased right padding for better visibility
            width: 'auto', // Ensure proper width
            minWidth: { xs: '90px', sm: '100px' }, // Ensure minimum width for better visibility
            zIndex: 1 // Ensure it's above other elements
          }}>
            <Chip 
              label={order.status.charAt(0).toUpperCase() + order.status.slice(1)} 
              color={getStatusColor(order.status) as "warning" | "success" | "error" | "default"} 
              size="small" 
              sx={{ 
                height: '20px', 
                '& .MuiChip-label': { 
                  px: 1, 
                  fontSize: '0.7rem' 
                }
              }}
            />
            
            <IconButton
              aria-label="more"
              aria-controls="order-menu"
              aria-haspopup="true"
              onClick={handleClick}
              size="medium"
              sx={{ 
                padding: { xs: '8px', sm: '10px' },
                minWidth: { xs: '36px', sm: '40px' }, // Increased minimum width
                height: { xs: '36px', sm: '40px' }, // Increased height
                backgroundColor: 'white', // Changed to white to match card background
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)' // Light gray on hover for feedback
                },
                '&.MuiIconButton-root': { 
                  marginLeft: 'auto'
                }
              }}
            >
              <MoreVertIcon fontSize="medium" />
            </IconButton>
            
            <Menu
              id="order-menu"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
          </Box>
        </Box>
        
        {/* Order date */}
        <Typography 
          color="text.secondary" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            mt: 0,
            mb: 0.5,
            lineHeight: 1.2
          }}
        >
          Order Date: {dayjs(order.orderDate).format('DD MMM YYYY, HH:mm')}
        </Typography>
        
        {/* Products */}
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 0.5, 
            mb: 0.5, 
            wordBreak: 'break-word', 
            overflowWrap: 'break-word',
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            lineHeight: 1.3,
            maxHeight: { xs: '2.6em', sm: 'none' },
            overflow: { xs: 'hidden', sm: 'visible' },
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: { xs: 2, sm: 'none' },
            WebkitBoxOrient: 'vertical'
          }}
        >
          <strong>Products:</strong> {order.products}
        </Typography>
        
        {/* Platform and Courier */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'row', // Always use row for better space usage
          justifyContent: 'space-between', 
          mt: 0.5,
          gap: { xs: 1, sm: 2 },
          flexWrap: 'wrap'
        }}>
          <Typography 
            variant="body2"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              lineHeight: 1.2
            }}
          >
            <strong>Platform:</strong> {order.platform}
          </Typography>
          
          <Typography 
            variant="body2"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              lineHeight: 1.2
            }}
          >
            <strong>Courier:</strong> {order.courier}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};