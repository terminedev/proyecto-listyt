import type { FormatResponse, User } from "./interfaces";

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

