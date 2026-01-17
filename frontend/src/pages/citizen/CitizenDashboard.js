function CitizenDashboard({ onLogout }) {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Citizen Dashboard</h1>
      <p>Logged in as Citizen</p>

      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default CitizenDashboard;
