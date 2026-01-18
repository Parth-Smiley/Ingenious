import { useState } from "react";

function CitizenDashboard({ onLogout }) {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);

  const sendRequest = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:9000/core/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ONLY auth browser sends
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Citizen Dashboard</h1>

      <textarea
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe your issue..."
      />

      <br />
      <button onClick={sendRequest}>Submit Request</button>

      <pre>{JSON.stringify(response, null, 2)}</pre>

      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default CitizenDashboard;
