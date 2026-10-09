import React, { useState, useMemo } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { ProductCategory, ProductSubcategory } from './types';
import { 
  Coffee, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Instagram, 
  Clock, 
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { formatRupiah } from './utils/formatters';

const StorefrontContent: React.FC = () => {
  const { 
    products, 
    isLoadingProducts, 
    isAdminLoggedIn, 
    setIsAdminLoginOpen, 
    toast,
    cartCount,
    cartSubtotal,
    setIsCartOpen
  } = useShop();

  const [isAdminView, setIsAdminView] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'semua' | ProductCategory>('semua');
  const [activeSubcategory, setActiveSubcategory] = useState<'semua' | ProductSubcategory>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Admin Button Click
  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      setIsAdminView(!isAdminView);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (activeCategory !== 'semua' && p.category !== activeCategory) {
        return false;
      }
      // Subcategory filter (e.g. coffee vs non-coffee)
      if (
        activeCategory === 'minuman' &&
        activeSubcategory !== 'semua' &&
        p.subcategory !== activeSubcategory
      ) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, activeCategory, activeSubcategory, searchQuery]);

  // Counts for category badges
  const categoryCounts = useMemo(() => {
    return {
      semua: products.length,
      minuman: products.filter(p => p.category === 'minuman').length,
      makanan: products.filter(p => p.category === 'makanan').length,
      snack: products.filter(p => p.category === 'snack').length,
    };
  }, [products]);

  // If in admin view and authenticated, render full admin dashboard
  if (isAdminView && isAdminLoggedIn) {
    return (
      <>
        <AdminLayout onBackToStore={() => setIsAdminView(false)} />
        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 bg-stone-900 border border-amber-500/40 text-stone-100 text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toast}</span>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      
      {/* Navbar */}
      <Navbar
        isAdminView={isAdminView}
        setIsAdminView={setIsAdminView}
        onAdminClick={handleAdminClick}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Hero Banner */}
      <HeroBanner />

      {/* Main Catalog Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Section Title & Filter */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 block">
                PILIHAN MENU TERBAIK
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Katalog Menu Kopi Senja
              </h2>
            </div>
            <p className="text-xs text-stone-400 max-w-sm">
              Disajikan segar dengan bahan berkualitas premium untuk memanjakan lidah Anda.
            </p>
          </div>

          {/* Category Tabs */}
          <CategoryFilter
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeSubcategory={activeSubcategory}
            setActiveSubcategory={setActiveSubcategory}
            counts={categoryCounts}
          />
        </div>

        {/* Products Grid */}
        {isLoadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-stone-900 rounded-3xl p-4 border border-stone-800 animate-pulse space-y-3">
                <div className="aspect-4/3 bg-stone-800 rounded-2xl" />
                <div className="h-4 bg-stone-800 rounded-md w-3/4" />
                <div className="h-3 bg-stone-800 rounded-md w-1/2" />
                <div className="h-8 bg-stone-800 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-stone-900/50 rounded-3xl border border-stone-800 space-y-3">
            <Coffee className="w-12 h-12 text-stone-600 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-stone-300">
              Tidak ada menu yang sesuai
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Coba ganti kata kunci pencarian atau pilih kategori menu lainnya.
            </p>
            <button
              onClick={() => {
                setActiveCategory('semua');
                setActiveSubcategory('semua');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Store Highlights Grid */}
        <div className="pt-8 border-t border-stone-800/80 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800 flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-white">100% Specialty Coffee</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Biji kopi dipetik dari lereng pegunungan Gayo dan Kerinci, dipanggang dengan profil medium-dark seimbang.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800 flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-white">Verifikasi Cepat Kasir</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Upload struk QRIS atau transfer bank Anda, kasir akan segera menyetujui dan pesanan langsung diproses.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800 flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-white">Dine In, Bungkus & Antar</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Pilih kemudahan makan di tempat dengan nomor meja, bawa pulang, atau kurir antar ke depan pintu Anda.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Floating Mobile Cart Bar */}
      {cartCount > 0 && (
        <div className="sm:hidden fixed bottom-4 inset-x-4 z-30">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-sm shadow-2xl flex items-center justify-between border border-amber-500/30"
          >
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-stone-950 text-amber-300 flex items-center justify-center text-xs">
                {cartCount}
              </div>
              <span>Lihat Keranjang</span>
            </div>
            <div className="flex items-center space-x-1.5 font-serif">
              <span>{formatRupiah(cartSubtotal)}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 bg-stone-900 border-t border-stone-800 text-stone-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Coffee className="w-5 h-5 text-amber-400" />
                <span className="font-serif text-base font-bold text-white tracking-tight">
                  KOPI SENJA
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Tempat berkumpul, merenung, dan menikmati secangkir kopi terbaik di kala senja menyapa.
              </p>
              <div className="text-[11px] text-stone-500">
                Single Source of Truth: Google Firestore Connected
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Jam Operasional</h4>
              <p>Senin - Jumat: 07.00 - 23.00 WIB</p>
              <p>Sabtu - Minggu: 07.00 - 24.00 WIB</p>
              <p className="text-amber-400">Kitchen & Bar buka sepanjang hari</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Lokasi & Kontak</h4>
              <p className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Jl. Senja Cerah No. 18, Jakarta Selatan</span>
              </p>
              <p className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>+62 812-3456-7890</span>
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Portal Kasir & Admin</h4>
              <p className="text-xs text-stone-400">
                Kelola stok 12 produk, pantau riwayat order, verifikasi bukti transfer, dan unduh laporan sales.
              </p>
              <button
                onClick={handleAdminClick}
                className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition flex items-center space-x-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAdminLoggedIn ? 'Buka Admin Panel' : 'Login Kasir / Admin'}</span>
              </button>
            </div>

          </div>

          <div className="mt-10 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-500 gap-2">
            <p>© {new Date().getFullYear()} Kopi Senja Marketplace. Hak Cipta Dilindungi.</p>
            <p>Database Real-time Firestore Cloud Platform</p>
          </div>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <OrderTrackerModal />
      <AdminLoginModal onSuccess={() => setIsAdminView(true)} />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 border border-amber-500/40 text-stone-100 text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <StorefrontContent />
    </ShopProvider>
  );
}
