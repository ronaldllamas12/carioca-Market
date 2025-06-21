"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Phone } from 'lucide-react';

export default function RegistroUsuario() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        telefono: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrar usuario');
            }

            // Redirigir al usuario a la página de inicio de sesión
            router.push('/auth/signin');
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Registro de Usuario</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            <User size={16} />
                            Nombre completo
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Ingresa tu nombre completo"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Mail size={16} />
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="ejemplo@correo.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Phone size={16} />
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Ingresa tu número de teléfono"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Lock size={16} />
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    >
                        {isLoading ? 'Registrando...' : 'Registrarse'}
                    </button>

                    <div className="text-center text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{' '}
                        <button
                            type="button"
                            onClick={() => router.push('/auth/signin')}
                            className="text-blue-600 hover:text-blue-700"
                        >
                            Iniciar sesión
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 