"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Package,
    Plus,
    Image as ImageIcon,
    Tag,
    DollarSign,
    Edit,
    Trash2,
    ShoppingCart,
    Star,
    MapPin,
    Phone,
    X
} from 'lucide-react';
import Image from "next/image";
import ImageUpload from "../../../components/ImageUpload";
import Notification from "../../../components/Notification";

interface Producto {
    _id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    categoria: string;
    disponible: boolean;
}

interface Comercio {
    _id: string;
    nombre: string;
    categoria: string;
    imagen: string;
    productosVenta: string[];
    telefono: string;
    adminEmail: string;
}

export default function ProductosComercioPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams();
    const comercioId = params.id as string;

    const [comercio, setComercio] = useState<Comercio | null>(null);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error' | 'info';
        isVisible: boolean;
    }>({ message: '', type: 'info', isVisible: false });
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
    const [newProduct, setNewProduct] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        imagen: '',
        categoria: ''
    });

    useEffect(() => {
        if (session?.user?.email) {
            fetch('/api/auth/check-admin')
                .then(res => res.json())
                .then(data => setIsAdmin(data.isAdmin))
                .catch(err => console.error('Error al verificar admin:', err));
        }
    }, [session]);

    useEffect(() => {
        if (comercioId) {
            fetchProductos();
        }
    }, [comercioId]);

    const fetchProductos = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/productos/${comercioId}/productos`);
            if (!response.ok) {
                throw new Error('Error al cargar productos');
            }
            const data = await response.json();
            setComercio(data.comercio);
            setProductos(data.productos);
        } catch (err) {
            setError('Error al cargar los productos');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        // Verificar que el usuario esté autenticado
        if (!session) {
            setNotification({
                message: 'Debes iniciar sesión para agregar productos',
                type: 'error',
                isVisible: true
            });
            return;
        }

        // Verificar que el usuario sea admin del comercio
        if (!isAdmin || session.user?.email !== comercio?.adminEmail) {
            setNotification({
                message: 'No tienes permisos para agregar productos a este comercio',
                type: 'error',
                isVisible: true
            });
            return;
        }

        try {
            const response = await fetch(`/api/productos/${comercioId}/productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newProduct,
                    precio: parseFloat(newProduct.precio)
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al agregar producto');
            }

            setShowAddForm(false);
            setNewProduct({
                nombre: '',
                descripcion: '',
                precio: '',
                imagen: '',
                categoria: ''
            });
            setNotification({
                message: 'Producto agregado exitosamente',
                type: 'success',
                isVisible: true
            });
            fetchProductos(); // Recargar productos
        } catch (err) {
            console.error('Error:', err);
            setNotification({
                message: err instanceof Error ? err.message : 'Error al agregar producto',
                type: 'error',
                isVisible: true
            });
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-slate-600">Cargando productos...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error || !comercio) {
        return (
            <>
                <Navbar />
                <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">⚠️</div>
                        <div className="text-red-600 text-lg">{error || 'Comercio no encontrado'}</div>
                        <button
                            onClick={() => router.back()}
                            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Volver
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Notification
                message={notification.message}
                type={notification.type}
                isVisible={notification.isVisible}
                onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
            />
            <main className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <motion.button
                                onClick={() => router.back()}
                                className="p-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-700" />
                            </motion.button>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-gradient bg-gradient-to-r from-slate-800 via-purple-800 to-blue-800 bg-clip-text text-transparent">
                                    Productos de {comercio.nombre}
                                </h1>
                                <p className="text-slate-600 mt-1">Descubre todos los productos disponibles</p>
                            </div>
                        </div>

                        {/* Información del comercio */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-xl">
                                    <Image
                                        src={comercio.imagen}
                                        alt={comercio.nombre}
                                        className="w-full h-full object-cover"
                                        width={128}
                                        height={128}
                                    />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                                        {comercio.nombre}
                                    </h2>
                                    <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                            {comercio.categoria}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4 text-slate-500" />
                                            <span className="text-slate-600 text-sm">Iguazú, Misiones</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-4">
                                        <a
                                            href={`https://wa.me/${comercio.telefono}?text=Hola,%20estoy%20interesado%20en%20sus%20productos.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                                        >
                                            <Phone className="w-4 h-4" />
                                            Contactar
                                        </a>
                                        {isAdmin && session?.user?.email === comercio.adminEmail && (
                                            <motion.button
                                                onClick={() => setShowAddForm(true)}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Plus className="w-4 h-4" />
                                                Agregar Producto
                                            </motion.button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Grid de productos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {productos.map((producto, index) => (
                                <motion.div
                                    key={producto._id}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover-lift border border-white/50 overflow-hidden"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    {/* Imagen del producto */}
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={producto.imagen || 'https://via.placeholder.com/300x200/f3f4f6/6b7280?text=Producto'}
                                            alt={producto.nombre}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                            width={300}
                                            height={200}
                                        />
                                        <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                                            <span className="text-xs font-semibold text-slate-700">
                                                {producto.categoria}
                                            </span>
                                        </div>
                                        {!producto.disponible && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="text-white font-semibold">No disponible</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Información del producto */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                                            {producto.nombre}
                                        </h3>
                                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                            {producto.descripcion}
                                        </p>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-green-500" />
                                                <span className="text-2xl font-bold text-green-600">
                                                    ${producto.precio}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm text-slate-600">4.8</span>
                                            </div>
                                        </div>

                                        {/* Botones de acción */}
                                        <div className="flex gap-2">
                                            <motion.button
                                                onClick={() => {
                                                    setSelectedProduct(producto);
                                                    setShowProductDetails(true);
                                                }}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                Ver Detalles
                                            </motion.button>
                                            {isAdmin && session?.user?.email === comercio.adminEmail && (
                                                <motion.button
                                                    className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Mensaje si no hay productos */}
                    {productos.length === 0 && (
                        <motion.div
                            className="text-center py-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="text-6xl mb-4">📦</div>
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">
                                No hay productos disponibles
                            </h3>
                            <p className="text-slate-600 mb-6">
                                Este comercio aún no ha agregado productos a su catálogo.
                            </p>
                            {isAdmin && session?.user?.email === comercio.adminEmail ? (
                                <motion.button
                                    onClick={() => setShowAddForm(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Plus className="w-5 h-5 inline mr-2" />
                                    Agregar Primer Producto
                                </motion.button>
                            ) : !session ? (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md mx-auto">
                                    <p className="text-blue-700 text-sm">
                                        💡 <strong>¿Eres el dueño de este comercio?</strong><br />
                                        Inicia sesión para agregar productos a tu catálogo.
                                    </p>
                                </div>
                            ) : null}
                        </motion.div>
                    )}

                    {/* Modal para agregar producto */}
                    {showAddForm && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                            <motion.div
                                className="bg-white/95 backdrop-blur-md rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/20"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                            >
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Agregar Producto</h3>
                                <form onSubmit={handleAddProduct} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Nombre del Producto
                                        </label>
                                        <input
                                            type="text"
                                            value={newProduct.nombre}
                                            onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Descripción
                                        </label>
                                        <textarea
                                            value={newProduct.descripcion}
                                            onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300"
                                            rows={3}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Precio
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={newProduct.precio}
                                                onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Categoría
                                            </label>
                                            <input
                                                type="text"
                                                value={newProduct.categoria}
                                                onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <ImageUpload
                                            value={newProduct.imagen}
                                            onChange={(url) => setNewProduct({ ...newProduct, imagen: url })}
                                            label="Imagen del Producto"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
                                            className="flex-1 px-4 py-3 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                                        >
                                            Agregar Producto
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}

                    {/* Modal de detalles del producto */}
                    {showProductDetails && selectedProduct && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                            <motion.div
                                className="bg-white/95 backdrop-blur-md rounded-3xl p-6 w-full max-w-2xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                            >
                                {/* Header del modal */}
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                            {selectedProduct.nombre}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                                {selectedProduct.categoria}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm text-slate-600">4.8 (15 reseñas)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <motion.button
                                        onClick={() => setShowProductDetails(false)}
                                        className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <X className="w-6 h-6" />
                                    </motion.button>
                                </div>

                                {/* Imagen del producto */}
                                <div className="relative mb-6">
                                    <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl">
                                        <Image
                                            src={selectedProduct.imagen || 'https://via.placeholder.com/600x400/f3f4f6/6b7280?text=Producto'}
                                            alt={selectedProduct.nombre}
                                            className="w-full h-full object-cover"
                                            fill
                                        />
                                        {!selectedProduct.disponible && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="text-white font-bold text-xl">No disponible</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Información del producto */}
                                <div className="space-y-6">
                                    {/* Precio */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-6 h-6 text-green-500" />
                                            <span className="text-3xl font-bold text-green-600">
                                                ${selectedProduct.precio}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-slate-500">Disponibilidad</div>
                                            <div className={`font-semibold ${selectedProduct.disponible ? 'text-green-600' : 'text-red-600'}`}>
                                                {selectedProduct.disponible ? 'En stock' : 'Agotado'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Descripción */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-800 mb-3">Descripción</h4>
                                        <p className="text-slate-600 leading-relaxed">
                                            {selectedProduct.descripcion}
                                        </p>
                                    </div>

                                    {/* Información del comercio */}
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <h4 className="text-lg font-semibold text-slate-800 mb-3">Información del Comercio</h4>
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                                                <Image
                                                    src={comercio.imagen}
                                                    alt={comercio.nombre}
                                                    className="w-full h-full object-cover"
                                                    width={48}
                                                    height={48}
                                                />
                                            </div>
                                            <div>
                                                <h5 className="font-semibold text-slate-800">{comercio.nombre}</h5>
                                                <p className="text-sm text-slate-600">{comercio.categoria}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <motion.a
                                            href={`https://wa.me/${comercio.telefono}?text=Hola,%20estoy%20interesado%20en%20el%20producto%20${selectedProduct.nombre}%20($${selectedProduct.precio})`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Phone className="w-5 h-5" />
                                            Contactar por WhatsApp
                                        </motion.a>
                                        <motion.button
                                            onClick={() => setShowProductDetails(false)}
                                            className="flex-1 px-6 py-3 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors font-semibold"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Cerrar
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
} 