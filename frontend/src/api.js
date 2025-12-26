const API_URL = "http://127.0.0.1:8000";

export const fetchBooks = async () => {
  const res = await fetch(`${API_URL}/books/`);
  return res.json();
};

export const fetchFilms = async () => {
  const res = await fetch(`${API_URL}/films/`);
  return res.json();
};

export const addToLibrary = async (itemId, itemType, token) => {
    if (!token) {
        alert("Kütüphaneye eklemek için giriş yapmalısınız.");
        return;
    }

  const response = await fetch( "http://127.0.0.1:8000/library/", {
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
    }
  );

  if (response.ok) {
    alert("Başarıyla kütüphaneye eklendi!");
    return;
  }
  
  const err = await response.json();
  console.log("Kütüphaneye ekleme hatası:", err);
  alert("Hata: " + JSON.stringify(err));
  return;
};

