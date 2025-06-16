"use client";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";

interface ImageUploadProps {
    onChange: (value: string) => void;
    value: string;
}

export default function ImageUpload({ onChange, value }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

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

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                    disabled={isUploading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                    <ImagePlus size={20} />
                    {isUploading ? 'Subiendo...' : 'Subir Imagen'}
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>
            <div className="relative w-40 h-40">
                <div className="absolute top-0 right-0 z-10">
                    <button
                        onClick={() => onChange("")}
                        type="button"
                        className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
                {value && (
                    <Image
                        fill
                        className="object-cover rounded-md"
                        alt="Imagen del producto"
                        src={value}
                    />
                )}
            </div>
        </div>
    );
} 