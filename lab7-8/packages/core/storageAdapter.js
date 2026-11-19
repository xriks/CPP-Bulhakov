export class BookStorageAdapter {
    load() {
        throw new Error("Не реалізовано: load()");
    }

    save(books) {
        throw new Error("Не реалізовано: save(books)");
    }
}

export class MemoryStorageAdapter extends BookStorageAdapter {
    #books;

    constructor(initial = []) {
        super();
        this.#books = JSON.parse(JSON.stringify(initial));
    }

    load() {
        return JSON.parse(JSON.stringify(this.#books));
    }

    save(books) {
        this.#books = JSON.parse(JSON.stringify(books));
    }
}
import { validateBook } from "./bookValidation.js";
import { createBook, filterBooksByQuery, sanitizeBooks, sortBooksByDate } from "./bookUtils.js";

export const ERROR_NOT_FOUND = "Книгу не знайдено.";

export class BooksService {
    #adapter;

    constructor(adapter) {
        this.#adapter = adapter;
    }

    #read() {
        return sanitizeBooks(this.#adapter.load());
    }

    list(query = "") {
        return sortBooksByDate(filterBooksByQuery(this.#read(), query));
    }

    add(data) {
        const { isValid, error } = validateBook(data);
        if (!isValid) return { ok: false, error };

        const books = this.#read();
        const id = books.reduce((max, b) => Math.max(max, b.id), 0) + 1;
        const book = createBook(data, id);
        this.#adapter.save([...books, book]);
        return { ok: true, book };
    }

    remove(id) {
        const books = this.#read();
        if (!books.some((b) => b.id === id)) return { ok: false, error: ERROR_NOT_FOUND };
        this.#adapter.save(books.filter((b) => b.id !== id));
        return { ok: true };
    }
}
export * from "./bookValidation.js";
export * from "./bookUtils.js";
export * from "./storageAdapter.js";
export * from "./booksService.js";
