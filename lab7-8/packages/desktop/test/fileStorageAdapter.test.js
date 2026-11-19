import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { FileStorageAdapter } from "../fileStorageAdapter.js";

const tmp = () => fs.mkdtemp(path.join(os.tmpdir(), "bukvarnia-"));

test("якщо файлу немає, load повертає порожній масив", async () => {
    const dir = await tmp();
    assert.deepEqual(new FileStorageAdapter(path.join(dir, "books.json")).load(), []);
});

test("save записує файл, load читає його", async () => {
    const dir = await tmp();
    const adapter = new FileStorageAdapter(path.join(dir, "books.json"));
    const books = [{ id: 1, title: "Кобзар" }];
    adapter.save(books);
    assert.deepEqual(adapter.load(), books);
});

test("save створює теку, якщо її немає", async () => {
    const dir = await tmp();
    const file = path.join(dir, "вкладена", "тека", "books.json");
    new FileStorageAdapter(file).save([{ id: 1 }]);
    assert.deepEqual(JSON.parse(await fs.readFile(file, "utf-8")), [{ id: 1 }]);
});

test("пошкоджений файл не ламає застосунок", async () => {
    const dir = await tmp();
    const file = path.join(dir, "books.json");
    await fs.writeFile(file, "{не json");
    assert.deepEqual(new FileStorageAdapter(file).load(), []);
});
