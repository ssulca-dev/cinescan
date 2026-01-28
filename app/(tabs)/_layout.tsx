// IMPORTACIONES

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

//LAYOUT DE PESTAÑAS

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();

    return (
        <Tabs

    //CONFIGURACIÓN GLOBAL DE LA BARRA
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    elevation: 0,
                    height: Platform.OS === 'ios' ? 85 : 60 + insets.bottom,
                    paddingBottom: Platform.OS === 'ios' ? 25 : insets.bottom + 5,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: colors.tint,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                    marginTop: -4,
                    marginBottom: 4
                }
            }}
        >
        {/* //PANTALLAS (TABS) INDIVIDUALES */}
            {/* Tab 1: Inicio (Home) */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
                    ),
                }}
            />

            {/* Tab 2: Búsqueda */}
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Búsqueda',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color} />
                    ),
                }}
            />

            {/* Tab 3: Cámara  */}
            <Tabs.Screen
                name="camera_placeholder"
                options={{
                    href: null,
                }}
            />

            {/* Tab 4: Historial */}
            <Tabs.Screen
                name="history"
                options={{
                    title: 'Historial',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "time" : "time-outline"} size={24} color={color} />
                    ),
                }}
            />

            {/* Tab 5: Perfil de Usuario */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}