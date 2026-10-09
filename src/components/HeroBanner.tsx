import React from 'react';
import { Sparkles, MapPin, Clock, Coffee, ShieldCheck } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white border-b border-stone-800">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Headline */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Artisan Coffee & Comfort Kitchen • Freshly Roasted</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-stone-100 leading-tight">
              Nikmati Setiap Tegukan, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                Hangatkan Hari di Kopi Senja
              </span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Katalog resmi 12 menu pilihan dari seduhan kopi spesialti, minuman non-kopi segar, sajian makanan hangat, hingga pastry renyah. Pesan langsung untuk dine-in, bawa pulang, atau antar ke lokasi Anda.
            </p>

            {/* Badges / highlights */}
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-stone-300">
              <div className="flex items-center space-x-2 bg-stone-800/70 border border-stone-700/60 px-3.5 py-2 rounded-xl">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Buka Setiap Hari: 07.00 - 23.00 WIB</span>
              </div>
              <div className="flex items-center space-x-2 bg-stone-800/70 border border-stone-700/60 px-3.5 py-2 rounded-xl">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Jl. Senja Cerah No. 18, Jakarta Selatan</span>
              </div>
              <div className="flex items-center space-x-2 bg-stone-800/70 border border-stone-700/60 px-3.5 py-2 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Realtime Stock & Quick QRIS Approval</span>
              </div>
            </div>
          </div>

          {/* Banner Promo Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-amber-900/40 shadow-2xl bg-gradient-to-tr from-stone-900 to-stone-800 p-6 text-stone-100">
              <div className="flex items-start justify-between">
                <div>
                  <span className="bg-amber-600/30 text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-amber-500/30 uppercase tracking-wider">
                    Promo Spesial
                  </span>
                  <h3 className="font-serif text-xl font-bold mt-2 text-white">
                    Diskon 10% Pembayaran QRIS & Transfer
                  </h3>
                  <p className="text-xs text-stone-300 mt-1">
                    Upload bukti transfer Anda saat checkout. Verifikasi cepat oleh kasir dalam hitungan menit!
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Coffee className="w-6 h-6" />
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-stone-700/60 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-stone-800/60 border border-stone-700/40">
                  <span className="block font-bold text-base text-amber-400 font-serif">6</span>
                  <span className="text-[11px] text-stone-400">Minuman Pilihan</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-800/60 border border-stone-700/40">
                  <span className="block font-bold text-base text-amber-400 font-serif">3</span>
                  <span className="text-[11px] text-stone-400">Makanan Utama</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-800/60 border border-stone-700/40">
                  <span className="block font-bold text-base text-amber-400 font-serif">3</span>
                  <span className="text-[11px] text-stone-400">Snack & Pastry</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
