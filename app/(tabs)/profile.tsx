// IMPORTACIONES

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';


// INTERFACES Y TIPOS

interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    showBorder?: boolean;
    value?: string;
}

interface ThemeOptionProps {
    label: string;
    value: 'light' | 'dark' | 'system';
    icon: keyof typeof Ionicons.glyphMap;
}

// COMPONENTE PRINCIPAL

export default function ProfileScreen() {
    // Hooks y Estado
    const insets = useSafeAreaInsets();
    const { theme, updateTheme, colors } = useTheme();
    const [settingsVisible, setSettingsVisible] = useState(false);

    // Manejo de Sesión
    const handleLogout = () => {
        Alert.alert("Cerrar sesión", "¿Estás seguro de que quieres salir?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Salir", style: "destructive" }
        ]);
    };

    // Componentes Internos Reutilizables
    const MenuItem = ({ icon, label, onPress, showBorder = true, value }: MenuItemProps) => (
        <TouchableOpacity
            style={[
                styles.menuItem,
                !showBorder && styles.noBorder,
                { borderBottomColor: colors.border }
            ]}
            onPress={onPress}
        >
            <View style={styles.menuLeft}>
                <Ionicons name={icon} size={22} color={colors.textPrimary} />
                <Text style={[styles.menuText, { color: colors.textPrimary }]}>{label}</Text>
            </View>
            <View style={styles.menuRight}>
                {value && <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{value}</Text>}
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
        </TouchableOpacity>
    );

    const ThemeOption = ({ label, value, icon }: ThemeOptionProps) => (
        <TouchableOpacity
            style={[
                styles.themeOption,
                theme === value && { backgroundColor: colors.border }
            ]}
            onPress={() => updateTheme(value)}
        >
            <View style={styles.themeOptionLeft}>
                <Ionicons name={icon} size={20} color={colors.textPrimary} />
                <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>{label}</Text>
            </View>
            {theme === value && <Ionicons name="checkmark" size={20} color={colors.tint} />}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>

            {/* Header */}
            <View style={styles.header}>
                <View style={[styles.avatarContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
                    <Image
                        source={{ uri: 'https://api.dicebear.com/9.x/avataaars/png?seed=Usuario&backgroundColor=b6e3f4' }}
                        style={styles.avatar}
                    />
                </View>
                <Text style={[styles.username, { color: colors.textPrimary }]}>Usuario</Text>
                <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.border }]}>
                    <Text style={[styles.editButtonText, { color: colors.textPrimary }]}>EDITAR PERFIL</Text>
                </TouchableOpacity>
            </View>

            {/* Lista de Opciones */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
                <MenuItem
                    icon="heart-outline"
                    label="Mi Lista"
                    onPress={() => { }}
                />
                <MenuItem
                    icon="settings-outline"
                    label="Ajustes de la aplicación"
                    value={theme === 'system' ? 'Automático' : theme === 'dark' ? 'Oscuro' : 'Claro'}
                    onPress={() => setSettingsVisible(true)}
                />
                <MenuItem
                    icon="person-outline"
                    label="Cuenta"
                    onPress={() => { }}
                    showBorder={false}
                />
            </View>

            {/* Botón de Salida */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>

            {/* Modal de Tema */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={settingsVisible}
                onRequestClose={() => setSettingsVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Tema</Text>
                            <TouchableOpacity onPress={() => setSettingsVisible(false)}>
                                <Ionicons name="close-circle" size={28} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ gap: 5 }}>
                            <ThemeOption label="Claro" value="light" icon="sunny-outline" />
                            <ThemeOption label="Oscuro" value="dark" icon="moon-outline" />
                            <ThemeOption label="Automático" value="system" icon="phone-portrait-outline" />
                        </View>
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
}

// ESTILOS
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { alignItems: 'center', paddingVertical: 40 },
    avatarContainer: {
        width: 100, height: 100, borderRadius: 50,
        marginBottom: 15, overflow: 'hidden', borderWidth: 2
    },
    avatar: { width: '100%', height: '100%' },
    username: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    editButton: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
    editButtonText: { fontWeight: '600', fontSize: 12 },
    section: { marginHorizontal: 20, borderRadius: 12, overflow: 'hidden', marginBottom: 30 },
    menuItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1
    },
    noBorder: { borderBottomWidth: 0 },
    menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    menuRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    menuText: { fontSize: 16, fontWeight: '500' },
    logoutButton: { alignItems: 'center', padding: 15 },
    logoutText: { color: '#8E8E93', fontSize: 14, fontWeight: '500' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold' },
    themeOption: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderRadius: 10 },
    themeOptionLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 }
});