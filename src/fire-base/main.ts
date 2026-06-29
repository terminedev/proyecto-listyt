import { getAuth } from "firebase/auth";
import type { FormatResponse } from "./interfaces";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;


// Función auxiliar para estandarizar las respuestas:
export const formatResponse = (
    response: boolean | null,
    data: any,
    message: string
): FormatResponse => ({
    response,
    data,
    message
});

// Generador de slugs (cleanName)
export const generateCleanName = (name: string): string => {
    if (!name) return "";

    return name
        .toLowerCase()
        .normalize("NFD") // Separa las letras de los acentos
        .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
};

