import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Settings, Heart, MapPin, Star, LogOut, User, Bell, HelpCircle, Shield } from 'lucide-react-native';

export default function ProfileScreen() {
    const userInfo = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        location: 'Iguazú, Argentina',
        memberSince: '2023',
        reviews: 12,
        favorites: 8,
    };

    const menuItems = [
        {
            id: 1,
            title: 'Mis Reservas',
            icon: '📅',
            color: '#3b82f6',
        },
        {
            id: 2,
            title: 'Favoritos',
            icon: '❤️',
            color: '#ef4444',
        },
        {
            id: 3,
            title: 'Historial',
            icon: '📋',
            color: '#10b981',
        },
        {
            id: 4,
            title: 'Notificaciones',
            icon: '🔔',
            color: '#f59e0b',
        },
    ];

    const settingsItems = [
        {
            id: 1,
            title: 'Configuración',
            icon: Settings,
            color: '#6b7280',
        },
        {
            id: 2,
            title: 'Privacidad',
            icon: Shield,
            color: '#6b7280',
        },
        {
            id: 3,
            title: 'Ayuda',
            icon: HelpCircle,
            color: '#6b7280',
        },
        {
            id: 4,
            title: 'Cerrar Sesión',
            icon: LogOut,
            color: '#ef4444',
        },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Header */}
            <View className="bg-white pt-12 pb-6 px-4 border-b border-gray-100">
                <View className="flex-row items-center justify-between mb-6">
                    <Text className="text-2xl font-bold text-gray-900">Perfil</Text>
                    <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                        <Settings size={20} color="#6b7280" />
                    </TouchableOpacity>
                </View>

                {/* User Info */}
                <View className="flex-row items-center">
                    <Image
                        source={{ uri: userInfo.avatar }}
                        className="w-20 h-20 rounded-full"
                    />
                    <View className="ml-4 flex-1">
                        <Text className="text-xl font-bold text-gray-900">{userInfo.name}</Text>
                        <Text className="text-gray-500">{userInfo.email}</Text>
                        <View className="flex-row items-center mt-1">
                            <MapPin size={14} color="#6b7280" />
                            <Text className="text-gray-500 ml-1 text-sm">{userInfo.location}</Text>
                        </View>
                    </View>
                </View>

                {/* Stats */}
                <View className="flex-row mt-6 bg-gray-50 rounded-2xl p-4">
                    <View className="flex-1 items-center">
                        <Text className="text-2xl font-bold text-gray-900">{userInfo.reviews}</Text>
                        <Text className="text-gray-500 text-sm">Reseñas</Text>
                    </View>
                    <View className="flex-1 items-center border-l border-r border-gray-200">
                        <Text className="text-2xl font-bold text-gray-900">{userInfo.favorites}</Text>
                        <Text className="text-gray-500 text-sm">Favoritos</Text>
                    </View>
                    <View className="flex-1 items-center">
                        <Text className="text-2xl font-bold text-gray-900">4.8</Text>
                        <Text className="text-gray-500 text-sm">Calificación</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Quick Actions */}
                <View className="px-4 py-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</Text>
                    <View className="flex-row flex-wrap justify-between">
                        {menuItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                className="w-[48%] bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
                            >
                                <View className="flex-row items-center">
                                    <Text className="text-2xl mr-3">{item.icon}</Text>
                                    <Text className="text-gray-900 font-medium">{item.title}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Settings */}
                <View className="px-4 pb-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Configuración</Text>
                    <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {settingsItems.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                className={`flex-row items-center p-4 ${index !== settingsItems.length - 1 ? 'border-b border-gray-100' : ''
                                    }`}
                            >
                                <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
                                    <item.icon size={16} color={item.color} />
                                </View>
                                <Text className={`flex-1 text-gray-900 ${item.color === '#ef4444' ? 'font-medium' : ''}`}>
                                    {item.title}
                                </Text>
                                <Text className="text-gray-400">›</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Recent Activity */}
                <View className="px-4 pb-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</Text>
                    <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                        <View className="flex-row items-center mb-3">
                            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                                <Star size={16} color="#3b82f6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 font-medium">Reseña en Hotel Cataratas</Text>
                                <Text className="text-gray-500 text-sm">Hace 2 días</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
                                <Heart size={16} color="#ef4444" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 font-medium">Agregaste a favoritos</Text>
                                <Text className="text-gray-500 text-sm">Restaurante Le Gourmet</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
} 