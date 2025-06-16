"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import RegistroProducto from "../components/RegistroProducto";
import { Search, Package, MessageCircle, Plus, Trash2, Edit, Phone } from 'lucide-react';
import io from "socket.io-client";

interface Producto {
    _id: string;
    nombre: string;
    precio: string;
    categoria: string;
    imagen: string;
    telefono: string;
    userId: string;
}

export default function ProductosPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [productos, setProductos] = useState<Producto[]>([]);
    const [categoriasFiltradas, setCategoriasFiltradas] = useState<string[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Verificar si el usuario es admin
        if (session?.user?.email) {
            fetch('/api/auth/check-admin')
                .then(res => res.json())
                .then(data => setIsAdmin(data.isAdmin))
                .catch(err => console.error('Error al verificar admin:', err));
        }
    }, [session]);

    useEffect(() => {
        const socket = io();

        socket.on('productoActualizado', (productoActualizado: Producto) => {
            setProductos(prev =>
                prev.map(p => p._id === productoActualizado._id ? productoActualizado : p)
            );
        });

        socket.on('productoEliminado', (productoId: string) => {
            setProductos(prev => prev.filter(p => p._id !== productoId));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        fetch('/api/productos')
            .then(res => res.json())
            .then(data => {
                setProductos(data);
                const categorias = [...new Set(data.map((p: Producto) => p.categoria))] as string[];
                setCategoriasFiltradas(categorias);
            })
            .catch(err => console.error('Error al cargar productos:', err));
    }, []);

    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.categoria.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleEliminarProducto = async (productoId: string) => {
        if (!isAdmin) return;

        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            try {
                const response = await fetch(`/api/productos/${productoId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setProductos(prev => prev.filter(p => p._id !== productoId));
                } else {
                    alert('Error al eliminar el producto');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al eliminar el producto');
            }
        }
    };

    return (
        <>
            <Navbar />
            <main className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Productos</h1>
                    {isAdmin && (
                        <button
                            onClick={() => setMostrarFormulario(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <Plus size={20} />
                            Agregar Producto
                        </button>
                    )}
                </div>

                <div className="mb-8">
                    <div className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Buscar productos por nombre o categoría..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full px-6 py-4 pl-12 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {categoriasFiltradas.map((cat) => (
                        <section key={cat} className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800 border-b pb-4">
                                <Package size={24} className="text-blue-600" />
                                {cat}
                            </h2>
                            <div className="grid gap-6">
                                {productosFiltrados
                                    .filter((item) => item.categoria === cat)
                                    .map((item) => (
                                        <div
                                            key={item._id}
                                            className="group bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                                        >
                                            <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                                                <img
                                                    src={item.imagen}
                                                    alt={item.nombre}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                                                {item.nombre}
                                            </h3>
                                            <p className="text-2xl font-bold text-blue-600 mb-3">
                                                {item.precio}
                                            </p>
                                            <p className="text-gray-600 text-sm mb-4 flex items-center gap-2">
                                                <Phone size={16} className="text-gray-400" />
                                                {item.telefono}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <a
                                                    href={`https://wa.me/${item.telefono.replace(/[^\d]/g, "")}?text=Hola,%20estoy%20interesado%20en%20el%20producto:%20${encodeURIComponent(item.nombre)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2"
                                                >
                                                    <MessageCircle size={18} />
                                                    Contactar
                                                </a>
                                                {isAdmin && (
                                                    <>
                                                        <button
                                                            onClick={() => handleEliminarProducto(item._id)}
                                                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold shadow hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2"
                                                        >
                                                            <Trash2 size={18} />
                                                            Eliminar
                                                        </button>
                                                        <button
                                                            onClick={() => router.push(`/productos/editar/${item._id}`)}
                                                            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-semibold shadow hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 flex items-center gap-2"
                                                        >
                                                            <Edit size={18} />
                                                            Editar
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </section>
                    ))}
                </div>
                {mostrarFormulario && isAdmin && <RegistroProducto />}
            </main>
        </>
    );
} 