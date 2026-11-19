import { useState } from "react";

const GENRES = ["Класика", "Поезія", "Фентезі", "Фантастика", "Антиутопія", "Детектив", "Казка"];

const EMPTY_FORM = {
  title: "",
  author: "",
  price: "",
  genre: GENRES[0],
  publisher: "",
  stock: "",
  description: "",
};

const field =
  "w-full rounded-[10px] border-[1.5px] border-gray-300 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-gray-400 focus:border-brand focus:outline-none";

function BookForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  function handleSubmit(event) {
    event.preventDefault();
    if (onAdd(form)) setForm(EMPTY_FORM);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mb-4 grid grid-cols-3 gap-4 max-md:grid-cols-1">
      <input className={field} placeholder="Назва книги" aria-label="Назва книги" value={form.title} onChange={set("title")} />
      <input className={field} placeholder="Автор" aria-label="Автор" value={form.author} onChange={set("author")} />
      <input className={field} type="number" min="0" placeholder="Ціна, грн" aria-label="Ціна, грн" value={form.price} onChange={set("price")} />
      <select className={field} aria-label="Жанр" value={form.genre} onChange={set("genre")}>
        {GENRES.map((genre) => (
          <option key={genre}>{genre}</option>
        ))}
      </select>
      <input className={field} placeholder="Видавництво" aria-label="Видавництво" value={form.publisher} onChange={set("publisher")} />
      <input className={field} type="number" min="0" placeholder="Кількість, шт" aria-label="Кількість, шт" value={form.stock} onChange={set("stock")} />
      <textarea
        className={`${field} col-span-3 h-24 resize-y max-md:col-span-1`}
        placeholder="Опис"
        aria-label="Опис"
        value={form.description}
        onChange={set("description")}
      />
      <button
        type="submit"
        className="col-span-3 cursor-pointer rounded-[10px] bg-brand py-3 font-semibold text-white transition hover:bg-brand-dark active:scale-[0.98] max-md:col-span-1"
      >
        Додати
      </button>
    </form>
  );
}
export default BookForm;
