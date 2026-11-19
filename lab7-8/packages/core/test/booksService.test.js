import test from "node:test";
import assert from "node:assert/strict";
import {
    BooksService, MemoryStorageAdapter, BookStorageAdapter, GENRES,
    ERROR_EMPTY_TITLE, ERROR_NOT_FOUND,
} from "../index.js";

const book = (over = {}) => ({ title: "Кобзар", author: "Тарас Шевченко", price: "350", stock: "10", genre: GENRES[1], ...over });
const makeService = () => new BooksService(new MemoryStorageAdapter());

test("add зберігає книгу та повертає її", () => {
    const service = makeService();
    const result = service.add(book());
    assert.equal(result.ok, true);
    assert.equal(result.book.title, "Кобзар");
    assert.equal(service.list().length, 1);
});

test("add відхиляє порожню назву й нічого не зберігає", () => {
    const service = makeService();
    const result = service.add(book({ title: "  " }));
    assert.deepEqual(result, { ok: false, error: ERROR_EMPTY_TITLE });
    assert.equal(service.list().length, 0);
});

test("id нових книг унікальні", () => {
    const service = makeService();
    const ids = [1, 2, 3].map(() => service.add(book()).book.id);
    assert.equal(new Set(ids).size, 3);
});

test("remove видаляє наявну книгу", () => {
    const service = makeService();
    const { book: added } = service.add(book());
    assert.deepEqual(service.remove(added.id), { ok: true });
    assert.equal(service.list().length, 0);
});

test("remove відсутньої книги повертає повідомлення", () => {
    const service = makeService();
    assert.deepEqual(service.remove(999), { ok: false, error: ERROR_NOT_FOUND });
    assert.equal(ERROR_NOT_FOUND, "Книгу не знайдено.");
});

test("list(query) фільтрує книги", () => {
    const service = makeService();
    service.add(book());
    service.add(book({ title: "1984", author: "Джордж Орвелл", genre: "Антиутопія" }));
    assert.equal(service.list("орвелл").length, 1);
    assert.equal(service.list("").length, 2);
});

test("список відсортований: новіші першими", () => {
    const old = { id: 1, title: "Стара", author: "А", price: 1, stock: 1, createdAt: "2020-01-01T00:00:00.000Z" };
    const service = new BooksService(new MemoryStorageAdapter([old]));
    service.add(book({ title: "Нова" }));
    assert.deepEqual(service.list().map((b) => b.title), ["Нова", "Стара"]);
});

test("сервіс ігнорує пошкоджені записи в сховищі", () => {
    const service = new BooksService(new MemoryStorageAdapter([null, { id: "x" }]));
    assert.deepEqual(service.list(), []);
    assert.equal(service.add(book()).ok, true);
});

test("базовий адаптер кидає помилку «не реалізовано»", () => {
    const adapter = new BookStorageAdapter();
    assert.throws(() => adapter.load(), /Не реалізовано/);
    assert.throws(() => adapter.save([]), /Не реалізовано/);
});
