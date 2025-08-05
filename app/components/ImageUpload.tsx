"use client";

import { X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface ImageUploadProps {
    onChange: (value: string) => void;
    value: string;
    label?: string;
}

export default function ImageUpload({ onChange, value, label = "Imagen" }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await uploadFile(file);
    };

    const uploadFile = async (file: File) => {
        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                onChange(data.url);
            } else {
                console.error('Error al subir la imagen:', data.error);
                alert('Error al subir la imagen');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al subir la imagen');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await uploadFile(e.dataTransfer.files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {label}
                </label>
            )}

            <div className="relative">
                {/* Área de upload */}
                <motion.div
                    className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${dragActive
                            ? 'border-purple-500 bg-purple-50'
                            : value
                                ? 'border-green-300 bg-green-50'
                                : 'border-slate-300 bg-slate-50 hover:border-purple-400 hover:bg-purple-50'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {value ? (
                        // Imagen subida
                        <div className="relative">
                            <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                <Image
                                    src={value}
                                    alt="Imagen subida"
                                    className="object-cover"
                                    fill
                                />
                                <div className="absolute inset-0 bg-black/20"></div>
                            </div>

                            {/* Botón de eliminar */}
                            <motion.button
                                type="button"
                                onClick={() => onChange("")}
                                className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X size={16} />
                            </motion.button>

                            {/* Overlay de éxito */}
                            <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
                                ✓ Imagen subida
                            </div>
                        </div>
                    ) : (
                        // Área de upload vacía
                        <div className="text-center">
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                                    <p className="text-slate-600 font-medium">Subiendo imagen...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                        <Upload className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-slate-700 font-medium mb-1">
                                            Arrastra una imagen aquí o haz clic
                                        </p>
                                        <p className="text-slate-500 text-sm">
                                            PNG, JPG, GIF hasta 10MB
                                        </p>
                                    </div>
                                    <motion.button
                                        type="button"
                                        onClick={handleClick}
                                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Seleccionar Archivo
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Input de archivo oculto */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>

            {/* Información adicional */}
            {!value && !isUploading && (
                <p className="text-xs text-slate-500 mt-2">
                    Las imágenes se guardan en Cloudinary de forma segura
                </p>
            )}
        </div>
    );
}
