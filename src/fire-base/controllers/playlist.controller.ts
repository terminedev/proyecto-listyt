// import { db } from '../main';
// import {
//     collection,
//     doc,
//     addDoc,
//     updateDoc,
//     deleteDoc,
//     getDoc, 
//     getDocs,
//     query,
//     limit,
//     startAfter,
//     orderBy,
//     where, 
//     serverTimestamp,
//     getCountFromServer,
//     arrayUnion,
//     arrayRemove,
// } from 'firebase/firestore';

import type { FormatResponse, Playlist, PlaylistResponse, UpdatedDataPlaylist } from "../interfaces";
import { formatResponse, generateCleanName } from "../main";

const COLLECTION_NAME = "playlists";

// ----------------------------------
// FIREBASE
// ----------------------------------

// -----------------
// GETTERS
// -----------------

// OBTENER playlists por cleanName (con paginación opcional):
export const getPlaylistsByCleanName = async (
    cleanName: Playlist['cleanName'] = '',
    limitCount: number | null = null,
    lastDoc: any = null
): Promise<FormatResponse> => {

    if (!cleanName || cleanName.length <= 0) return {
        data: null,
        message: 'Ingrese un nombre para buscar.',
        response: false
    };

    try {
        const playlistCollectionRef = collection(db, COLLECTION_NAME);
        const queryConstraints = [];

        if (cleanName) queryConstraints.push(where('cleanName', '==', cleanName));

        queryConstraints.push(orderBy('createdAt', 'asc'));

        if (limitCount) queryConstraints.push(limit(limitCount));

        if (lastDoc) queryConstraints.push(startAfter(lastDoc));

        const q = queryConstraints.length > 0
            ? query(playlistCollectionRef, ...queryConstraints)
            : playlistCollectionRef;

        const querySnapshot = await getDocs(q);
        const playlists: Playlist[] = [];

        querySnapshot.forEach((doc: any) => {
            playlists.push({
                id: doc.id,
                ...doc.data()
            } as Playlist);
        });

        const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

        return formatResponse(
            true,
            {
                playlists,
                lastDoc: newLastDoc
            } as PlaylistResponse,
            "Playlists filtradas obtenidas exitosamente."
        );

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error en la búsqueda de playlists.`);
    }
};

// OBTENER una única playlist por su ID:
export const getPlaylistById = async (
    playlistID: Playlist['id']
): Promise<FormatResponse> => {

    if (!playlistID || playlistID.length <= 0) return {
        data: null,
        message: 'Ingrese un id.',
        response: false
    };

    try {
        const docRef = doc(db, COLLECTION_NAME, playlistID);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return formatResponse(false, null, "Playlist no encontrada.");

        return formatResponse(
            true,
            { id: docSnap.id, ...docSnap.data() } as Playlist,
            "Playlist obtenida exitosamente."
        );
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al obtener la playlist.`);
    }
};

// -----------------
// CRUD
// -----------------

// ALMACENAR una nueva playlist:
export const storePlaylist = async (
    playlist: Playlist
): Promise<FormatResponse> => {

    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), playlist);

        return formatResponse(true, {
            ...playlist,
            id: docRef.id,
        }, "Playlist almacenada exitosamente.");

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al almacenar la playlist.`);
    }
};

// ACTUALIZAR y EDITAR una playlist existente por su ID:
export const updatePlaylist = async (
    playlistID: string,
    updatedData: UpdatedDataPlaylist
): Promise<FormatResponse> => {

    if (!playlistID || playlistID.length <= 0) return {
        data: null,
        message: 'Ingrese el ID de la playlist.',
        response: false
    };

    try {
        const docRef = doc(db, COLLECTION_NAME, playlistID);

        const dataToUpdate = { ...updatedData };

        // Limpiamos el nombre si se está enviando en la actualización
        if (dataToUpdate.cleanName) {
            dataToUpdate.cleanName = generateCleanName(dataToUpdate.cleanName);
        } else if (dataToUpdate.name) {
            // Opcional: Si envían 'name' pero no 'cleanName', lo generamos automáticamente
            dataToUpdate.cleanName = generateCleanName(dataToUpdate.name);
        }

        await updateDoc(docRef, dataToUpdate as any);

        return formatResponse(true, { id: playlistID, ...dataToUpdate }, "Playlist actualizada exitosamente.");

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al actualizar la playlist.`);
    }
};

// ELIMINAR una playlist existente por su ID:
export const deletePlaylist = async (
    playlistID: Playlist['id']
): Promise<FormatResponse> => {

    if (!playlistID || playlistID.length <= 0) return {
        data: null,
        message: 'Ingrese el ID de la playlist.',
        response: false
    };

    try {
        const docRef = doc(db, COLLECTION_NAME, playlistID);
        await deleteDoc(docRef);

        return formatResponse(true, null, "Playlist eliminada exitosamente.");
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al eliminar la playlist.`);
    }
};