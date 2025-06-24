"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Cerrar Sesión"
            className="group relative flex items-center justify-center w-12 h-12 text-white bg-gradient-to-r from-red-600 to-red-400 rounded-full shadow-xl hover:shadow-4xl transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
            <LogOut size={24} className="transition-transform duration-300 group-hover:rotate-[-15deg]" />
        </button>
    );
}
