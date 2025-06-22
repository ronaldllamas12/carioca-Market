"use client";

import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main
      className="flex flex-col items-center justify-end min-h-screen p-6 md:p-10 pb-12 max-w-screen-xxl mx-auto bg-black bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: "url('/Bienvenido al Marketplace Iguazú.png')",
      }}
    >
      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.a
          href="/productos"
          className="group flex items-center py-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Círculo con el ícono */}
          <motion.div
            className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full mr-2 shadow-inner"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <ShoppingCart className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </motion.div>

          {/* Texto */}
          <span className="font-bold text-sm md:text-base px-4 md:px-6 tracking-wide group-hover:tracking-wider transition-all duration-300">
            VER COMERCIOS
          </span>
        </motion.a>
      </motion.div>
    </main>
  );
}