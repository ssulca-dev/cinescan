import {CameraView, useCameraPermissions, BarcodeScanningResult} from 'expo-camera';
import {useRef, useState} from 'react';
import {Button, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ImageBackground } from 'react-native';
import {supabase} from "@/supabase/supabase";

const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;

export default function CameraPage() {

    const [scanEnabled, setScanEnabled] = useState(false);
    const ref = useRef<any>(0);
    const [permission, requestPermission] = useCameraPermissions();
    const [modalVisible, setModalVisible] = useState(false);
    const [movie, setMovie] = useState<any>(null);
    const [scanned, setScanned] = useState(false);

    const saveMovieToSupabase = async (title: string, year: number | null) => {
        const { data, error } = await supabase
            .from('ScanPeliculas')
            .insert([
                {
                    name_film: title,
                    year_film: year,
                }
            ])
            .select();

        if (error) {
            console.log('Supabase error:', error.message, error.details);
        } else {
            console.log('Guardado:', data);
        }
    };

    const fetchMovie = async (movieId: string) => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=es-ES`
            );

            const data = await response.json();

            console.log('🎬 Movie fetched:', data.title, data.release_date);

            setMovie(data);
            setModalVisible(true);

            const year = data.release_date
                ? Number(data.release_date.split('-')[0])
                : null;

            await saveMovieToSupabase(data.title, year);

        } catch (error) {
            console.log('fetchMovie error:', error);
        }
    };

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function barcodeScanned(result: BarcodeScanningResult) {
        if (scanned) return;

        setScanned(true);
        setScanEnabled(false);

        const movieId = result.data.split('/movie/')[1]?.split('-')[0];

        if (movieId) {
            fetchMovie(movieId);
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
                    <View style={styles.scanBox}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                </View>
            )}

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>

                        {movie?.poster_path && (
                            <ImageBackground
                                source={{
                                    uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                }}
                                style={styles.posterBackground}
                                imageStyle={{ borderRadius: 15 }}
                            >

                                {/* OVERLAY OSCURO */}
                                <View style={styles.overlay}>

                                    <Text style={styles.title}>{movie?.title}</Text>

                                    <Text style={styles.modalText}>
                                        Año: {movie?.release_date?.split('-')[0]}
                                    </Text>

                                    <Text style={[styles.modalText, { marginTop: 10 }]}>
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
                                        <Text style={styles.closeButtonText}>Escanear otro</Text>
                                    </TouchableOpacity>

                                </View>
                            </ImageBackground>
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
                >
                    <MaterialIcons name="photo-camera" size={50} color="white" />
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
    },

    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },

    camera: {
        flex: 1,
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 100,
        marginBottom: 50,
        backgroundColor: 'transparent',
    },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },

    modalText: {
        color: '#fff',
        fontSize: 13,
    },

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        backgroundColor: '#000',
        padding: 20,
        borderRadius: 15,
        width: '85%',
    },

    closeButton: {
        marginTop: 15,
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },

    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

    posterBackground: {
        width: '100%',
        height: 450,
        justifyContent: 'flex-end',
    },

    overlay: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 20,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },

    scanOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },

    scanBox: {
        width: 260,
        height: 260,
        position: 'relative',
    },

    corner: {
        position: 'absolute',
        width: 35,
        height: 35,
        borderColor: '#fff', // BLANCO
    },

    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4,
    },

    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 4,
        borderRightWidth: 4,
    },

    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
    },

    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 4,
        borderRightWidth: 4,
    },
});
