"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
    onClose: () => void;
}

export default function Notification({ message, type, isVisible, onClose }: NotificationProps) {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-700';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-700';
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-700';
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={`fixed top-20 right-4 z-50 max-w-sm w-full ${getStyles()} border rounded-xl p-4 shadow-lg`}
                    initial={{ opacity: 0, x: 300, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 300, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <div className="flex items-start gap-3">
                        {getIcon()}
                        <div className="flex-1">
                            <p className="text-sm font-medium">{message}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
} 