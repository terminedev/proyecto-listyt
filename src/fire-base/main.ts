import type { FormatResponse, User } from "./interfaces";

// Función auxiliar para estandarizar las respuestas:
export const formatResponse = (
    response: boolean | null,
    data: null | User,
    message: string
): FormatResponse => ({
    response,
    data,
    message
});
