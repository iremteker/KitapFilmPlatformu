import { useEffect, useState } from "react";
import {
  fetchBooks,
  fetchFilms,
  addToLibrary,
  addRating,
  getItemRatings,
  getMyRating,
  addComment,
  getItemComments,
} from "../api";

function ItemCard({ item, itemType, currentUser, token, onAddToLibrary }) {
  const [expanded, setExpanded] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [myRating, setMyRating] = useState(null);
  const [comments, setComments] = useState([]);
  const [ratingValue, setRatingValue] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expanded) {
      loadRatingsAndComments();
    }
  }, [expanded, item.id, itemType]);

  const loadRatingsAndComments = async () => {
    try {
      const [ratingsData, myRatingData, commentsData] = await Promise.all([
        getItemRatings(item.id, itemType),
        getMyRating(item.id, itemType, token),
        getItemComments(item.id, itemType),
      ]);
      setRatings(ratingsData);
      setMyRating(myRatingData);
      setComments(commentsData);
      if (myRatingData) {
        setRatingValue(myRatingData.rating);
      }
    } catch (error) {
      console.error("Yükleme hatası:", error);
    }
  };

  const handleRating = async (rating) => {
    try {
      setLoading(true);
      await addRating(item.id, itemType, rating, token);
      await loadRatingsAndComments();
      setRatingValue(rating);
    } catch (error) {
      alert("Puan verme başarısız");
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setLoading(true);
      await addComment(item.id, itemType, commentText, token);
      setCommentText("");
      await loadRatingsAndComments();
    } catch (error) {
      alert("Yorum ekleme başarısız");
    } finally {
      setLoading(false);
    }
  };

  const averageRating =
    ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : 0;

  const isBook = itemType === "book";

  return (
    <div
      style={{
        border: "1px solid #dee2e6",
        borderRadius: "8px",
        padding: "1.5rem",
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
      }}
    >
      {!isBook && item.poster_image && (
        <img
          src={item.poster_image}
          alt={item.title}
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

      <h3
        style={{
          marginTop: 0,
          marginBottom: "0.5rem",
          color: "#343a40",
        }}
      >
        {item.title}
      </h3>

      <p style={{ color: "#6c757d", marginBottom: "0.5rem" }}>
        <strong>{isBook ? "Yazar:" : "Yönetmen:"}</strong>{" "}
        {isBook ? item.author : item.director}
      </p>

      {!isBook && item.release_year && (
        <p style={{ color: "#6c757d", marginBottom: "0.5rem" }}>
          <strong>Yıl:</strong> {item.release_year}
        </p>
      )}

      {item.description && (
        <p
          style={{
            color: "#495057",
            fontSize: "0.9rem",
            marginBottom: "1rem",
            lineHeight: "1.5",
          }}
        >
          {item.description.length > 100
            ? `${item.description.substring(0, 100)}...`
            : item.description}
        </p>
      )}

      {/* Ortalama Puan */}
      {averageRating > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <span style={{ color: "#ffc107", fontSize: "1.2rem" }}>⭐</span>{" "}
          <strong>{averageRating}</strong> ({ratings.length} değerlendirme)
        </div>
      )}

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button
          onClick={() => onAddToLibrary(item.id, itemType, item.title)}
          style={{
            flex: 1,
            padding: "0.75rem",
            backgroundColor: isBook ? "#007bff" : "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = isBook ? "#0056b3" : "#c82333")
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = isBook ? "#007bff" : "#dc3545")
          }
        >
          ➕ Kütüphaneye Ekle
        </button>

        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            padding: "0.75rem 1rem",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {expanded ? "▲ Detayları Gizle" : "▼ Puan & Yorum"}
        </button>
      </div>

      {/* Expandable Section */}
      {expanded && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "4px",
            border: "1px solid #dee2e6",
          }}
        >
          {/* Puan Verme */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
              Puan Ver ⭐
            </h4>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  disabled={loading}
                  style={{
                    fontSize: "1.5rem",
                    border: "none",
                    background: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    color: ratingValue >= star ? "#ffc107" : "#ddd",
                    padding: "0.25rem",
                  }}
                >
                  ⭐
                </button>
              ))}
              {myRating && (
                <span style={{ marginLeft: "0.5rem", color: "#6c757d" }}>
                  (Puanınız: {myRating.rating})
                </span>
              )}
            </div>
          </div>

          {/* Yorum Yapma */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Yorum Yap 💬</h4>
            <form onSubmit={handleComment}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Yorumunuzu yazın..."
                rows="3"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  marginBottom: "0.5rem",
                  fontFamily: "inherit",
                }}
                required
              />
              <button
                type="submit"
                disabled={loading || !commentText.trim()}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                Yorum Gönder
              </button>
            </form>
          </div>

          {/* Yorumlar Listesi */}
          {comments.length > 0 && (
            <div>
              <h4 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
                Yorumlar ({comments.length})
              </h4>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      padding: "0.75rem",
                      marginBottom: "0.5rem",
                      backgroundColor: "white",
                      borderRadius: "4px",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>
                      {comment.comment}
                    </p>
                    <small style={{ color: "#6c757d" }}>
                      {new Date(comment.created_at).toLocaleDateString("tr-TR")}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HomePage({ currentUser }) {
  const [books, setBooks] = useState([]);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [booksData, filmsData] = await Promise.all([
        fetchBooks(),
        fetchFilms(),
      ]);
      setBooks(booksData);
      setFilms(filmsData);
    } catch (error) {
      console.error("Veri yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleAddToLibrary = async (itemId, itemType, itemTitle) => {
    try {
      await addToLibrary(itemId, itemType, token);
      showNotification(
        `${itemTitle} başarıyla kütüphanenize eklendi! 🎉`,
        "success"
      );
    } catch (error) {
      showNotification("Kütüphaneye ekleme başarısız", "error");
    }
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

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Notification Popup */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "20px",
            padding: "1rem 1.5rem",
            backgroundColor: notification.type === "success" ? "#28a745" : "#dc3545",
            color: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            zIndex: 1000,
            animation: "slideIn 0.3s ease-out",
          }}
        >
          {notification.message}
        </div>
      )}

      <h1 style={{ marginBottom: "2rem", color: "#343a40" }}>
        Hoş Geldiniz! 👋
      </h1>

      {/* Kitaplar Bölümü */}
      <section style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            marginBottom: "1.5rem",
            color: "#007bff",
            borderBottom: "3px solid #007bff",
            paddingBottom: "0.5rem",
          }}
        >
          📚 Kitaplar
        </h2>
        {books.length === 0 ? (
          <p style={{ color: "#6c757d", fontStyle: "italic" }}>
            Henüz kitap eklenmemiş.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {books.map((book) => (
              <ItemCard
                key={book.id}
                item={book}
                itemType="book"
                currentUser={currentUser}
                token={token}
                onAddToLibrary={handleAddToLibrary}
              />
            ))}
          </div>
        )}
      </section>

      {/* Filmler Bölümü */}
      <section>
        <h2
          style={{
            marginBottom: "1.5rem",
            color: "#dc3545",
            borderBottom: "3px solid #dc3545",
            paddingBottom: "0.5rem",
          }}
        >
          🎬 Filmler
        </h2>
        {films.length === 0 ? (
          <p style={{ color: "#6c757d", fontStyle: "italic" }}>
            Henüz film eklenmemiş.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {films.map((film) => (
              <ItemCard
                key={film.id}
                item={film}
                itemType="film"
                currentUser={currentUser}
                token={token}
                onAddToLibrary={handleAddToLibrary}
              />
            ))}
          </div>
        )}
      </section>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default HomePage;
