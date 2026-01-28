import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';

// @ts-ignore
if (typeof setImmediate === 'undefined') {
    // @ts-ignore
    global.setImmediate = (fn: any) => setTimeout(fn, 0);
}

export default function Layout() {
    return (
        <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="camera" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            </Stack>
        </ThemeProvider>
    );
}