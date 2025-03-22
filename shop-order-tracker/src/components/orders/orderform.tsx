import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { db, Order } from '../../db/database';

type OrderFormData = {
  orderDate: Dayjs | null;
  products: string;
  buyerName: string;
  platform: string;
  courier: string;
  status: 'pending' | 'completed' | 'cancelled';
};

type FormErrors = {
  [key in keyof OrderFormData]?: string;
};

export const OrderForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = id !== undefined;

  const [formData, setFormData] = useState<OrderFormData>({
    orderDate: dayjs(),
    products: '',
    buyerName: '',
    platform: '',
    courier: '',
    status: 'pending',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (isEditMode && id) {
        try {
          setLoading(true);
          const orders = await db.orders.where('id').equals(parseInt(id)).toArray();
          
          if (orders.length > 0) {
            const order = orders[0];
            setFormData({
              orderDate: dayjs(order.orderDate),
              products: order.products,
              buyerName: order.buyerName,
              platform: order.platform,
              courier: order.courier,
              status: order.status,
            });
          } else {
            setError('Order not found');
            setTimeout(() => navigate('/'), 2000);
          }
        } catch (err) {
          console.error('Error fetching order:', err);
          setError('Failed to load order details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [id, isEditMode, navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.orderDate) {
      newErrors.orderDate = 'Order date is required';
    }
    
    if (!formData.products.trim()) {
      newErrors.products = 'Products are required';
    }
    
    if (!formData.buyerName.trim()) {
      newErrors.buyerName = 'Buyer name is required';
    }
    
    if (!formData.platform.trim()) {
      newErrors.platform = 'Platform is required';
    }
    
    if (!formData.courier.trim()) {
      newErrors.courier = 'Courier is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
        orderDate: formData.orderDate!.toDate(),
        products: formData.products,
        buyerName: formData.buyerName,
        platform: formData.platform,
        courier: formData.courier,
        status: formData.status,
      };
      
      if (isEditMode && id) {
        await db.updateOrder(parseInt(id), orderData);
        setSuccess('Order updated successfully');
      } else {
        await db.addOrder(orderData);
        setSuccess('Order added successfully');
      }
      
      // Redirect after a short delay
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error('Error saving order:', err);
      setError('Failed to save order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof OrderFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  if (loading && isEditMode) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
      <Typography 
        variant="h5" 
        component="h1" 
        gutterBottom
        sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
      >
        {isEditMode ? 'Edit Order' : 'New Order'}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="Order Date and Time"
                value={formData.orderDate}
                onChange={(newValue) => handleChange('orderDate', newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                    error: !!errors.orderDate,
                    helperText: errors.orderDate,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" error={!!errors.status}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Buyer Name"
                value={formData.buyerName}
                onChange={(e) => handleChange('buyerName', e.target.value)}
                margin="normal"
                error={!!errors.buyerName}
                helperText={errors.buyerName}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Products"
                value={formData.products}
                onChange={(e) => handleChange('products', e.target.value)}
                margin="normal"
                multiline
                rows={3}
                error={!!errors.products}
                helperText={errors.products}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Platform (e.g., Tokopedia, Shopee)"
                value={formData.platform}
                onChange={(e) => handleChange('platform', e.target.value)}
                margin="normal"
                error={!!errors.platform}
                helperText={errors.platform}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Courier (e.g., JNE, J&T, SiCepat)"
                value={formData.courier}
                onChange={(e) => handleChange('courier', e.target.value)}
                margin="normal"
                error={!!errors.courier}
                helperText={errors.courier}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 1.5 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                disabled={loading}
                fullWidth
                sx={{ order: { xs: 2, sm: 1 } }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
                sx={{ order: { xs: 1, sm: 2 } }}
              >
                {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Update Order' : 'Add Order')}
              </Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Box>
    </Paper>
  );
};