"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import RegistroProducto from "../components/RegistroProducto";
import { Search, MessageCircle, Plus, Edit, XCircle, Filter, MapPin, Star, Package } from 'lucide-react';
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Comercio {
    _id: string;
    nombre: string;
    categoria: string;
    imagen: string;
    productosVenta: string[];
    telefono: string;
    adminEmail: string;
}

export default function ComerciosPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [comercios, setComercios] = useState<Comercio[]>([]);
    const [categorias, setCategorias] = useState<string[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
    const [busqueda, setBusqueda] = useState("");
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (session?.user && 'role' in session.user && (session.user as { role?: string }).role === 'admin') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, [session]);

    useEffect(() => {
        fetch('/api/productos')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setComercios(data);
                    const cats = [...new Set(data.map((c: Comercio) => c.categoria))] as string[];
                    setCategorias(cats);
                    setError('');
                } else {
                    setError('No se pudieron cargar los comercios.');
                }
            })
            .catch(() => setError('Error al conectar con el servidor.'));
    }, []);

    const comerciosFiltrados = comercios.filter(comercio =>
        (categoriaSeleccionada ? comercio.categoria === categoriaSeleccionada : true) &&
        (
            comercio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            comercio.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
            (Array.isArray(comercio.productosVenta) &&
                comercio.productosVenta.some(producto => producto.toLowerCase().includes(busqueda.toLowerCase()))
            )
        )
    );

    if (error) {
        return (
            <>
                <Navbar />
                <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">⚠️</div>
                        <div className="text-red-600 text-lg">{error}</div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-black text-gradient bg-gradient-to-r from-slate-800 via-purple-800 to-blue-800 bg-clip-text text-transparent mb-4">
                            Comercios Locales
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Descubre los mejores comercios de Iguazú y conecta directamente con ellos
                        </p>
                    </motion.div>

                    {/* Controles superiores */}
                    <motion.div
                        className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {isAdmin && (
                            <motion.button
                                onClick={() => setMostrarFormulario(true)}
                                className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 btn-modern"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Plus size={20} />
                                    Agregar Comercio
                                </span>
                            </motion.button>
                        )}
                    </motion.div>

                    {/* Barra de búsqueda */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="relative max-w-2xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar por comercio, categoría o producto..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="w-full px-6 py-4 pl-14 pr-14 bg-white/80 backdrop-blur-sm border-2 border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 text-slate-700 placeholder-slate-500"
                                />
                                <Search
                                    className={`absolute left-5 top-1/2 transform -translate-y-1/2 ${busqueda ? 'text-purple-500' : 'text-slate-400'}`}
                                    size={20}
                                />
                                {busqueda && (
                                    <button
                                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
                                        onClick={() => setBusqueda('')}
                                        title="Limpiar búsqueda"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Filtros de categorías */}
                    <motion.div
                        className="flex flex-wrap gap-3 justify-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="flex items-center gap-2 text-slate-600 font-medium">
                            <Filter size={16} />
                            <span>Categorías:</span>
                        </div>
                        {categorias.map((cat, index) => (
                            <motion.button
                                key={cat}
                                onClick={() => setCategoriaSeleccionada(cat)}
                                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${categoriaSeleccionada === cat
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                    : 'bg-white/80 backdrop-blur-sm text-slate-700 border border-white/50 hover:bg-white hover:shadow-md'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                {cat}
                            </motion.button>
                        ))}
                        {categoriaSeleccionada && (
                            <motion.button
                                onClick={() => setCategoriaSeleccionada(null)}
                                className="px-4 py-2 rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Limpiar filtro
                            </motion.button>
                        )}
                    </motion.div>

                    {/* Resultados */}
                    {comerciosFiltrados.length === 0 && (
                        <motion.div
                            className="text-center text-slate-500 text-lg my-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="text-6xl mb-4">🔍</div>
                            <p>No se encontraron comercios para tu búsqueda.</p>
                            <p className="text-sm mt-2">Intenta con otros términos o categorías</p>
                        </motion.div>
                    )}

                    {/* Grid de comercios */}
                    <div className="max-w-6xl mx-auto">
                        <AnimatePresence>
                            {comerciosFiltrados.map((comercio, index) => (
                                <motion.div
                                    key={comercio._id}
                                    className="mb-6"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover-lift border border-white/50 overflow-hidden">
                                        <div className="p-8">
                                            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                                                {/* Imagen */}
                                                <motion.div
                                                    className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden shadow-xl flex-shrink-0"
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {typeof comercio.imagen === 'string' && comercio.imagen ? (
                                                        <Image
                                                            src={comercio.imagen}
                                                            alt={comercio.nombre}
                                                            className="w-full h-full object-cover"
                                                            width={160}
                                                            height={160}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                            <span className="text-gray-500 text-xs">Sin imagen</span>
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                                    <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                                                        <span className="text-xs font-semibold text-slate-700">{comercio.categoria}</span>
                                                    </div>
                                                </motion.div>

                                                {/* Contenido */}
                                                <div className="flex-1 text-center lg:text-left">
                                                    <h3 className="text-3xl lg:text-4xl font-black text-gradient bg-gradient-to-r from-slate-800 via-purple-800 to-blue-800 bg-clip-text text-transparent mb-4">
                                                        {comercio.nombre}
                                                    </h3>

                                                    <div className="mb-6">
                                                        <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                                                            <MapPin className="w-4 h-4 text-purple-500" />
                                                            <span className="text-slate-600 font-medium">Iguazú, Misiones</span>
                                                        </div>
                                                        <div className="flex items-center justify-center lg:justify-start gap-1 mb-4">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} />
                                                            ))}
                                                            <span className="text-slate-600 text-sm ml-2">(4.8)</span>
                                                        </div>
                                                    </div>

                                                    <div className="mb-6">
                                                        <h4 className="font-semibold text-slate-800 mb-3">Productos en venta:</h4>
                                                        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                                                            {Array.isArray(comercio.productosVenta) ?
                                                                comercio.productosVenta.map((producto, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="inline-block px-3 py-1 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200"
                                                                    >
                                                                        {producto}
                                                                    </span>
                                                                )) : ''
                                                            }
                                                        </div>
                                                    </div>

                                                    {/* Botones de acción */}
                                                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-3">
                                                        <motion.button
                                                            onClick={() => router.push(`/productos/${comercio._id}/productos`)}
                                                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <Package size={18} /> Ver Productos
                                                        </motion.button>
                                                        {isAdmin && session?.user?.email === comercio.adminEmail && (
                                                            <motion.button
                                                                onClick={() => router.push(`/productos/editar/${comercio._id}`)}
                                                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-yellow-500/25 transition-all duration-300"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                <Edit size={18} /> Editar
                                                            </motion.button>
                                                        )}
                                                        <motion.a
                                                            href={`https://wa.me/${comercio.telefono}?text=Hola,%20estoy%20interesado%20en%20sus%20productos.`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <MessageCircle size={18} /> Contáctanos
                                                        </motion.a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Modal de formulario */}
                    {mostrarFormulario && isAdmin && <RegistroProducto />}
                </div>
            </main>
        </>
    );
}
