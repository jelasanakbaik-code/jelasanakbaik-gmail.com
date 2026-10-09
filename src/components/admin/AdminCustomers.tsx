import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  ShoppingBag, 
  Calendar, 
  MessageCircle,
  ExternalLink,
  X,
  Award
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Customer, Order } from '../../types';
import { formatRupiah, formatDate } from '../../utils/formatters';

export const AdminCustomers: React.FC = () => {
  const { customers, orders } = useShop();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q);
  });

  // Get orders of selected customer
  const customerOrders: Order[] = selectedCustomer
    ? orders.filter(
        (o) =>
          o.customerPhone.replace(/[^0-9]/g, '') === selectedCustomer.phone.replace(/[^0-9]/g, '') ||
          o.customerName.toLowerCase() === selectedCustomer.name.toLowerCase()
      )
    : [];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Data Pelanggan (CRM)</h2>
          <p className="text-xs text-stone-400">
            Total {customers.length} pelanggan tercatat bertransaksi di Kopi Senja
          </p>
        </div>

        <div className="relative min-w-[260px] self-start sm:self-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama pelanggan / no. HP..."
            className="w-full bg-stone-900 text-stone-100 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-stone-800 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950/70 border-b border-stone-800 text-[11px] uppercase tracking-wider text-stone-400">
              <tr>
                <th className="p-4">Pelanggan</th>
                <th className="p-4">Kontak</th>
                <th className="p-4 text-center">Total Pesanan</th>
                <th className="p-4">Total Belanja</th>
                <th className="p-4">Pesanan Terakhir</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-500">
                    Belum ada data pelanggan yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const isLoyal = cust.totalOrders >= 3;
                  const cleanPhone = cust.phone.replace(/[^0-9]/g, '');

                  return (
                    <tr key={cust.id} className="hover:bg-stone-800/40 transition">
                      
                      {/* Name & Tier */}
                      <td className="p-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                            {cust.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{cust.name}</span>
                            {isLoyal && (
                              <span className="inline-flex items-center space-x-1 text-[10px] text-amber-300 font-semibold">
                                <Award className="w-3 h-3 text-amber-400" />
                                <span>Pelanggan Loyal</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="p-4">
                        <div className="flex items-center space-x-1.5 text-stone-300">
                          <Phone className="w-3.5 h-3.5 text-stone-500" />
                          <span>{cust.phone}</span>
                        </div>
                        {cust.email && (
                          <div className="flex items-center space-x-1.5 text-stone-400 text-[11px] mt-0.5">
                            <Mail className="w-3 h-3 text-stone-500" />
                            <span>{cust.email}</span>
                          </div>
                        )}
                      </td>

                      {/* Orders Count */}
                      <td className="p-4 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-stone-800 text-stone-200 font-bold text-xs">
                          {cust.totalOrders}x Transaksi
                        </span>
                      </td>

                      {/* Total Spent */}
                      <td className="p-4 font-mono font-bold text-amber-300 text-sm">
                        {formatRupiah(cust.totalSpent)}
                      </td>

                      {/* Last Order Date */}
                      <td className="p-4 text-stone-400 text-[11px]">
                        {formatDate(cust.lastOrderAt)}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 transition"
                            title="Chat via WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white font-medium text-xs transition"
                          >
                            Riwayat
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl text-stone-100 overflow-hidden my-6">
            
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Riwayat Pesanan - {selectedCustomer.name}
                </h3>
                <p className="text-xs text-stone-400">{selectedCustomer.phone}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-stone-800/60 border border-stone-700/60">
                  <span className="text-[11px] text-stone-400 block">Total Transaksi</span>
                  <span className="font-bold text-base text-white">{selectedCustomer.totalOrders} Pesanan</span>
                </div>
                <div className="p-3 rounded-2xl bg-stone-800/60 border border-stone-700/60">
                  <span className="text-[11px] text-stone-400 block">Total Pengeluaran</span>
                  <span className="font-bold text-base text-amber-400 font-mono">{formatRupiah(selectedCustomer.totalSpent)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">Daftar Transaksi:</h4>
                {customerOrders.length === 0 ? (
                  <p className="text-xs text-stone-500 py-4 text-center">Belum ada riwayat pesanan.</p>
                ) : (
                  <div className="space-y-2">
                    {customerOrders.map((ord) => (
                      <div key={ord.id} className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 text-xs flex justify-between items-center">
                        <div>
                          <span className="font-mono font-bold text-amber-300 block">{ord.orderNumber}</span>
                          <span className="text-[11px] text-stone-400">{formatDate(ord.createdAt)} • {ord.items.length} item</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-white block">{formatRupiah(ord.totalAmount)}</span>
                          <span className="text-[10px] text-emerald-400 capitalize">{ord.orderStatus.replace('_', ' ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-stone-800 bg-stone-900 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2.5 rounded-xl bg-stone-800 text-stone-200 text-xs font-bold hover:bg-stone-700"
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
