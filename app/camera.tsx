import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, Modal, StyleSheet, Text, TouchableOpacity, View, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/supabase/supabase';
import { router } from 'expo-router';

const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;

export default function CameraPage() {
    const [scanEnabled, setScanEnabled] = useState(false);
    const ref = useRef(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [modalVisible, setModalVisible] = useState(false);
    const [movie, setMovie] = useState<any>(null);
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);

    const saveToHistory = async (movieData: any, mediaType: string) => {
        const { error } = await supabase
            .from('history')
            .upsert([
                {
                    id: movieData.id,
                    title: movieData.title || movieData.name,
                    poster_path: movieData.poster_path,
                    media_type: mediaType,
                    release_date: movieData.release_date || movieData.first_air_date,
                    scanned_by: 'Usuario'
                }
            ]);

        if (error) {
            console.log('Error guardando en historial:', error.message);
        }
    };

    const fetchMovieData = async (id: string, type: string) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/${type}/${id}?api_key=${TMDB_API_KEY}&language=es-MX`
            );

            if (!response.ok) throw new Error("No encontrado");

            const data = await response.json();
            setMovie(data);
            setModalVisible(true);

            await saveToHistory(data, type);

        } catch (error) {
            Alert.alert("Error", "No pudimos obtener la información de este código.");
            setScanned(false);
            setScanEnabled(false);
        } finally {
            setLoading(false);
        }
    };

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Necesitamos acceso a tu cámara para escanear.</Text>
                <Button onPress={requestPermission} title="Dar Permiso" />
            </View>
        );
    }

    function barcodeScanned(result: any) {
        if (scanned || loading) return;

        const url = result.data;
        const match = url.match(/\/(movie|tv)\/(\d+)/);

        if (match) {
            setScanned(true);
            setScanEnabled(false);
            const type = match[1];
            const id = match[2];
            fetchMovieData(id, type);
        } else {
            // Ignorar QRs no válidos
        }
    }

    return (
        <View style={styles.container}>
            <CameraView
                ref={ref}
                style={styles.camera}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={scanEnabled ? barcodeScanned : undefined}
            />

            {!modalVisible && (
                <View style={styles.scanOverlay}>
                    <TouchableOpacity style={styles.closeCamera} onPress={() => router.back()}>
                        <Ionicons name="close" size={30} color="white" />
                    </TouchableOpacity>

                    <View style={styles.scanBox}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>

                    {loading && <ActivityIndicator size="large" color="#fff" style={{marginTop: 20}} />}

                    {!scanEnabled && !loading && (
                        <Text style={styles.instructions}>Presiona el botón para escanear</Text>
                    )}
                </View>
            )}

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {movie?.poster_path ? (
                            <ImageBackground
                                source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                                style={styles.posterBackground}
                                imageStyle={{ borderRadius: 15 }}
                            >
                                <View style={styles.overlay}>
                                    <Text style={styles.title}>{movie?.title || movie?.name}</Text>
                                    <Text style={styles.modalText}>
                                        {new Date(movie?.release_date || movie?.first_air_date || Date.now()).getFullYear()}
                                    </Text>
                                    <Text numberOfLines={3} style={[styles.modalText, { marginTop: 10, opacity: 0.8 }]}>
                                        {movie?.overview}
                                    </Text>

                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => {
                                            setModalVisible(false);
                                            setScanned(false);
                                            setMovie(null);
                                        }}
                                    >
                                        <Text style={styles.closeButtonText}>Cerrar</Text>
                                    </TouchableOpacity>
                                </View>
                            </ImageBackground>
                        ) : (
                            <View style={{padding: 20}}>
                                <Text style={[styles.title, {color:'white'}]}>Información no disponible</Text>
                                <Button title="Cerrar" onPress={() => setModalVisible(false)} />
                            </View>
                        )}
                    </View>
                </View>
            </Modal>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => {
                        setScanEnabled(true);
                        setScanned(false);
                    }}
                    style={{ opacity: scanEnabled ? 0.5 : 1 }}
                >
                    <Ionicons name="radio-button-on" size={80} color="white" />
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    message: { textAlign: 'center', paddingBottom: 10, color: 'white' },
    camera: { flex: 1 },
    buttonContainer: { position: 'absolute', bottom: 50, alignSelf: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
    modalText: { color: '#fff', fontSize: 14 },
    modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#1a1a1a', borderRadius: 15, width: '85%', overflow: 'hidden', height: 500 },
    closeButton: { marginTop: 20, backgroundColor: 'white', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
    closeButtonText: { color: 'black', fontWeight: 'bold', fontSize: 16 },
    posterBackground: { width: '100%', height: '100%', justifyContent: 'flex-end' },
    overlay: { padding: 20, backgroundColor: 'rgba(0,0,0,0.7)' },
    scanOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
    scanBox: { width: 280, height: 280, position: 'relative' },
    instructions: { color: '#ccc', marginTop: 20, fontSize: 14 },
    closeCamera: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 10 },
    corner: { position: 'absolute', width: 40, height: 40, borderColor: 'white', borderWidth: 4 },
    topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
    topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
    bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
    bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
});