import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
    try {
        const { nombre, email, password, telefono } = await request.json();

        if (!nombre || !email || !password || !telefono) {
            return Response.json(
                { message: 'Todos los campos son requeridos' },
                { status: 400 }
            );
        }
        if (password.length < 6) {
            return Response.json(
                { message: 'La contraseña debe tener al menos 6 caracteres' },
                { status: 400 }
            );
        }
        const { db } = await connectToDatabase();
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return Response.json(
                { message: 'El correo electrónico ya está registrado' },
                { status: 400 }
            );
        }
        const role = email === 'ronaldllamas17@gmail.com' ? 'admin' : 'user';
        await db.collection('users').insertOne({
            nombre,
            email,
            password,
            telefono,
            role,
            createdAt: new Date(),
        });
        return Response.json(
            { message: 'Usuario registrado exitosamente' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return Response.json(
            { message: 'Error al registrar usuario' },
            { status: 500 }
        );
    }
} 