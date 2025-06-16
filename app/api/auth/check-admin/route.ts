import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json({ isAdmin: false });
        }

        const { db } = await connectToDatabase();
        const user = await db.collection('users').findOne({
            email: session.user.email,
            role: 'admin'
        });

        return NextResponse.json({ isAdmin: !!user });
    } catch (error) {
        console.error('Error al verificar admin:', error);
        return NextResponse.json({ isAdmin: false });
    }
} 