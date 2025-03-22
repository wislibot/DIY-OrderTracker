import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { db, Order } from '../../db/database';
import { OrderCard } from './OrderCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export const OrderList = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [upcomingOrders, setUpcomingOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all orders
      const allOrders = await db.getAllOrders();
      setOrders(allOrders);
      
      // Fetch upcoming orders (future dates)
      const upcoming = await db.getUpcomingOrders();
      setUpcomingOrders(upcoming);
      
      // Fetch orders by status
      const pending = await db.getOrdersByStatus('pending');
      setPendingOrders(pending);
      
      const completed = await db.getOrdersByStatus('completed');
      setCompletedOrders(completed);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDeleteOrder = async (id: number) => {
    try {
      await db.deleteOrder(id);
      fetchOrders(); // Refresh the orders list
    } catch (err) {
      console.error('Error deleting order:', err);
      setError('Failed to delete order. Please try again.');
    }
  };

  const renderOrderList = (orderList: Order[]) => {
    if (orderList.length === 0) {
      return (
        <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
          No orders found.
        </Typography>
      );
    }

    return orderList.map((order) => (
      <OrderCard key={order.id} order={order} onDelete={handleDeleteOrder} />
    ));
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 2,
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography 
          variant="h5" 
          component="h1"
          sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
        >
          Order Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/orders/new')}
          size="medium"
          sx={{ alignSelf: { xs: 'flex-end', sm: 'auto' } }}
        >
          New Order
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', overflowX: 'auto', maxWidth: '100vw' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="order tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ 
            minHeight: { xs: '42px', sm: '48px' },
            '& .MuiTab-root': { 
              minHeight: { xs: '42px', sm: '48px' },
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }
          }}
        >
          <Tab label="All Orders" />
          <Tab label="Upcoming" />
          <Tab label="Pending" />
          <Tab label="Completed" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
              {renderOrderList(orders)}
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
              {renderOrderList(upcomingOrders)}
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
              {renderOrderList(pendingOrders)}
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
              {renderOrderList(completedOrders)}
            </Box>
          </TabPanel>
        </>
      )}
    </Paper>
  );
};