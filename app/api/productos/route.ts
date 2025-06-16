import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET: Obtener todos los productos
export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const productos = await db.collection('productos').find({}).toArray();
        return NextResponse.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return NextResponse.json(
            { message: 'Error al obtener productos' },
            { status: 500 }
        );
    }
}

// POST: Crear nuevo producto (solo admin)
export async function POST(request: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: 'No autorizado' },
                { status: 401 }
            );
        }

        const { db } = await connectToDatabase();
        const user = await db.collection('users').findOne({
            email: session.user.email,
            role: 'admin'
        });

        if (!user) {
            return NextResponse.json(
                { message: 'No autorizado' },
                { status: 401 }
            );
        }

        const data = await request.json();
        const result = await db.collection('productos').insertOne({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return NextResponse.json(
            { message: 'Producto creado exitosamente', id: result.insertedId },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error al crear producto:', error);
        return NextResponse.json(
            { message: 'Error al crear producto' },
            { status: 500 }
        );
    }
} 