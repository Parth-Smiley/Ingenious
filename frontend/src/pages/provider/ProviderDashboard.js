import { useState } from "react";

function ProviderDashboard({ onLogout }) {
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [domain, setDomain] = useState("city");
  const [baseUrl, setBaseUrl] = useState("");
  const [endpointPath, setEndpointPath] = useState("");
  const [message, setMessage] = useState("");

const registerService = async () => {
  setMessage("");

  try {
    const res = await fetch("http://127.0.0.1:9000/registry/service-requests", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
  name: name,                    // or serviceName if that’s your state
  domain: domain,
  base_url: baseUrl,
  endpoint_path: endpointPath,
}),

});


    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Request failed");
    }

    setMessage("Service request submitted (pending admin approval)");
  } catch (err) {
    setMessage(err.message);
  }
};



  return (
    <div style={{ padding: 40 }}>
      <h1>Provider Dashboard</h1>
      <h3>Register a New Service</h3>

      <input
        placeholder="Service Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br />

      <select value={domain} onChange={(e) => setDomain(e.target.value)}>
        <option value="city">City</option>
        <option value="health">Health</option>
        <option value="agriculture">Agriculture</option>
      </select><br />

      <input
        placeholder="Base URL (e.g. http://127.0.0.1:9004)"
        value={baseUrl}
        onChange={(e) => setBaseUrl(e.target.value)}
      /><br />

      <input
        placeholder="Endpoint Path (e.g. /city/request)"
        value={endpointPath}
        onChange={(e) => setEndpointPath(e.target.value)}
      /><br /><br />

      <button onClick={registerService}>Register Service</button>

      {message && <p>{message}</p>}

      <br /><br />
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default ProviderDashboard;
