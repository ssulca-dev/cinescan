// IMPORTACIONES
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/supabase/supabase';
import { useTheme } from '@/context/ThemeContext';

// COMPONENTE PRINCIPAL (HISTORIAL)
export default function HistoryScreen() {
    // Hooks y Estado
    const insets = useSafeAreaInsets();
    const { colors, theme } = useTheme();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Carga de Datos y Tiempo Real
    useEffect(() => {
        fetchHistory();
        const channel = supabase
            .channel('history_updates')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'history' }, (payload) => {
                setHistory((prev) => [payload.new, ...prev]);
            })
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Función de Petición a Supabase
    const fetchHistory = async () => {
        const { data, error } = await supabase
            .from('history')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setHistory(data);
        }
        setLoading(false);
    };

    // Renderizado de Cada Ítem (card)
    const renderItem = ({ item }: { item: any }) => (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Imagen del poster */}
            <Image
                source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
                style={styles.image}
            />
            {/* Información de texto */}
            <View style={styles.info}>
                <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={[styles.date, { color: colors.textSecondary }]}>
                    Escaneado el: {new Date(item.created_at).toLocaleDateString()}
                </Text>
                {/* Etiqueta de tipo (Pelicula/Serie) */}
                <View style={[styles.badge, { backgroundColor: theme === 'dark' ? '#333' : '#E5E5EA' }]}>
                    <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
                        {item.media_type === 'tv' ? 'Serie' : 'Película'}
                    </Text>
                </View>
            </View>
        </View>
    );

    // Renderizado Principal
    return (
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Historial de Escaneos</Text>

            {loading ? (
                <ActivityIndicator size="large" color={colors.tint} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 15 }}
                    ListEmptyComponent={
                        <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 50 }}>
                            No hay historial de escaneos.
                        </Text>
                    }
                />
            )}
        </View>
    );
}

// ESTILOS
const styles = StyleSheet.create({
    container: { flex: 1 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', marginHorizontal: 20, marginVertical: 15 },
    card: { flexDirection: 'row', marginBottom: 15, borderRadius: 12, overflow: 'hidden', borderWidth: 1 },
    image: { width: 80, height: 120 },
    info: { flex: 1, padding: 10, justifyContent: 'center' },
    title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    date: { fontSize: 12, marginBottom: 8 },
    badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    badgeText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }
});