// IMPORTACIONES
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, StatusBar, Modal, Dimensions, ImageBackground, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';

import { TMDBService } from '@/services/tmdb';
import { supabase } from '@/supabase/supabase';
import { useTheme } from '@/context/ThemeContext';

const CATEGORIES = [
    { id: 0, name: "Todos" },
    { id: 28, name: "Acción" },
    { id: 878, name: "Sci-Fi" },
    { id: 27, name: "Terror" },
    { id: 18, name: "Drama" },
    { id: 35, name: "Comedia" },
    { id: 10749, name: "Romance" },
    { id: 16, name: "Animación" },
];

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { colors, theme } = useTheme();

    const [swiperMovies, setSwiperMovies] = useState<any[]>([]);
    const [trendingHorizontal, setTrendingHorizontal] = useState<any[]>([]);
    const [moviesList, setMoviesList] = useState<any[]>([]);

    const [activeCategory, setActiveCategory] = useState(0);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const [selectedMovie, setSelectedMovie] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // @ts-ignore
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        const popData = await TMDBService.getPopular(1);
        setSwiperMovies(popData.results?.slice(0, 5) || []);

        const trendData = await TMDBService.getTrending();
        setTrendingHorizontal(trendData.results || []);

        await fetchMoviesList(1, 0, true);
    };

    const fetchMoviesList = async (pageNum: number, categoryId: number, reset = false) => {
        if (loadingMore && !reset) return;
        setLoadingMore(true);

        let data;
        if (categoryId === 0) {
            data = await TMDBService.getPopular(pageNum);
        } else {
            data = await TMDBService.getByGenre(categoryId, pageNum);
        }

        const newMovies = data.results || [];

        if (reset) {
            setMoviesList(newMovies);
        } else {
            setMoviesList(prev => {
                const currentIds = new Set(prev.map(m => m.id));
                const filtered = newMovies.filter((m: any) => !currentIds.has(m.id));
                return [...prev, ...filtered];
            });
        }

        setPage(pageNum);
        setLoadingMore(false);
    };

    const handleCategoryPress = (catId: number) => {
        if (activeCategory === catId) return;
        setActiveCategory(catId);
        setMoviesList([]);
        fetchMoviesList(1, catId, true);
    };

    const handleLoadMore = () => {
        fetchMoviesList(page + 1, activeCategory);
    };

    const openMovie = async (movie: any) => {
        setSelectedMovie(movie);
        setModalVisible(true);
        const { data } = await supabase.from('favorites').select('id').eq('id', movie.id).maybeSingle();
        setIsFavorite(!!data);
        await TMDBService.getDetails(movie.id, movie.media_type === 'tv' ? 'tv' : 'movie');
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
                media_type: selectedMovie.media_type || 'movie',
                release_date: selectedMovie.release_date || selectedMovie.first_air_date,
                user_name: 'Usuario'
            });
            if (!error) setIsFavorite(true);
        }
    };

    const renderHeader = () => (
        <View>
            <View style={styles.swiperContainer}>
                {swiperMovies.length > 0 && (
                    <Swiper
                        autoplay={true} autoplayTimeout={5}
                        dotColor="rgba(255,255,255,0.3)" activeDotColor="#FFF"
                        paginationStyle={{ bottom: 10 }}
                    >
                        {swiperMovies.map((movie) => (
                            <TouchableOpacity key={movie.id} style={styles.slide} onPress={() => openMovie(movie)}>
                                <Image source={{ uri: `https://image.tmdb.org/t/p/original${movie.backdrop_path}` }} style={styles.slideImage} />
                                {/* Gradiente dinámico para fundirse con el fondo */}
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.5)', colors.background]}
                                    style={styles.slideGradient}
                                />
                                <View style={styles.slideContent}>
                                    <Text style={styles.slideTitle}>{movie.title}</Text>
                                    <Text style={styles.slideSubtitle}>{new Date(movie.release_date).getFullYear()} • {movie.vote_average.toFixed(1)} ⭐</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </Swiper>
                )}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
                {CATEGORIES.map(cat => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[
                            styles.pill,
                            {
                                backgroundColor: activeCategory === cat.id ? colors.tint : (theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                                borderColor: activeCategory === cat.id ? colors.tint : colors.border
                            }
                        ]}
                        onPress={() => handleCategoryPress(cat.id)}
                    >
                        <Text style={[
                            styles.pillText,
                            { color: activeCategory === cat.id ? (theme === 'dark' ? 'black' : 'white') : colors.textPrimary }
                        ]}>
                            {cat.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {activeCategory === 0 && (
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Tendencias de la semana</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 15 }}>
                        {trendingHorizontal.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.horizontalCard} onPress={() => openMovie(item)}>
                                <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.horizontalImage} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            <Text style={[styles.sectionTitle, { marginTop: 20, color: colors.textPrimary }]}>
                {activeCategory === 0 ? "Catálogo Completo" : `Películas de ${CATEGORIES.find(c => c.id === activeCategory)?.name}`}
            </Text>
        </View>
    );

    const renderGridItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.gridCard} onPress={() => openMovie(item)}>
            <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.gridImage} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
            <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />

            <View style={styles.appHeader}>
                <View style={{flex:1}}/>
                <Text style={[styles.logoText, { color: colors.textPrimary }]}>CINESCAN</Text>
                <View style={{flex:1, alignItems:'flex-end'}}>
                    <TouchableOpacity onPress={() => router.push('/camera')} style={styles.scanButton}>
                        <Ionicons name="scan-outline" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={moviesList}
                renderItem={renderGridItem}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapper}
                ListHeaderComponent={renderHeader}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color={colors.tint} style={{margin:20}}/> : <View style={{height: 100}}/>}
                showsVerticalScrollIndicator={false}
            />

            <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    {selectedMovie && (
                        <ScrollView bounces={false} contentContainerStyle={{paddingBottom: 50}}>
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
                                    <Text style={{color: colors.textSecondary, marginTop: 10}}>ID: {selectedMovie.id}</Text>
                                </View>
                            </View>
                        </ScrollView>
                    )}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    appHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, marginBottom: 10, height: 50 },
    logoText: { fontSize: 24, fontWeight: '900', letterSpacing: 2, textAlign: 'center' },
    scanButton: { padding: 5 },
    swiperContainer: { height: 450, marginBottom: 20 },
    slide: { flex: 1 },
    slideImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    slideGradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 250 },
    slideContent: { position: 'absolute', bottom: 40, alignItems: 'center', width: '100%' },
    slideTitle: { color: 'white', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, textShadowColor: 'black', textShadowRadius: 10 },
    slideSubtitle: { color: '#ccc', fontSize: 12, fontWeight: '600' },
    pillsRow: { paddingVertical: 10, paddingHorizontal: 10, marginBottom: 10 },
    pill: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1 },
    pillText: { fontWeight: '600', fontSize: 13 },
    section: { marginBottom: 10 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15, marginBottom: 10, marginTop: 10 },
    horizontalCard: { marginRight: 12 },
    horizontalImage: { width: 110, height: 160, borderRadius: 8 },
    columnWrapper: { justifyContent: 'flex-start', paddingHorizontal: 10 },
    gridCard: { width: (width - 40) / 3, margin: 3, aspectRatio: 2/3 },
    gridImage: { width: '100%', height: '100%', borderRadius: 8 },
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