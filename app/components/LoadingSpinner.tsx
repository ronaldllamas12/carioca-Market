"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function LoadingSpinner({ size = "md", text = "Cargando..." }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        {/* Círculo exterior */}
        <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
        
        {/* Círculo animado */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 border-r-pink-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Círculo interior */}
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-blue-200"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Punto central */}
        <motion.div
          className="absolute inset-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
      
      {text && (
        <motion.p
          className="text-slate-600 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Variante para pantalla completa
export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center z-50">
      <LoadingSpinner size="lg" text="Cargando Marketplace..." />
    </div>
  );
}

// Variante para cards
export function CardLoader() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
      <LoadingSpinner size="md" text="Cargando comercios..." />
    </div>
  );
} 