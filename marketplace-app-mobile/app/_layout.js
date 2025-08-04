import { Stack } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "nativewind/tailwind.css";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack />
            </NavigationContainer>
        </SafeAreaProvider>
    );
} 