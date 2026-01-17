function AdminDashboard({ onLogout }) {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Dashboard</h1>
      <p>Logged in as Admin</p>

      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default AdminDashboard;
