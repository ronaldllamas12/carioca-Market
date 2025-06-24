"use client";

import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen px-6 md:px-10 pb-12 max-w-screen-xxl mx-auto bg-black relative overflow-hidden"
      style={{
        backgroundImage: "url('/Bienvenido al Marketplace Iguazú.png')",
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Capa oscura para mejor visibilidad */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-15"></div>

      <motion.div
        className="flex flex-col items-center text-center z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Título grande */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-8">
          Bienvenido al Marketplace Iguazú
        </h1>

        {/* Botón premium */}
        <motion.a
          href="/productos"
          className="group flex items-center py-3 md:py-4 px-6 md:px-8 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full shadow-2xl hover:shadow-inner transition-all duration-300"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Ícono circular animado */}
          <motion.div
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300"
            whileHover={{ scale: 1.15 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </motion.div>

          {/* Texto */}
          <span className="font-bold text-lg md:text-xl tracking-wide group-hover:tracking-widest transition-all duration-300">
            VER COMERCIOS
          </span>
        </motion.a>
      </motion.div>
    </main>
  );
}