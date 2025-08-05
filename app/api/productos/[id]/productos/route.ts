import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET: Obtener productos de un comercio específico
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { db } = await connectToDatabase();
        const comercio = await db.collection('comercios').findOne({
            _id: new ObjectId(id)
        });

        if (!comercio) {
            return NextResponse.json(
                { message: 'Comercio no encontrado' },
                { status: 404 }
            );
        }

        // Obtener productos del comercio (si existe la colección)
        const productos = await db.collection('productos').find({
            comercioId: id
        }).toArray();

        return NextResponse.json({
            comercio,
            productos: productos || []
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return NextResponse.json(
            { message: 'Error al obtener productos' },
            { status: 500 }
        );
    }
}

// POST: Agregar producto a un comercio (solo admin del comercio)
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: 'No autorizado' },
                { status: 401 }
            );
        }

        const { db } = await connectToDatabase();

        // Verificar que el comercio existe y pertenece al usuario
        const comercio = await db.collection('comercios').findOne({
            _id: new ObjectId(id),
            adminEmail: session.user.email
        });

        if (!comercio) {
            return NextResponse.json(
                { message: 'Comercio no encontrado o no autorizado' },
                { status: 404 }
            );
        }

        const data = await request.json();
        const nuevoProducto = {
            comercioId: id,
            nombre: data.nombre,
            descripcion: data.descripcion,
            precio: data.precio,
            imagen: data.imagen,
            categoria: data.categoria,
            disponible: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection('productos').insertOne(nuevoProducto);

        return NextResponse.json(
            { message: 'Producto agregado exitosamente', id: result.insertedId },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error al agregar producto:', error);
        return NextResponse.json(
            { message: 'Error al agregar producto' },
            { status: 500 }
        );
    }
}
