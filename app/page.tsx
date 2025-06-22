"use client";

import { ShoppingCart } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-10 max-w-screen-xxl mx-auto">
      <div className="flex gap-3">
        <a
          href="/productos"
          className="group flex items-center py-0 bg-gradient-to-r from-green-400 via-green-600 to-green-500 text-white rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out"
        >
          {/* Círculo con el ícono */}
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-700 to-green-500 rounded-full mr-2 shadow-inner group-hover:scale-110 transition-transform duration-300 animate-pulse group-hover:animate-none">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>

          {/* Texto */}
          <span className="font-bold text-sm px-6 tracking-wide group-hover:tracking-wider transition-all duration-300">
            VER COMERCIOS
          </span>
        </a>
      </div>
    </main>
  );
}
