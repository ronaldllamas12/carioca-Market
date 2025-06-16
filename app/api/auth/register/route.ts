import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
    try {
        const { nombre, email, password, telefono } = await request.json();

        // Validaciones básicas
        if (!nombre || !email || !password || !telefono) {
            return NextResponse.json(
                { message: 'Todos los campos son requeridos' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: 'La contraseña debe tener al menos 6 caracteres' },
                { status: 400 }
            );
        }

        // Conectar a la base de datos
        const { db } = await connectToDatabase();

        // Verificar si el usuario ya existe
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'El correo electrónico ya está registrado' },
                { status: 400 }
            );
        }

        // Encriptar la contraseña
        const hashedPassword = await hash(password, 12);

        // Crear el usuario (por defecto no es admin)
        const result = await db.collection('users').insertOne({
            nombre,
            email,
            password: hashedPassword,
            telefono,
            role: 'user', // Por defecto es usuario normal
            createdAt: new Date(),
        });

        return NextResponse.json(
            { message: 'Usuario registrado exitosamente' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error en el registro:', error);
        return NextResponse.json(
            { message: 'Error al registrar usuario' },
            { status: 500 }
        );
    }
} 