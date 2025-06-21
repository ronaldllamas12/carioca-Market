"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ImageUpload from '../../../components/ImageUpload';
import { Package, Tag, Phone, Image as ImageIcon, Info } from 'lucide-react';
import React from 'react';
import { CATEGORIAS } from '../../../config/categorias';

export default function EditarComercio() {
    const router = useRouter();
    const params = useParams();
    const [formData, setFormData] = useState({
        nombre: '',
        categoria: '',
        imagen: '',
        productosVenta: '',
        telefono: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!params?.id) return;
        fetch(`/api/productos/${params.id}`)
            .then(res => res.json())
            .then(data => {
                if (data && data._id) {
                    setFormData({
                        nombre: data.nombre || '',
                        categoria: data.categoria || '',
                        imagen: data.imagen || '',
                        productosVenta: Array.isArray(data.productosVenta) ? data.productosVenta.join(', ') : '',
                        telefono: data.telefono || ''
                    });
                } else {
                    setError('No se encontró el comercio');
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Error al cargar el comercio');
                setLoading(false);
            });
    }, [params?.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await fetch(`/api/productos/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    productosVenta: formData.productosVenta
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error al actualizar');
            setSuccess('¡Comercio actualizado exitosamente!');
            setTimeout(() => router.push('/productos'), 1500);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocurrió un error inesperado');
            }
        }
    };

    if (loading) return <div className="text-center py-12">Cargando...</div>;
    if (error) return <div className="text-center text-red-500 py-12">{error}</div>;

    return (
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Editar Comercio</h2>
            {success && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Package size={16} className="text-blue-600" /> Nombre del Comercio
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Tag size={16} className="text-purple-600" /> Categoría
                    </label>
                    <select
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Selecciona una categoría</option>
                        {CATEGORIAS.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Package size={16} className="text-green-600" /> Productos en venta (separados por coma)
                    </label>
                    <textarea
                        name="productosVenta"
                        value={formData.productosVenta}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Phone size={16} className="text-orange-600" /> Teléfono de Contacto
                    </label>
                    <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <ImageIcon size={16} className="text-blue-600" /> Imagen o Logo del Comercio
                    </label>
                    <ImageUpload
                        value={formData.imagen}
                        onChange={url => setFormData(prev => ({ ...prev, imagen: url }))}
                    />
                    <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                        <Info size={14} /> Recomendado: Imagen cuadrada de al menos 800x800px
                    </p>
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-semibold shadow hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300"
                >
                    Guardar Cambios
                </button>
            </form>
        </div>
    );
} 