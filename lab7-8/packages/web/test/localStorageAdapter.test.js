import test from "node:test";
import assert from "node:assert/strict";
import { BooksService, GENRES } from "@bukvarnia/core";
import { LocalStorageAdapter } from "../localStorageAdapter.js";

function fakeStorage(initial = {}) {
    const data = { ...initial };
    return {
        getItem: (key) => (key in data ? data[key] : null),
        setItem: (key, value) => { data[key] = String(value); },
        data,
    };
}

test("порожнє сховище повертає порожній масив", () => {
    assert.deepEqual(new LocalStorageAdapter(fakeStorage()).load(), []);
});

test("save записує дані, load їх читає", () => {
    const adapter = new LocalStorageAdapter(fakeStorage());
    const books = [{ id: 1, title: "Кобзар" }];
    adapter.save(books);
    assert.deepEqual(adapter.load(), books);
});

test("дані зберігаються у localStorage під ключем bukvarnia-books", () => {
    const storage = fakeStorage();
    new LocalStorageAdapter(storage).save([{ id: 1 }]);
    assert.equal(storage.data["bukvarnia-books"], '[{"id":1}]');
});

test("пошкоджений JSON не ламає застосунок", () => {
    const adapter = new LocalStorageAdapter(fakeStorage({ "bukvarnia-books": "{не json" }));
    assert.deepEqual(adapter.load(), []);
});

test("адаптер працює разом із BooksService", () => {
    const storage = fakeStorage();
    const first = new BooksService(new LocalStorageAdapter(storage));
    first.add({ title: "Кобзар", author: "Тарас Шевченко", price: "350", stock: "10", genre: GENRES[1] });

    const second = new BooksService(new LocalStorageAdapter(storage));
    assert.equal(second.list()[0].title, "Кобзар");
});
