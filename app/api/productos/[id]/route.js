import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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

// GET: Obtener un comercio por ID
export async function GET(request, context) {
    const { params } = context;
    try {
        const { db } = await connectToDatabase();
        const comercio = await db.collection('comercios').findOne({
            _id: new ObjectId(params.id)
        });

        if (!comercio) {
            return NextResponse.json(
                { message: 'Comercio no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(comercio);
    } catch (error) {
        console.error('Error al obtener comercio:', error);
        return NextResponse.json(
            { message: 'Error al obtener comercio' },
            { status: 500 }
        );
    }
}

// DELETE: Eliminar producto (solo admin)
export async function DELETE(
    request,
    context
) {
    const { params } = context;
    try {
        if (!await isAdmin()) {
            return NextResponse.json(
                { message: 'No autorizado' },
                { status: 401 }
            );
        }

        const { db } = await connectToDatabase();
        const result = await db.collection('comercios').deleteOne({
            _id: new ObjectId(params.id)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { message: 'Comercio no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Comercio eliminado exitosamente' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error al eliminar Comercio:', error);
        return NextResponse.json(
            { message: 'Error al eliminar Comercio' },
            { status: 500 }
        );
    }
}

// PUT: Actualizar producto (solo admin)
export async function PUT(
    request,
    context
) {
    const { params } = context;
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: 'No autorizado' },
                { status: 401 }
            );
        }
        const { db } = await connectToDatabase();
        // Buscar el comercio y verificar el adminEmail
        const comercio = await db.collection('comercios').findOne({ _id: new ObjectId(params.id) });
        if (!comercio) {
            return NextResponse.json(
                { message: 'Comercio no encontrado' },
                { status: 404 }
            );
        }
        if (comercio.adminEmail !== session.user.email) {
            return NextResponse.json(
                { message: 'No autorizado. Solo el admin que registró el comercio puede editarlo.' },
                { status: 403 }
            );
        }
        const data = await request.json();
        const result = await db.collection('comercios').updateOne(
            { _id: new ObjectId(params.id) },
            {
                $set: {
                    ...data,
                    productosVenta: data.productosVenta.split(',').map(p => p.trim()),
                    updatedAt: new Date()
                }
            }
        );
        if (result.matchedCount === 0) {
            return NextResponse.json(
                { message: 'Comercio no encontrado' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: 'Comercio actualizado exitosamente' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error al actualizar comercio:', error);
        return NextResponse.json(
            { message: 'Error al actualizar comercio' },
            { status: 500 }
        );
    }
} 