import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Coffee, 
  ShoppingBag, 
  Truck, 
  QrCode, 
  CreditCard, 
  Banknote,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { OrderType, PaymentMethod } from '../types';
import { formatRupiah } from '../utils/formatters';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    createOrder 
  } = useShop();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCheckoutOpen) return null;

  const deliveryFee = orderType === 'delivery' ? 10000 : 0;
  const totalAmount = cartSubtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Mohon isi nama lengkap Anda.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 8) {
      setErrorMsg('Mohon masukkan nomor WhatsApp / telepon yang valid.');
      return;
    }
    if (orderType === 'dine-in' && !tableNumber.trim()) {
      setErrorMsg('Mohon masukkan nomor meja untuk pesanan Dine In.');
      return;
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMsg('Mohon masukkan alamat lengkap pengantaran.');
      return;
    }

    try {
      setIsSubmitting(true);
      await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        orderType,
        tableNumber: orderType === 'dine-in' ? tableNumber.trim() : undefined,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
        notes: notes.trim(),
        paymentMethod,
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          notes: item.notes,
          subtotal: item.subtotal,
          imageUrl: item.product.imageUrl,
        })),
        subtotal: cartSubtotal,
        tax: 0,
        deliveryFee,
        totalAmount,
      });

      setIsCheckoutOpen(false);
    } catch (err: any) {
      setErrorMsg('Gagal memproses pesanan: ' + (err?.message || 'Terjadi kesalahan sistem'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl text-stone-100 overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-900/90">
          <div>
            <h2 className="font-serif text-xl font-bold text-white">Konfirmasi & Checkout Pesanan</h2>
            <p className="text-xs text-stone-400 mt-0.5">Lengkapi data pemesanan dan pilih metode pembayaran</p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Data Pemesan */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5" />
              <span>1. Data Pemesan</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-300 mb-1 font-medium">
                  Nama Lengkap <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Dimas Prasetyo"
                    className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1 font-medium">
                  Nomor WhatsApp / HP <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-stone-300 mb-1 font-medium">
                  Alamat Email (Opsional, untuk e-receipt)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="dimas@example.com"
                    className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Tipe Pesanan */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>2. Tipe Pesanan</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('dine-in')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1.5 ${
                  orderType === 'dine-in'
                    ? 'bg-amber-600/20 border-amber-500 text-amber-200'
                    : 'bg-stone-800/60 border-stone-700 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Coffee className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold">Dine In</span>
                <span className="text-[10px] text-stone-400">Makan di Kafe</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('takeaway')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1.5 ${
                  orderType === 'takeaway'
                    ? 'bg-amber-600/20 border-amber-500 text-amber-200'
                    : 'bg-stone-800/60 border-stone-700 text-stone-400 hover:text-stone-200'
                }`}
              >
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold">Take Away</span>
                <span className="text-[10px] text-stone-400">Bawa Pulang</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1.5 ${
                  orderType === 'delivery'
                    ? 'bg-amber-600/20 border-amber-500 text-amber-200'
                    : 'bg-stone-800/60 border-stone-700 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Truck className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold">Delivery</span>
                <span className="text-[10px] text-stone-400">+Ongkir Rp 10rb</span>
              </button>
            </div>

            {/* Conditional input based on Order Type */}
            {orderType === 'dine-in' && (
              <div className="pt-1">
                <label className="block text-xs text-stone-300 mb-1 font-medium">
                  Nomor Meja Anda <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Contoh: Meja 05 atau Area Outdoor A"
                  className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl px-3 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {orderType === 'delivery' && (
              <div className="pt-1">
                <label className="block text-xs text-stone-300 mb-1 font-medium">
                  Alamat Pengantaran Lengkap <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-stone-500" />
                  <textarea
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Contoh: Gedung Senja Tower Lt. 4 Ruang 402, Jl. Sudirman No. 12"
                    className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl pl-9 pr-3 py-2 border border-stone-700 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs text-stone-300 mb-1 font-medium">
                Catatan Pesanan Keseluruhan (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Tolong jangan terlalu manis, sajikan bersamaan..."
                className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl px-3 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 3. Metode Pembayaran */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              <span>3. Metode Pembayaran</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label 
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center space-x-3 transition ${
                  paymentMethod === 'qris'
                    ? 'bg-amber-600/20 border-amber-500 text-white'
                    : 'bg-stone-800/60 border-stone-700 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="qris"
                  checked={paymentMethod === 'qris'}
                  onChange={() => setPaymentMethod('qris')}
                  className="sr-only"
                />
                <div className="p-2 rounded-xl bg-stone-900 text-amber-400">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">QRIS Instant (Rekomendasi)</div>
                  <div className="text-[10px] text-stone-400">Gopay, OVO, Dana, Shopee, BCA</div>
                </div>
              </label>

              <label 
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center space-x-3 transition ${
                  paymentMethod === 'transfer_bca'
                    ? 'bg-amber-600/20 border-amber-500 text-white'
                    : 'bg-stone-800/60 border-stone-700 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="transfer_bca"
                  checked={paymentMethod === 'transfer_bca'}
                  onChange={() => setPaymentMethod('transfer_bca')}
                  className="sr-only"
                />
                <div className="p-2 rounded-xl bg-stone-900 text-blue-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">Transfer Bank BCA</div>
                  <div className="text-[10px] text-stone-400">873-098-1234 (Kopi Senja)</div>
                </div>
              </label>

              <label 
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center space-x-3 transition ${
                  paymentMethod === 'transfer_mandiri'
                    ? 'bg-amber-600/20 border-amber-500 text-white'
                    : 'bg-stone-800/60 border-stone-700 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="transfer_mandiri"
                  checked={paymentMethod === 'transfer_mandiri'}
                  onChange={() => setPaymentMethod('transfer_mandiri')}
                  className="sr-only"
                />
                <div className="p-2 rounded-xl bg-stone-900 text-yellow-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">Transfer Bank Mandiri</div>
                  <div className="text-[10px] text-stone-400">137-00-9876543-1 (Kopi Senja)</div>
                </div>
              </label>

              <label 
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center space-x-3 transition ${
                  paymentMethod === 'tunai'
                    ? 'bg-amber-600/20 border-amber-500 text-white'
                    : 'bg-stone-800/60 border-stone-700 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="tunai"
                  checked={paymentMethod === 'tunai'}
                  onChange={() => setPaymentMethod('tunai')}
                  className="sr-only"
                />
                <div className="p-2 rounded-xl bg-stone-900 text-emerald-400">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">Tunai / Bayar di Kasir</div>
                  <div className="text-[10px] text-stone-400">Bayar langsung saat pesanan tiba</div>
                </div>
              </label>
            </div>
          </div>

          {/* Ringkasan Biaya */}
          <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2 text-xs">
            <div className="flex justify-between text-stone-400">
              <span>Subtotal ({cart.length} menu)</span>
              <span>{formatRupiah(cartSubtotal)}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between text-stone-400">
                <span>Biaya Pengantaran (Delivery)</span>
                <span>{formatRupiah(deliveryFee)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-stone-800 flex justify-between font-bold text-sm text-white">
              <span>Total Tagihan</span>
              <span className="text-amber-400 font-serif text-lg">{formatRupiah(totalAmount)}</span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 text-xs font-bold shadow-lg shadow-amber-900/30 transition transform active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <span>Memproses Pesanan...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Konfirmasi & Buat Pesanan</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
