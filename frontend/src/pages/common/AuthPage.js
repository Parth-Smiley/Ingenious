import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage({ setAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:9000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // store auth
      localStorage.clear();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);

      setAuth({
        token: data.access_token,
        role: data.role,
      });

      // redirect by role
      navigate(`/${data.role}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={login}>Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
