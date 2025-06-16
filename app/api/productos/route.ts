import { NextRequest, NextResponse } from "next/server";
import mongoose, { Schema, model, models } from "mongoose";
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/marketplace";

// Conexión a MongoDB
if (mongoose.connection.readyState === 0) {
    mongoose.connect(MONGODB_URI, {
        dbName: "marketplace",
    });
}

// Definir el esquema y modelo de producto
const productoSchema = new Schema({
    nombre: String,
    categoria: String,
    precio: String,
    telefono: String,
    imagen: String, // URL base64 o URL pública
});

const Producto = models.Producto || model("Producto", productoSchema);

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

// GET: Obtener todos los productos (público)
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
        if (!await isAdmin()) {
            return NextResponse.json(
                { message: 'No autorizado' },
                { status: 401 }
            );
        }

        const data = await request.json();
        const { db } = await connectToDatabase();

        const result = await db.collection('productos').insertOne({
            ...data,
            createdAt: new Date()
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