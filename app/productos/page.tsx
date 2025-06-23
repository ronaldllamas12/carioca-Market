"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import RegistroProducto from "../components/RegistroProducto";
import { Search, MessageCircle, Plus, Edit, XCircle } from 'lucide-react';
import Image from "next/image";

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
                            placeholder="Buscar por comercio, categoría o producto..."
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
                <div className="max-w-4xl mx-auto space-y-6">
                    {comerciosFiltrados.map(comercio => (
                        <div key={comercio._id} className="bg-white rounded-xl shadow-lg p-6 transform transition duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-100">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-3 border-blue-300 shadow-lg flex-shrink-0">
                                    <Image
                                        src={comercio.imagen}
                                        alt={comercio.nombre}
                                        className="w-full h-full object-cover"
                                        width={128}
                                        height={128}
                                    />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="font-serif text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-purple-700 to-indigo-800 mb-3 font-bold tracking-wide">
                                        {comercio.nombre}
                                    </h3>
                                    <div className="text-gray-700 text-base mb-4 leading-relaxed">
                                        <span className="font-semibold text-gray-800">Productos en venta:</span>
                                        <div className="mt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                                            {Array.isArray(comercio.productosVenta) ?
                                                comercio.productosVenta.map((producto, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-block px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                                                    >
                                                        {producto}
                                                    </span>
                                                )) : ''
                                            }
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-3 mt-4">
                                        {isAdmin && session?.user?.email === comercio.adminEmail && (
                                            <button
                                                onClick={() => router.push(`/productos/editar/${comercio._id}`)}
                                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-semibold shadow-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105"
                                            >
                                                <Edit size={18} /> Editar
                                            </button>
                                        )}
                                        <a
                                            href={`https://wa.me/${comercio.telefono}?text=Hola,%20estoy%20interesado%20en%20sus%20productos.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-semibold shadow-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
                                        >
                                            <MessageCircle size={18} /> Contáctanos
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {mostrarFormulario && isAdmin && <RegistroProducto />}
            </main>
        </>
    );
} 