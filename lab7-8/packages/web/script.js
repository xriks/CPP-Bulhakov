import { BooksService, GENRES, formatBookDate } from "@bukvarnia/core";
import { LocalStorageAdapter } from "./localStorageAdapter.js";

const service = new BooksService(new LocalStorageAdapter());

const fields = {
    title: document.getElementById("bookTitleInput"),
    author: document.getElementById("bookAuthorInput"),
    price: document.getElementById("bookPriceInput"),
    stock: document.getElementById("bookStockInput"),
    genre: document.getElementById("genreSelect"),
    publisher: document.getElementById("bookPublisherInput"),
    description: document.getElementById("bookDescriptionInput"),
};
const addBookButton = document.getElementById("addBookButton");
const searchInput = document.getElementById("searchInput");
const booksList = document.getElementById("booksList");
const message = document.getElementById("message");

let messageTimeout;

function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => (message.textContent = ""), 2500);
}

function createSpan(className, text) {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = text;
    return span;
}

function renderBooks() {
    booksList.innerHTML = "";
    const books = service.list(searchInput.value);

    if (books.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty-message";
        empty.textContent = searchInput.value.trim()
            ? "Нічого не знайдено."
            : "Книг поки немає. Додайте першу!";
        booksList.appendChild(empty);
        return;
    }

    books.forEach((book) => {
        const item = document.createElement("li");
        item.className = "book-item";

        const info = document.createElement("div");
        info.className = "book-info";
        info.appendChild(createSpan("book-title", book.title));
        info.appendChild(
            createSpan(
                "book-details",
                [book.author, book.genre, book.publisher, `${book.stock} шт`].filter(Boolean).join(" · ")
            )
        );
        if (book.description) info.appendChild(createSpan("book-description", book.description));
        info.appendChild(createSpan("book-price", `${book.price} грн`));
        const date = formatBookDate(book.createdAt);
        if (date) info.appendChild(createSpan("book-date", `Додано: ${date}`));

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Видалити";
        deleteButton.addEventListener("click", () => {
            const result = service.remove(book.id);
            renderBooks();
            showMessage(result.ok ? "Книгу видалено з каталогу." : result.error, "#ef4444");
        });

        item.appendChild(info);
        item.appendChild(deleteButton);
        booksList.appendChild(item);
    });
}

function addBook() {
    const data = Object.fromEntries(Object.entries(fields).map(([key, el]) => [key, el.value]));
    const result = service.add(data);

    if (!result.ok) {
        showMessage(result.error, "#ef4444");
        return;
    }

    Object.entries(fields).forEach(([key, el]) => {
        if (key !== "genre") el.value = "";
    });
    renderBooks();
    showMessage("Книгу успішно додано та збережено.", "#16a34a");
}

GENRES.forEach((genre) => {
    const option = document.createElement("option");
    option.textContent = genre;
    fields.genre.appendChild(option);
});

addBookButton.addEventListener("click", addBook);
searchInput.addEventListener("input", renderBooks);
[fields.title, fields.author, fields.price, fields.stock, fields.publisher].forEach((input) => {
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") addBook();
    });
});

renderBooks();
