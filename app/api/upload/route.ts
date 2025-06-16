import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No se ha proporcionado ningún archivo' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Crear un nombre único para el archivo
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `${uniqueSuffix}-${file.name}`;

        // Asegurarse de que el directorio existe
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        const path = join(uploadDir, filename);

        // Guardar el archivo
        await writeFile(path, buffer);

        // Devolver la URL de la imagen
        return NextResponse.json({
            url: `/uploads/${filename}`,
            success: true
        });
    } catch (error) {
        console.error('Error al subir el archivo:', error);
        return NextResponse.json(
            { error: 'Error al subir el archivo' },
            { status: 500 }
        );
    }
} 