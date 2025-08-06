import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongodb";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";
import bcrypt from 'bcryptjs';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error('Credenciales requeridas');
                    }
                    const { db } = await connectToDatabase();
                    const user = await db.collection('users').findOne({ email: credentials.email, role: 'admin' });
                    if (!user) {
                        throw new Error('Usuario no encontrado');
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) {
                        throw new Error('Contraseña incorrecta');
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.nombre,
                        role: user.role
                    };
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error('Error de autenticación: ' + error.message);
                    } else {
                        throw new Error('Error de autenticación desconocido');
                    }
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT, user?: User | { role?: string } }) {
            if (user && 'role' in user) {
                (token as JWT & { role?: string }).role = (user as { role?: string }).role;
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: JWT & { role?: string } }) {
            if (session?.user && 'role' in token) {
                (session.user as typeof session.user & { role?: string }).role = token.role;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: "jwt",
    },
    debug: true,
});

export { handler as GET, handler as POST };
