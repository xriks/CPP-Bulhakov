export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;

export const GENRES = [
    "Класика",
    "Поезія",
    "Фентезі",
    "Фантастика",
    "Антиутопія",
    "Детектив",
    "Казка",
];

export const ERROR_INVALID_DATA = "Некоректні дані книги.";
export const ERROR_EMPTY_TITLE = "Будь ласка, введіть назву книги.";
export const ERROR_TITLE_TOO_LONG = `Назва книги не повинна перевищувати ${MAX_TITLE_LENGTH} символів.`;
export const ERROR_EMPTY_AUTHOR = "Будь ласка, введіть автора.";
export const ERROR_INVALID_PRICE = "Будь ласка, введіть коректну ціну.";
export const ERROR_INVALID_STOCK = "Будь ласка, введіть коректну кількість.";
export const ERROR_INVALID_GENRE = "Оберіть жанр зі списку.";
export const ERROR_DESCRIPTION_TOO_LONG = `Опис не повинен перевищувати ${MAX_DESCRIPTION_LENGTH} символів.`;

/** Перетворює значення поля (рядок із форми або число) на число; порожнє значення -> NaN. */
export function parseNumber(value) {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() !== "") return Number(value.trim());
    return NaN;
}

function text(value) {
    return typeof value === "string" ? value.trim() : "";
}

/** Перевіряє дані нової книги. Повертає { isValid, error }. */
export function validateBook(data) {
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
        return { isValid: false, error: ERROR_INVALID_DATA };
    }

    const title = text(data.title);
    if (title === "") return { isValid: false, error: ERROR_EMPTY_TITLE };
    if (title.length > MAX_TITLE_LENGTH) return { isValid: false, error: ERROR_TITLE_TOO_LONG };

    if (text(data.author) === "") return { isValid: false, error: ERROR_EMPTY_AUTHOR };

    const price = parseNumber(data.price);
    if (!Number.isFinite(price) || price <= 0) return { isValid: false, error: ERROR_INVALID_PRICE };

    const stock = parseNumber(data.stock);
    if (!Number.isInteger(stock) || stock < 0) return { isValid: false, error: ERROR_INVALID_STOCK };

    if (!GENRES.includes(data.genre)) return { isValid: false, error: ERROR_INVALID_GENRE };

    if (text(data.description).length > MAX_DESCRIPTION_LENGTH) {
        return { isValid: false, error: ERROR_DESCRIPTION_TOO_LONG };
    }

    return { isValid: true, error: "" };
}
