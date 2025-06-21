import { connectToDatabase } from '@/lib/mongodb';
const SUPERADMIN_EMAIL = 'ronaldllamas17@gmail.com';

export async function POST(request: Request) {
    try {
        const { nombre, email, password, telefono, requester } = await request.json();
        if (requester !== SUPERADMIN_EMAIL) {
            return Response.json({ message: 'No autorizado' }, { status: 401 });
        }
        if (!nombre || !email || !password || !telefono) {
            return Response.json({ message: 'Todos los campos son requeridos' }, { status: 400 });
        }
        const { db } = await connectToDatabase();
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return Response.json({ message: 'Ya existe un usuario con ese correo' }, { status: 400 });
        }
        await db.collection('users').insertOne({
            nombre,
            email,
            password,
            telefono,
            role: 'admin',
            createdAt: new Date(),
        });
        return Response.json({ message: 'Usuario admin creado exitosamente' }, { status: 201 });
    } catch (error) {
        console.error('Error al crear admin:', error);
        return Response.json({ message: 'Error al crear admin' }, { status: 500 });
    }
} 