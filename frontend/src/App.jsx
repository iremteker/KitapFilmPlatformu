import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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


const fetchMe = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch("http://127.0.0.1:8000/users/me",{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  console.log("Current user:", data);

};


  return (
    <div style={{ padding: "2rem", maxWidth: "400px" }}>
      <h1>Login</h1>

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
          <label>Password</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default App;
