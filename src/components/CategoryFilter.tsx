import React from 'react';
import { Coffee, UtensilsCrossed, Cookie, Sparkles } from 'lucide-react';
import { ProductCategory, ProductSubcategory } from '../types';

interface CategoryFilterProps {
  activeCategory: 'semua' | ProductCategory;
  setActiveCategory: (cat: 'semua' | ProductCategory) => void;
  activeSubcategory: 'semua' | ProductSubcategory;
  setActiveSubcategory: (sub: 'semua' | ProductSubcategory) => void;
  counts: {
    semua: number;
    minuman: number;
    makanan: number;
    snack: number;
  };
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  setActiveCategory,
  activeSubcategory,
  setActiveSubcategory,
  counts,
}) => {
  return (
    <div className="space-y-4">
      {/* Main Category Tabs */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        <button
          onClick={() => {
            setActiveCategory('semua');
            setActiveSubcategory('semua');
          }}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm ${
            activeCategory === 'semua'
              ? 'bg-amber-600 text-white shadow-amber-900/30'
              : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Semua Menu</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${
            activeCategory === 'semua' ? 'bg-amber-700 text-amber-100' : 'bg-stone-700 text-stone-400'
          }`}>
            {counts.semua}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('minuman');
            setActiveSubcategory('semua');
          }}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm ${
            activeCategory === 'minuman'
              ? 'bg-amber-600 text-white shadow-amber-900/30'
              : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/60'
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>Minuman</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${
            activeCategory === 'minuman' ? 'bg-amber-700 text-amber-100' : 'bg-stone-700 text-stone-400'
          }`}>
            {counts.minuman}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('makanan');
            setActiveSubcategory('semua');
          }}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm ${
            activeCategory === 'makanan'
              ? 'bg-amber-600 text-white shadow-amber-900/30'
              : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/60'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Makanan</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${
            activeCategory === 'makanan' ? 'bg-amber-700 text-amber-100' : 'bg-stone-700 text-stone-400'
          }`}>
            {counts.makanan}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('snack');
            setActiveSubcategory('semua');
          }}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm ${
            activeCategory === 'snack'
              ? 'bg-amber-600 text-white shadow-amber-900/30'
              : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/60'
          }`}
        >
          <Cookie className="w-4 h-4" />
          <span>Snack & Pastry</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${
            activeCategory === 'snack' ? 'bg-amber-700 text-amber-100' : 'bg-stone-700 text-stone-400'
          }`}>
            {counts.snack}
          </span>
        </button>
      </div>

      {/* Subcategory sub-chips if Minuman is selected */}
      {activeCategory === 'minuman' && (
        <div className="flex items-center space-x-2 pt-1 pl-1">
          <span className="text-xs text-stone-400 font-medium mr-1">Varian Minuman:</span>
          <button
            onClick={() => setActiveSubcategory('semua')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              activeSubcategory === 'semua'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700'
            }`}
          >
            Semua Minuman
          </button>
          <button
            onClick={() => setActiveSubcategory('coffee')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              activeSubcategory === 'coffee'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700'
            }`}
          >
            ☕ Coffee Based
          </button>
          <button
            onClick={() => setActiveSubcategory('non-coffee')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              activeSubcategory === 'non-coffee'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700'
            }`}
          >
            🍵 Non-Coffee / Tea / Choco
          </button>
        </div>
      )}
    </div>
  );
};
