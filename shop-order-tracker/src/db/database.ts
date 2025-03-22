import Dexie, { Table } from 'dexie';

// Define the Order interface
export interface Order {
  id?: number;
  orderDate: Date;
  products: string;
  buyerName: string;
  platform: string;
  courier: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Define the database class
class OrderDatabase extends Dexie {
  orders!: Table<Order>;

  constructor() {
    super('OrderDatabase');
    this.version(1).stores({
      orders: '++id, orderDate, buyerName, platform, courier, status'
    });
  }

  // Get all orders
  async getAllOrders(): Promise<Order[]> {
    return await this.orders.toArray();
  }

  // Get upcoming orders (orders with dates in the future)
  async getUpcomingOrders(): Promise<Order[]> {
    const now = new Date();
    return await this.orders
      .where('orderDate')
      .above(now)
      .toArray();
  }

  // Get orders by status
  async getOrdersByStatus(status: 'pending' | 'completed' | 'cancelled'): Promise<Order[]> {
    return await this.orders
      .where('status')
      .equals(status)
      .toArray();
  }

  // Add a new order
  async addOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date();
    return await this.orders.add({
      ...order,
      createdAt: now,
      updatedAt: now
    });
  }

  // Update an existing order
  async updateOrder(id: number, orderData: Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>): Promise<number> {
    const now = new Date();
    return await this.orders.update(id, {
      ...orderData,
      updatedAt: now
    });
  }

  // Delete an order
  async deleteOrder(id: number): Promise<void> {
    await this.orders.delete(id);
  }
}

// Create and export a singleton instance
export const db = new OrderDatabase();