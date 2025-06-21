"use client";

import { ShoppingCart } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-10 max-w-screen-xxl mx-auto">
      <div className="flex gap-3">
        <a
          href="/productos"
          className="flex items-center py-0 bg-gradient-to-r from-green-200 via-green-500 to-green-400 text-white rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out"
        >
          {/* Círculo con el ícono */}
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-800 to-green-500 rounded-full mr-2 shadow-inner">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>

          {/* Texto */}
          <span className="font-semibold text-sm px-6">VER PRODUCTOS</span>
        </a>
      </div>
    </main>
  );
}
