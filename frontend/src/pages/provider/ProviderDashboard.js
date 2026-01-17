function ProviderDashboard({ onLogout }) {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Provider Dashboard</h1>
      <p>Logged in as Provider</p>

      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default ProviderDashboard;
