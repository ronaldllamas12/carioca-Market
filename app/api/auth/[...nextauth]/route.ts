import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";

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
                        console.log('Credenciales faltantes');
                        throw new Error('Credenciales requeridas');
                    }

                    console.log('Intentando autenticar:', credentials.email);
                    const { db } = await connectToDatabase();

                    const user = await db.collection('users').findOne({
                        email: credentials.email,
                        role: 'admin'
                    });

                    if (!user) {
                        console.log('Usuario no encontrado');
                        throw new Error('Usuario no encontrado');
                    }

                    console.log('Usuario encontrado, verificando contraseña');
                    const isValid = await compare(credentials.password, user.password);

                    if (!isValid) {
                        console.log('Contraseña incorrecta');
                        throw new Error('Contraseña incorrecta');
                    }

                    console.log('Autenticación exitosa');
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.nombre,
                        role: user.role
                    };
                } catch (error) {
                    console.error('Error en authorize:', error);
                    throw error;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                (session.user as any).role = token.role;
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