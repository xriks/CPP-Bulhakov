import test from "node:test";
import assert from "node:assert/strict";
import { createBook, formatBookDate, sortBooksByDate, filterBooksByQuery, sanitizeBooks } from "../index.js";

const data = { title: " 1984 ", author: " Джордж Орвелл ", price: "420", stock: "5", genre: "Антиутопія" };

test("createBook обрізає пробіли, перетворює числа та додає id і дату", () => {
    const now = new Date(2026, 10, 18);
    const book = createBook(data, 7, now);
    assert.equal(book.id, 7);
    assert.equal(book.title, "1984");
    assert.equal(book.author, "Джордж Орвелл");
    assert.equal(book.price, 420);
    assert.equal(book.stock, 5);
    assert.equal(book.publisher, "");
    assert.equal(book.createdAt, now.toISOString());
});

test("formatBookDate повертає дд.мм.рррр", () => {
    assert.equal(formatBookDate(new Date(2026, 0, 5).toISOString()), "05.01.2026");
    assert.equal(formatBookDate(new Date(2026, 10, 18).toISOString()), "18.11.2026");
});

test("formatBookDate для некоректної дати повертає порожній рядок", () => {
    assert.equal(formatBookDate("не дата"), "");
    assert.equal(formatBookDate(undefined), "");
});

test("sortBooksByDate: новіші першими, вихідний масив не змінюється", () => {
    const books = [
        { id: 1, createdAt: "2026-01-01T00:00:00.000Z" },
        { id: 2, createdAt: "2026-03-01T00:00:00.000Z" },
        { id: 3, createdAt: "2026-02-01T00:00:00.000Z" },
    ];
    const sorted = sortBooksByDate(books);
    assert.deepEqual(sorted.map((b) => b.id), [2, 3, 1]);
    assert.deepEqual(books.map((b) => b.id), [1, 2, 3]);
});

test("filterBooksByQuery шукає без урахування регістру за назвою й автором", () => {
    const books = [
        { id: 1, title: "Кобзар", author: "Тарас Шевченко", genre: "Поезія", publisher: "" },
        { id: 2, title: "1984", author: "Джордж Орвелл", genre: "Антиутопія", publisher: "" },
    ];
    assert.deepEqual(filterBooksByQuery(books, "КОБЗАР").map((b) => b.id), [1]);
    assert.deepEqual(filterBooksByQuery(books, "орвелл").map((b) => b.id), [2]);
    assert.equal(filterBooksByQuery(books, "немає такої").length, 0);
});

test("filterBooksByQuery з порожнім запитом повертає всі книги", () => {
    const books = [{ id: 1, title: "А", author: "Б" }];
    assert.equal(filterBooksByQuery(books, "  ").length, 1);
    assert.equal(filterBooksByQuery(books, undefined).length, 1);
});

test("sanitizeBooks відкидає некоректні записи", () => {
    const good = { id: 1, title: "Кобзар", author: "Шевченко", price: 350, stock: 3 };
    const result = sanitizeBooks([good, null, "рядок", { id: "x" }, { ...good, id: 2, price: "дорого" }]);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 1);
    assert.equal(result[0].description, "");
});

test("sanitizeBooks для не масиву повертає порожній масив", () => {
    assert.deepEqual(sanitizeBooks({}), []);
    assert.deepEqual(sanitizeBooks(null), []);
});
