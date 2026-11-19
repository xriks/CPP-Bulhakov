function BookItem({ book, onToggle, onDelete }) {
  const details = [book.author, book.genre, book.publisher, `${book.stock} шт`].filter(Boolean).join(" · ");

  return (
    <li
      className={`flex items-center justify-between gap-3 rounded-lg border border-line-dark px-4 py-3 ${
        book.sold ? "bg-line" : "bg-cream"
      }`}
    >
      <label className="flex flex-1 cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="mt-1.5 accent-brand"
          checked={book.sold}
          onChange={() => onToggle(book.id)}
        />
        <span className={book.sold ? "text-gray-500 line-through" : "text-ink"}>
          <span className="block font-semibold text-navy">
            {book.title} — <span className="font-bold text-brand">{book.price} грн</span>
          </span>
          <span className="block text-sm text-gray-600">{details}</span>
          {book.description && <span className="block text-sm text-gray-600">{book.description}</span>}
        </span>
      </label>
      <button
        type="button"
        onClick={() => onDelete(book.id)}
        className="cursor-pointer rounded-md bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
      >
        Видалити
      </button>
    </li>
  );
}

export default BookItem;
