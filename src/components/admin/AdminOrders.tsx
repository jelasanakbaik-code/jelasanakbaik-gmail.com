import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  MapPin, 
  Coffee, 
  ShoppingBag, 
  Truck,
  CheckCircle2,
  XCircle,
  X,
  Phone
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Order, OrderStatus } from '../../types';
import { 
  formatRupiah, 
  formatDate, 
  getOrderStatusInfo, 
  getPaymentStatusInfo,
  getPaymentMethodLabel 
} from '../../utils/formatters';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, showToast } = useShop();

  const [statusFilter, setStatusFilter] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'semua' || o.orderStatus === statusFilter;
    const cleanSearch = searchQuery.toLowerCase();
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(cleanSearch) ||
      o.customerName.toLowerCase().includes(cleanSearch) ||
      o.customerPhone.includes(cleanSearch);
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, orderStatus: newStatus } : null);
      }
    } catch (err: any) {
      showToast('Gagal mengubah status: ' + err.message);
    }
  };

  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'menunggu_pembayaran', label: 'Menunggu Pembayaran' },
    { value: 'menunggu_approval', label: 'Menunggu Approval Bukti' },
    { value: 'diproses', label: 'Sedang Diproses Dapur' },
    { value: 'siap_diambil', label: 'Siap Diambil / Diantar' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'dibatalkan', label: 'Dibatalkan' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Data Pesanan & Riwayat Transaksi</h2>
          <p className="text-xs text-stone-400">
            Total {orders.length} pesanan tercatat dari pelanggan
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-stone-900 p-4 rounded-2xl border border-stone-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setStatusFilter('semua')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === 'semua'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            Semua ({orders.length})
          </button>
          {statusOptions.map((opt) => {
            const count = orders.filter(o => o.orderStatus === opt.value).length;
            return (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1 ${
                  statusFilter === opt.value
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                <span>{opt.label}</span>
                {count > 0 && <span className="opacity-80">({count})</span>}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode pesanan / nama..."
            className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl pl-9 pr-3 py-2 border border-stone-700 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950/70 border-b border-stone-800 text-[11px] uppercase tracking-wider text-stone-400">
              <tr>
                <th className="p-4">Kode Pesanan</th>
                <th className="p-4">Pelanggan</th>
                <th className="p-4">Tipe & Lokasi</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status Pesanan</th>
                <th className="p-4">Status Bayar</th>
                <th className="p-4 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-500">
                    Tidak ada pesanan pada filter ini.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = getOrderStatusInfo(order.orderStatus);
                  const payInfo = getPaymentStatusInfo(order.paymentStatus);

                  return (
                    <tr key={order.id} className="hover:bg-stone-800/40 transition">
                      
                      {/* Order Code & Date */}
                      <td className="p-4 font-mono">
                        <span className="font-bold text-amber-300 block">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] text-stone-500 font-sans">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="p-4">
                        <span className="font-bold text-white block">
                          {order.customerName}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {order.customerPhone}
                        </span>
                      </td>

                      {/* Order Type */}
                      <td className="p-4">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-stone-800 text-stone-300 text-[11px] font-semibold">
                          {order.orderType === 'dine-in' && <Coffee className="w-3 h-3 text-amber-400" />}
                          {order.orderType === 'takeaway' && <ShoppingBag className="w-3 h-3 text-amber-400" />}
                          {order.orderType === 'delivery' && <Truck className="w-3 h-3 text-amber-400" />}
                          <span className="capitalize">{order.orderType}</span>
                        </span>
                        {order.tableNumber && (
                          <span className="block text-[10px] text-stone-400 mt-0.5">
                            Meja: {order.tableNumber}
                          </span>
                        )}
                        {order.deliveryAddress && (
                          <span className="block text-[10px] text-stone-400 mt-0.5 max-w-[160px] truncate">
                            {order.deliveryAddress}
                          </span>
                        )}
                      </td>

                      {/* Total Amount */}
                      <td className="p-4">
                        <span className="font-mono font-bold text-amber-300 text-sm block">
                          {formatRupiah(order.totalAmount)}
                        </span>
                        <span className="text-[10px] text-stone-500">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} item
                        </span>
                      </td>

                      {/* Order Status with Quick Change */}
                      <td className="p-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className={`text-[11px] font-bold rounded-xl px-2.5 py-1 border focus:outline-none cursor-pointer ${statusInfo.color}`}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-stone-900 text-white font-normal">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Payment Status */}
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${payInfo.color}`}>
                          {payInfo.label}
                        </span>
                        <span className="block text-[10px] text-stone-400 mt-1 uppercase">
                          {order.paymentMethod.replace('_', ' ')}
                        </span>
                      </td>

                      {/* View Action */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
                          title="Lihat Detail Pesanan"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl text-stone-100 overflow-hidden my-6">
            
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Detail Pesanan #{selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-stone-400">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Customer info card */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-400">Nama Pelanggan:</span>
                  <span className="font-bold text-white">{selectedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Nomor Telepon:</span>
                  <a 
                    href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-emerald-400 hover:underline flex items-center space-x-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{selectedOrder.customerPhone}</span>
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Tipe Pesanan:</span>
                  <span className="font-semibold text-amber-300 capitalize">
                    {selectedOrder.orderType}
                    {selectedOrder.tableNumber && ` (Meja: ${selectedOrder.tableNumber})`}
                  </span>
                </div>
                {selectedOrder.deliveryAddress && (
                  <div className="flex justify-between">
                    <span className="text-stone-400">Alamat:</span>
                    <span className="font-normal text-stone-200 text-right max-w-xs">{selectedOrder.deliveryAddress}</span>
                  </div>
                )}
                {selectedOrder.notes && (
                  <div className="pt-2 border-t border-stone-800">
                    <span className="text-stone-400 block mb-0.5">Catatan Pesanan:</span>
                    <p className="text-amber-200/90 italic">"{selectedOrder.notes}"</p>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">Item Yang Dipesan:</h4>
                <div className="divide-y divide-stone-800 bg-stone-950/60 rounded-2xl p-3 border border-stone-800">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-stone-100">{item.quantity}x {item.name}</span>
                        {item.notes && (
                          <span className="block text-[10px] text-amber-300/80">Catatan: {item.notes}</span>
                        )}
                      </div>
                      <span className="font-mono font-semibold text-amber-300">{formatRupiah(item.subtotal)}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-stone-800 flex justify-between font-bold text-sm text-white">
                    <span>Total Pembayaran</span>
                    <span className="font-serif text-base text-amber-400">{formatRupiah(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">Ubah Status Alur Kerja:</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, 'diproses')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                      selectedOrder.orderStatus === 'diproses'
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                    }`}
                  >
                    1. Diproses
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, 'siap_diambil')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                      selectedOrder.orderStatus === 'siap_diambil'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                    }`}
                  >
                    2. Siap
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, 'selesai')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                      selectedOrder.orderStatus === 'selesai'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                    }`}
                  >
                    3. Selesai
                  </button>
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-stone-800 bg-stone-900 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
