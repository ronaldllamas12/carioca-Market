"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="group relative flex items-center gap-3 px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
            <LogOut size={22} className="transition-transform duration-300 group-hover:rotate-[-15deg]" />
            <span className="tracking-wider">Cerrar Sesión</span>
        </button>
    );
}
