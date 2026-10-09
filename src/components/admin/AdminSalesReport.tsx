import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Printer, 
  ArrowUpRight,
  Coffee,
  UtensilsCrossed,
  Cookie,
  Award
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatRupiah, formatDate } from '../../utils/formatters';

export const AdminSalesReport: React.FC = () => {
  const { orders, customers, products } = useShop();

  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');

  // Filter orders by time range
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    return orders.filter((o) => {
      // Exclude cancelled orders from revenue
      if (o.orderStatus === 'dibatalkan') return false;

      const orderDate = new Date(o.createdAt);
      if (timeFilter === 'today') {
        return o.createdAt.slice(0, 10) === todayStr;
      }
      if (timeFilter === 'week') {
        const diffTime = Math.abs(now.getTime() - orderDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }
      if (timeFilter === 'month') {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }
      return true;
    });
  }, [orders, timeFilter]);

  // Aggregate Metrics
  const totalRevenue = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  }, [filteredOrders]);

  const completedOrdersCount = useMemo(() => {
    return filteredOrders.filter((o) => o.orderStatus === 'selesai' || o.paymentStatus === 'approved').length;
  }, [filteredOrders]);

  const averageOrderValue = useMemo(() => {
    if (filteredOrders.length === 0) return 0;
    return totalRevenue / filteredOrders.length;
  }, [filteredOrders, totalRevenue]);

  // Top Selling Products Calculation
  const topProducts = useMemo(() => {
    const map: { [prodId: string]: { name: string; quantity: number; revenue: number; category: string } } = {};

    filteredOrders.forEach((o) => {
      o.items.forEach((item) => {
        if (!map[item.productId]) {
          const prodObj = products.find(p => p.id === item.productId);
          map[item.productId] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
            category: prodObj?.category || 'minuman',
          };
        }
        map[item.productId].quantity += item.quantity;
        map[item.productId].revenue += item.subtotal;
      });
    });

    return Object.values(map)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [filteredOrders, products]);

  // Category Revenue Breakdown
  const categoryBreakdown = useMemo(() => {
    let minumanRev = 0;
    let makananRev = 0;
    let snackRev = 0;

    filteredOrders.forEach((o) => {
      o.items.forEach((item) => {
        const prod = products.find(p => p.id === item.productId);
        const cat = prod?.category || 'minuman';
        if (cat === 'minuman') minumanRev += item.subtotal;
        else if (cat === 'makanan') makananRev += item.subtotal;
        else if (cat === 'snack') snackRev += item.subtotal;
      });
    });

    const sum = minumanRev + makananRev + snackRev || 1;
    return {
      minuman: { amount: minumanRev, percent: Math.round((minumanRev / sum) * 100) },
      makanan: { amount: makananRev, percent: Math.round((makananRev / sum) * 100) },
      snack: { amount: snackRev, percent: Math.round((snackRev / sum) * 100) },
    };
  }, [filteredOrders, products]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Laporan Sales & Analisis Omset</h2>
          <p className="text-xs text-stone-400">
            Ringkasan pendapatan toko, performa menu terlaris, dan rincian transaksi
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {/* Time range selector */}
          <div className="flex bg-stone-900 p-1 rounded-2xl border border-stone-800 text-xs font-semibold">
            <button
              onClick={() => setTimeFilter('today')}
              className={`px-3 py-1.5 rounded-xl transition ${
                timeFilter === 'today' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-3 py-1.5 rounded-xl transition ${
                timeFilter === 'week' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-3 py-1.5 rounded-xl transition ${
                timeFilter === 'month' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
              }`}
            >
              Bulan Ini
            </button>
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition ${
                timeFilter === 'all' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
              }`}
            >
              Semua
            </button>
          </div>

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition"
            title="Cetak Laporan"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Omset */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 to-stone-900 border border-amber-900/40 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Total Omset Penjualan
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 font-serif text-2xl font-bold text-white">
            {formatRupiah(totalRevenue)}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Dari {filteredOrders.length} transaksi aktif
          </span>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Volume Pesanan
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 font-serif text-2xl font-bold text-white">
            {filteredOrders.length} Pesanan
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            {completedOrdersCount} pesanan selesai/terverifikasi
          </span>
        </div>

        {/* Average Order Value */}
        <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Rata-rata Transaksi
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 font-serif text-2xl font-bold text-white">
            {formatRupiah(averageOrderValue)}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Per transaksi pelanggan
          </span>
        </div>

        {/* Customer Base */}
        <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Basis Pelanggan
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 font-serif text-2xl font-bold text-white">
            {customers.length} Pelanggan
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Tersimpan di database CRM
          </span>
        </div>

      </div>

      {/* Middle Row: Category Share & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Contribution */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
          <h3 className="font-serif text-base font-bold text-white flex items-center space-x-2">
            <span>Kontribusi Penjualan per Kategori</span>
          </h3>

          <div className="space-y-4 pt-2">
            {/* Minuman */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center space-x-1.5 text-stone-200">
                  <Coffee className="w-3.5 h-3.5 text-amber-400" />
                  <span>Minuman (Coffee & Non-Coffee)</span>
                </span>
                <span className="font-bold text-amber-300">
                  {formatRupiah(categoryBreakdown.minuman.amount)} ({categoryBreakdown.minuman.percent}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-stone-800 overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${categoryBreakdown.minuman.percent}%` }}
                />
              </div>
            </div>

            {/* Makanan */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center space-x-1.5 text-stone-200">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-orange-400" />
                  <span>Makanan Utama</span>
                </span>
                <span className="font-bold text-orange-300">
                  {formatRupiah(categoryBreakdown.makanan.amount)} ({categoryBreakdown.makanan.percent}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-stone-800 overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${categoryBreakdown.makanan.percent}%` }}
                />
              </div>
            </div>

            {/* Snack */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center space-x-1.5 text-stone-200">
                  <Cookie className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Snack & Pastry</span>
                </span>
                <span className="font-bold text-yellow-300">
                  {formatRupiah(categoryBreakdown.snack.amount)} ({categoryBreakdown.snack.percent}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-stone-800 overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                  style={{ width: `${categoryBreakdown.snack.percent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top 5 Best Selling Products */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
          <h3 className="font-serif text-base font-bold text-white flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Top 5 Menu Paling Laris</span>
          </h3>

          <div className="divide-y divide-stone-800">
            {topProducts.length === 0 ? (
              <p className="text-xs text-stone-500 py-6 text-center">
                Belum ada transaksi pada periode ini.
              </p>
            ) : (
              topProducts.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-stone-800 font-bold text-stone-400 flex items-center justify-center text-[11px]">
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-white block">{item.name}</span>
                      <span className="text-[10px] text-stone-400 capitalize">{item.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-300 block">{item.quantity} Terjual</span>
                    <span className="text-[10px] text-stone-400 font-mono">{formatRupiah(item.revenue)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Transaction History Breakdown Table */}
      <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl p-6 space-y-4">
        <h3 className="font-serif text-base font-bold text-white">
          Rincian Transaksi Penjualan ({filteredOrders.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950/70 border-b border-stone-800 text-[11px] uppercase tracking-wider text-stone-400">
              <tr>
                <th className="py-3 px-4">Tanggal & Jam</th>
                <th className="py-3 px-4">No. Transaksi</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Metode Bayar</th>
                <th className="py-3 px-4">Item Dipesan</th>
                <th className="py-3 px-4 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-stone-500">
                    Tidak ada transaksi pada filter periode ini.
                  </td>
                </tr>
              ) : (
                filteredOrders.slice(0, 10).map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-800/40 transition">
                    <td className="py-3 px-4 text-stone-400 text-[11px]">
                      {formatDate(ord.createdAt)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-300">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {ord.customerName}
                    </td>
                    <td className="py-3 px-4 text-stone-300 capitalize">
                      {ord.paymentMethod.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 text-stone-400 max-w-xs truncate">
                      {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-300">
                      {formatRupiah(ord.totalAmount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
