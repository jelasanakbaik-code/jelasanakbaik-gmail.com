import React, { useState } from 'react';
import { Star, Plus, Check, MessageSquare } from 'lucide-react';
import { Product } from '../types';
import { formatRupiah } from '../utils/formatters';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useShop();
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [notes, setNotes] = useState('');
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product, 1, notes);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
    setNotes('');
    setShowNotesInput(false);
  };

  return (
    <div className="group relative bg-stone-900 rounded-3xl border border-stone-800 hover:border-amber-700/60 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:shadow-amber-950/20">
      
      {/* Top Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-800">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-60" />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-amber-500 text-stone-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider">
            {product.badge}
          </div>
        )}

        {/* Rating */}
        <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-md text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 border border-stone-700">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{product.rating.toFixed(1)}</span>
        </div>

        {/* Stock Badge */}
        <div className="absolute bottom-3 left-3">
          {isOutOfStock ? (
            <span className="bg-rose-500/90 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
              Stok Habis
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-500/90 text-stone-950 text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm animate-pulse">
              Sisa {product.stock} Porsi!
            </span>
          ) : (
            <span className="bg-emerald-950/80 text-emerald-300 text-[11px] font-medium px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-emerald-700/50">
              Stok: {product.stock}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/90 mb-1">
            {product.category === 'minuman' 
              ? (product.subcategory === 'coffee' ? '☕ Kopi' : '🍵 Non-Coffee')
              : product.category === 'makanan' 
              ? '🍛 Makanan Utama' 
              : '🥐 Snack & Pastry'}
          </div>

          <h3 className="font-serif text-lg font-bold text-stone-100 group-hover:text-amber-200 transition line-clamp-1">
            {product.name}
          </h3>

          <p className="text-stone-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Notes input accordion */}
        {showNotesInput && (
          <div className="mt-3 pt-3 border-t border-stone-800">
            <label className="text-[11px] text-stone-300 flex items-center justify-between mb-1">
              <span>Catatan Pesanan:</span>
              <button 
                onClick={() => setShowNotesInput(false)}
                className="text-[10px] text-stone-400 hover:text-stone-200"
              >
                Batal
              </button>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Less ice, gula sedikit, pedas sedang..."
              className="w-full text-xs bg-stone-800 text-stone-100 placeholder-stone-400 rounded-xl px-3 py-1.5 border border-stone-700 focus:outline-none focus:border-amber-500"
              autoFocus
            />
          </div>
        )}

        {/* Price & Add to Cart action */}
        <div className="mt-4 pt-4 border-t border-stone-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Harga</span>
            <span className="font-serif text-base font-bold text-amber-300">
              {formatRupiah(product.price)}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Note toggle */}
            {!isOutOfStock && !showNotesInput && (
              <button
                type="button"
                onClick={() => setShowNotesInput(true)}
                title="Tambahkan catatan khusus"
                className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300 border border-stone-700 transition"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            )}

            {/* Main Add Button */}
            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                isOutOfStock
                  ? 'bg-stone-800 text-stone-400 cursor-not-allowed border border-stone-700'
                  : justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white active:scale-95 shadow-amber-900/30'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Masuk!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>+ Keranjang</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
