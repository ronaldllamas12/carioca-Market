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

// DELETE: Eliminar producto (solo admin)
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json(
                { message: 'No autorizado' },
                { status: 401 }
            );
        }

        const { db } = await connectToDatabase();
        const result = await db.collection('productos').deleteOne({
            _id: new ObjectId(params.id)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { message: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Producto eliminado exitosamente' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        return NextResponse.json(
            { message: 'Error al eliminar producto' },
            { status: 500 }
        );
    }
}

// PUT: Actualizar producto (solo admin)
export async function PUT(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json(
                { message: 'No autorizado' },
                { status: 401 }
            );
        }

        const data = await request.json();
        const { db } = await connectToDatabase();

        const result = await db.collection('productos').updateOne(
            { _id: new ObjectId(context.params.id) },
            { $set: { ...data, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { message: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Producto actualizado exitosamente' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        return NextResponse.json(
            { message: 'Error al actualizar producto' },
            { status: 500 }
        );
    }
} 