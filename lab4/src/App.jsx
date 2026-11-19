import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import BookForm from "./components/BookForm.jsx";
import BookList from "./components/BookList.jsx";

const STORAGE_KEY = "bukvarnia";

function loadBooks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function App() {
  const [books, setBooks] = useState(loadBooks);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  function addBook(data) {
    const title = data.title.trim();
    const author = data.author.trim();

    if (!title) {
      setMessage({ text: "Введіть назву книги.", type: "error" });
      return false;
    }
    if (!author) {
      setMessage({ text: "Введіть автора.", type: "error" });
      return false;
    }
    if (!data.price || Number(data.price) <= 0) {
      setMessage({ text: "Введіть коректну ціну.", type: "error" });
      return false;
    }
    if (data.stock === "" || Number(data.stock) < 0) {
      setMessage({ text: "Введіть коректну кількість.", type: "error" });
      return false;
    }

    const newBook = {
      id: Date.now(),
      title,
      author,
      price: Number(data.price),
      genre: data.genre,
      publisher: data.publisher.trim(),
      stock: Number(data.stock),
      description: data.description.trim(),
      sold: false,
    };

    setBooks([...books, newBook]);
    setMessage({ text: "Книгу додано.", type: "success" });
    return true;
  }

  function toggleBook(id) {
    setBooks(books.map((book) => (book.id === id ? { ...book, sold: !book.sold } : book)));
  }

  function deleteBook(id) {
    setBooks(books.filter((book) => book.id !== id));
    setMessage({ text: "Книгу видалено.", type: "success" });
  }

  const soldCount = books.filter((book) => book.sold).length;

  const query = search.trim().toLowerCase();
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query),
  );

  const emptyText = query ? "Нічого не знайдено за вашим запитом." : "Книг поки немає. Додайте першу!";

  return (
    <div className="min-h-screen bg-sand px-4 py-8 text-ink">
      <main className="mx-auto w-full max-w-3xl rounded-2xl border border-line bg-white p-6 shadow-lg md:max-w-4xl lg:max-w-6xl lg:p-10">
        <Header total={books.length} sold={soldCount} />
        <BookForm onAdd={addBook} />

        {message && (
          <p className={message.type === "error" ? "mb-4 font-semibold text-red-600" : "mb-4 font-semibold text-navy"}>
            {message.text}
          </p>
        )}

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Пошук за назвою, автором чи жанром"
          aria-label="Пошук книги"
          className="mb-4 w-full rounded-[10px] border-[1.5px] border-gray-300 bg-white px-4 py-3 text-[15px] text-ink focus:border-brand focus:outline-none"
        />

        <BookList books={filteredBooks} emptyText={emptyText} onToggle={toggleBook} onDelete={deleteBook} />
      </main>
    </div>
  );
}

export default App;
