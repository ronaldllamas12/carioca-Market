import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TabBar from './components/TabBar';
import "nativewind/tailwind.css";

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <TabBar />
            </NavigationContainer>
        </SafeAreaProvider>
    );
} 