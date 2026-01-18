import { useEffect, useState } from "react";

function AdminDashboard({ onLogout }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [requests, setRequests] = useState([]);

  const token = localStorage.getItem("token");
  const handleDecision = async (id, action) => {
  await fetch(
    `http://127.0.0.1:9000/admin/service-requests/${id}/${action}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  fetchRequests();
  fetchServices(); // refresh registry list
};

  const fetchRequests = async () => {
    const res = await fetch(
      "http://127.0.0.1:9000/admin/service-requests",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const data = await res.json();
    setRequests(data);
  };

  const fetchLogs = async () => {
    const res = await fetch("http://127.0.0.1:9000/admin/logs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setLogs(data.logs || data);
      };

  const fetchServices = async () => {
    setLoading(true);

    const res = await fetch("http://127.0.0.1:9000/registry/services", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setServices(data.services || data);
    setLoading(false);
  };

  const toggleService = async (serviceId, isEnabled) => {
    const action = isEnabled ? "disable" : "enable";

    await fetch(
      `http://127.0.0.1:9000/registry/services/${serviceId}/${action}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchServices(); // refresh list
  };
  const loadRequests = async () => {
  const res = await fetch("http://127.0.0.1:9000/registry/service-requests", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();
  setRequests(data);
};

useEffect(() => {
  loadRequests();
}, []);

const approve = async (id) => {
  await fetch(
    `http://127.0.0.1:9000/registry/service-requests/${id}/approve`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  loadRequests(); // refresh table
};

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) return <p>Loading services...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Control Panel</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Domain</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {services.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.domain}</td>
              <td>{s.is_enabled ? "ENABLED" : "DISABLED"}</td>
              <td>
                <button
                  onClick={() => toggleService(s.id, s.is_enabled)}
                >
                  {s.is_enabled ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>System Logs</h2>
<h3>Pending Service Requests</h3>

<table border="1">
  <thead>
    <tr>
      <th>Name</th>
      <th>Domain</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {requests
      .filter(r => r.status === "PENDING")
      .map(r => (
        <tr key={r.id}>
          <td>{r.name}</td>
          <td>{r.domain}</td>
          <td>{r.status}</td>
          <td>
            <button onClick={() => approve(r.id)}>Approve</button>
          </td>
        </tr>
      ))}
  </tbody>
</table>



      <br />
      <button onClick={onLogout}>Logout</button>
    </div>
    
  );
}

export default AdminDashboard;
