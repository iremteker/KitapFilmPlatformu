import { useState, useEffect } from "react";
import { fetchMyLibrary, fetchBooks, fetchFilms } from "../api";

function LibraryPage({ currentUser }) {
  const token = localStorage.getItem("access_token");
  const [library, setLibrary] = useState([]);
  const [books, setBooks] = useState([]);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [libraryData, booksData, filmsData] = await Promise.all([
        fetchMyLibrary(token),
        fetchBooks(),
        fetchFilms(),
      ]);
      setLibrary(libraryData);
      setBooks(booksData);
      setFilms(filmsData);
    } catch (error) {
      console.error("Veri yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const getItemDetails = (itemId, itemType) => {
    if (itemType === "book") {
      return books.find((b) => b.id === itemId);
    } else {
      return films.find((f) => f.id === itemId);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      reading: "📖 Okunuyor",
      completed: "✅ Tamamlandı",
      watching: "🎬 İzleniyor",
      watched: "✅ İzlendi",
      added: "➕ Eklendi",
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <p style={{ fontSize: "1.2rem" }}>Yükleniyor...</p>
      </div>
    );
  }

  const libraryBooks = library.filter((item) => item.item_type === "book");
  const libraryFilms = library.filter((item) => item.item_type === "film");

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem", color: "#343a40" }}>
        Kütüphanem 📚
      </h1>

      {library.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          }}
        >
          <p style={{ fontSize: "1.2rem", color: "#6c757d" }}>
            Kütüphanenizde henüz kitap veya film yok.
          </p>
          <p style={{ color: "#6c757d", marginTop: "1rem" }}>
            Ana sayfadan kitapları ve filmleri kütüphanenize ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <>
          {/* Kitaplar */}
          {libraryBooks.length > 0 && (
            <section style={{ marginBottom: "3rem" }}>
              <h2
                style={{
                  marginBottom: "1.5rem",
                  color: "#007bff",
                  borderBottom: "3px solid #007bff",
                  paddingBottom: "0.5rem",
                }}
              >
                📚 Kitaplarım ({libraryBooks.length})
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {libraryBooks.map((item) => {
                  const book = getItemDetails(item.item_id, "book");
                  if (!book) return null;
                  return (
                    <div
                      key={item.id}
                      style={{
                        border: "1px solid #dee2e6",
                        borderRadius: "8px",
                        padding: "1.5rem",
                        backgroundColor: "white",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
                        {book.title}
                      </h3>
                      <p style={{ color: "#6c757d", marginBottom: "0.5rem" }}>
                        <strong>Yazar:</strong> {book.author}
                      </p>
                      <div
                        style={{
                          padding: "0.5rem",
                          backgroundColor: "#e9ecef",
                          borderRadius: "4px",
                          display: "inline-block",
                          marginTop: "0.5rem",
                        }}
                      >
                        {getStatusText(item.status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Filmler */}
          {libraryFilms.length > 0 && (
            <section>
              <h2
                style={{
                  marginBottom: "1.5rem",
                  color: "#dc3545",
                  borderBottom: "3px solid #dc3545",
                  paddingBottom: "0.5rem",
                }}
              >
                🎬 Filmlerim ({libraryFilms.length})
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {libraryFilms.map((item) => {
                  const film = getItemDetails(item.item_id, "film");
                  if (!film) return null;
                  return (
                    <div
                      key={item.id}
                      style={{
                        border: "1px solid #dee2e6",
                        borderRadius: "8px",
                        padding: "1.5rem",
                        backgroundColor: "white",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      {film.poster_image && (
                        <img
                          src={film.poster_image}
                          alt={film.title}
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            marginBottom: "1rem",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                      <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
                        {film.title}
                      </h3>
                      <p style={{ color: "#6c757d", marginBottom: "0.5rem" }}>
                        <strong>Yönetmen:</strong> {film.director}
                      </p>
                      {film.release_year && (
                        <p style={{ color: "#6c757d", marginBottom: "0.5rem" }}>
                          <strong>Yıl:</strong> {film.release_year}
                        </p>
                      )}
                      <div
                        style={{
                          padding: "0.5rem",
                          backgroundColor: "#e9ecef",
                          borderRadius: "4px",
                          display: "inline-block",
                          marginTop: "0.5rem",
                        }}
                      >
                        {getStatusText(item.status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default LibraryPage;

