/** Інтерфейс адаптера сховища: кожна платформа реалізує load() і save(books). */
export class BookStorageAdapter {
    load() {
        throw new Error("Не реалізовано: load()");
    }

    save(books) {
        throw new Error("Не реалізовано: save(books)");
    }
}

/** Зберігає книги в пам'яті (для тестів і прототипів). */
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
