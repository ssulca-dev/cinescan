// CONFIGURACIÓN Y CONSTANTES
const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;

// SERVICIO DE DATOS

export const TMDBService = {

    // Películas Populares
    getPopular: async (page = 1) => {
        try {
            const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-MX&page=${page}`);
            return await res.json();
        } catch (error) {
            return {results: []};
        }
    },

    // Tendencias
    getTrending: async (page = 1) => {
        try {
            const res = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=es-MX`);
            return await res.json();
        } catch (error) {
            return {results: []};
        }
    },

    // Series de TV Populares
    getTVPopular: async (page = 1) => {
        try {
            const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=es-MX&page=${page}`);
            return await res.json();
        } catch (error) {
            return {results: []};
        }
    },

    // Filtrado por Género
    getByGenre: async (genreId: number, page = 1) => {
        try {
            const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-MX&with_genres=${genreId}&page=${page}`);
            return await res.json();
        } catch (error) {
            return {results: []};
        }
    },

    // Búsqueda
    search: async (query: string) => {
        try {
            const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=es-MX&query=${query}&include_adult=false`);
            return await res.json();
        } catch (error) {
            return {results: []};
        }
    },

    // Detalles
    getDetails: async (id: number, type: 'movie' | 'tv') => {
        try {
            const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=es-MX&append_to_response=videos,credits`);
            return await res.json();
        } catch (error) {
            return null;
        }
    }
};