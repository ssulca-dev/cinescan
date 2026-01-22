import {CameraView, CameraType, useCameraPermissions, BarcodeScanningResult} from 'expo-camera';
import {useRef, useState} from 'react';
import {Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {router} from "expo-router";

export default function CameraPage() {
    const [facing, setFacing] = useState<CameraType>('back');
    const ref = useRef<any>(0);
    const [permission, requestPermission] = useCameraPermissions();
    const [showWelcome, setShowWelcome] = useState(true);
    const [name, setName] = useState('');

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function onPictureSaved(data:any){
        console.log('Picture Saved', data);
    }

    function takePhoto() {
        ref.current.takePictureAsync({base64: true, onPictureSaved:onPictureSaved}).then((data:any)=>{
            console.log('take photo',data);
        }).catch(()=>{
            console.log('Error');
        });
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    function barcodeScanned(result: BarcodeScanningResult ){
        console.log('Barcode scanned', result.data);
        router.push({
            pathname: '/camera',
            params:{
                qr: result.data,
            }
        })
    }

    return (

        <View style={styles.container}>

            {/* 🔹 MODAL DE BIENVENIDA */}
            <Modal visible={showWelcome} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.title}>¡Bienvenido! 👋</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Ingresa tu nombre"
                            value={name}
                            onChangeText={setName}
                        />

                        <TouchableOpacity
                            style={styles.startButton}
                            onPress={() => setShowWelcome(false)}
                            disabled={!name.trim()}
                        >
                            <Text style={styles.startText}>Comenzar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <CameraView ref={ref} style={styles.camera} facing={facing} barcodeScannerSettings={{
                barcodeTypes: ["qr"],
            }} onBarcodeScanned={barcodeScanned}/>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                    <MaterialIcons name="cameraswitch" size={50} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={takePhoto}>
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

    button: {
        width: 80,
        height: 90,
        borderRadius: 27.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalBox: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
    },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },

    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
    },

    startButton: {
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
    },

    startText: {
        color: 'white',
        fontSize: 16,
    },
});
