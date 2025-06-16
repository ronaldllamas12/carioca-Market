"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutButton from "./LogoutButton";
import { User } from "lucide-react";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-blue-600">
                            Marketplace Iguazu
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        {session ? (
                            <>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <User size={20} />
                                    <span>{session.user?.name}</span>
                                </div>
                                <LogoutButton />
                            </>
                        ) : (
                            <Link
                                href="/auth/signin"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
} 