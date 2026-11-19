import test from "node:test";
import assert from "node:assert/strict";
import { BooksService, MemoryStorageAdapter, GENRES, ERROR_EMPTY_TITLE } from "@bukvarnia/core";
import { createHandlers, ERROR_BAD_REQUEST } from "../ipcHandlers.js";

const make = () => createHandlers(new BooksService(new MemoryStorageAdapter()));
const book = (over = {}) => ({ title: "Кобзар", author: "Тарас Шевченко", price: "350", stock: "10", genre: GENRES[1], ...over });

test("add додає книгу та поле dateLabel (дд.мм.рррр)", () => {
    const result = make().add(book());
    assert.equal(result.ok, true);
    assert.match(result.book.dateLabel, /^\d{2}\.\d{2}\.\d{4}$/);
});

test("add передає помилку перевірки з ядра", () => {
    assert.deepEqual(make().add(book({ title: "" })), { ok: false, error: ERROR_EMPTY_TITLE });
});

test("add відхиляє некоректні дані з рендер-процесу", () => {
    const h = make();
    for (const bad of [null, "рядок", [], 42, book({ title: 5 }), book({ price: {} })]) {
        assert.deepEqual(h.add(bad), { ok: false, error: ERROR_BAD_REQUEST });
    }
});

test("list повертає книги з dateLabel і підтримує пошук", () => {
    const h = make();
    h.add(book());
    h.add(book({ title: "1984", author: "Джордж Орвелл", genre: "Антиутопія" }));
    assert.equal(h.list("").length, 2);
    const found = h.list("орвелл");
    assert.equal(found.length, 1);
    assert.ok(found[0].dateLabel);
});

test("list з нерядковим запитом повертає всі книги", () => {
    const h = make();
    h.add(book());
    assert.equal(h.list(123).length, 1);
});

test("remove видаляє книгу, відсутню — повідомляє, нечисловий id — відхиляє", () => {
    const h = make();
    const { book: added } = h.add(book());
    assert.deepEqual(h.remove(added.id), { ok: true });
    assert.equal(h.remove(added.id).error, "Книгу не знайдено.");
    assert.deepEqual(h.remove("1"), { ok: false, error: ERROR_BAD_REQUEST });
});

test("genres повертає список жанрів із ядра", () => {
    assert.deepEqual(make().genres(), GENRES);
});
