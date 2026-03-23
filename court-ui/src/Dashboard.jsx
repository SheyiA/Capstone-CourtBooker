import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {

  const [courts, setCourts] = useState([]);
  const [occupancy, setOccupancy] = useState({});

  useEffect(() => {
    loadCourts();
  }, []);


  useEffect(() => {
  const interval = setInterval(() => {
    refreshAllOccupancy();
  }, 5000);

  return () => clearInterval(interval);
}, [courts]);


  const loadCourts = async () => {
    const res = await fetch("http://localhost:3000/courts");
    const data = await res.json();
    setCourts(data);

    data.forEach(court => fetchStatus(court.id));
  };

  const fetchStatus = async (courtId) => {
    const res = await fetch(`http://localhost:3000/court/${courtId}/status`);
    const data = await res.json();

    setOccupancy(prev => ({
      ...prev,
      [courtId]: data.active_players
    }));
  };

  const refreshAllOccupancy = () => {
  courts.forEach(court => {
    fetchStatus(court.id);
  });
};

  const getStatusColor = (count) => {
  if (count >= 6) return "#ff4d4f";   // busy → red
  if (count >= 3) return "#faad14";   // moderate → yellow
  return "#52c41a";                   // low → green
};

  return (
  <div style={{
    padding: 40,
    fontFamily: "Arial",
    background: "#f4f6f8",
    minHeight: "100vh"
  }}>
    <div style={{
      maxWidth: 1100,
      margin: "0 auto"
    }}>
      <h1 style={{ marginBottom: 20 }}>
        City of Calgary Court Usage Dashboard
      </h1>
<p> Page refreshes every 5 seconds </p>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 20
      }}>
        {courts.map(court => (
          <div key={court.id} style={{
            background: "white",
            padding: 20,
            borderRadius: 10,
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
          }}>
            <h2 style={{ marginBottom: 6 }}>{court.name}</h2>
            <p style={{ marginBottom: 12, color: "#666" }}>
              {court.location}
            </p>

            <div style={{
              marginBottom: 15,
              padding: 10,
              borderRadius: 6,
              background: getStatusColor(occupancy[court.id] || 0),
              color: "white",
              fontWeight: "bold"
            }}>
              Active Players: {occupancy[court.id] || 0}
            </div>

            <Link
              to={`/court/${court.id}`}
              style={{
                textDecoration: "none",
                padding: "10px 16px",
                background: "#52c41a",
                color: "white",
                borderRadius: 6,
                display: "inline-block"
              }}
            >
              View Court
            </Link>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}

export default Dashboard;