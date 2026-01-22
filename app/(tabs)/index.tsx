import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function CineScanApp() {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logo}>CINESCAN</Text>

            {/* BOTÓN CÁMARA */}
            <TouchableOpacity onPress={() => router.push('/camera')}>
                <Ionicons name="camera-outline" size={28} color="#fff" />
            </TouchableOpacity>

            </View>

            {/* Main Content */}
            <ScrollView style={styles.content}>
                <View style={styles.mainCard} />

                <View style={styles.themeContainer}>
                    <TouchableOpacity style={styles.themeButton}>
                        <Text style={styles.themeText}>Tema 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.themeButton}>
                        <Text style={styles.themeText}>Tema 2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.themeButton}>
                        <Text style={styles.themeText}>Tema 3</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.themeButton}>
                        <Text style={styles.themeText}>Tema 4</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.recommendedTitle}>Recomendado para ti</Text>
                <View style={styles.recommendedContainer}>
                    <View style={styles.recommendedCard} />
                    <View style={styles.recommendedCard} />
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navButton}>
                    <Ionicons name="home" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
                    <Ionicons name="search" size={28} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
                    <Ionicons name="person-outline" size={28} color="#6B7280" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: '#000',
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 2,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    mainCard: {
        width: '100%',
        height: 360,
        backgroundColor: '#4B5563',
        borderRadius: 20,
        marginTop: 10,
    },
    themeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 30,
    },
    themeButton: {
        backgroundColor: '#4B5563',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    themeText: {
        color: '#D1D5DB',
        fontSize: 14,
    },
    recommendedTitle: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 15,
    },
    recommendedContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 100,
    },
    recommendedCard: {
        width: '48%',
        height: 200,
        backgroundColor: '#4B5563',
        borderRadius: 15,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#000',
        paddingVertical: 15,
        paddingBottom: 30,
        borderTopWidth: 1,
        borderTopColor: '#1F2937',
    },
    navButton: {
        padding: 10,
    },
});