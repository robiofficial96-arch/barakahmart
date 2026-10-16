import path from 'path';
import fs from 'fs';

export interface Order {
  id: number;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  package_name: string;
  package_qty: number;
  package_price: number;
  delivery_area: string;
  delivery_charge: number;
  total_amount: number;
  order_type: string;
  status: string;
  notes: string;
  created_at: string;
}

const dataDir = path.join(process.cwd(), 'data');
const jsonPath = path.join(dataDir, 'orders.json');

function ensureFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(jsonPath)) {
    fs.writeFileSync(jsonPath, JSON.stringify([], null, 2), 'utf-8');
  }
}

export function getOrders(): Order[] {
  ensureFile();
  try {
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const orders: Order[] = JSON.parse(raw);
    return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (err) {
    console.error('Error reading orders:', err);
    return [];
  }
}

export function createOrder(data: {
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  package_name: string;
  package_qty: number;
  package_price: number;
  delivery_area: string;
  delivery_charge: number;
  total_amount: number;
  order_type?: string;
  status?: string;
  notes?: string;
}): Order {
  ensureFile();
  const orders = getOrders();
  const newOrder: Order = {
    id: orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1,
    order_id: data.order_id,
    customer_name: data.customer_name,
    customer_phone: data.customer_phone,
    customer_address: data.customer_address,
    package_name: data.package_name,
    package_qty: data.package_qty,
    package_price: data.package_price,
    delivery_area: data.delivery_area,
    delivery_charge: data.delivery_charge,
    total_amount: data.total_amount,
    order_type: data.order_type || 'form',
    status: data.status || 'pending',
    notes: data.notes || '',
    created_at: new Date().toISOString()
  };

  orders.unshift(newOrder);
  fs.writeFileSync(jsonPath, JSON.stringify(orders, null, 2), 'utf-8');
  return newOrder;
}

export function updateOrderStatus(orderId: string, status: string): boolean {
  ensureFile();
  const orders = getOrders();
  const index = orders.findIndex((o) => o.order_id === orderId);
  if (index === -1) return false;
  orders[index].status = status;
  fs.writeFileSync(jsonPath, JSON.stringify(orders, null, 2), 'utf-8');
  return true;
}

export default {
  getOrders,
  createOrder,
  updateOrderStatus
};
