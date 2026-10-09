export type ProductCategory = 'minuman' | 'makanan' | 'snack';
export type ProductSubcategory = 'coffee' | 'non-coffee' | 'makanan' | 'snack';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subcategory: ProductSubcategory;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  rating: number;
  isPopular?: boolean;
  badge?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
  subtotal: number;
}

export type OrderType = 'dine-in' | 'takeaway' | 'delivery';

export type PaymentMethod = 'qris' | 'transfer_bca' | 'transfer_mandiri' | 'tunai';

export type PaymentStatus = 'unpaid' | 'pending_approval' | 'approved' | 'rejected';

export type OrderStatus = 
  | 'menunggu_pembayaran'
  | 'menunggu_approval'
  | 'diproses'
  | 'siap_diambil'
  | 'selesai'
  | 'dibatalkan';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  subtotal: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: OrderType;
  tableNumber?: string;
  deliveryAddress?: string;
  notes?: string;
  items: OrderItem[];
  totalQuantity: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentProofUrl?: string;
  paymentProofUploadedAt?: string;
  approvalNotes?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string;
  createdAt: string;
}

export type AdminTab = 
  | 'sales-report' 
  | 'payment-approval' 
  | 'products' 
  | 'orders' 
  | 'customers';
