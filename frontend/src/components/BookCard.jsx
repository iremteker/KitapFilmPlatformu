function BookCard({ book, onAdd }) {
  return (
    <div className="card">
      <h3>{book.title}</h3>
      <p><strong>Yazar:</strong> {book.author}</p>

      {book.description && (
        <p className="desc">{book.description}</p>
      )}

      <button onClick={() => onAdd(book.id)}>
        Kütüphaneye Ekle📚
      </button>
    </div>
  );
}

export default BookCard;