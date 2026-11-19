import test from "node:test";
import assert from "node:assert/strict";
import {
    validateBook, parseNumber, GENRES, MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH,
    ERROR_EMPTY_TITLE, ERROR_TITLE_TOO_LONG, ERROR_EMPTY_AUTHOR, ERROR_INVALID_PRICE,
    ERROR_INVALID_STOCK, ERROR_INVALID_GENRE, ERROR_DESCRIPTION_TOO_LONG, ERROR_INVALID_DATA,
} from "../index.js";

const valid = () => ({ title: "Кобзар", author: "Тарас Шевченко", price: "350", stock: "10", genre: GENRES[1] });

test("коректна книга проходить перевірку", () => {
    assert.deepEqual(validateBook(valid()), { isValid: true, error: "" });
});

test("порожня назва та назва з пробілів — помилка", () => {
    assert.equal(validateBook({ ...valid(), title: "" }).error, ERROR_EMPTY_TITLE);
    assert.equal(validateBook({ ...valid(), title: "   " }).error, ERROR_EMPTY_TITLE);
});

test("назва не рядок або дані не об'єкт — помилка", () => {
    assert.equal(validateBook({ ...valid(), title: 42 }).isValid, false);
    assert.equal(validateBook(null).error, ERROR_INVALID_DATA);
    assert.equal(validateBook("книга").error, ERROR_INVALID_DATA);
});

test("межа довжини назви: MAX і MAX + 1", () => {
    assert.equal(validateBook({ ...valid(), title: "а".repeat(MAX_TITLE_LENGTH) }).isValid, true);
    assert.equal(validateBook({ ...valid(), title: "а".repeat(MAX_TITLE_LENGTH + 1) }).error, ERROR_TITLE_TOO_LONG);
});

test("довжина назви вимірюється після видалення зайвих пробілів", () => {
    const title = "  " + "а".repeat(MAX_TITLE_LENGTH) + "  ";
    assert.equal(validateBook({ ...valid(), title }).isValid, true);
});

test("межа довжини опису: MAX і MAX + 1", () => {
    assert.equal(validateBook({ ...valid(), description: "а".repeat(MAX_DESCRIPTION_LENGTH) }).isValid, true);
    assert.equal(
        validateBook({ ...valid(), description: "а".repeat(MAX_DESCRIPTION_LENGTH + 1) }).error,
        ERROR_DESCRIPTION_TOO_LONG
    );
});

test("порожній автор — помилка", () => {
    assert.equal(validateBook({ ...valid(), author: " " }).error, ERROR_EMPTY_AUTHOR);
});

test("некоректна ціна: порожня, нуль, від'ємна, не число", () => {
    for (const price of ["", "0", "-5", "abc", undefined]) {
        assert.equal(validateBook({ ...valid(), price }).error, ERROR_INVALID_PRICE, String(price));
    }
});

test("некоректна кількість: порожня, дробова, від'ємна; нуль допустимий", () => {
    for (const stock of ["", "1.5", "-1", "abc"]) {
        assert.equal(validateBook({ ...valid(), stock }).error, ERROR_INVALID_STOCK, stock);
    }
    assert.equal(validateBook({ ...valid(), stock: 0 }).isValid, true);
});

test("жанр поза списком — помилка", () => {
    assert.equal(validateBook({ ...valid(), genre: "Кулінарія" }).error, ERROR_INVALID_GENRE);
});

test("parseNumber розпізнає рядки, числа та порожні значення", () => {
    assert.equal(parseNumber(" 12.5 "), 12.5);
    assert.equal(parseNumber(7), 7);
    assert.ok(Number.isNaN(parseNumber("")));
    assert.ok(Number.isNaN(parseNumber(null)));
});
