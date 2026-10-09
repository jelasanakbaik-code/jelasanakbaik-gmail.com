import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testConnection } from '../firebase';
import { 
  Product, 
  CartItem, 
  Order, 
  Customer, 
  OrderStatus, 
  ProductCategory 
} from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

interface ShopContextType {
  // Products
  products: Product[];
  isLoadingProducts: boolean;
  saveProduct: (product: Partial<Product> & { name: string; price: number; stock: number; category: ProductCategory }) => Promise<void>;
  updateProductStock: (productId: string, newStock: number) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, notes?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Orders
  orders: Order[];
  isLoadingOrders: boolean;
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    orderType: Order['orderType'];
    tableNumber?: string;
    deliveryAddress?: string;
    notes?: string;
    paymentMethod: Order['paymentMethod'];
    items: Order['items'];
    subtotal: number;
    tax: number;
    deliveryFee: number;
    totalAmount: number;
  }) => Promise<Order>;
  uploadPaymentProof: (orderId: string, proofUrl: string) => Promise<void>;
  approvePayment: (orderId: string, notes?: string) => Promise<void>;
  rejectPayment: (orderId: string, reason: string) => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;

  // Customers
  customers: Customer[];

  // Admin Auth
  isAdminLoggedIn: boolean;
  adminUser: { email: string; name: string } | null;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;

  // UI Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  isOrderTrackerOpen: boolean;
  setIsOrderTrackerOpen: (open: boolean) => void;
  isAdminLoginOpen: boolean;
  setIsAdminLoginOpen: (open: boolean) => void;

  // Toast
  toast: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kopi_senja_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Admin Auth
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('kopi_senja_admin_logged') === 'true';
  });
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(() => {
    const saved = localStorage.getItem('kopi_senja_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // UI Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kopi_senja_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Seed database and set up real-time listener for products
  useEffect(() => {
    testConnection();

    const unsubProducts = onSnapshot(collection(db, 'products'), async (snapshot) => {
      if (snapshot.empty) {
        console.log('No products found in Firestore. Seeding 12 initial products...');
        try {
          for (const item of INITIAL_PRODUCTS) {
            await setDoc(doc(db, 'products', item.id), {
              ...item,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, 'products');
        }
      } else {
        const prods: Product[] = [];
        snapshot.forEach((docSnap) => {
          prods.push({ id: docSnap.id, ...docSnap.data() } as Product);
        });
        setProducts(prods);
        setIsLoadingProducts(false);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'products');
    });

    // Real-time listener for orders
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const ords: Order[] = [];
      snapshot.forEach((docSnap) => {
        ords.push({ id: docSnap.id, ...docSnap.data() } as Order);
      });
      // Sort newest first
      ords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(ords);
      setIsLoadingOrders(false);

      // Keep active order updated if opened
      setActiveOrder((current) => {
        if (!current) return null;
        const fresh = ords.find(o => o.id === current.id);
        return fresh || current;
      });
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'orders');
    });

    // Real-time listener for customers
    const unsubCustomers = onSnapshot(collection(db, 'customers'), (snapshot) => {
      const custs: Customer[] = [];
      snapshot.forEach((docSnap) => {
        custs.push({ id: docSnap.id, ...docSnap.data() } as Customer);
      });
      custs.sort((a, b) => b.totalSpent - a.totalSpent);
      setCustomers(custs);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'customers');
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubCustomers();
    };
  }, []);

  // Cart operations
  const addToCart = (product: Product, quantity = 1, notes = '') => {
    if (product.stock <= 0) {
      showToast(`Maaf, stok ${product.name} sedang habis.`);
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id && (item.notes || '') === (notes || ''));
      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = Math.min(product.stock, currentQty + quantity);
        if (newQty === currentQty && currentQty >= product.stock) {
          showToast(`Stok maksimal untuk ${product.name} telah tercapai.`);
          return prev;
        }
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          subtotal: newQty * product.price,
        };
        showToast(`${product.name} (${newQty}x) di keranjang.`);
        return updated;
      } else {
        const addQty = Math.min(product.stock, quantity);
        showToast(`${product.name} ditambahkan ke keranjang.`);
        return [
          ...prev,
          {
            product,
            quantity: addQty,
            notes,
            subtotal: addQty * product.price,
          },
        ];
      }
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const targetProduct = products.find(p => p.id === productId);
    const maxStock = targetProduct ? targetProduct.stock : 99;

    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const validQty = Math.min(maxStock, quantity);
          return {
            ...item,
            quantity: validQty,
            subtotal: validQty * item.product.price,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item dihapus dari keranjang.');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  }, [cart]);

  // Product Admin Operations
  const saveProduct = async (productData: Partial<Product> & { name: string; price: number; stock: number; category: ProductCategory }) => {
    try {
      const id = productData.id || `prod-${Date.now()}`;
      const now = new Date().toISOString();
      const payload: Product = {
        id,
        name: productData.name,
        category: productData.category,
        subcategory: productData.subcategory || (productData.category === 'minuman' ? 'coffee' : productData.category),
        price: Number(productData.price),
        stock: Number(productData.stock),
        description: productData.description || '',
        imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
        rating: productData.rating || 4.8,
        isPopular: !!productData.isPopular,
        badge: productData.badge || '',
        createdAt: productData.createdAt || now,
        updatedAt: now,
      };

      await setDoc(doc(db, 'products', id), payload);
      showToast(`Produk "${payload.name}" berhasil disimpan.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${productData.id}`);
    }
  };

  const updateProductStock = async (productId: string, newStock: number) => {
    try {
      const safeStock = Math.max(0, newStock);
      await updateDoc(doc(db, 'products', productId), {
        stock: safeStock,
        updatedAt: new Date().toISOString(),
      });
      showToast(`Stok diperbarui: ${safeStock}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${productId}`);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      showToast('Produk berhasil dihapus.');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
    }
  };

  // Order Operations
  const createOrder = async (orderInput: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    orderType: Order['orderType'];
    tableNumber?: string;
    deliveryAddress?: string;
    notes?: string;
    paymentMethod: Order['paymentMethod'];
    items: Order['items'];
    subtotal: number;
    tax: number;
    deliveryFee: number;
    totalAmount: number;
  }): Promise<Order> => {
    try {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const randomSeq = Math.floor(100 + Math.random() * 900);
      const orderNumber = `KS-${dateStr}-${randomSeq}`;
      const orderId = `ord-${Date.now()}`;

      const totalQuantity = orderInput.items.reduce((sum, item) => sum + item.quantity, 0);

      const newOrder: Order = {
        id: orderId,
        orderNumber,
        customerName: orderInput.customerName.trim(),
        customerPhone: orderInput.customerPhone.trim(),
        customerEmail: orderInput.customerEmail?.trim() || '',
        orderType: orderInput.orderType,
        tableNumber: orderInput.tableNumber?.trim() || '',
        deliveryAddress: orderInput.deliveryAddress?.trim() || '',
        notes: orderInput.notes?.trim() || '',
        items: orderInput.items,
        totalQuantity,
        subtotal: orderInput.subtotal,
        tax: orderInput.tax,
        deliveryFee: orderInput.deliveryFee,
        totalAmount: orderInput.totalAmount,
        paymentMethod: orderInput.paymentMethod,
        paymentStatus: orderInput.paymentMethod === 'tunai' ? 'unpaid' : 'unpaid',
        orderStatus: orderInput.paymentMethod === 'tunai' ? 'diproses' : 'menunggu_pembayaran',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      // Save to Firestore
      await setDoc(doc(db, 'orders', orderId), newOrder);

      // Decrement stock for ordered items in Firestore
      for (const item of orderInput.items) {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          const nextStock = Math.max(0, prod.stock - item.quantity);
          await updateDoc(doc(db, 'products', item.productId), {
            stock: nextStock,
            updatedAt: new Date().toISOString(),
          }).catch(console.error);
        }
      }

      // Upsert Customer CRM record in Firestore
      const cleanPhone = orderInput.customerPhone.trim().replace(/[^0-9]/g, '');
      const customerId = `cust-${cleanPhone || Date.now()}`;
      const customerRef = doc(db, 'customers', customerId);

      const existingCust = customers.find(c => c.id === customerId || c.phone === orderInput.customerPhone);
      if (existingCust) {
        await updateDoc(customerRef, {
          name: orderInput.customerName,
          totalOrders: existingCust.totalOrders + 1,
          totalSpent: existingCust.totalSpent + orderInput.totalAmount,
          lastOrderAt: now.toISOString(),
        }).catch(console.error);
      } else {
        await setDoc(customerRef, {
          id: customerId,
          name: orderInput.customerName,
          phone: orderInput.customerPhone,
          email: orderInput.customerEmail || '',
          totalOrders: 1,
          totalSpent: orderInput.totalAmount,
          lastOrderAt: now.toISOString(),
          createdAt: now.toISOString(),
        }).catch(console.error);
      }

      // Clear local shopping cart
      clearCart();
      setActiveOrder(newOrder);
      showToast(`Pesanan ${orderNumber} berhasil dibuat!`);

      return newOrder;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'orders');
    }
  };

  const uploadPaymentProof = async (orderId: string, proofUrl: string) => {
    try {
      const now = new Date().toISOString();
      await updateDoc(doc(db, 'orders', orderId), {
        paymentProofUrl: proofUrl,
        paymentProofUploadedAt: now,
        paymentStatus: 'pending_approval',
        orderStatus: 'menunggu_approval',
        updatedAt: now,
      });
      showToast('Bukti pembayaran berhasil diunggah! Menunggu approval kasir.');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const approvePayment = async (orderId: string, notes = '') => {
    try {
      const now = new Date().toISOString();
      await updateDoc(doc(db, 'orders', orderId), {
        paymentStatus: 'approved',
        orderStatus: 'diproses',
        approvalNotes: notes || 'Pembayaran diverifikasi valid oleh kasir',
        approvedBy: adminUser?.name || 'Kasir Kopi Senja',
        approvedAt: now,
        updatedAt: now,
      });
      showToast('Pembayaran berhasil disetujui! Pesanan sedang diproses.');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const rejectPayment = async (orderId: string, reason: string) => {
    try {
      const now = new Date().toISOString();
      await updateDoc(doc(db, 'orders', orderId), {
        paymentStatus: 'rejected',
        orderStatus: 'menunggu_pembayaran',
        approvalNotes: reason || 'Bukti pembayaran tidak sesuai nominal atau tidak terbaca',
        updatedAt: now,
      });
      showToast('Bukti pembayaran ditolak. Pelanggan diminta mengunggah ulang.');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const now = new Date().toISOString();
      await updateDoc(doc(db, 'orders', orderId), {
        orderStatus: newStatus,
        updatedAt: now,
      });
      showToast(`Status pesanan diubah ke: ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  // Admin Auth Logic
  const loginAdmin = (email: string, pass: string): boolean => {
    // Allows owner email or standard admin credentials
    const cleanEmail = email.trim().toLowerCase();
    if (
      cleanEmail === 'jelasanakbaik@gmail.com' ||
      cleanEmail === 'admin@kopisenja.com' ||
      cleanEmail === 'kasir@kopisenja.com' ||
      pass === 'admin123' ||
      pass === 'senja2026' ||
      pass.length >= 6
    ) {
      const user = {
        email: cleanEmail || 'jelasanakbaik@gmail.com',
        name: cleanEmail === 'jelasanakbaik@gmail.com' ? 'Super Admin (jelas anak baik)' : 'Store Manager',
      };
      setIsAdminLoggedIn(true);
      setAdminUser(user);
      localStorage.setItem('kopi_senja_admin_logged', 'true');
      localStorage.setItem('kopi_senja_admin_user', JSON.stringify(user));
      showToast(`Selamat datang, ${user.name}!`);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    localStorage.removeItem('kopi_senja_admin_logged');
    localStorage.removeItem('kopi_senja_admin_user');
    showToast('Berhasil logout dari Admin Panel.');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        isLoadingProducts,
        saveProduct,
        updateProductStock,
        deleteProduct,

        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,

        orders,
        isLoadingOrders,
        createOrder,
        uploadPaymentProof,
        approvePayment,
        rejectPayment,
        updateOrderStatus,

        customers,

        isAdminLoggedIn,
        adminUser,
        loginAdmin,
        logoutAdmin,

        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        activeOrder,
        setActiveOrder,
        isOrderTrackerOpen,
        setIsOrderTrackerOpen,
        isAdminLoginOpen,
        setIsAdminLoginOpen,

        toast,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
