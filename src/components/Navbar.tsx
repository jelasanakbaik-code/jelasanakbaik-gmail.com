import React from 'react';
import { 
  Coffee, 
  ShoppingBag, 
  Search, 
  ShieldCheck, 
  User, 
  Menu,
  X,
  FileCheck2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatRupiah } from '../utils/formatters';

interface NavbarProps {
  onAdminClick: () => void;
  isAdminView: boolean;
  setIsAdminView: (view: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onAdminClick,
  isAdminView,
  setIsAdminView,
  searchQuery,
  setSearchQuery,
}) => {
  const { 
    cartCount, 
    cartSubtotal, 
    setIsCartOpen, 
    setIsOrderTrackerOpen,
    isAdminLoggedIn,
    adminUser,
    orders
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Count pending approvals for admin alert badge
  const pendingApprovalsCount = orders.filter(
    (o) => o.orderStatus === 'menunggu_approval' || o.paymentStatus === 'pending_approval'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsAdminView(false)}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center shadow-lg shadow-amber-950/40 border border-amber-500/30">
              <Coffee className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-amber-50">
                  KOPI SENJA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Marketplace
                </span>
              </div>
              <p className="text-xs text-stone-400 font-sans tracking-wide">
                Specialty Coffee & Kitchen
              </p>
            </div>
          </div>

          {/* Search bar on customer view */}
          {!isAdminView && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kopi, makanan, atau snack favoritmu..."
                  className="w-full bg-stone-800/80 text-stone-100 placeholder-stone-400 text-sm rounded-full pl-10 pr-4 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Lacak Pesanan Button */}
            {!isAdminView && (
              <button
                onClick={() => setIsOrderTrackerOpen(true)}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 hover:text-stone-100 border border-stone-700 transition"
              >
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>Lacak Pesanan</span>
              </button>
            )}

            {/* Shopping Cart button */}
            {!isAdminView && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-xs shadow-md shadow-amber-900/30 transition transform active:scale-95"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <span>Keranjang</span>
                  {cartCount > 0 && (
                    <span className="block text-[10px] font-semibold text-amber-200">
                      {formatRupiah(cartSubtotal)}
                    </span>
                  )}
                </div>
              </button>
            )}

            {/* Admin Toggle / Login Button */}
            <button
              onClick={onAdminClick}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                isAdminView
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : isAdminLoggedIn
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900/60'
                  : 'bg-stone-800/80 text-stone-300 border border-stone-700 hover:bg-stone-700'
              }`}
            >
              {isAdminLoggedIn ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isAdminView ? 'Kembali ke Toko' : 'Admin Panel'}</span>
                  {pendingApprovalsCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 animate-bounce">
                      {pendingApprovalsCount}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-stone-400" />
                  <span>Login Admin</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex sm:hidden items-center space-x-2">
            {!isAdminView && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl bg-amber-600 text-white"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-stone-800 text-stone-300 border border-stone-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-4 border-t border-stone-800 space-y-3">
            {!isAdminView && (
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kopi, makanan..."
                  className="w-full bg-stone-800 text-stone-100 placeholder-stone-400 text-sm rounded-xl pl-9 pr-3 py-2 border border-stone-700 focus:outline-none"
                />
              </div>
            )}
            <div className="flex flex-col space-y-2 pt-1">
              {!isAdminView && (
                <button
                  onClick={() => {
                    setIsOrderTrackerOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 p-2.5 rounded-xl bg-stone-800 text-stone-200 text-sm"
                >
                  <Search className="w-4 h-4 text-amber-400" />
                  <span>Lacak Pesanan Saya</span>
                </button>
              )}
              <button
                onClick={() => {
                  onAdminClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-stone-800 text-stone-200 text-sm"
              >
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>{isAdminView ? 'Kembali ke Katalog Toko' : 'Portal Kasir & Admin'}</span>
                </div>
                {pendingApprovalsCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {pendingApprovalsCount} Approval
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
