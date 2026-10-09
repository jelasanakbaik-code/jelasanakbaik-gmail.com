import React, { useState } from 'react';
import { 
  BarChart3, 
  FileCheck2, 
  Package, 
  ClipboardList, 
  Users, 
  LogOut, 
  Store, 
  Coffee,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { AdminTab } from '../../types';
import { AdminSalesReport } from './AdminSalesReport';
import { AdminPaymentApproval } from './AdminPaymentApproval';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminCustomers } from './AdminCustomers';

interface AdminLayoutProps {
  onBackToStore: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToStore }) => {
  const { 
    adminUser, 
    logoutAdmin, 
    orders 
  } = useShop();

  const [activeTab, setActiveTab] = useState<AdminTab>('sales-report');

  // Count pending approvals
  const pendingApprovalsCount = orders.filter(
    (o) => o.paymentStatus === 'pending_approval' || (o.paymentProofUrl && o.paymentStatus === 'unpaid')
  ).length;

  const handleLogout = () => {
    logoutAdmin();
    onBackToStore();
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      
      {/* Admin Top Header */}
      <header className="bg-stone-900 border-b border-stone-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand title */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-stone-950 flex items-center justify-center font-bold">
                <Coffee className="w-5 h-5 text-stone-950" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-serif text-base sm:text-lg font-bold text-white tracking-tight">
                    Admin Kopi Senja
                  </h1>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    Online (Firestore Sync)
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Login: <span className="text-amber-300 font-medium">{adminUser?.email || 'admin@kopisenja.com'}</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onBackToStore}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition"
              >
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Lihat Web Toko</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-800/60 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex overflow-x-auto space-x-2 py-2.5 border-t border-stone-800/80 no-scrollbar">
            
            <button
              onClick={() => setActiveTab('sales-report')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === 'sales-report'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-stone-800/60 text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Laporan Sales</span>
            </button>

            <button
              onClick={() => setActiveTab('payment-approval')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition relative ${
                activeTab === 'payment-approval'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-stone-800/60 text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Approval Pembayaran</span>
              {pendingApprovalsCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 animate-pulse">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === 'products'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-stone-800/60 text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Produk & Stok</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === 'orders'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-stone-800/60 text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Pesanan & Riwayat</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === 'customers'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-stone-800/60 text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Data Pelanggan</span>
            </button>

          </div>
        </div>
      </header>

      {/* Main Admin Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'sales-report' && <AdminSalesReport />}
        {activeTab === 'payment-approval' && <AdminPaymentApproval />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'customers' && <AdminCustomers />}
      </main>

    </div>
  );
};
