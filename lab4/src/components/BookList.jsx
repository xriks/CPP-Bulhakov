import BookRow from "./BookItem.jsx";

function BookList({ books, emptyText, onToggle, onDelete }) {
  if (books.length === 0) {
    return <p className="text-center italic text-gray-500">{emptyText}</p>;
  }

  return (
    <ul className="space-y-2.5">
      {books.map((book) => (
        <BookRow key={book.id} book={book} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default BookList;
