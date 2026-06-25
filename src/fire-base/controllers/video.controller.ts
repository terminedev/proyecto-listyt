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

import type { FormatResponse, Video, VideoResponse } from "../interfaces";
import { formatResponse } from "../main";

const COLLECTION_NAME = "videos";



// OBTENER la cantidad total de videos en la colección:
export const getVideosCount = async () => {
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

// OBTENER vídeo original en Youtube:
export const getOriginalVideoInYT = async (url: string): Promise<Video> => {
    if
};

