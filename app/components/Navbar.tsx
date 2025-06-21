"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutButton from "./LogoutButton";
import { User } from "lucide-react";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-gradient-to-r from-blue-600 via-pink-200 to-pink-500 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">
                            <span className="bg-transparent bg-opacity-20 px-3 py-1 rounded-xl">Market Iguazu</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        {session ? (
                            <>
                                <div className="flex items-center gap-2 text-white font-semibold">
                                    <User size={24} />
                                    <span className="hidden sm:inline">{session.user?.name}</span>
                                </div>
                                <LogoutButton />
                            </>
                        ) : (
                            <Link
                                href="/auth/signin"
                                className="px-4 py-2 text-base font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 transition-colors shadow"
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