import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  Check, 
  X, 
  Package, 
  ArrowUpDown,
  Coffee,
  Sparkles
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product, ProductCategory, ProductSubcategory } from '../../types';
import { formatRupiah } from '../../utils/formatters';

export const AdminProducts: React.FC = () => {
  const { 
    products, 
    isLoadingProducts, 
    saveProduct, 
    updateProductStock, 
    deleteProduct,
    showToast 
  } = useShop();

  const [categoryFilter, setCategoryFilter] = useState<'semua' | ProductCategory>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filtered product catalog
  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === 'semua' || p.category === categoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingProduct({
      id: '',
      name: '',
      category: 'minuman',
      subcategory: 'coffee',
      price: 25000,
      stock: 30,
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      badge: '',
      isPopular: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    try {
      setIsSaving(true);
      await saveProduct(editingProduct as any);
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      showToast('Gagal menyimpan produk: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setConfirmDeleteId(null);
    } catch (err: any) {
      showToast('Gagal menghapus produk: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Kelola Produk & Stok</h2>
          <p className="text-xs text-stone-400">
            Total {products.length} menu terdaftar di database Firestore (Single Source of Truth)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Menu Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-stone-900 p-4 rounded-2xl border border-stone-800">
        <div className="flex flex-wrap items-center gap-2">
          {(['semua', 'minuman', 'makanan', 'snack'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                categoryFilter === cat
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              {cat === 'semua' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama menu..."
            className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl pl-9 pr-3 py-2 border border-stone-700 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950/70 border-b border-stone-800 text-[11px] uppercase tracking-wider text-stone-400">
              <tr>
                <th className="p-4">Menu</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Harga</th>
                <th className="p-4 text-center">Stok Gudang</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-500">
                    Tidak ada produk yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOutOfStock = p.stock <= 0;
                  const isLow = p.stock > 0 && p.stock <= 5;

                  return (
                    <tr key={p.id} className="hover:bg-stone-800/40 transition">
                      
                      {/* Image & Name */}
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover bg-stone-800 flex-shrink-0 border border-stone-700"
                          />
                          <div>
                            <span className="font-bold text-white text-sm block">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">
                              {p.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 font-semibold capitalize text-[11px]">
                          {p.category}
                        </span>
                        {p.subcategory && (
                          <span className="block text-[10px] text-stone-500 mt-1 capitalize">
                            {p.subcategory}
                          </span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="p-4 font-mono font-bold text-amber-300 text-sm">
                        {formatRupiah(p.price)}
                      </td>

                      {/* Stock Quick Adjustment */}
                      <td className="p-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => updateProductStock(p.id, Math.max(0, p.stock - 1))}
                            className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold flex items-center justify-center border border-stone-700 transition"
                            title="Kurangi stok"
                          >
                            -
                          </button>
                          
                          <input
                            type="number"
                            min="0"
                            value={p.stock}
                            onChange={(e) => updateProductStock(p.id, parseInt(e.target.value) || 0)}
                            className="w-16 bg-stone-800 text-center font-bold text-white rounded-lg py-1 border border-stone-700 text-xs focus:outline-none focus:border-amber-500"
                          />

                          <button
                            onClick={() => updateProductStock(p.id, p.stock + 1)}
                            className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold flex items-center justify-center border border-stone-700 transition"
                            title="Tambah stok"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Stock Status Badge */}
                      <td className="p-4">
                        {isOutOfStock ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800/60">
                            Habis
                          </span>
                        ) : isLow ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/60 animate-pulse">
                            Menipis ({p.stock})
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                            Tersedia ({p.stock})
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
                            title="Edit Produk"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(p.id)}
                            className="p-2 rounded-xl bg-stone-800 hover:bg-rose-900/60 text-stone-300 hover:text-rose-400 transition"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Product Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl text-stone-100 overflow-hidden my-6">
            
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-white">
                {editingProduct.id ? 'Edit Data Produk' : 'Tambah Menu Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              <div>
                <label className="block text-xs text-stone-300 mb-1 font-medium">Nama Menu *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="Contoh: Kopi Susu Aren"
                  className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl px-3 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-300 mb-1 font-medium">Kategori *</label>
                  <select
                    value={editingProduct.category || 'minuman'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                    className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl px-3 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500"
                  >
                    <option value="minuman">Minuman</option>
                    <option value="makanan">Makanan</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1 font-medium">Subkategori</label>
                  <select
                    value={editingProduct.subcategory || 'coffee'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value as ProductSubcategory })}
                    className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl px-3 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500"
                  >
                    <option value="coffee">Coffee</option>
                    <option value="non-coffee">Non-Coffee</option>
                    <option value="makanan">Makanan</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-300 mb-1 font-medium">Harga (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="500"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl px-3 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1 font-medium">Stok Awal *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl px-3 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1 font-medium">Deskripsi Menu</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Bahan utama, racikan rasa..."
                  className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl p-3 border border-stone-700 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1 font-medium">URL Gambar Menu</label>
                <input
                  type="url"
                  value={editingProduct.imageUrl || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl px-3 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-300 mb-1 font-medium">Badge Label (Opsional)</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    placeholder="Signature / Favorit / Chef Special"
                    className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl px-3 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1 font-medium">Rating (1.0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={editingProduct.rating || 4.8}
                    onChange={(e) => setEditingProduct({ ...editingProduct, rating: parseFloat(e.target.value) || 4.8 })}
                    className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl px-3 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold hover:bg-stone-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-sm font-bold text-white font-serif">Hapus Produk Ini?</h3>
            <p className="text-xs text-stone-400">
              Produk akan dihapus permanen dari database Firestore dan katalog toko.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
