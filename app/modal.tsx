import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

export default function ModalScreen() {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.text, { color: colors.textPrimary }]}>Pantalla Modal</Text>
            <TouchableOpacity onPress={() => router.back()}>
                <Text style={[styles.link, { color: colors.tint }]}>Cerrar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 18, marginBottom: 20 },
    link: { fontSize: 16, fontWeight: 'bold' }
});