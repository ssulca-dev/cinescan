// IMPORTACIONES
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, Modal, ScrollView, ImageBackground, ActivityIndicator, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { TMDBService } from '../../services/tmdb';
import { supabase } from '../../supabase/supabase';
import { useTheme } from '../../context/ThemeContext';

// TIPOS Y CONSTANTES
type FilterType = 'trending' | 'movie' | 'tv';

// COMPONENTE PRINCIPAL (BÚSQUEDA)
export default function SearchScreen() {
    // Hooks y Estado
    const insets = useSafeAreaInsets();
    const { colors, theme } = useTheme();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);

    const [activeFilter, setActiveFilter] = useState<FilterType>('trending');
    const [exploreData, setExploreData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [selectedMovie, setSelectedMovie] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        loadContent(activeFilter);
    }, [activeFilter]);

    // Lógica de Datos
    const loadContent = async (filter: FilterType) => {
        setLoading(true);
        let data;
        if (filter === 'trending') {
            data = await TMDBService.getTrending();
        } else if (filter === 'movie') {
            data = await TMDBService.getPopular(1);
        } else if (filter === 'tv') {
            data = await TMDBService.getTVPopular(1);
        }
        setExploreData(data.results || []);
        setLoading(false);
    };

    const handleSearch = async (text: string) => {
        setQuery(text);
        if (text.length > 2) {
            setLoading(true);
            const data = await TMDBService.search(text);
            const filtered = data.results?.filter((m: any) => m.media_type !== 'person' && (m.backdrop_path || m.poster_path));
            setResults(filtered || []);
            setLoading(false);
        } else {
            setResults([]);
        }
    };

    // Modal y Favoritos
    const openMovie = async (movie: any) => {
        setSelectedMovie(movie);
        setModalVisible(true);
        const { data } = await supabase.from('favorites').select('id').eq('id', movie.id).maybeSingle();
        setIsFavorite(!!data);
        const type = movie.media_type || (activeFilter === 'tv' ? 'tv' : 'movie');
        await TMDBService.getDetails(movie.id, type);
    };

    const toggleFavorite = async () => {
        if (!selectedMovie) return;
        if (isFavorite) {
            const { error } = await supabase.from('favorites').delete().eq('id', selectedMovie.id);
            if (!error) setIsFavorite(false);
        } else {
            const { error } = await supabase.from('favorites').insert({
                id: selectedMovie.id,
                title: selectedMovie.title || selectedMovie.name,
                poster_path: selectedMovie.poster_path,
                media_type: selectedMovie.media_type || (activeFilter === 'tv' ? 'tv' : 'movie'),
                release_date: selectedMovie.release_date || selectedMovie.first_air_date,
                user_name: 'Usuario'
            });
            if (!error) setIsFavorite(true);
        }
    };

    // Componentes de UI
    const FilterButton = ({ title, type, icon }: { title: string, type: FilterType, icon: any }) => (
        <TouchableOpacity
            style={[
                styles.catBox,
                { backgroundColor: theme === 'dark' ? '#1A1A1A' : '#E5E5EA' },
                activeFilter === type && { backgroundColor: colors.tint }
            ]}
            onPress={() => setActiveFilter(type)}
        >
            <Ionicons
                name={icon}
                size={28}
                color={activeFilter === type ? (theme === 'dark' ? 'black' : 'white') : colors.textPrimary}
                style={{ marginBottom: 5 }}
            />
            <Text style={[
                styles.catText,
                { color: activeFilter === type ? (theme === 'dark' ? 'black' : 'white') : colors.textPrimary }
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.gridCard} onPress={() => openMovie(item)}>
            <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                style={styles.gridImage}
            />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
            <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />

            {/* Barra de Búsqueda */}
            <View style={[styles.searchHeader, { backgroundColor: colors.card }]}>
                <Ionicons name="search" size={20} color={colors.textSecondary} />
                <TextInput
                    style={[styles.searchInput, { color: colors.textPrimary }]}
                    placeholder="Título, género, equipo o liga"
                    placeholderTextColor={colors.textSecondary}
                    value={query}
                    onChangeText={handleSearch}
                />
                {query.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearch('')}>
                        <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Contenido Dinámico */}
            {query.length === 0 ? (
                <View style={{ flex: 1 }}>
                    <View style={styles.categoriesRow}>
                        <FilterButton title="Tendencias" type="trending" icon="trending-up" />
                        <FilterButton title="Películas" type="movie" icon="film" />
                        <FilterButton title="Series" type="tv" icon="tv" />
                    </View>

                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                        {activeFilter === 'trending' ? 'Tendencias de hoy' : activeFilter === 'movie' ? 'Películas Populares' : 'Series Populares'}
                    </Text>

                    {loading ? (
                        <ActivityIndicator size="large" color={colors.tint} style={{ marginTop: 50 }} />
                    ) : (
                        <FlatList
                            data={exploreData}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={3}
                            columnWrapperStyle={styles.columnWrapper}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 15 }}
                    contentContainerStyle={{ paddingVertical: 15 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.resultCard} onPress={() => openMovie(item)}>
                            <Image
                                source={{ uri: `https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}` }}
                                style={styles.resultImage}
                            />
                            <Text numberOfLines={1} style={[styles.resultTitle, { color: colors.textPrimary }]}>{item.title || item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* Modal de Detalle */}
            <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    {selectedMovie && (
                        <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 50 }}>
                            <ImageBackground
                                source={{ uri: `https://image.tmdb.org/t/p/original${selectedMovie.poster_path}` }}
                                style={styles.modalHero}
                            >
                                <LinearGradient colors={['transparent', colors.background]} style={styles.modalGradient} />
                                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                    <Ionicons name="close-circle" size={36} color={theme === 'dark' ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.5)"} />
                                </TouchableOpacity>
                            </ImageBackground>

                            <View style={styles.modalContent}>
                                <Text style={[styles.movieLogoText, { color: colors.textPrimary }]}>{selectedMovie.title || selectedMovie.name}</Text>
                                <View style={styles.metaRow}>
                                    <View style={[styles.hdBadge, { backgroundColor: colors.border }]}><Text style={[styles.hdText, { color: colors.textSecondary }]}>HD</Text></View>
                                    <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                                        {new Date(selectedMovie.release_date || selectedMovie.first_air_date).getFullYear()} •
                                        {selectedMovie.vote_average?.toFixed(1)} ⭐
                                    </Text>
                                </View>
                                <TouchableOpacity style={[styles.playButton, { backgroundColor: colors.textPrimary }]}>
                                    <Ionicons name="play" size={24} color={colors.background} />
                                    <Text style={[styles.playText, { color: colors.background }]}>VER AHORA</Text>
                                </TouchableOpacity>
                                <View style={styles.actionRow}>
                                    <TouchableOpacity style={styles.actionBtn} onPress={toggleFavorite}>
                                        <Ionicons
                                            name={isFavorite ? "heart" : "heart-outline"}
                                            size={28}
                                            color={isFavorite ? colors.danger : colors.textPrimary}
                                        />
                                        <Text style={[styles.actionText, { color: isFavorite ? colors.danger : colors.textSecondary }]}>MI LISTA</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.actionBtn}>
                                        <Ionicons name="videocam-outline" size={28} color={colors.textPrimary} />
                                        <Text style={[styles.actionText, { color: colors.textSecondary }]}>TRAILER</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.actionBtn}>
                                        <Ionicons name="download-outline" size={28} color={colors.textPrimary} />
                                        <Text style={[styles.actionText, { color: colors.textSecondary }]}>DESCARGAR</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={[styles.synopsis, { color: colors.textSecondary }]}>{selectedMovie.overview}</Text>
                                <View style={styles.qrSection}>
                                    <View style={[styles.qrBox, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                                        <Ionicons name="qr-code" size={60} color={colors.textPrimary} />
                                    </View>
                                    <Text style={{ color: colors.textSecondary, marginTop: 10 }}>ID: {selectedMovie.id}</Text>
                                </View>
                            </View>
                        </ScrollView>
                    )}
                </View>
            </Modal>
        </View>
    );
}

// ESTILOS

const styles = StyleSheet.create({
    container: { flex: 1 },
    searchHeader: {
        flexDirection: 'row', alignItems: 'center',
        margin: 15, paddingHorizontal: 15, borderRadius: 8, height: 50
    },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
    categoriesRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, marginBottom: 20 },
    catBox: { width: '31%', aspectRatio: 1, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    catText: { fontWeight: '600', fontSize: 12 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, paddingHorizontal: 15 },
    columnWrapper: { justifyContent: 'flex-start', paddingHorizontal: 10 },
    gridCard: { width: '31%', margin: '1%', aspectRatio: 2 / 3 },
    gridImage: { width: '100%', height: '100%', borderRadius: 8 },
    resultCard: { width: '48%', marginBottom: 15 },
    resultImage: { width: '100%', aspectRatio: 16 / 9, borderRadius: 6, backgroundColor: '#333' },
    resultTitle: { marginTop: 5, fontSize: 14, fontWeight: '600' },
    modalContainer: { flex: 1 },
    modalHero: { width: '100%', height: 450, justifyContent: 'flex-end' },
    modalGradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 300 },
    closeButton: { position: 'absolute', top: 20, right: 20, zIndex: 10 },
    modalContent: { paddingHorizontal: 20, marginTop: -30 },
    movieLogoText: { fontSize: 32, fontWeight: '900', textAlign: 'center', marginBottom: 15, textShadowColor: 'black', textShadowRadius: 10 },
    metaRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 25, gap: 10 },
    hdBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    hdText: { fontSize: 10, fontWeight: 'bold' },
    metaText: { fontSize: 13 },
    playButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 5, marginBottom: 25 },
    playText: { fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
    actionRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30 },
    actionBtn: { alignItems: 'center' },
    actionText: { fontSize: 10, marginTop: 6, textTransform: 'uppercase', letterSpacing: 1 },
    synopsis: { fontSize: 14, lineHeight: 22, marginBottom: 30 },
    qrSection: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
    qrBox: { padding: 15, borderRadius: 10 }
});