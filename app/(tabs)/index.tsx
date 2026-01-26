import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// export default function CineScanApp() {
//     return (
        // <View style={styles.container}>
        //     {/* Header */}
        //     <View style={styles.header}>
        //         <Text style={styles.logo}>CINESCAN</Text>
        //
        //     {/* BOTÓN CÁMARA */}
        //     <TouchableOpacity onPress={() => router.push('/camera')}>
        //         <Ionicons name="camera-outline" size={28} color="#fff" />
        //     </TouchableOpacity>
        //
        //     </View>
        //
        //     {/* Main Content */}
        //     <ScrollView style={styles.content}>
        //         <View style={styles.mainCard} />
        //
        //         <View style={styles.themeContainer}>
        //             <TouchableOpacity style={styles.themeButton}>
        //                 <Text style={styles.themeText}>Tema 1</Text>
        //             </TouchableOpacity>
        //             <TouchableOpacity style={styles.themeButton}>
        //                 <Text style={styles.themeText}>Tema 2</Text>
        //             </TouchableOpacity>
        //             <TouchableOpacity style={styles.themeButton}>
        //                 <Text style={styles.themeText}>Tema 3</Text>
        //             </TouchableOpacity>
        //             <TouchableOpacity style={styles.themeButton}>
        //                 <Text style={styles.themeText}>Tema 4</Text>
        //             </TouchableOpacity>
        //         </View>
        //
        //         <Text style={styles.recommendedTitle}>Recomendado para ti</Text>
        //         <View style={styles.recommendedContainer}>
        //             <View style={styles.recommendedCard} />
        //             <View style={styles.recommendedCard} />
        //         </View>
        //     </ScrollView>
        //
        //     {/* Bottom Navigation */}
        //     <View style={styles.bottomNav}>
        //         <TouchableOpacity style={styles.navButton}>
        //             <Ionicons name="home" size={28} color="#fff" />
        //         </TouchableOpacity>
        //         <TouchableOpacity style={styles.navButton}>
        //             <Ionicons name="search" size={28} color="#6B7280" />
        //         </TouchableOpacity>
        //         <TouchableOpacity style={styles.navButton}>
        //             <Ionicons name="person-outline" size={28} color="#6B7280" />
        //         </TouchableOpacity>
        //     </View>
        // </View>

//         <View className="flex-1 bg-black">
//             {/* Header */}
//             <View className="flex-row justify-between items-center px-5 pt-12 pb-5 bg-black">
//                 <Text className="text-2xl font-bold text-white tracking-widest">CINESCAN</Text>
//
//             {/* Camara */}
//             <TouchableOpacity onPress={() => router.push('/camera')}>
//                 <Ionicons name="camera-outline" size={28} color="#fff" />
//             </TouchableOpacity>
//              </View>
//
//
//             {/* Main Content */}
//             <ScrollView className="flex-1 px-5">
//                 {/* Main Card */}
//                 <View className="w-full h-[360px] bg-gray-600 rounded-3xl mt-2" />
//
//                 {/* Theme Buttons */}
//                 <View className="flex-row justify-between mt-5 mb-8">
//                     <TouchableOpacity className="bg-gray-600 py-3 px-5 rounded-full">
//                         <Text className="text-gray-300 text-sm">Tema 1</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity className="bg-gray-600 py-3 px-5 rounded-full">
//                         <Text className="text-gray-300 text-sm">Tema 2</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity className="bg-gray-600 py-3 px-5 rounded-full">
//                         <Text className="text-gray-300 text-sm">Tema 3</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity className="bg-gray-600 py-3 px-5 rounded-full">
//                         <Text className="text-gray-300 text-sm">Tema 4</Text>
//                     </TouchableOpacity>
//                 </View>
//
//                 {/* Recommended Section */}
//                 <Text className="text-white text-base mb-4">Recomendado para ti</Text>
//                 <View className="flex-row justify-between mb-24">
//                     <View className="w-[48%] h-[200px] bg-gray-600 rounded-2xl" />
//                     <View className="w-[48%] h-[200px] bg-gray-600 rounded-2xl" />
//                 </View>
//             </ScrollView>
//
//             {/* Bottom Navigation */}
//             <View className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center bg-black py-4 pb-8 border-t border-gray-800">
//                 <TouchableOpacity className="p-2">
//                     <Ionicons name="home" size={28} color="#fff" />
//                 </TouchableOpacity>
//                 <TouchableOpacity className="p-2">
//                     <Ionicons name="search" size={28} color="#6B7280" />
//                 </TouchableOpacity>
//                 <TouchableOpacity className="p-2">
//                     <Ionicons name="person-outline" size={28} color="#6B7280" />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#000',
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//         paddingTop: 50,
//         paddingBottom: 20,
//         backgroundColor: '#000',
//     },
//     logo: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#fff',
//         letterSpacing: 2,
//     },
//     content: {
//         flex: 1,
//         paddingHorizontal: 20,
//     },
//     mainCard: {
//         width: '100%',
//         height: 360,
//         backgroundColor: '#4B5563',
//         borderRadius: 20,
//         marginTop: 10,
//     },
//     themeContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 20,
//         marginBottom: 30,
//     },
//     themeButton: {
//         backgroundColor: '#4B5563',
//         paddingVertical: 12,
//         paddingHorizontal: 20,
//         borderRadius: 25,
//     },
//     themeText: {
//         color: '#D1D5DB',
//         fontSize: 14,
//     },
//     recommendedTitle: {
//         color: '#fff',
//         fontSize: 16,
//         marginBottom: 15,
//     },
//     recommendedContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 100,
//     },
//     recommendedCard: {
//         width: '48%',
//         height: 200,
//         backgroundColor: '#4B5563',
//         borderRadius: 15,
//     },
//     bottomNav: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         alignItems: 'center',
//         backgroundColor: '#000',
//         paddingVertical: 15,
//         paddingBottom: 30,
//         borderTopWidth: 1,
//         borderTopColor: '#1F2937',
//     },
//     navButton: {
//         padding: 10,
//     },
// });