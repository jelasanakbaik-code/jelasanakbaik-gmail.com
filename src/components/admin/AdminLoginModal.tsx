import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  KeyRound, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface AdminLoginModalProps {
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onSuccess }) => {
  const { 
    isAdminLoginOpen, 
    setIsAdminLoginOpen, 
    loginAdmin, 
    showToast 
  } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isAdminLoginOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = loginAdmin(email, password);
    if (success) {
      setIsAdminLoginOpen(false);
      onSuccess();
    } else {
      setError('Email atau password tidak sesuai. Gunakan tombol login cepat di bawah.');
    }
  };

  const handleQuickLogin = () => {
    loginAdmin('jelasanakbaik@gmail.com', 'admin123');
    setIsAdminLoginOpen(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl text-stone-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">Login Admin Toko</h2>
              <p className="text-xs text-stone-400">Kelola produk, approval pembayaran & laporan</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminLoginOpen(false)}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-stone-300 mb-1 font-medium">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kopisenja.com atau jelasanakbaik@gmail.com"
                className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl pl-10 pr-3 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-stone-300 mb-1 font-medium">
              Kata Sandi / PIN
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi kasir"
                className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl pl-10 pr-3 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
          >
            <span>Masuk ke Admin Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Login Option */}
          <div className="pt-3 border-t border-stone-800 text-center">
            <span className="text-[11px] text-stone-400 block mb-2">Akses Cepat Pengelola:</span>
            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 text-xs font-semibold flex items-center justify-center space-x-2 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Login Instan: jelasanakbaik@gmail.com</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
