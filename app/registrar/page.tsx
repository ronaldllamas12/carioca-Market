"use client";
import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import Image from "next/image";

const categorias = ["Electrónica",
    "Ropa",
    "Hogar",
    "Deportes",
    "Juguetes",
    "Libros",
    "Mascotas",
    "viverres y Abarrotes",
    "Tecnologia",
    "Perfumeria",
    "Comida Rapida",
    "Restaurante",
    "Belleza y cosmetologia",
    "Turismo",
    "Construccion",
    "Variedades",
    "Otros",];

export default function RegistrarProducto() {
    const [nombre, setNombre] = useState("");
    const [categoria, setCategoria] = useState(categorias[0]);
    const [precio, setPrecio] = useState("");
    const [telefono, setTelefono] = useState("");
    const [imagen, setImagen] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [confirmacion, setConfirmacion] = useState("");
    const inputFileRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        setImagen(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview("");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let imagenBase64 = "";
        if (imagen) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                imagenBase64 = reader.result as string;
                await fetch("/api/productos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre, categoria, precio, telefono, imagen: imagenBase64 }),
                });
                setConfirmacion("¡Comercio registrado exitosamente!");
                setNombre("");
                setCategoria(categorias[0]);
                setPrecio("");
                setTelefono("");
                setImagen(null);
                setPreview("");
                setTimeout(() => setConfirmacion(""), 2000);
            };
            reader.readAsDataURL(imagen);
        } else {
            await fetch("/api/productos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, categoria, precio, telefono, imagen: "" }),
            });
            setConfirmacion("¡Producto registrado exitosamente!");
            setNombre("");
            setCategoria(categorias[0]);
            setPrecio("");
            setTelefono("");
            setImagen(null);
            setPreview("");
            setTimeout(() => setConfirmacion(""), 2000);
        }
    };

    const handleCerrar = () => {
        router.push("/productos");
    };

    return (
        <>
            <Navbar />
            <main className="max-w-md mx-auto bg-white rounded-lg shadow p-6 mt-8 relative">
                <button onClick={handleCerrar} className="absolute top-4 right-4 text-gray-400 hover:text-blue-700 text-2xl font-bold" title="Cerrar">×</button>
                <h1 className="text-2xl font-bold mb-4 text-blue-900 text-center">Registrar producto</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <label className="font-semibold">Foto del producto</label>
                    <div
                        className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-lg p-4 cursor-pointer hover:bg-blue-50 mb-2"
                        onClick={() => inputFileRef.current?.click()}
                    >
                        {preview ? (
                            <Image src={preview} alt="Preview" className="w-24 h-24 object-cover rounded mb-2" width={96} height={96} />
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
                                <span className="text-blue-400">Haz clic para subir foto</span>
                            </>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImagen}
                            ref={inputFileRef}
                            className="hidden"
                        />
                    </div>

                    <label className="font-semibold">Nombre del producto</label>
                    <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required className="p-2 border rounded" />

                    <label className="font-semibold">Categoría</label>
                    <select value={categoria} onChange={e => setCategoria(e.target.value)} className="p-2 border rounded">
                        {categorias.map(cat => <option key={cat}>{cat}</option>)}
                    </select>


                    <label className="font-semibold">Número de WhatsApp</label>
                    <input type="text" value={telefono} onChange={e => setTelefono(e.target.value)} required className="p-2 border rounded" />

                    <button type="submit" className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-700 transition-colors">Registrar producto</button>
                </form>
                {confirmacion && <div className="mt-4 text-green-600 font-semibold text-center">{confirmacion}</div>}
            </main>
        </>
    );
} 