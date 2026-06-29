// import { db } from '../main';
// import {
//     collection,
//     doc,
//     addDoc,
//     updateDoc,
//     deleteDoc,
//     getDocs,
//     query,
//     limit,
//     startAfter,
//     orderBy,
//     serverTimestamp,
//     getCountFromServer,
//     arrayUnion,
//     arrayRemove,
// } from 'firebase/firestore';

import type { FormatResponse, UpdatedDataVideo, Video, VideoResponse } from "../interfaces";
import { formatResponse, generateCleanName } from "../main";

const COLLECTION_NAME = "videos";

// ----------------------------------
// FIREBASE
// ----------------------------------

// -----------------
// GETTERS
// -----------------

// OBTENER la cantidad total de videos en la colección:
export const getVideosCount = async (): Promise<FormatResponse> => {
    try {
        const collRef = collection(db, COLLECTION_NAME);
        const snapshot = await getCountFromServer(collRef);
        const count = snapshot.data().count as number;

        return formatResponse(true, count, "Cantidad de catálogos obtenida exitosamente.");

    } catch (error) {
        if (error instanceof Error) {
            // Aquí TypeScript sabe que 'error' es de tipo Error
            console.error(error.message);
        } else {
            // Fallback por si lanzaron algo que no es un Error (como una cadena o null)
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al obtener la cantidad de vídeos.`);
    }
};

// OBTENER videos por cleanTitle (con paginación opcional):
export const getVideosByCleanTitle = async (
    cleanTitle: Video['cleanTitle'] = '',
    limitCount: number | null = null,
    lastDoc = null
): Promise<FormatResponse> => {

    if (!cleanTitle || cleanTitle.length <= 0) return {
        data: null,
        message: 'Ingrese un título.',
        response: false
    };

    try {
        const productCollectionRef = collection(db, COLLECTION_NAME);
        const queryConstraints = [];

        if (cleanTitle) queryConstraints.push(where('cleanTitle', '==', cleanTitle));

        queryConstraints.push(orderBy('createdAt', 'asc'));

        if (limitCount) queryConstraints.push(limit(limitCount));

        if (lastDoc) queryConstraints.push(startAfter(lastDoc));

        // Construir la query final
        const q = queryConstraints.length > 0
            ? query(productCollectionRef, ...queryConstraints)
            : productCollectionRef;

        const querySnapshot = await getDocs(q);
        const videos: Video[] = [];

        querySnapshot.forEach((doc: any) => {
            videos.push({
                id: doc.id,
                ...doc.data()
            } as Video);
        });

        const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] as Video || null;

        return formatResponse(
            true,
            {
                videos,
                lastDoc: newLastDoc
            } as VideoResponse,
            "Productos filtrados obtenidos exitosamente."
        );

    } catch (error) {

        if (error instanceof Error) {
            // Aquí TypeScript sabe que 'error' es de tipo Error
            console.error(error.message);
        } else {
            // Fallback por si lanzaron algo que no es un Error (como una cadena o null)
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error en la búsqueda de vídeos.`);
    }
};

// OBTENER un único vídeo por su ID:
export const getVideoById = async (
    videoID: Video['id']
): Promise<FormatResponse> => {

    if (!videoID || videoID.length <= 0) return {
        data: null,
        message: 'Ingrese un id.',
        response: false
    };

    try {
        const docRef = doc(db, COLLECTION_NAME, videoID);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return formatResponse(false, null, "Vídeo no encontrado.");

        return formatResponse(
            true,
            { id: docSnap.id, ...docSnap.data() } as Video,
            "Vídeo obtenido exitosamente."
        );
    } catch (error) {

        if (error instanceof Error) {
            // Aquí TypeScript sabe que 'error' es de tipo Error
            console.error(error.message);
        } else {
            // Fallback por si lanzaron algo que no es un Error (como una cadena o null)
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al obtener el vídeo.`);
    }
};

// -----------------
// CRUD
// -----------------

// ALMACENAR un nuevo vídeo:
export const storeVideo = async (
    video: Video
): Promise<FormatResponse> => {

    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), video);

        return formatResponse(true, {
            ...video,
            id: docRef.id,
        }, "Vídeo almacenado exitosamente.");

    } catch (error) {
        if (error instanceof Error) {
            // Aquí TypeScript sabe que 'error' es de tipo Error
            console.error(error.message);
        } else {
            // Fallback por si lanzaron algo que no es un Error (como una cadena o null)
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al almacenar el vídeo.`);
    }
};

// ACTUALIZAR y EDITAR un vídeo existente por su ID:
export const updateVideo = async (
    videoID: string,
    updatedData: UpdatedDataVideo
): Promise<FormatResponse> => {

    if (!videoID || videoID.length <= 0) return {
        data: null,
        message: 'Ingrese el ID del vídeo.',
        response: false
    };

    try {
        const docRef = doc(db, COLLECTION_NAME, videoID);

        const dataToUpdate = { ...updatedData };

        if (dataToUpdate.cleanTitle) dataToUpdate.cleanTitle = generateCleanName(dataToUpdate.cleanTitle);

        await updateDoc(docRef, dataToUpdate);

        return formatResponse(true, { id: videoID, ...dataToUpdate }, "Vídeo actualizado exitosamente.");

    } catch (error) {

        if (error instanceof Error) {
            // Aquí TypeScript sabe que 'error' es de tipo Error
            console.error(error.message);
        } else {
            // Fallback por si lanzaron algo que no es un Error (como una cadena o null)
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al actualizar el vídeo.`);
    }
};

// ELIMINAR un vídeo existente por su ID:
export const deleteVideo = async (
    videoID: Video['id']
): Promise<FormatResponse> => {

    if (!videoID || videoID.length <= 0) return {
        data: null,
        message: 'Ingrese el ID del vídeo.',
        response: false
    };

    try {
        const docRef = doc(db, COLLECTION_NAME, videoID);
        await deleteDoc(docRef);

        return formatResponse(true, null, "Vídeo eliminado exitosamente.");
    } catch (error) {

        if (error instanceof Error) {
            // Aquí TypeScript sabe que 'error' es de tipo Error
            console.error(error.message);
        } else {
            // Fallback por si lanzaron algo que no es un Error (como una cadena o null)
            console.error('Error desconocido:', error);
        }

        return formatResponse(false, null, `Error al eliminar el vídeo.`);
    }
};


// ----------------------------------
// API AJENA
// ----------------------------------

// OBTENER vídeo original en Youtube:
export const getOriginalVideoInYT = async (
    url: string,
    uid: string
): Promise<Video | null> => {
    if (!url || url.length <= 0) return null;
    if (!uid || uid.length <= 0) return null;

    // Extraer ID
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?\t?v=))([^#&?]*).*/;
    const match = url.match(regExp);
    const idVideoYT = (match && match[7].length === 11) ? match[7] : null;

    if (!idVideoYT) return null;

    try {
        // Usamos la URL completa del video para que noembed funcione correctamente
        const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${idVideoYT}`);

        if (!response.ok) return null;

        const data = await response.json();
        const cleanTitle = generateCleanName(data.title);

        return {
            id: idVideoYT,
            autor: data.author_name || 'Desconocido',
            uid: uid,
            cleanTitle: cleanTitle || 'Título no limpiado',
            title: data.title || 'Título desconocido',
            url: url,
            miniature: data.thumbnail_url || 'Sin miniatura'
        };

    } catch (error) {
        console.error('Error al obtener datos de video:', error);
        return null;
    }
};

