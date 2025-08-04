"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { X, Package, Tag, Phone, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { CATEGORIAS } from '../config/categorias';
import { motion, AnimatePresence } from 'framer-motion';

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

    const formatPhone = (value: string) => {
        // Remover caracteres no numéricos
        const numericValue = value.replace(/\D/g, '');

        // Si está vacío, retornar vacío
        if (!numericValue) return '';

        // Limitar a 10 dígitos
        return numericValue.slice(0, 10);
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
        <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white/95 backdrop-blur-md rounded-3xl p-6 w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl border border-white/20"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-gradient bg-gradient-to-r from-slate-800 via-purple-800 to-blue-800 bg-clip-text text-transparent">
                            Registrar Nuevo Comercio
                        </h2>
                        <p className="text-slate-600 text-sm mt-1">Completa la información de tu comercio</p>
                    </div>
                    <motion.button
                        onClick={() => window.location.reload()}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-2 -m-2 rounded-full hover:bg-slate-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <X size={20} />
                    </motion.button>
                </div>

                {/* Mensaje de éxito */}
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl flex items-center gap-3"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-green-700 font-medium">¡Comercio registrado exitosamente!</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre del Comercio */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                                <Package size={16} className="text-purple-500" />
                                Nombre del Comercio
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Ej: Variedades Iguazu"
                                className={`w-full px-4 py-3 rounded-xl border-2 text-sm transition-all duration-300 ${errors.nombre
                                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-slate-200 bg-white/80 focus:border-purple-500 focus:ring-purple-500/20'
                                    } focus:outline-none focus:ring-4`}
                            />
                            {errors.nombre && (
                                <motion.p
                                    className="mt-2 text-sm text-red-500 flex items-center gap-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <AlertCircle size={14} />
                                    {errors.nombre}
                                </motion.p>
                            )}
                        </motion.div>

                        {/* Categoría */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                                <Tag size={16} className="text-blue-500" />
                                Categoría
                            </label>
                            <select
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border-2 text-sm transition-all duration-300 ${errors.categoria
                                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-slate-200 bg-white/80 focus:border-blue-500 focus:ring-blue-500/20'
                                    } focus:outline-none focus:ring-4`}
                            >
                                <option value="">Selecciona una categoría</option>
                                {CATEGORIAS.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.categoria && (
                                <motion.p
                                    className="mt-2 text-sm text-red-500 flex items-center gap-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <AlertCircle size={14} />
                                    {errors.categoria}
                                </motion.p>
                            )}
                        </motion.div>

                        {/* Productos en venta */}
                        <motion.div
                            className="md:col-span-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                                <Package size={16} className="text-green-500" />
                                Productos en venta (separados por coma)
                            </label>
                            <textarea
                                name="productosVenta"
                                value={formData.productosVenta}
                                onChange={handleChange}
                                placeholder="Ej: Zapatos, Sandalias, Botas"
                                className={`w-full px-4 py-3 rounded-xl border-2 text-sm transition-all duration-300 ${errors.productosVenta
                                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-slate-200 bg-white/80 focus:border-green-500 focus:ring-green-500/20'
                                    } focus:outline-none focus:ring-4`}
                                rows={3}
                            />
                            {errors.productosVenta && (
                                <motion.p
                                    className="mt-2 text-sm text-red-500 flex items-center gap-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <AlertCircle size={14} />
                                    {errors.productosVenta}
                                </motion.p>
                            )}
                        </motion.div>

                        {/* Teléfono */}
                        <motion.div
                            className="md:col-span-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                                <Phone size={16} className="text-orange-500" />
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
                                className={`w-full px-4 py-3 rounded-xl border-2 text-sm transition-all duration-300 ${errors.telefono
                                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-slate-200 bg-white/80 focus:border-orange-500 focus:ring-orange-500/20'
                                    } focus:outline-none focus:ring-4`}
                            />
                            {errors.telefono && (
                                <motion.p
                                    className="mt-2 text-sm text-red-500 flex items-center gap-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <AlertCircle size={14} />
                                    {errors.telefono}
                                </motion.p>
                            )}
                        </motion.div>
                    </div>

                    {/* Imagen */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                            <ImageIcon size={16} className="text-purple-500" />
                            Imagen o Logo del Comercio
                        </label>
                        <div className="bg-slate-50 rounded-xl p-4 border-2 border-dashed border-slate-200">
                            <ImageUpload
                                value={formData.imagen}
                                onChange={(url) => setFormData(prev => ({ ...prev, imagen: url }))}
                            />
                        </div>
                    </motion.div>

                    {/* Error de envío */}
                    <AnimatePresence>
                        {errors.submit && (
                            <motion.div
                                className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl flex items-center gap-3"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <span className="text-red-700 font-medium">{errors.submit}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Botones */}
                    <motion.div
                        className="flex flex-col sm:flex-row justify-end gap-4 pt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <motion.button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all duration-300 flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <X size={16} />
                            Cancelar
                        </motion.button>
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${isSubmitting
                                    ? 'bg-slate-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/25'
                                }`}
                            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                        >
                            <Package size={16} />
                            {isSubmitting ? 'Registrando...' : 'Registrar Comercio'}
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </motion.div>
    );
} 