import { useEffect, useState } from "react";
import { fetchBooks, fetchFilms, addToLibrary } from "./api";
import BookCard from "./components/BookCard";
import FilmCard from "./components/FilmCard";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [films, setFilms] = useState([]);

  useEffect(() => {
    fetchBooks();
    fetchFilms();
  }, []);

  const fetchBooks = async () => {
    const res = await fetch("http://127.0.0.1:8000/books");
    const data = await res.json();
    setBooks(data);
  };

  const fetchFilms = async () => {
    const res = await fetch("http://127.0.0.1:8000/films");
    const data = await res.json();
    setFilms(data);
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Sending:", {
  email: email,
  password: password,
});


  try {
    const response = await fetch("http://127.0.0.1:8000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: email,
        password: password,
      }),
    });

    const data = await response.json();

    console.log("Backend response:", data);

    if (response.ok && data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      console.log("Token kaydedildi:", data.access_token);
    } else {
      console.error("Login başarısız:");
    }

  } catch (error) {
    console.error("Login error:", error);
  }

  fetchMe();
};

const handleLogout = () => {
  localStorage.removeItem("access_token");
  setToken(null);
  setCurrentUser(null);
};


const fetchMe = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch("http://127.0.0.1:8000/users/me",{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  setCurrentUser(data);

};


  return (
    <div style={{ padding: "2rem", maxWidth: "400px" }}>
      <h1>Kitap&Film Platformu</h1>

      {currentUser && (
        <>
        <p style={{ color: "lightgreen"}}>
          Hoş geldiniz, {currentUser.username}
        </p>
        <button onClick={handleLogout}>
          Çıkış Yap
        </button>
        </>
        )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Şifre</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit">Giriş Yap</button>
      </form>

      <hr />

      <h2>Kitaplar📚</h2>
      <div className="grid">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onAdd={(id) =>
              addToLibrary(id, "book", localStorage.getItem("access_token"))
            }
          />
        ))}
      </div>

      <hr />

      <h2>Filmler🎬</h2>
      <div className="grid">
        {films.map((film) => (
          <FilmCard
            key={film.id}
            film={film}
            onAdd={(id) =>
              addToLibrary(id, "film", localStorage.getItem("access_token"))
            }
          />
        ))}
      </div>
    </div>
  );
}

export default App;
