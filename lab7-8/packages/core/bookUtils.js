import { parseNumber } from "./bookValidation.js";

/** Створює книгу з перевірених даних форми. */
export function createBook(data, id, now = new Date()) {
    return {
        id,
        title: data.title.trim(),
        author: data.author.trim(),
        price: parseNumber(data.price),
        genre: data.genre,
        publisher: typeof data.publisher === "string" ? data.publisher.trim() : "",
        stock: parseNumber(data.stock),
        description: typeof data.description === "string" ? data.description.trim() : "",
        createdAt: now.toISOString(),
    };
}

/** Дата у форматі дд.мм.рррр; для некоректної дати — порожній рядок. */
export function formatBookDate(value) {
    const date = new Date(value);
    if (value === undefined || value === null || Number.isNaN(date.getTime())) return "";
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    return `${dd}.${mm}.${date.getFullYear()}`;
}

/** Спочатку новіші. Вихідний масив не змінюється. */
export function sortBooksByDate(books) {
    return [...books].sort((a, b) => {
        const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return Number.isNaN(diff) || diff === 0 ? b.id - a.id : diff;
    });
}

/** Пошук без урахування регістру за назвою, автором, жанром і видавництвом. */
export function filterBooksByQuery(books, query) {
    const q = typeof query === "string" ? query.trim().toLowerCase() : "";
    if (q === "") return [...books];
    return books.filter((book) =>
        [book.title, book.author, book.genre, book.publisher].some((field) =>
            String(field ?? "").toLowerCase().includes(q)
        )
    );
}

/** Відкидає некоректні записи зі сховища та доповнює відсутні необов'язкові поля. */
export function sanitizeBooks(raw) {
    if (!Array.isArray(raw)) return [];
    return raw
        .filter(
            (b) =>
                typeof b === "object" && b !== null &&
                Number.isInteger(b.id) &&
                typeof b.title === "string" && b.title.trim() !== "" &&
                typeof b.author === "string" && b.author.trim() !== "" &&
                Number.isFinite(b.price) &&
                Number.isInteger(b.stock)
        )
        .map((b) => ({
            id: b.id,
            title: b.title,
            author: b.author,
            price: b.price,
            genre: typeof b.genre === "string" ? b.genre : "",
            publisher: typeof b.publisher === "string" ? b.publisher : "",
            stock: b.stock,
            description: typeof b.description === "string" ? b.description : "",
            createdAt: typeof b.createdAt === "string" ? b.createdAt : "",
        }));
}
