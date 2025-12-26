function FilmCard({ film, onAdd }) {
  return (
    <div className="card">
      <h3>{film.title}</h3>
      <p><strong>Yönetmen:</strong> {film.director}</p>

      {film.description && (
        <p className="desc">{film.description}</p>
      )}

      <button onClick={() => onAdd(film.id)}>
        Kütüphaneye Ekle🎬
      </button>
    </div>
  );
}

export default FilmCard;