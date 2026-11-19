import { BookStorageAdapter } from "@bukvarnia/core";

const STORAGE_KEY = "bukvarnia-books";

/** Веб-адаптер: зберігає масив книг у localStorage браузера. */
export class LocalStorageAdapter extends BookStorageAdapter {
    #storage;

    constructor(storage = globalThis.localStorage) {
        super();
        this.#storage = storage;
    }

    load() {
        try {
            const parsed = JSON.parse(this.#storage.getItem(STORAGE_KEY));
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    save(books) {
        this.#storage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
}
