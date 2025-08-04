"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function LogoutButton() {
    return (
        <motion.button
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Cerrar Sesión"
            className="group relative flex items-center justify-center w-10 h-10 glass rounded-full border border-white/20 shadow-lg hover:shadow-red-500/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Efecto de brillo */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Ícono */}
            <motion.div
                className="relative z-10"
                whileHover={{ rotate: -15 }}
                transition={{ duration: 0.3 }}
            >
                <LogOut size={18} className="text-white group-hover:text-red-200 transition-colors duration-300" />
            </motion.div>

            {/* Tooltip */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                Cerrar Sesión
            </div>
        </motion.button>
    );
}
