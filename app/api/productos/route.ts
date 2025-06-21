import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';

// GET: Obtener todos los comercios
export async function GET() {
    const { db } = await connectToDatabase();
    const comercios = await db.collection('comercios').find({}).toArray();
    return Response.json(comercios);
}

// POST: Crear nuevo comercio (solo admin)
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
        const nuevoComercio = {
            nombre: data.nombre,
            categoria: data.categoria,
            imagen: data.imagen,
            productosVenta: data.productosVenta.split(',').map((p: string) => p.trim()),
            telefono: data.telefono,
            adminEmail: session.user.email,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await db.collection('comercios').insertOne(nuevoComercio);
        return NextResponse.json(
            { message: 'Comercio creado exitosamente', id: result.insertedId },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error al crear comercio:', error);
        return NextResponse.json(
            { message: 'Error al crear comercio' },
            { status: 500 }
        );
    }
} 