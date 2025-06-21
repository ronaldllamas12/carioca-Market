import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';

// Función auxiliar para verificar si el usuario es admin
async function isAdmin() {
    const session = await getServerSession();
    if (!session?.user?.email) return false;

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({
        email: session.user.email,
        role: 'admin'
    });

    return !!user;
}

// GET: Obtener todos los usuarios (solo admin)
export async function GET() {
    try {
        if (!await isAdmin()) {
            return NextResponse.json(
                { message: 'No autorizado' },
                { status: 401 }
            );
        }

        const { db } = await connectToDatabase();
        const users = await db.collection('users').find({}).toArray();
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return NextResponse.json(
            { message: 'Error al obtener usuarios' },
            { status: 500 }
        );
    }
} 