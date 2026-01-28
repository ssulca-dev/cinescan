// IMPORTACIONES

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// PALETAS DE COLORES (CONSTANTES)

const DarkColors = {
    background: '#121212',
    card: '#1E1E1E',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
    border: '#2A2A2A',
    tint: '#FFFFFF',
    danger: '#FF453A'
};

const LightColors = {
    background: '#F2F2F7',
    card: '#FFFFFF',
    textPrimary: '#000000',
    textSecondary: '#8E8E93',
    border: '#E5E5EA',
    tint: '#007AFF',
    danger: '#FF3B30'
};

//CONTEXTO

const ThemeContext = createContext<any>(null);

//COMPONENTE PROVIDER

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemScheme = useColorScheme();
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
    const [colors, setColors] = useState(DarkColors);

    useEffect(() => {
        loadTheme();
    }, []);

    useEffect(() => {
        const activeTheme = theme === 'system' ? systemScheme : theme;
        setColors(activeTheme === 'dark' ? DarkColors : LightColors);
    }, [theme, systemScheme]);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('user_theme');
            if (savedTheme) setTheme(savedTheme as any);
        } catch (e) {
            console.log('Error loading theme', e);
        }
    };

    const updateTheme = async (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme);
        await AsyncStorage.setItem('user_theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);