import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Clock, 
  Phone, 
  Receipt, 
  AlertCircle,
  X,
  FileCheck2,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Order } from '../../types';
import { 
  formatRupiah, 
  formatDate, 
  getPaymentMethodLabel 
} from '../../utils/formatters';

export const AdminPaymentApproval: React.FC = () => {
  const { 
    orders, 
    approvePayment, 
    rejectPayment, 
    showToast 
  } = useShop();

  const [filterMode, setFilterMode] = useState<'pending' | 'history'>('pending');
  const [selectedProofOrder, setSelectedProofOrder] = useState<Order | null>(null);
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter orders
  const pendingOrders = orders.filter(
    (o) => o.paymentStatus === 'pending_approval' || (o.paymentProofUrl && o.paymentStatus === 'unpaid')
  );

  const historyOrders = orders.filter(
    (o) => o.paymentStatus === 'approved' || o.paymentStatus === 'rejected'
  );

  const handleApprove = async (order: Order) => {
    try {
      setIsProcessing(true);
      await approvePayment(order.id, 'Bukti transfer valid dan dana telah diterima');
      if (selectedProofOrder?.id === order.id) {
        setSelectedProofOrder(null);
      }
    } catch (err: any) {
      showToast('Gagal menyetujui: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingOrder) return;
    try {
      setIsProcessing(true);
      await rejectPayment(rejectingOrder.id, rejectReason || 'Bukti transfer tidak valid atau nominal tidak sesuai');
      setRejectingOrder(null);
      setRejectReason('');
      if (selectedProofOrder?.id === rejectingOrder.id) {
        setSelectedProofOrder(null);
      }
    } catch (err: any) {
      showToast('Gagal menolak: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const displayedOrders = filterMode === 'pending' ? pendingOrders : historyOrders;

  return (
    <div className="space-y-6">
      
      {/* Top Header & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Approval Bukti Pembayaran</h2>
          <p className="text-xs text-stone-400">Verifikasi struk transfer atau bukti scan QRIS dari pelanggan</p>
        </div>

        <div className="flex items-center space-x-2 bg-stone-900 p-1.5 rounded-2xl border border-stone-800 self-start">
          <button
            onClick={() => setFilterMode('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              filterMode === 'pending'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <span>Menunggu Approval</span>
            {pendingOrders.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {pendingOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setFilterMode('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterMode === 'history'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <span>Riwayat Verifikasi ({historyOrders.length})</span>
          </button>
        </div>
      </div>

      {/* Orders Grid / Cards */}
      {displayedOrders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-stone-900/60 border border-stone-800 text-stone-400 space-y-3">
          <FileCheck2 className="w-12 h-12 mx-auto text-stone-600" />
          <h3 className="font-serif text-base font-bold text-stone-300">
            {filterMode === 'pending'
              ? 'Tidak ada bukti pembayaran yang menunggu verifikasi'
              : 'Belum ada riwayat verifikasi'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {filterMode === 'pending'
              ? 'Saat pelanggan mengunggah bukti transfer, pemberitahuan akan langsung muncul di sini.'
              : 'Riwayat persetujuan atau penolakan bukti pembayaran akan tercatat di sini.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden flex flex-col justify-between shadow-lg hover:border-stone-700 transition"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-stone-800/80">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-300">
                      {order.orderNumber}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      {order.customerName}
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                      order.paymentStatus === 'approved'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                        : order.paymentStatus === 'rejected'
                        ? 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                        : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs text-stone-400">
                  <div className="flex items-center justify-between">
                    <span>Nominal:</span>
                    <span className="font-bold text-amber-300 font-serif text-sm">
                      {formatRupiah(order.totalAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Metode:</span>
                    <span className="text-stone-300 font-medium">
                      {order.paymentMethod.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Waktu:</span>
                    <span>{formatDate(order.paymentProofUploadedAt || order.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Receipt Preview Thumbnail */}
              <div className="p-5 bg-stone-950/40 space-y-3">
                <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider">
                  Bukti Transfer Pelanggan:
                </span>
                {order.paymentProofUrl ? (
                  <div 
                    onClick={() => setSelectedProofOrder(order)}
                    className="relative group rounded-2xl overflow-hidden border border-stone-700 bg-stone-900 cursor-pointer h-36 flex items-center justify-center"
                  >
                    <img
                      src={order.paymentProofUrl}
                      alt="Bukti Transfer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-white text-xs font-bold">
                      <Eye className="w-4 h-4" />
                      <span>Perbesar Bukti</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-28 rounded-2xl border border-dashed border-stone-800 flex items-center justify-center text-xs text-stone-500">
                    Belum upload gambar
                  </div>
                )}

                {/* Items summary */}
                <div className="text-[11px] text-stone-400 truncate">
                  Pesanan: {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 border-t border-stone-800 bg-stone-900/90 flex items-center space-x-2">
                {order.paymentStatus === 'pending_approval' || (order.paymentProofUrl && order.paymentStatus === 'unpaid') ? (
                  <>
                    <button
                      onClick={() => handleApprove(order)}
                      disabled={isProcessing}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Setujui</span>
                    </button>
                    <button
                      onClick={() => setRejectingOrder(order)}
                      disabled={isProcessing}
                      className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-rose-950/60 hover:text-rose-300 text-stone-300 font-bold text-xs border border-stone-700 transition flex items-center justify-center space-x-1"
                    >
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Tolak</span>
                    </button>
                  </>
                ) : (
                  <div className="w-full text-center py-1.5 text-xs text-stone-400">
                    {order.paymentStatus === 'approved' ? (
                      <span className="text-emerald-400 font-semibold flex items-center justify-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Telah Disetujui ({order.approvedBy || 'Kasir'})</span>
                      </span>
                    ) : (
                      <span className="text-rose-400 font-semibold flex items-center justify-center space-x-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Ditolak ({order.approvalNotes || 'Tidak Valid'})</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Proof Zoom Modal */}
      {selectedProofOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Bukti Pembayaran - {selectedProofOrder.orderNumber}
                </h3>
                <p className="text-xs text-stone-400">
                  {selectedProofOrder.customerName} • {formatRupiah(selectedProofOrder.totalAmount)}
                </p>
              </div>
              <button
                onClick={() => setSelectedProofOrder(null)}
                className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-stone-950 flex items-center justify-center max-h-[60vh] overflow-auto">
              {selectedProofOrder.paymentProofUrl ? (
                <img
                  src={selectedProofOrder.paymentProofUrl}
                  alt="Full Proof"
                  className="max-h-[55vh] object-contain rounded-xl border border-stone-800"
                />
              ) : (
                <div className="text-stone-500 text-xs">Gambar tidak tersedia</div>
              )}
            </div>

            <div className="p-5 border-t border-stone-800 bg-stone-900 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedProofOrder(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold hover:bg-stone-700"
              >
                Tutup
              </button>
              {selectedProofOrder.paymentStatus === 'pending_approval' && (
                <>
                  <button
                    onClick={() => {
                      setRejectingOrder(selectedProofOrder);
                      setSelectedProofOrder(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600/20 text-rose-300 border border-rose-500/30 text-xs font-bold hover:bg-rose-600/30"
                  >
                    Tolak Bukti
                  </button>
                  <button
                    onClick={() => handleApprove(selectedProofOrder)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                  >
                    Setujui Pembayaran
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white font-serif">Tolak Bukti Pembayaran</h3>
            <p className="text-xs text-stone-400 mt-1">
              Pesanan {rejectingOrder.orderNumber} ({rejectingOrder.customerName})
            </p>

            <form onSubmit={handleReject} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs text-stone-300 mb-1 font-medium">
                  Alasan Penolakan:
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Contoh: Nominal transfer kurang, struk buram/tidak terbaca, atau salah rekening tujuan."
                  className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl p-3 border border-stone-700 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setRejectingOrder(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Konfirmasi Tolak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
