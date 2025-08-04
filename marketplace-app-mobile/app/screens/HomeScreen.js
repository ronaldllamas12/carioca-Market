import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Search, MapPin, Star, Heart } from 'lucide-react-native';

export default function HomeScreen() {
    const categories = [
        { id: 1, name: 'Restaurantes', icon: '🍽️', color: '#ef4444' },
        { id: 2, name: 'Hoteles', icon: '🏨', color: '#3b82f6' },
        { id: 3, name: 'Actividades', icon: '🎯', color: '#10b981' },
        { id: 4, name: 'Transporte', icon: '🚗', color: '#f59e0b' },
    ];

    const featuredProducts = [
        {
            id: 1,
            title: 'Restaurante Le Gourmet',
            location: 'Centro de Iguazú',
            rating: 4.8,
            price: '$25',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
        },
        {
            id: 2,
            title: 'Hotel Cataratas',
            location: 'Puerto Iguazú',
            rating: 4.6,
            price: '$120',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        },
        {
            id: 3,
            title: 'Tour Cataratas',
            location: 'Parque Nacional',
            rating: 4.9,
            price: '$45',
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
        },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Header */}
            <View className="bg-white pt-12 pb-4 px-4 border-b border-gray-100">
                <View className="flex-row items-center justify-between mb-4">
                    <View>
                        <Text className="text-2xl font-bold text-gray-900">Marketplace</Text>
                        <Text className="text-gray-500">Iguazú</Text>
                    </View>
                    <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                        <Text className="text-lg">👤</Text>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <TouchableOpacity className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
                    <Search size={20} color="#6b7280" />
                    <Text className="ml-3 text-gray-500">¿Qué estás buscando?</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Categories */}
                <View className="px-4 py-6">
                    <Text className="text-xl font-semibold text-gray-900 mb-4">Categorías</Text>
                    <View className="flex-row justify-between">
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                className="items-center bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                                style={{ width: '22%' }}
                            >
                                <Text className="text-2xl mb-2">{category.icon}</Text>
                                <Text className="text-xs text-gray-600 text-center font-medium">{category.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Featured Products */}
                <View className="px-4 pb-6">
                    <Text className="text-xl font-semibold text-gray-900 mb-4">Destacados</Text>
                    {featuredProducts.map((product) => (
                        <TouchableOpacity
                            key={product.id}
                            className="bg-white rounded-2xl mb-4 shadow-sm border border-gray-100 overflow-hidden"
                        >
                            <Image
                                source={{ uri: product.image }}
                                className="w-full h-48"
                                resizeMode="cover"
                            />
                            <View className="p-4">
                                <View className="flex-row items-center justify-between mb-2">
                                    <Text className="text-lg font-semibold text-gray-900">{product.title}</Text>
                                    <TouchableOpacity>
                                        <Heart size={20} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>

                                <View className="flex-row items-center mb-2">
                                    <MapPin size={16} color="#6b7280" />
                                    <Text className="text-gray-500 ml-1">{product.location}</Text>
                                </View>

                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center">
                                        <Star size={16} color="#fbbf24" fill="#fbbf24" />
                                        <Text className="text-gray-700 ml-1 font-medium">{product.rating}</Text>
                                    </View>
                                    <Text className="text-lg font-bold text-gray-900">{product.price}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
} 