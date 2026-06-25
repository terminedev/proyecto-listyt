// import { auth } from '../main';
// import {
//     signInWithEmailAndPassword,
//     signOut,
//     onAuthStateChanged
// } from 'firebase/auth';

import type { FormatResponse, User } from "../interfaces";
import { formatResponse } from "../main";


// 1. Iniciar sesión (Login):
export const loginUser = async (email: string, password: string): Promise<FormatResponse> => {

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Retornamos solo los datos necesarios del usuario por seguridad
        return formatResponse(
            true,
            {
                uid: user.uid,
                email: user.email,
                isGuest: true
            } as User,
            "Inicio de sesión exitoso."
        );

    } catch (error) {
        if (error instanceof Error) {
            // Aquí TypeScript sabe que 'error' es de tipo Error
            console.error(error.message);
        } else {
            // Fallback por si lanzaron algo que no es un Error (como una cadena o null)
            console.error('Error desconocido:', error);
        }

        return formatResponse(
            false,
            null,
            `Error al iniciar sesión.`
        );

    }
};

// 2. Cerrar sesión (Logout):
export const logoutUser = async (): Promise<FormatResponse> => {
    try {
        await signOut(auth);

        return formatResponse(
            true,
            null,
            "Sesión cerrada exitosamente."
        );
    } catch (error) {
        if (error instanceof Error) {
            // Aquí TypeScript sabe que 'error' es de tipo Error
            console.error(error.message);
        } else {
            // Fallback por si lanzaron algo que no es un Error (como una cadena o null)
            console.error('Error desconocido:', error);
        }

        return formatResponse(
            false,
            null,
            `Error al cerrar sesión.`
        );
    }
};

// 3. VERIFICAR Y ESCUCHAR EL ESTADO DE AUTENTICACIÓN (Listener):
// Esta función no usa async/await de forma tradicional porque es un "observador" en tiempo real.
// Recibe un "callback" (una función) que se ejecutará cada vez que el estado cambie (login, logout, expiración).
export const listenAuthState = (callback: (res: FormatResponse) => void): () => void => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // El usuario está logueado
            callback(formatResponse(
                true,
                {
                    uid: user.uid,
                    email: user.email,
                    isGuest: true
                } as User,
                "Usuario actualmente autenticado."
            ));
        } else {
            // El usuario no está logueado
            callback(formatResponse(
                false,
                null,
                "No hay usuario autenticado en este momento."
            ));
        }
    });

    // Retornamos la función unsubscribe para que la UI pueda dejar de escuchar cuando el componente se desmonte.
    return unsubscribe;
};