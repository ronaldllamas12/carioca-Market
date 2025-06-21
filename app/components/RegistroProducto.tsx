"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { X, Package, DollarSign, Tag, Phone, Image as ImageIcon, Info } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { CATEGORIAS } from '../config/categorias';

export default function RegistroProducto() {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        nombre: '',
        categoria: '',
        imagen: '',
        productosVenta: '',
        telefono: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre del comercio es requerido';
        }
        if (!formData.categoria) {
            newErrors.categoria = 'Selecciona una categoría';
        }
        if (!formData.productosVenta.trim()) {
            newErrors.productosVenta = 'Debes ingresar los productos en venta';
        }
        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es requerido';
        } else if (!/^[0-9]{10}$/.test(formData.telefono.replace(/\D/g, ''))) {
            newErrors.telefono = 'Ingresa un número de 10 dígitos';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Error al registrar la Tienda Virtual');
            }

            setShowSuccess(true);
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
            setErrors({ submit: 'Error al registrar La tienda Virtual' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const formatPrice = (value: string) => {
        // Remover caracteres no numéricos excepto el punto decimal
        const numericValue = value.replace(/[^\d.]/g, '');

        // Si está vacío, retornar vacío
        if (!numericValue) return '';

        // Asegurar que solo haya un punto decimal
        const parts = numericValue.split('.');
        if (parts.length > 2) {
            return parts[0] + '.' + parts.slice(1).join('');
        }

        // Limitar a dos decimales
        if (parts.length === 2) {
            return parts[0] + '.' + parts[1].slice(0, 2);
        }

        return numericValue;
    };

    const formatPhone = (value: string) => {
        // Remover caracteres no numéricos
        const numericValue = value.replace(/\D/g, '');

        // Si está vacío, retornar vacío
        if (!numericValue) return '';

        // Limitar a 10 dígitos
        return numericValue.slice(0, 10);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatPrice(e.target.value);
        setFormData(prev => ({
            ...prev,
            precio: formattedValue
        }));
        // Limpiar error si existe
        if (errors.precio) {
            setErrors(prev => ({ ...prev, precio: '' }));
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatPhone(e.target.value);
        setFormData(prev => ({
            ...prev,
            telefono: formattedValue
        }));
        // Limpiar error si existe
        if (errors.telefono) {
            setErrors(prev => ({ ...prev, telefono: '' }));
        }
    };

    if (!session) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-2xl p-4 sm:p-8 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Registrar Nuevo Comercio</h2>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-2 -m-2"
                    >
                        <X size={20} className="sm:w-6 sm:h-6" />
                    </button>
                </div>

                {showSuccess && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm sm:text-base">
                        ¡Comercio registrado exitosamente!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2 mb-1 sm:mb-2">
                                <Package size={16} className="text-blue-600" />
                                Nombre del Comercio
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Ej: Variedades Iguazu"
                                className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-sm sm:text-base ${errors.nombre ? 'border-red-500' : 'border-gray-300'
                                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            />
                            {errors.nombre && (
                                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.nombre}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2 mb-1 sm:mb-2">
                                <Tag size={16} className="text-purple-600" />
                                Categoría
                            </label>
                            <select
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleChange}
                                className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-sm sm:text-base ${errors.categoria ? 'border-red-500' : 'border-gray-300'
                                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            >
                                <option value="">Selecciona una categoría</option>
                                {CATEGORIAS.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.categoria && (
                                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.categoria}</p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2 mb-1 sm:mb-2">
                                <Package size={16} className="text-green-600" />
                                Productos en venta (separados por coma)
                            </label>
                            <textarea
                                name="productosVenta"
                                value={formData.productosVenta}
                                onChange={handleChange}
                                placeholder="Ej: Zapatos, Sandalias, Botas"
                                className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-sm sm:text-base ${errors.productosVenta ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                rows={2}
                            />
                            {errors.productosVenta && (
                                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.productosVenta}</p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2 mb-1 sm:mb-2">
                                <Phone size={16} className="text-orange-600" />
                                Teléfono de Contacto
                            </label>
                            <input
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handlePhoneChange}
                                placeholder="10 dígitos"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-sm sm:text-base ${errors.telefono ? 'border-red-500' : 'border-gray-300'
                                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            />
                            {errors.telefono && (
                                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.telefono}</p>
                            )}
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2 mb-1 sm:mb-2">
                            <ImageIcon size={16} className="text-blue-600" />
                            Imagen o Logo del Comercio
                        </label>
                        <ImageUpload
                            value={formData.imagen}
                            onChange={(url) => setFormData(prev => ({ ...prev, imagen: url }))}
                        />
                    </div>

                    {errors.submit && (
                        <div className="p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm sm:text-base">
                            {errors.submit}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <X size={16} />
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-white rounded-lg flex items-center justify-center gap-2 ${isSubmitting
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                                } transition-all duration-300`}
                        >
                            <Package size={16} />
                            {isSubmitting ? 'Registrando...' : 'Registrar Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 