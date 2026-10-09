import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Clock, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  Upload,
  Coffee
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';
import { 
  formatRupiah, 
  formatDate, 
  getOrderStatusInfo, 
  getPaymentMethodLabel 
} from '../utils/formatters';

export const OrderTrackerModal: React.FC = () => {
  const { 
    isOrderTrackerOpen, 
    setIsOrderTrackerOpen, 
    orders, 
    uploadPaymentProof,
    showToast 
  } = useShop();

  const [query, setQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOrderTrackerOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toLowerCase();
    if (!clean) return;

    const found = orders.find(
      (o) => o.orderNumber.toLowerCase() === clean || 
             o.customerPhone.replace(/[^0-9]/g, '').includes(clean)
    );

    if (found) {
      setSelectedOrder(found);
    } else {
      showToast('Pesanan tidak ditemukan. Periksa kembali kode pesanan atau no. telepon Anda.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedOrder || !uploadPreview) return;
    try {
      setIsUploading(true);
      await uploadPaymentProof(selectedOrder.id, uploadPreview);
      setUploadPreview(null);
      // update selected order reference
      const fresh = orders.find(o => o.id === selectedOrder.id);
      if (fresh) setSelectedOrder(fresh);
    } catch (err: any) {
      showToast('Gagal upload: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl text-stone-100 overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">Lacak Status Pesanan</h2>
              <p className="text-xs text-stone-400">Pantau proses pembuatan pesanan Anda secara langsung</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsOrderTrackerOpen(false);
              setSelectedOrder(null);
              setQuery('');
            }}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-stone-800 bg-stone-950/40">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Masukkan Kode Pesanan (KS-...) atau No HP"
                className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl pl-10 pr-3 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition"
            >
              Cari
            </button>
          </form>

          {/* Quick list of recent orders if no order searched yet */}
          {!selectedOrder && orders.length > 0 && (
            <div className="mt-4 pt-3 border-t border-stone-800">
              <span className="text-[11px] text-stone-400 block mb-2 font-medium">
                Pesanan Terkini di Toko:
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {orders.slice(0, 4).map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className="w-full text-left p-2 rounded-xl bg-stone-800/60 hover:bg-stone-800 border border-stone-700/60 flex items-center justify-between text-xs transition"
                  >
                    <div>
                      <span className="font-mono font-bold text-amber-300">{ord.orderNumber}</span>
                      <span className="text-stone-400 ml-2">({ord.customerName})</span>
                    </div>
                    <span className="text-[10px] text-stone-300">{formatRupiah(ord.totalAmount)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Selected Order Details */}
        {selectedOrder ? (
          <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-sm font-bold text-amber-300 block">
                  {selectedOrder.orderNumber}
                </span>
                <span className="text-xs text-stone-400">
                  {selectedOrder.customerName} • {formatDate(selectedOrder.createdAt)}
                </span>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${getOrderStatusInfo(selectedOrder.orderStatus).color}`}>
                  {getOrderStatusInfo(selectedOrder.orderStatus).label}
                </span>
              </div>
            </div>

            {/* Items list */}
            <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2 text-xs">
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Item ({selectedOrder.items.length})
              </div>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1 text-stone-200">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="text-amber-300">{formatRupiah(item.subtotal)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-stone-800 flex justify-between font-bold text-white">
                <span>Total Biaya</span>
                <span className="text-amber-400">{formatRupiah(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            {/* Payment proof upload / reupload if not approved yet */}
            {selectedOrder.paymentMethod !== 'tunai' && (
              <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-200">Bukti Transfer:</span>
                  <span className="text-[11px] text-stone-400">
                    Status: <strong className="text-amber-300">{selectedOrder.paymentStatus}</strong>
                  </span>
                </div>

                {selectedOrder.paymentProofUrl ? (
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedOrder.paymentProofUrl}
                      alt="Proof"
                      className="w-16 h-16 rounded-xl object-cover border border-stone-600"
                    />
                    <div className="text-xs text-stone-300">
                      <p className="font-semibold text-emerald-400">Bukti Pembayaran Terpasang</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Menunggu verifikasi admin kasir toko
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    {!uploadPreview ? (
                      <label className="border border-dashed border-stone-600 hover:border-amber-500 rounded-xl p-3.5 flex flex-col items-center justify-center cursor-pointer transition">
                        <Upload className="w-5 h-5 text-amber-400 mb-1" />
                        <span className="text-xs text-stone-200">Upload Bukti Transfer / QRIS</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                    ) : (
                      <div className="space-y-2">
                        <img
                          src={uploadPreview}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-xl border border-stone-600"
                        />
                        <button
                          onClick={handleUpload}
                          disabled={isUploading}
                          className="w-full py-2 bg-amber-600 text-white rounded-xl text-xs font-bold"
                        >
                          {isUploading ? 'Mengunggah...' : 'Kirim Bukti'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold hover:bg-stone-700"
            >
              Cari Pesanan Lain
            </button>
          </div>
        ) : (
          <div className="p-8 text-center text-stone-400 space-y-2">
            <Coffee className="w-10 h-10 mx-auto text-stone-500" />
            <p className="text-xs">Masukkan kode pesanan Anda di atas untuk melihat status real-time.</p>
          </div>
        )}

      </div>
    </div>
  );
};
