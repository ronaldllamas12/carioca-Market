"use client";

import { ShoppingCart, Sparkles, MapPin, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Fondo animado con partículas */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/Bienvenido al Marketplace Iguazú.png')] bg-cover bg-center bg-no-repeat opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/40 to-black/60"></div>
        
        {/* Partículas flotantes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 md:px-10 pb-12">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Badge de bienvenida */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-white/90 text-sm font-medium">Bienvenido a Iguazú</span>
          </motion.div>

          {/* Título principal */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="text-gradient bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Marketplace
            </span>
            <br />
            <span className="text-gradient bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
              Iguazú
            </span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Descubre los mejores comercios locales y conecta con la comunidad de Iguazú
          </motion.p>

          {/* Estadísticas */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-2 mx-auto">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-white/70 text-sm">Comercios</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mb-2 mx-auto">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-white/70 text-sm">Local</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-2 mx-auto">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">4.8</div>
              <div className="text-white/70 text-sm">Calificación</div>
            </div>
          </motion.div>

          {/* Botón principal mejorado */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.a
              href="/productos"
              className="group relative inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-full text-lg font-bold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 btn-modern"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Efecto de brillo */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Ícono animado */}
              <motion.div
                className="relative flex items-center justify-center w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <ShoppingCart className="w-6 h-6 text-white" />
              </motion.div>

              {/* Texto */}
              <span className="relative">Explorar Comercios</span>

              {/* Flecha animada */}
              <motion.div
                className="relative w-6 h-6"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.div>
            </motion.a>
          </motion.div>

          {/* Texto adicional */}
          <motion.p
            className="text-white/60 text-sm mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            ✨ Conecta con comerciantes locales • 🚀 Encuentra productos únicos • 💫 Apoya la economía local
          </motion.p>
        </motion.div>
      </div>

      {/* Ola decorativa en la parte inferior */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-16 md:h-24"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-white/5"
          ></path>
        </svg>
      </div>
    </main>
  );
}