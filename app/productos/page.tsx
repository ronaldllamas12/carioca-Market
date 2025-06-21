"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import RegistroProducto from "../components/RegistroProducto";
import { Search, Package, MessageCircle, Plus, Trash2, Edit, Phone, Heart, XCircle, Share2 } from 'lucide-react';
import Image from "next/image";
import { Slider } from '@mui/material';

interface Comercio {
    _id: string;
    nombre: string;
    categoria: string;
    imagen: string;
    productosVenta: string[];
    telefono: string;
    adminEmail: string;
}

interface Reseña {
    productoId: string;
    nombre: string;
    comentario: string;
    rating: number;
    fecha: string;
}

const SUPERADMIN_EMAIL = 'ronaldllamas17@gmail.com';

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
    const [favoritos, setFavoritos] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            return JSON.parse(localStorage.getItem('favoritos') || '[]');
        }
        return [];
    });
    const [mostrarSoloFavoritos, setMostrarSoloFavoritos] = useState(false);
    const [productoModal, setProductoModal] = useState<Comercio | null>(null);
    const [filtroTienda, setFiltroTienda] = useState('');
    const [filtroRating, setFiltroRating] = useState(0);
    const [filtroPrecio, setFiltroPrecio] = useState<[number, number]>([0, 10000]);
    const [reseñas, setReseñas] = useState<Reseña[]>(() => {
        if (typeof window !== 'undefined') {
            return JSON.parse(localStorage.getItem('reseñas') || '[]');
        }
        return [];
    });
    const [nuevaReseña, setNuevaReseña] = useState({ nombre: '', comentario: '', rating: 5 });
    const [mostrarModalAdmin, setMostrarModalAdmin] = useState(false);
    const [nuevoAdmin, setNuevoAdmin] = useState({ nombre: '', email: '', password: '', telefono: '' });
    const [mensajeAdmin, setMensajeAdmin] = useState('');
    const [usuariosMock, setUsuariosMock] = useState([
        { nombre: 'Ronald Llamas', email: 'ronaldllamas17@gmail.com', role: 'superadmin', password: 'password123' },
        { nombre: 'Usuario Mock', email: 'mockuser@example.com', role: 'admin', password: 'mockpassword' },
    ]);

    useEffect(() => {
        if (session?.user?.email) {
            fetch('/api/auth/check-admin')
                .then(res => res.json())
                .then(data => setIsAdmin(data.isAdmin))
                .catch(err => console.error('Error al verificar admin:', err));
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

    useEffect(() => {
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
    }, [favoritos]);

    useEffect(() => {
        localStorage.setItem('reseñas', JSON.stringify(reseñas));
    }, [reseñas]);

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

    const handleEliminarProducto = async (productoId: string) => {
        if (!isAdmin) return;

        if (window.confirm('¿Estás seguro de que deseas eliminar este Comercio?')) {
            try {
                const response = await fetch(`/api/productos/${productoId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setComercios(prev => prev.filter(p => p._id !== productoId));
                } else {
                    alert('Error al eliminar el producto');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al eliminar el producto');
            }
        }
    };

    const toggleFavorito = (id: string) => {
        setFavoritos(prev =>
            prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
        );
    };

    // Función para crear admin (solo superadmin)
    const handleCrearAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevoAdmin.nombre || !nuevoAdmin.email || !nuevoAdmin.password || !nuevoAdmin.telefono) return;
        setMensajeAdmin('');
        try {
            const res = await fetch('/api/admins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...nuevoAdmin, requester: session?.user?.email }),
            });
            const data = await res.json();
            setMensajeAdmin(data.message);
            if (res.ok) {
                setNuevoAdmin({ nombre: '', email: '', password: '', telefono: '' });
            }
        } catch (err) {
            setMensajeAdmin('Error al conectar con el servidor');
        }
    };

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>{error}</div>;
    }

    return (
        <>
            <Navbar />
            <main className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 drop-shadow-lg mb-2 text-center relative inline-block">
                        Comercios
                        <span className="block h-1 w-2/3 mx-auto bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full mt-2 animate-pulse"></span>
                    </h1>
                    <div className="flex gap-2 items-center">
                        {isAdmin && (
                            <button
                                onClick={() => setMostrarFormulario(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <Plus size={20} />
                                Agregar Comercio
                            </button>
                        )}
                    </div>
                </div>
                <div className="mb-8">
                    <div className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Buscar comercios por nombre o categoría..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full px-6 py-4 pl-12 pr-12 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                        />
                        <Search
                            className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${busqueda ? 'text-blue-500' : 'text-gray-400'}`}
                            size={24}
                        />
                        {busqueda && (
                            <button
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                                onClick={() => setBusqueda('')}
                                title="Limpiar búsqueda"
                            >
                                <XCircle size={22} />
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 justify-center mb-8">
                    {categorias.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoriaSeleccionada(cat)}
                            className={`px-6 py-2 rounded-full border-2 font-semibold text-lg transition-all ${categoriaSeleccionada === cat ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-100'}`}
                        >
                            {cat}
                        </button>
                    ))}
                    {categoriaSeleccionada && (
                        <button
                            onClick={() => setCategoriaSeleccionada(null)}
                            className="ml-2 px-4 py-2 rounded-full bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300 transition"
                        >
                            Limpiar filtro
                        </button>
                    )}
                </div>
                {comerciosFiltrados.length === 0 && (
                    <div className="text-center text-gray-500 text-lg my-12">
                        No se encontraron comercios para tu búsqueda.
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {comerciosFiltrados.map(comercio => (
                        <div key={comercio._id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-blue-300 mb-4">
                                <Image
                                    src={comercio.imagen}
                                    alt={comercio.nombre}
                                    className="w-full h-full object-cover"
                                    width={128}
                                    height={128}
                                />
                            </div>
                            <h3 className="font-bold text-2xl text-blue-700 mb-2">{comercio.nombre}</h3>
                            <div className="text-gray-600 text-sm mb-2">
                                <span className="font-semibold">Productos en venta:</span> {Array.isArray(comercio.productosVenta) ? comercio.productosVenta.join(', ') : ''}
                            </div>
                            <div className="text-gray-600 text-sm flex items-center gap-1 mb-4">
                                <Phone size={16} className="text-blue-400" /> {comercio.telefono}
                            </div>
                            <a
                                href={`https://wa.me/${comercio.telefono.replace(/[^\d]/g, "")}?text=Hola,%20quiero%20información%20sobre%20su%20comercio%20(${encodeURIComponent(comercio.nombre)})`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2"
                            >
                                <MessageCircle size={18} />
                                Contáctanos
                            </a>
                            {comercio.adminEmail && session?.user?.email === comercio.adminEmail && (
                                <button
                                    onClick={() => router.push(`/productos/editar/${comercio._id}`)}
                                    className="mt-4 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-semibold shadow hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 flex items-center gap-2"
                                >
                                    <Edit size={18} />
                                    Editar
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {mostrarFormulario && isAdmin && <RegistroProducto />}
            </main>
            {productoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fade-in">
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                            onClick={() => setProductoModal(null)}
                        >
                            <XCircle size={32} />
                        </button>
                        <div className="flex flex-col items-center gap-4">
                            <Image
                                src={productoModal.imagen}
                                alt={productoModal.nombre}
                                width={260}
                                height={260}
                                className="rounded-xl border shadow-lg"
                            />
                            <h2 className="text-2xl font-bold text-blue-700 mb-1">{productoModal.nombre}</h2>
                            <div className="text-gray-600 text-sm mb-1">
                                <span className="font-semibold">Productos de venta:</span> {Array.isArray(productoModal.productosVenta) ? productoModal.productosVenta.join(', ') : ''}
                            </div>
                            <div className="text-gray-600 text-sm flex items-center gap-1 mb-1">
                                <Phone size={14} className="text-blue-400" /> {productoModal.telefono}
                            </div>
                            <div className="mt-6 w-full">
                                <h3 className="text-lg font-bold mb-2 text-gray-800">Reseñas de clientes</h3>
                                <div className="max-h-40 overflow-y-auto mb-4">
                                    {reseñas.filter(r => r.productoId === productoModal._id).length === 0 && (
                                        <p className="text-gray-500 text-sm">Aún no hay reseñas para este producto.</p>
                                    )}
                                    {reseñas.filter(r => r.productoId === productoModal._id).map((r, idx) => (
                                        <div key={idx} className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-blue-700">{r.nombre}</span>
                                                <span className="flex items-center">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <svg key={i} className={`w-3 h-3 ${i < r.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                                                    ))}
                                                </span>
                                                <span className="text-xs text-gray-400 ml-2">{r.fecha}</span>
                                            </div>
                                            <p className="text-gray-700 text-sm">{r.comentario}</p>
                                        </div>
                                    ))}
                                </div>
                                {/* Formulario para dejar reseña */}
                                {!reseñas.some(r => r.productoId === productoModal._id && r.nombre === nuevaReseña.nombre) && (
                                    <form
                                        className="bg-blue-50 rounded-lg p-4 border border-blue-100"
                                        onSubmit={e => {
                                            e.preventDefault();
                                            if (!nuevaReseña.nombre || !nuevaReseña.comentario) return;
                                            setReseñas(prev => [
                                                ...prev,
                                                {
                                                    productoId: productoModal._id,
                                                    nombre: nuevaReseña.nombre,
                                                    comentario: nuevaReseña.comentario,
                                                    rating: nuevaReseña.rating,
                                                    fecha: new Date().toLocaleDateString(),
                                                },
                                            ]);
                                            setNuevaReseña({ nombre: '', comentario: '', rating: 5 });
                                        }}
                                    >
                                        <div className="mb-2">
                                            <input
                                                type="text"
                                                placeholder="Tu nombre"
                                                value={nuevaReseña.nombre}
                                                onChange={e => setNuevaReseña({ ...nuevaReseña, nombre: e.target.value })}
                                                className="w-full px-3 py-2 rounded border border-gray-300 focus:ring focus:ring-blue-200"
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <textarea
                                                placeholder="Tu opinión sobre la tienda o el producto..."
                                                value={nuevaReseña.comentario}
                                                onChange={e => setNuevaReseña({ ...nuevaReseña, comentario: e.target.value })}
                                                className="w-full px-3 py-2 rounded border border-gray-300 focus:ring focus:ring-blue-200"
                                                required
                                            />
                                        </div>
                                        <div className="mb-2 flex items-center gap-2">
                                            <span className="text-sm font-semibold text-gray-700">Calificación:</span>
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <button
                                                    type="button"
                                                    key={i}
                                                    onClick={() => setNuevaReseña({ ...nuevaReseña, rating: i + 1 })}
                                                    className="focus:outline-none"
                                                >
                                                    <svg className={`w-5 h-5 ${i < nuevaReseña.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            type="submit"
                                            className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold shadow hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                                        >
                                            Enviar reseña
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal para crear admin */}
            {mostrarModalAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in">
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                            onClick={() => { setMostrarModalAdmin(false); setMensajeAdmin(''); }}
                        >
                            <XCircle size={32} />
                        </button>
                        <h2 className="text-xl font-bold text-purple-700 mb-4">Crear nuevo usuario admin</h2>
                        <form onSubmit={handleCrearAdmin} className="flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={nuevoAdmin.nombre}
                                onChange={e => setNuevoAdmin({ ...nuevoAdmin, nombre: e.target.value })}
                                className="px-3 py-2 rounded border border-gray-300 focus:ring focus:ring-purple-200"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                value={nuevoAdmin.email}
                                onChange={e => setNuevoAdmin({ ...nuevoAdmin, email: e.target.value })}
                                className="px-3 py-2 rounded border border-gray-300 focus:ring focus:ring-purple-200"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={nuevoAdmin.password}
                                onChange={e => setNuevoAdmin({ ...nuevoAdmin, password: e.target.value })}
                                className="px-3 py-2 rounded border border-gray-300 focus:ring focus:ring-purple-200"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Teléfono"
                                value={nuevoAdmin.telefono}
                                onChange={e => setNuevoAdmin({ ...nuevoAdmin, telefono: e.target.value })}
                                className="px-3 py-2 rounded border border-gray-300 focus:ring focus:ring-purple-200"
                                required
                            />
                            <button
                                type="submit"
                                className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                            >
                                Crear admin
                            </button>
                        </form>
                        {mensajeAdmin && <div className="mt-4 text-center text-green-600 font-semibold">{mensajeAdmin}</div>}
                    </div>
                </div>
            )}
        </>
    );
} 