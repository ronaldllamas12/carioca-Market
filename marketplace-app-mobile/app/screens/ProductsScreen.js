import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, StatusBar } from 'react-native';
import { Filter, MapPin, Star, Heart, Grid, List } from 'lucide-react-native';

export default function ProductsScreen() {
    const [viewMode, setViewMode] = useState('grid');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', name: 'Todos' },
        { id: 'restaurants', name: 'Restaurantes' },
        { id: 'hotels', name: 'Hoteles' },
        { id: 'activities', name: 'Actividades' },
        { id: 'transport', name: 'Transporte' },
    ];

    const products = [
        {
            id: 1,
            title: 'Restaurante Le Gourmet',
            category: 'restaurants',
            location: 'Centro de Iguazú',
            rating: 4.8,
            price: '$25',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
            reviews: 128,
        },
        {
            id: 2,
            title: 'Hotel Cataratas',
            category: 'hotels',
            location: 'Puerto Iguazú',
            rating: 4.6,
            price: '$120',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
            reviews: 89,
        },
        {
            id: 3,
            title: 'Tour Cataratas',
            category: 'activities',
            location: 'Parque Nacional',
            rating: 4.9,
            price: '$45',
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
            reviews: 256,
        },
        {
            id: 4,
            title: 'Transfer Aeropuerto',
            category: 'transport',
            location: 'Aeropuerto IGR',
            rating: 4.7,
            price: '$35',
            image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
            reviews: 67,
        },
        {
            id: 5,
            title: 'Pizzería Bella Vista',
            category: 'restaurants',
            location: 'Centro Comercial',
            rating: 4.5,
            price: '$18',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
            reviews: 94,
        },
        {
            id: 6,
            title: 'Hostel Backpackers',
            category: 'hotels',
            location: 'Zona Turística',
            rating: 4.3,
            price: '$45',
            image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
            reviews: 156,
        },
    ];

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(product => product.category === selectedCategory);

    const renderProduct = ({ item }) => (
        <TouchableOpacity
            className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${viewMode === 'grid' ? 'w-[48%] mb-4' : 'w-full mb-4'
                }`}
        >
            <Image
                source={{ uri: item.image }}
                className={`${viewMode === 'grid' ? 'w-full h-32' : 'w-full h-48'}`}
                resizeMode="cover"
            />
            <View className="p-3">
                <View className="flex-row items-center justify-between mb-2">
                    <Text className={`font-semibold text-gray-900 ${viewMode === 'grid' ? 'text-sm' : 'text-lg'}`}>
                        {item.title}
                    </Text>
                    <TouchableOpacity>
                        <Heart size={16} color="#ef4444" />
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center mb-2">
                    <MapPin size={14} color="#6b7280" />
                    <Text className="text-gray-500 ml-1 text-xs">{item.location}</Text>
                </View>

                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Star size={14} color="#fbbf24" fill="#fbbf24" />
                        <Text className="text-gray-700 ml-1 text-xs font-medium">{item.rating}</Text>
                        <Text className="text-gray-400 ml-1 text-xs">({item.reviews})</Text>
                    </View>
                    <Text className={`font-bold text-gray-900 ${viewMode === 'grid' ? 'text-sm' : 'text-lg'}`}>
                        {item.price}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Header */}
            <View className="bg-white pt-12 pb-4 px-4 border-b border-gray-100">
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-2xl font-bold text-gray-900">Productos</Text>
                    <TouchableOpacity className="flex-row items-center bg-gray-100 rounded-full px-3 py-2">
                        <Filter size={16} color="#6b7280" />
                        <Text className="text-gray-600 ml-1 text-sm">Filtros</Text>
                    </TouchableOpacity>
                </View>

                {/* View Mode Toggle */}
                <View className="flex-row items-center justify-between">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="flex-1 mr-4"
                    >
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                onPress={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-full mr-2 ${selectedCategory === category.id
                                        ? 'bg-red-500'
                                        : 'bg-gray-100'
                                    }`}
                            >
                                <Text className={`text-sm font-medium ${selectedCategory === category.id
                                        ? 'text-white'
                                        : 'text-gray-600'
                                    }`}>
                                    {category.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View className="flex-row bg-gray-100 rounded-full p-1">
                        <TouchableOpacity
                            onPress={() => setViewMode('grid')}
                            className={`p-2 rounded-full ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                        >
                            <Grid size={16} color={viewMode === 'grid' ? '#ef4444' : '#6b7280'} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setViewMode('list')}
                            className={`p-2 rounded-full ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                        >
                            <List size={16} color={viewMode === 'list' ? '#ef4444' : '#6b7280'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Products Grid/List */}
            <FlatList
                data={filteredProducts}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id.toString()}
                numColumns={viewMode === 'grid' ? 2 : 1}
                columnWrapperStyle={viewMode === 'grid' ? { justifyContent: 'space-between' } : null}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
} 