import { GENRES, formatBookDate } from "@bukvarnia/core";

export const ERROR_BAD_REQUEST = "Некоректний запит.";

const TEXT_FIELDS = ["title", "author", "genre", "publisher", "description"];
const NUMBER_FIELDS = ["price", "stock"];

const withDate = (book) => ({ ...book, dateLabel: formatBookDate(book.createdAt) });

function isValidPayload(data) {
    if (typeof data !== "object" || data === null || Array.isArray(data)) return false;
    return (
        TEXT_FIELDS.every((f) => data[f] === undefined || typeof data[f] === "string") &&
        NUMBER_FIELDS.every((f) => data[f] === undefined || typeof data[f] === "string" || typeof data[f] === "number")
    );
}

/** Обробники IPC над BooksService (electron не підключається — тестується без вікна). */
export function createHandlers(service) {
    return {
        genres() {
            return [...GENRES];
        },

        list(query) {
            return service.list(typeof query === "string" ? query : "").map(withDate);
        },

        add(data) {
            if (!isValidPayload(data)) return { ok: false, error: ERROR_BAD_REQUEST };
            const result = service.add(data);
            return result.ok ? { ok: true, book: withDate(result.book) } : result;
        },

        remove(id) {
            if (!Number.isInteger(id)) return { ok: false, error: ERROR_BAD_REQUEST };
            return service.remove(id);
        },
    };
}
