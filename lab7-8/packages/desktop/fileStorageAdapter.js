import fs from "node:fs";
import path from "node:path";
import { BookStorageAdapter } from "@bukvarnia/core";

/** Десктопний адаптер: зберігає масив книг у JSON-файлі. */
export class FileStorageAdapter extends BookStorageAdapter {
    #filePath;

    constructor(filePath) {
        super();
        this.#filePath = filePath;
    }

    load() {
        try {
            const parsed = JSON.parse(fs.readFileSync(this.#filePath, "utf-8"));
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    save(books) {
        fs.mkdirSync(path.dirname(this.#filePath), { recursive: true });
        fs.writeFileSync(this.#filePath, JSON.stringify(books, null, 2), "utf-8");
    }
}
