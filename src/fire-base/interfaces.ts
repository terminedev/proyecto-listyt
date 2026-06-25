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
    url: string;
    miniature: string;
}

export interface Playlist {
    id: string;
    uid: User['uid'];
    // Editables:
    name: string;
    color: string;
    videos: Video['id'][];
}

export interface FormatResponse {
    response: boolean | null;
    data: any,
    message: string
}

