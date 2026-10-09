import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight,
  Coffee
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatRupiah } from '../utils/formatters';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    cartSubtotal,
    cartCount,
    setIsCheckoutOpen
  } = useShop();

  if (!isCartOpen) return null;

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-l border-stone-800 text-stone-100 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-white">Keranjang Belanja</h2>
                <p className="text-xs text-stone-400">{cartCount} item siap dipesan</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  title="Kosongkan Keranjang"
                  className="p-2 text-stone-400 hover:text-rose-400 rounded-lg hover:bg-stone-800 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-stone-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center text-stone-400">
                  <Coffee className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-base font-bold text-stone-200">Keranjang Masih Kosong</h3>
                <p className="text-xs text-stone-400 max-w-xs">
                  Pilih minuman kopi favorit atau makanan lezat kami untuk mulai memesan.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-md"
                >
                  Lihat Katalog Menu
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={`${item.product.id}-${item.notes || ''}`}
                  className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex space-x-3 items-start"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-stone-700 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-bold text-stone-100 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stone-400 hover:text-rose-400 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-amber-300/80 bg-amber-950/40 px-2 py-0.5 rounded mt-1 line-clamp-1 border border-amber-900/30">
                        Catatan: {item.notes}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300">
                        {formatRupiah(item.subtotal)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-1.5 bg-stone-900 px-2 py-1 rounded-xl border border-stone-700">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-stone-300 hover:text-white rounded hover:bg-stone-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-stone-100 px-1 min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 text-stone-300 hover:text-white rounded hover:bg-stone-800 disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-800 bg-stone-950/70 space-y-4">
              <div className="space-y-1.5 text-xs text-stone-300">
                <div className="flex justify-between">
                  <span>Subtotal Belanja</span>
                  <span className="font-semibold">{formatRupiah(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Pajak Restoran (PB1 0%)</span>
                  <span>Rp 0</span>
                </div>
                <div className="pt-2 border-t border-stone-800 flex justify-between text-sm font-bold text-white">
                  <span>Total Estimasi</span>
                  <span className="text-amber-400 font-serif text-base">{formatRupiah(cartSubtotal)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedCheckout}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-sm shadow-xl shadow-amber-900/30 transition transform active:scale-95"
              >
                <span>Lanjut ke Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
