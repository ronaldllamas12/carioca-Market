import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';

let productosMock = [
    {
        _id: '1',
        nombre: 'Laptop Lenovo',
        categoria: 'Tecnología',
        tienda: 'TechStore',
        imagen: '/public/laptop.png',
        productosVenta: ['Laptop', 'Mouse', 'Teclado'],
        telefono: '3001234567',
        descripcion: 'Laptop Lenovo de última generación, ideal para trabajo y estudio.',
        direccion: 'Cra 10 #20-30, Centro',
        horario: 'Lun-Sab 9:00am - 7:00pm',
        rating: 4.8,
        redes: {
            instagram: 'https://instagram.com/techstore',
            facebook: 'https://facebook.com/techstore',
        },
        userId: 'demo',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '2',
        nombre: 'Sofá 3 plazas',
        categoria: 'Hogar',
        tienda: 'Muebles Hogar',
        imagen: '/public/sofa.png',
        productosVenta: ['Sofá', 'Mesa', 'Silla'],
        telefono: '3009876543',
        descripcion: 'Sofá cómodo y elegante para tu sala.',
        direccion: 'Av. Siempre Viva 123',
        horario: 'Lun-Dom 10:00am - 8:00pm',
        rating: 4.5,
        redes: {
            instagram: 'https://instagram.com/muebleshogar',
            facebook: 'https://facebook.com/muebleshogar',
        },
        userId: 'demo',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '3',
        nombre: 'Bicicleta Montañera',
        categoria: 'Deportes',
        tienda: 'Deportes Activos',
        imagen: '/public/bicicleta.png',
        productosVenta: ['Bicicleta', 'Casco', 'Guantes'],
        telefono: '3012345678',
        descripcion: 'Bicicleta resistente para aventuras extremas.',
        direccion: 'Calle 45 #12-34',
        horario: 'Lun-Sab 8:00am - 6:00pm',
        rating: 4.7,
        redes: {
            instagram: 'https://instagram.com/deportesactivos',
            facebook: 'https://facebook.com/deportesactivos',
        },
        userId: 'demo',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '4',
        nombre: 'Camiseta Selección',
        categoria: 'Ropa',
        tienda: 'Moda Deportiva',
        imagen: '/public/camiseta.png',
        productosVenta: ['Camiseta', 'Pantaloneta', 'Medias'],
        telefono: '3023456789',
        descripcion: 'Camiseta oficial de la selección nacional.',
        direccion: 'Cra 7 #15-50',
        horario: 'Lun-Vie 9:00am - 6:00pm',
        rating: 4.6,
        redes: {
            instagram: 'https://instagram.com/modadeportiva',
            facebook: 'https://facebook.com/modadeportiva',
        },
        userId: 'demo',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '5',
        nombre: 'Celular Samsung',
        categoria: 'Tecnología',
        tienda: 'Celulares Ya',
        imagen: '/public/celular.png',
        productosVenta: ['Celular', 'Cargador', 'Audífonos'],
        telefono: '3034567890',
        descripcion: 'Celular Samsung con cámara de alta resolución.',
        direccion: 'Calle 8 #22-10',
        horario: 'Lun-Sab 9:00am - 7:00pm',
        rating: 4.9,
        redes: {
            instagram: 'https://instagram.com/celularesya',
            facebook: 'https://facebook.com/celularesya',
        },
        userId: 'demo',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '6',
        nombre: 'Zapatos de cuero',
        categoria: 'Calzado',
        tienda: 'Zapatería Central',
        imagen: '/public/zapatos.png',
        productosVenta: ['Zapatos', 'Sandalias', 'Botas'],
        telefono: '3045678901',
        descripcion: 'Zapatos de cuero genuino, elegantes y duraderos.',
        direccion: 'Av. Las Palmas 45',
        horario: 'Lun-Dom 10:00am - 8:00pm',
        rating: 4.4,
        redes: {
            instagram: 'https://instagram.com/zapateriacentral',
            facebook: 'https://facebook.com/zapateriacentral',
        },
        userId: 'demo',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '7',
        nombre: 'Refrigerador LG',
        categoria: 'Electrodomésticos',
        tienda: 'ElectroHogar',
        imagen: '/public/refrigerador.png',
        productosVenta: ['Refrigerador', 'Microondas', 'Licuadora'],
        telefono: '3056789012',
        descripcion: 'Refrigerador LG de bajo consumo energético.',
        direccion: 'Cra 12 #34-56',
        horario: 'Lun-Sab 9:00am - 6:00pm',
        rating: 4.7,
        redes: {
            instagram: 'https://instagram.com/electrohogar',
            facebook: 'https://facebook.com/electrohogar',
        },
        userId: 'demo',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '8',
        nombre: 'Juego de ollas',
        categoria: 'Cocina',
        tienda: 'Cocina Feliz',
        imagen: '/public/ollas.png',
        productosVenta: ['Ollas', 'Sartenes', 'Cucharas'],
        telefono: '3067890123',
        descripcion: 'Juego de ollas de acero inoxidable.',
        direccion: 'Calle 9 #10-11',
        horario: 'Lun-Vie 8:00am - 5:00pm',
        rating: 4.3,
        redes: {
            instagram: 'https://instagram.com/cocinafeliz',
            facebook: 'https://facebook.com/cocinafeliz',
        },
        userId: 'demo',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

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