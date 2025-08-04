"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutButton from "./LogoutButton";
import { User, ShoppingBag, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-md border-b border-white/10"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                                    <ShoppingBag className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black text-gradient bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                    Market Iguazú
                                </span>
                                <span className="text-xs text-slate-800 font-medium">Comercios Locales</span>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Navegación central */}
                    <div className="hidden md:flex items-center gap-6">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/"
                                className="flex items-center gap-2 px-4 py-2 text-slate-800 font-semibold hover:text-purple-700 transition-all duration-200 rounded-xl hover:bg-white/80 hover:shadow-md"
                            >
                                <Home className="w-4 h-4" />
                                <span className="font-medium">Inicio</span>
                            </Link>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/productos"
                                className="flex items-center gap-2 px-4 py-2 text-slate-800 font-semibold hover:text-purple-700 transition-all duration-200 rounded-xl hover:bg-white/80 hover:shadow-md"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                <span className="font-medium">Comercios</span>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Área de usuario */}
                    <div className="flex items-center gap-4">
                        {session ? (
                            <motion.div
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-white/50 shadow-lg">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="hidden sm:block">
                                        <div className="text-slate-800 font-semibold text-sm">
                                            {session.user?.name}
                                        </div>
                                        <div className="text-slate-600 text-xs">
                                            {session.user?.email}
                                        </div>
                                    </div>
                                </div>
                                <LogoutButton />
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Link
                                    href="/auth/signin"
                                    className="group relative px-6 py-2 bg-gradient-to-r from-indigo-700 to-purple-800 text-purple-800 rounded-full font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 btn-modern"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Iniciar Sesión
                                    </span>
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
} 