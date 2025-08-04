import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { Home, User, ShoppingBag } from 'lucide-react-native';
import HomeScreen from '../app/screens/HomeScreen';
import ProductsScreen from '../app/screens/ProductsScreen';
import ProfileScreen from '../app/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabBar() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#ef4444',
                tabBarInactiveTintColor: '#6b7280',
                tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0, height: 60 },
                tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
            }}
        >
            <Tab.Screen name="Inicio" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <Home color={color} size={24} /> }} />
            <Tab.Screen name="Productos" component={ProductsScreen} options={{ tabBarIcon: ({ color }) => <ShoppingBag color={color} size={24} /> }} />
            <Tab.Screen name="Perfil" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <User color={color} size={24} /> }} />
        </Tab.Navigator>
    );
} 