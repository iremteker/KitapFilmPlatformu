import { useState, useEffect } from "react";
import {
  fetchBooks,
  fetchFilms,
  adminAddBook,
  adminAddFilm,
  adminUpdateBook,
  adminUpdateFilm,
  adminDeleteBook,
  adminDeleteFilm,
} from "../api";

function AdminPage() {
  const token = localStorage.getItem("access_token");
  const [books, setBooks] = useState([]);
  const [films, setFilms] = useState([]);
  const [activeTab, setActiveTab] = useState("books"); // "books" or "films"
  const [editingItem, setEditingItem] = useState(null); // {type: "book"/"film", id: number}
  const [loading, setLoading] = useState(false);

  // Form states
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    description: "",
  });
  const [filmForm, setFilmForm] = useState({
    title: "",
    director: "",
    release_year: "",
    description: "",
    poster_image: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [booksData, filmsData] = await Promise.all([
        fetchBooks(),
        fetchFilms(),
      ]);
      setBooks(booksData);
      setFilms(filmsData);
    } catch (error) {
      alert("Veriler yüklenirken hata oluştu");
    }
  };

  const resetBookForm = () => {
    setBookForm({ title: "", author: "", description: "" });
    setEditingItem(null);
  };

  const resetFilmForm = () => {
    setFilmForm({
      title: "",
      director: "",
      release_year: "",
      description: "",
      poster_image: "",
    });
    setEditingItem(null);
  };

  const handleEditBook = (book) => {
    setEditingItem({ type: "book", id: book.id });
    setBookForm({
      title: book.title || "",
      author: book.author || "",
      description: book.description || "",
    });
  };

  const handleEditFilm = (film) => {
    setEditingItem({ type: "film", id: film.id });
    setFilmForm({
      title: film.title || "",
      director: film.director || "",
      release_year: film.release_year || "",
      description: film.description || "",
      poster_image: film.poster_image || "",
    });
  };

  const handleSubmitBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingItem && editingItem.type === "book") {
        await adminUpdateBook(editingItem.id, bookForm, token);
        alert("Kitap güncellendi");
      } else {
        await adminAddBook(bookForm, token);
        alert("Kitap eklendi");
      }
      resetBookForm();
      loadData();
    } catch (error) {
      alert("İşlem başarısız");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFilm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const filmData = {
        ...filmForm,
        release_year: filmForm.release_year
          ? parseInt(filmForm.release_year)
          : null,
      };
      if (editingItem && editingItem.type === "film") {
        await adminUpdateFilm(editingItem.id, filmData, token);
        alert("Film güncellendi");
      } else {
        await adminAddFilm(filmData, token);
        alert("Film eklendi");
      }
      resetFilmForm();
      loadData();
    } catch (error) {
      alert("İşlem başarısız");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!confirm("Bu kitabı silmek istediğinize emin misiniz?")) return;
    try {
      await adminDeleteBook(bookId, token);
      alert("Kitap silindi");
      loadData();
    } catch (error) {
      alert("Silme işlemi başarısız");
    }
  };

  const handleDeleteFilm = async (filmId) => {
    if (!confirm("Bu filmi silmek istediğinize emin misiniz?")) return;
    try {
      await adminDeleteFilm(filmId, token);
      alert("Film silindi");
      loadData();
    } catch (error) {
      alert("Silme işlemi başarısız");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Admin Panel</h1>

      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => {
            setActiveTab("books");
            resetBookForm();
          }}
          style={{
            padding: "0.5rem 1rem",
            marginRight: "0.5rem",
            backgroundColor: activeTab === "books" ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Kitaplar
        </button>
        <button
          onClick={() => {
            setActiveTab("films");
            resetFilmForm();
          }}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: activeTab === "films" ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Filmler
        </button>
      </div>

      {activeTab === "books" && (
        <div>
          <h2>Kitap {editingItem ? "Düzenle" : "Ekle"}</h2>
          <form onSubmit={handleSubmitBook} style={{ marginBottom: "2rem" }}>
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Kitap Başlığı"
                value={bookForm.title}
                onChange={(e) =>
                  setBookForm({ ...bookForm, title: e.target.value })
                }
                required
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Yazar"
                value={bookForm.author}
                onChange={(e) =>
                  setBookForm({ ...bookForm, author: e.target.value })
                }
                required
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <textarea
                placeholder="Açıklama"
                value={bookForm.description}
                onChange={(e) =>
                  setBookForm({ ...bookForm, description: e.target.value })
                }
                style={{ width: "100%", padding: "0.5rem", minHeight: "100px" }}
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  marginRight: "0.5rem",
                }}
              >
                {editingItem ? "Güncelle" : "Ekle"}
              </button>
              {editingItem && (
                <button
                  type="button"
                  onClick={resetBookForm}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  İptal
                </button>
              )}
            </div>
          </form>

          <h2>Kitaplar Listesi</h2>
          <div>
            {books.length === 0 ? (
              <p>Henüz kitap eklenmemiş</p>
            ) : (
              books.map((book) => (
                <div
                  key={book.id}
                  style={{
                    border: "1px solid #ddd",
                    padding: "1rem",
                    marginBottom: "1rem",
                    borderRadius: "4px",
                  }}
                >
                  <h3>{book.title}</h3>
                  <p>
                    <strong>Yazar:</strong> {book.author}
                  </p>
                  {book.description && (
                    <p>
                      <strong>Açıklama:</strong> {book.description}
                    </p>
                  )}
                  <div style={{ marginTop: "0.5rem" }}>
                    <button
                      onClick={() => handleEditBook(book)}
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "#ffc107",
                        color: "black",
                        border: "none",
                        cursor: "pointer",
                        marginRight: "0.5rem",
                      }}
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "films" && (
        <div>
          <h2>Film {editingItem ? "Düzenle" : "Ekle"}</h2>
          <form onSubmit={handleSubmitFilm} style={{ marginBottom: "2rem" }}>
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Film Başlığı"
                value={filmForm.title}
                onChange={(e) =>
                  setFilmForm({ ...filmForm, title: e.target.value })
                }
                required
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Yönetmen"
                value={filmForm.director}
                onChange={(e) =>
                  setFilmForm({ ...filmForm, director: e.target.value })
                }
                required
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="number"
                placeholder="Yayın Yılı"
                value={filmForm.release_year}
                onChange={(e) =>
                  setFilmForm({ ...filmForm, release_year: e.target.value })
                }
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <textarea
                placeholder="Açıklama"
                value={filmForm.description}
                onChange={(e) =>
                  setFilmForm({ ...filmForm, description: e.target.value })
                }
                style={{ width: "100%", padding: "0.5rem", minHeight: "100px" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Poster Görsel URL"
                value={filmForm.poster_image}
                onChange={(e) =>
                  setFilmForm({ ...filmForm, poster_image: e.target.value })
                }
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  marginRight: "0.5rem",
                }}
              >
                {editingItem ? "Güncelle" : "Ekle"}
              </button>
              {editingItem && (
                <button
                  type="button"
                  onClick={resetFilmForm}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  İptal
                </button>
              )}
            </div>
          </form>

          <h2>Filmler Listesi</h2>
          <div>
            {films.length === 0 ? (
              <p>Henüz film eklenmemiş</p>
            ) : (
              films.map((film) => (
                <div
                  key={film.id}
                  style={{
                    border: "1px solid #ddd",
                    padding: "1rem",
                    marginBottom: "1rem",
                    borderRadius: "4px",
                  }}
                >
                  <h3>{film.title}</h3>
                  <p>
                    <strong>Yönetmen:</strong> {film.director}
                  </p>
                  {film.release_year && (
                    <p>
                      <strong>Yayın Yılı:</strong> {film.release_year}
                    </p>
                  )}
                  {film.description && (
                    <p>
                      <strong>Açıklama:</strong> {film.description}
                    </p>
                  )}
                  {film.poster_image && (
                    <img
                      src={film.poster_image}
                      alt={film.title}
                      style={{
                        maxWidth: "200px",
                        marginTop: "0.5rem",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                  <div style={{ marginTop: "0.5rem" }}>
                    <button
                      onClick={() => handleEditFilm(film)}
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "#ffc107",
                        color: "black",
                        border: "none",
                        cursor: "pointer",
                        marginRight: "0.5rem",
                      }}
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDeleteFilm(film.id)}
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
