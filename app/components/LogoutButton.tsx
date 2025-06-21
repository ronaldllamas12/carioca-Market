"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-2xl shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out hover:shadow-2xl"
        >
            <LogOut size={20} />
            <span className="tracking-wide">Cerrar Sesión</span>
        </button>
    );
}
