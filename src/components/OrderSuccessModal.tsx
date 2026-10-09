import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  Upload, 
  QrCode, 
  CreditCard, 
  Clock, 
  AlertCircle,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { 
  formatRupiah, 
  formatDate, 
  getOrderStatusInfo, 
  getPaymentMethodLabel 
} from '../utils/formatters';

export const OrderSuccessModal: React.FC = () => {
  const { 
    activeOrder, 
    setActiveOrder, 
    uploadPaymentProof, 
    showToast 
  } = useShop();

  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!activeOrder) return null;

  const statusInfo = getOrderStatusInfo(activeOrder.orderStatus);

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(activeOrder.orderNumber);
    setCopied(true);
    showToast('Nomor pesanan disalin ke clipboard!');
    setTimeout(() => setCopied(false), 2000);
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
      setProofPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadProof = async () => {
    if (!proofPreview) return;
    try {
      setIsUploading(true);
      await uploadPaymentProof(activeOrder.id, proofPreview);
      setProofPreview(null);
    } catch (err: any) {
      showToast('Gagal mengunggah bukti: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl text-stone-100 overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">Pesanan Berhasil Dibuat!</h2>
              <p className="text-xs text-stone-400">{formatDate(activeOrder.createdAt)}</p>
            </div>
          </div>
          <button
            onClick={() => setActiveOrder(null)}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Order ID banner with copy button */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-900/40 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-amber-400/80 uppercase tracking-wider block font-semibold">
                Kode Pesanan Anda
              </span>
              <span className="font-mono text-lg font-bold text-amber-200">
                {activeOrder.orderNumber}
              </span>
            </div>
            <button
              onClick={handleCopyOrderNumber}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
            </button>
          </div>

          {/* Stepper Status tracker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-300">Status Terkini:</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>

            {/* Visual step bar */}
            <div className="grid grid-cols-4 gap-1.5 pt-2">
              <div className={`h-2 rounded-full ${activeOrder.orderStatus !== 'dibatalkan' ? 'bg-emerald-500' : 'bg-stone-700'}`} />
              <div className={`h-2 rounded-full ${
                ['menunggu_approval', 'diproses', 'siap_diambil', 'selesai'].includes(activeOrder.orderStatus)
                  ? 'bg-emerald-500'
                  : 'bg-stone-700'
              }`} />
              <div className={`h-2 rounded-full ${
                ['diproses', 'siap_diambil', 'selesai'].includes(activeOrder.orderStatus)
                  ? 'bg-purple-500'
                  : 'bg-stone-700'
              }`} />
              <div className={`h-2 rounded-full ${
                activeOrder.orderStatus === 'selesai'
                  ? 'bg-emerald-500'
                  : 'bg-stone-700'
              }`} />
            </div>
            <div className="flex justify-between text-[10px] text-stone-400 pt-1">
              <span>Pesanan Masuk</span>
              <span>Approval Bukti</span>
              <span>Diproses Dapur</span>
              <span>Selesai</span>
            </div>
          </div>

          {/* Payment Instructions & Upload Section */}
          <div className="p-5 rounded-2xl bg-stone-800/70 border border-stone-700/60 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-700 pb-3">
              <div>
                <span className="text-xs text-stone-400 block">Metode Pembayaran</span>
                <span className="text-sm font-bold text-white">
                  {getPaymentMethodLabel(activeOrder.paymentMethod)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-400 block">Total Tagihan</span>
                <span className="font-serif text-lg font-bold text-amber-400">
                  {formatRupiah(activeOrder.totalAmount)}
                </span>
              </div>
            </div>

            {/* Dynamic payment instructions */}
            {activeOrder.paymentMethod === 'qris' && (
              <div className="text-center py-2 space-y-3">
                <p className="text-xs text-stone-300">
                  Scan QRIS di bawah ini dengan aplikasi perbankan atau e-wallet Anda:
                </p>
                <div className="inline-block p-4 bg-white rounded-2xl shadow-lg border border-stone-300">
                  <div className="w-48 h-48 bg-stone-900 rounded-xl flex flex-col items-center justify-center p-3 text-white">
                    <QrCode className="w-24 h-24 text-amber-400" />
                    <span className="text-[11px] font-bold mt-2">NMID: ID1020268491823</span>
                    <span className="text-[9px] text-stone-400">KOPI SENJA NUSANTARA</span>
                  </div>
                </div>
                <p className="text-[11px] text-amber-300/80">
                  Nominal Pas: <strong className="text-amber-300">{formatRupiah(activeOrder.totalAmount)}</strong>
                </p>
              </div>
            )}

            {activeOrder.paymentMethod === 'transfer_bca' && (
              <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-700 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Bank Tujuan:</span>
                  <span className="font-bold text-white">BCA (Bank Central Asia)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Nomor Rekening:</span>
                  <span className="font-mono font-bold text-amber-300 text-sm">873-098-1234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Atas Nama:</span>
                  <span className="font-semibold text-white">Kopi Senja Nusantara PT</span>
                </div>
              </div>
            )}

            {activeOrder.paymentMethod === 'transfer_mandiri' && (
              <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-700 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Bank Tujuan:</span>
                  <span className="font-bold text-white">Bank Mandiri</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Nomor Rekening:</span>
                  <span className="font-mono font-bold text-amber-300 text-sm">137-00-9876543-1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Atas Nama:</span>
                  <span className="font-semibold text-white">Kopi Senja Nusantara PT</span>
                </div>
              </div>
            )}

            {activeOrder.paymentMethod === 'tunai' && (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-200">
                Silakan siapkan uang pas sebesar <strong>{formatRupiah(activeOrder.totalAmount)}</strong> untuk diserahkan ke kasir atau kurir saat pesanan tiba.
              </div>
            )}

            {/* Upload Bukti Section (for non-cash or cashless) */}
            {activeOrder.paymentMethod !== 'tunai' && (
              <div className="pt-3 border-t border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-200 flex items-center space-x-1.5">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload Bukti Pembayaran</span>
                  </span>
                  {activeOrder.paymentProofUrl && (
                    <span className="text-[11px] text-emerald-400 flex items-center space-x-1">
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Sudah Diunggah</span>
                    </span>
                  )}
                </div>

                {activeOrder.paymentProofUrl ? (
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-700 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={activeOrder.paymentProofUrl}
                        alt="Bukti Transfer"
                        className="w-12 h-12 object-cover rounded-lg border border-stone-600 cursor-pointer"
                        onClick={() => window.open(activeOrder.paymentProofUrl, '_blank')}
                      />
                      <div>
                        <span className="text-xs font-semibold text-stone-200 block">Bukti Transfer Anda</span>
                        <span className="text-[10px] text-stone-400">
                          {activeOrder.paymentStatus === 'approved' 
                            ? '✅ Telah Disetujui oleh Kasir'
                            : activeOrder.paymentStatus === 'rejected'
                            ? `❌ Ditolak: ${activeOrder.approvalNotes || 'Bukti tidak valid'}`
                            : '⏳ Menunggu Verifikasi Kasir'}
                        </span>
                      </div>
                    </div>

                    {activeOrder.paymentStatus !== 'approved' && (
                      <label className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline">
                        Ganti Bukti
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {!proofPreview ? (
                      <label className="border-2 border-dashed border-stone-700 hover:border-amber-500/60 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition bg-stone-900/60 group">
                        <Upload className="w-6 h-6 text-stone-400 group-hover:text-amber-400 mb-2 transition" />
                        <span className="text-xs font-semibold text-stone-200">
                          Klik untuk memilih screenshot transfer / struk QRIS
                        </span>
                        <span className="text-[10px] text-stone-400 mt-0.5">
                          Format JPG, PNG, atau WEBP (Maksimal 2MB)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                    ) : (
                      <div className="p-4 rounded-2xl bg-stone-900 border border-amber-900/40 space-y-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={proofPreview}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-xl border border-stone-600"
                          />
                          <div className="flex-1">
                            <span className="text-xs font-bold text-stone-200 block">Pratinjau Bukti Transfer</span>
                            <span className="text-[11px] text-amber-300">Siap dikirim ke kasir untuk disetujui</span>
                          </div>
                          <button
                            onClick={() => setProofPreview(null)}
                            className="text-stone-400 hover:text-rose-400 text-xs"
                          >
                            Batal
                          </button>
                        </div>

                        <button
                          onClick={handleUploadProof}
                          disabled={isUploading}
                          className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
                        >
                          <Upload className="w-4 h-4" />
                          <span>{isUploading ? 'Mengunggah...' : 'Kirim Bukti Pembayaran Sekarang'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rincian Pesanan Items */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-300">Rincian Item Pesanan:</h4>
            <div className="divide-y divide-stone-800 bg-stone-950/60 rounded-2xl p-3 border border-stone-800/80">
              {activeOrder.items.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-200">
                      {item.quantity}x {item.name}
                    </span>
                    {item.notes && (
                      <span className="block text-[10px] text-amber-300/70">Catatan: {item.notes}</span>
                    )}
                  </div>
                  <span className="font-medium text-amber-300">{formatRupiah(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Closing Button */}
          <div className="pt-2">
            <button
              onClick={() => setActiveOrder(null)}
              className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition"
            >
              Simpan & Kembali ke Halaman Utama
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
