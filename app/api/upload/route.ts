import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { Readable } from 'stream';

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

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'marketplace-app', // Opcional: para organizar en Cloudinary
                    resource_type: 'image'
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                }
            );
            const readableStream = new Readable();
            readableStream._read = () => { };
            readableStream.push(buffer);
            readableStream.push(null);
            readableStream.pipe(stream);
        });

        // Asegurarnos de que el tipo de uploadResult sea el correcto
        const result = uploadResult as { secure_url?: string };

        if (!result || !result.secure_url) {
            throw new Error('No se pudo obtener la URL segura de Cloudinary.');
        }

        return NextResponse.json({
            url: result.secure_url,
            success: true
        });

    } catch (error) {
        console.error('Error al subir el archivo a Cloudinary:', error);
        return NextResponse.json(
            { error: 'Error al subir el archivo' },
            { status: 500 }
        );
    }
} 