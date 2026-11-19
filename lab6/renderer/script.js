const bookTitleInput = document.getElementById("bookTitleInput");
const bookAuthorInput = document.getElementById("bookAuthorInput");
const bookPriceInput = document.getElementById("bookPriceInput");
const bookStockInput = document.getElementById("bookStockInput");
const genreSelect = document.getElementById("genreSelect");
const bookPublisherInput = document.getElementById("bookPublisherInput");
const bookDescriptionInput = document.getElementById("bookDescriptionInput");
const addBookButton = document.getElementById("addBookButton");
const booksList = document.getElementById("booksList");
const message = document.getElementById("message");

let books = [];
let messageTimeout;

function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
        message.textContent = "";
    }, 2500);
}

function createSpan(className, text) {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = text;
    return span;
}

function renderBooks() {
    booksList.innerHTML = "";

    if (books.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "empty-message";
        emptyItem.textContent = "Книг поки немає. Додайте першу!";
        booksList.appendChild(emptyItem);
        return;
    }

    books.forEach((book) => {
        const bookItem = document.createElement("li");
        bookItem.className = "book-item";

        const infoDiv = document.createElement("div");
        infoDiv.className = "book-info";
        infoDiv.appendChild(createSpan("book-title", book.title));
        infoDiv.appendChild(
            createSpan(
                "book-details",
                [book.author, book.genre, book.publisher, `${book.stock} шт`].filter(Boolean).join(" · ")
            )
        );
        if (book.description) {
            infoDiv.appendChild(createSpan("book-description", book.description));
        }
        infoDiv.appendChild(createSpan("book-price", `${book.price} грн`));

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Видалити";
        deleteButton.addEventListener("click", async () => {
            books = books.filter((element) => element.id !== book.id);
            renderBooks();
            await window.booksAPI.saveBooks(books);
            showMessage("Книгу видалено з каталогу.", "#ef4444");
        });

        bookItem.appendChild(infoDiv);
        bookItem.appendChild(deleteButton);
        booksList.appendChild(bookItem);
    });
}

async function addBook() {
    const title = bookTitleInput.value.trim();
    const author = bookAuthorInput.value.trim();
    const publisher = bookPublisherInput.value.trim();
    const description = bookDescriptionInput.value.trim();
    const price = Number(bookPriceInput.value.trim());
    const stockText = bookStockInput.value.trim();
    const stock = Number(stockText);

    if (title === "") {
        showMessage("Будь ласка, введіть назву книги.", "#ef4444");
        return;
    }
    if (author === "") {
        showMessage("Будь ласка, введіть автора.", "#ef4444");
        return;
    }
    if (!Number.isFinite(price) || price <= 0) {
        showMessage("Будь ласка, введіть коректну ціну.", "#ef4444");
        return;
    }
    if (stockText === "" || !Number.isInteger(stock) || stock < 0) {
        showMessage("Будь ласка, введіть коректну кількість.", "#ef4444");
        return;
    }

    books.push({
        id: Date.now(),
        title,
        author,
        price,
        genre: genreSelect.value,
        publisher,
        stock,
        description,
    });

    bookTitleInput.value = "";
    bookAuthorInput.value = "";
    bookPriceInput.value = "";
    bookStockInput.value = "";
    bookPublisherInput.value = "";
    bookDescriptionInput.value = "";

    renderBooks();

    await window.booksAPI.saveBooks(books);
    showMessage("Книгу успішно додано та збережено у файл.", "#16a34a");
}

addBookButton.addEventListener("click", addBook);

[bookTitleInput, bookAuthorInput, bookPriceInput, bookStockInput, bookPublisherInput].forEach((input) => {
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addBook();
        }
    });
});

window.addEventListener("DOMContentLoaded", async () => {
    try {
        books = (await window.booksAPI.loadBooks()) || [];
    } catch (error) {
        showMessage("Не вдалося завантажити книги з файлу.", "#ef4444");
    }
    renderBooks();
});
