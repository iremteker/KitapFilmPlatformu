const API_URL = "http://127.0.0.1:8000";

export const registerUser = async (username, email, password) => {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Registration failed");
  }

  return res.json();
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      username: email,
      password,
    }),
  });

  if (!res.ok) throw new Error("Login failed");

  const data = await res.json();
  localStorage.setItem("access_token", data.access_token);
  return data.access_token;
};

export const fetchMe = async (token) => {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
};

export const updateUser = async (userData, token) => {
  const res = await fetch(`${API_URL}/users/me`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Update failed");
  }
  return res.json();
};

export const adminAddBook = async (book, token) => {
  const res = await fetch(`${API_URL}/books/admin`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });

  if (!res.ok) throw new Error("Admin add book failed");
  return res.json();
};

export const adminAddFilm = async (film, token) => {
  const res = await fetch(`${API_URL}/films/admin`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(film),
  });

  if (!res.ok) throw new Error("Admin add film failed");
  return res.json();
};

export const fetchBooks = async () => {
  const res = await fetch(`${API_URL}/books/`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
};

export const fetchFilms = async () => {
  const res = await fetch(`${API_URL}/films/`);
  if (!res.ok) throw new Error("Failed to fetch films");
  return res.json();
};

export const adminUpdateBook = async (bookId, book, token) => {
  const res = await fetch(`${API_URL}/books/admin/${bookId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });

  if (!res.ok) throw new Error("Admin update book failed");
  return res.json();
};

export const adminDeleteBook = async (bookId, token) => {
  const res = await fetch(`${API_URL}/books/admin/${bookId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Admin delete book failed");
};

export const adminUpdateFilm = async (filmId, film, token) => {
  const res = await fetch(`${API_URL}/films/admin/${filmId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(film),
  });

  if (!res.ok) throw new Error("Admin update film failed");
  return res.json();
};

export const adminDeleteFilm = async (filmId, token) => {
  const res = await fetch(`${API_URL}/films/admin/${filmId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Admin delete film failed");
};

export const addToLibrary = async (itemId, itemType, token) => {
  const res = await fetch(`${API_URL}/library/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      item_id: itemId,
      item_type: itemType,
      status: itemType === "book" ? "reading" : "watching",
    }),
  });

  if (!res.ok) throw new Error("Add to library failed");
  return res.json();
};

export const fetchMyLibrary = async (token) => {
  const res = await fetch(`${API_URL}/library/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch library");
  return res.json();
};

export const addRating = async (itemId, itemType, rating, token) => {
  const res = await fetch(`${API_URL}/ratings/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      item_id: itemId,
      item_type: itemType,
      rating: rating,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Rating failed");
  }
  return res.json();
};

export const getItemRatings = async (itemId, itemType) => {
  const res = await fetch(`${API_URL}/ratings/item/${itemId}/${itemType}`);
  if (!res.ok) throw new Error("Failed to fetch ratings");
  return res.json();
};

export const getMyRating = async (itemId, itemType, token) => {
  const res = await fetch(`${API_URL}/ratings/item/${itemId}/${itemType}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return null;
  return res.json();
};

export const addComment = async (itemId, itemType, comment, token) => {
  const res = await fetch(`${API_URL}/comments/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      item_id: itemId,
      item_type: itemType,
      comment: comment,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Comment failed");
  }
  return res.json();
};

export const getItemComments = async (itemId, itemType) => {
  const res = await fetch(`${API_URL}/comments/item/${itemId}/${itemType}`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
};
