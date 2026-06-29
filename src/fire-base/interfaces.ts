// ----------------------------------
// OBJETOS
// ----------------------------------

// isGuest: para diferenciar usuarios logueados
export interface User {
    uid: string;
    email: string;
    isGuest: boolean;
};

export interface Video {
    id: string;
    autor: string;
    uid: User['uid'];
    // Editables:
    title: string;
    cleanTitle: string;
    url: string;
    miniature: string;
}

export interface Playlist {
    id: string;
    uid: User['uid'];
    cleanName: string;
    // Editables:
    name: string;
    color: string;
    videos: Video['id'][];
}

// ----------------------------------
// RESPUESTAS
// ----------------------------------

export interface FormatResponse {
    response: boolean | null;
    data: any,
    message: string
}

export interface VideoResponse {
    videos: Video[],
    lastDoc: Video | null
}

// ----------------------------------
// ACTUALIZACIÓN
// ----------------------------------

export interface UpdatedDataVideo {
    title: Video['title'];
    cleanTitle: Video['cleanTitle'];
    url: Video['url'];
    miniature: Video['miniature'];
}
