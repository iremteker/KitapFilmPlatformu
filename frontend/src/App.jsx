import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import LibraryPage from "./pages/LibraryPage";
import Navbar from "./components/Navbar";
import { fetchMe } from "./api";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetchMe(token)
      .then((user) => setCurrentUser(user))
      .catch(() => {
        localStorage.removeItem("access_token");
        setCurrentUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <>
      {currentUser && <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />}
      <Routes>
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage setCurrentUser={setCurrentUser} />
            )
          }
        />

        <Route
          path="/register"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <RegisterPage setCurrentUser={setCurrentUser} />
            )
          }
        />

        <Route
          path="/"
          element={
            currentUser ? (
              <HomePage currentUser={currentUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/profile"
          element={
            currentUser ? (
              <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/library"
          element={
            currentUser ? (
              <LibraryPage currentUser={currentUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin"
          element={
            currentUser && currentUser.is_admin ? (
              <AdminPage />
            ) : currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Güvenlik için fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
