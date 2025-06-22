"use client";

import { ShoppingCart } from 'lucide-react';

export default function Home() {
  return (
    <main
      className="flex flex-col items-center justify-end min-h-screen p-10 pb-12 max-w-screen-xxl mx-auto"
      style={{
        backgroundImage: "url('/Bienvenido al Marketplace Iguazú.png')",
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'black',
      }}
    >
      <div className="flex gap-3">
        <a
          href="/productos"
          className="group flex items-center py-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out animate-bounce hover:animate-none"
        >
          {/* Círculo con el ícono */}
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full mr-2 shadow-inner group-hover:scale-110 transition-transform duration-300">
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
