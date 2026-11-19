function Header({ total, sold }) {
  return (
    <header className="mb-8 rounded-xl bg-linear-to-br from-navy to-brand px-6 py-10 text-center text-white shadow-md">
      <h1 className="text-4xl font-bold tracking-wide max-sm:text-3xl">Букварня</h1>
      <p className="mt-2 opacity-90">
        Усього книг: {total} · Продано: {sold}
      </p>
    </header>
  );
}

export default Header;
