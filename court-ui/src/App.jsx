import { useEffect, useState } from "react";

function App() {

  const [courts, setCourts] = useState([]);
  const [occupancy, setOccupancy] = useState({});

  // load courts once
  useEffect(() => {
    loadCourts();
  }, []);

  // auto refresh occupancy every 5 seconds
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

    // initial occupancy load
    data.forEach(court => {
      fetchStatus(court.id);
    });
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


// color for occupancy levels
const getStatusColor = (count) => {
  if (count >= 6) return "#ff4d4f";   // red
  if (count >= 3) return "#faad14";   // yellow
  return "#52c41a";                   // green
};

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>City of Calgary Court Usage Dashboard</h1>

      <button
        onClick={refreshAllOccupancy}
        style={{
          marginBottom: 20,
          padding: "10px 20px",
          cursor: "pointer"
        }}
      >
        Refresh Now
      </button>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: 20
      }}>
        {courts.map(court => (
          <div key={court.id} style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 20,
            background: "#fafafa"
          }}>
            <h2>{court.name}</h2>
            <p>{court.location}</p>

            <h3>
<div
  style={{
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    background: getStatusColor(occupancy[court.id] || 0),
    color: "white",
    fontWeight: "bold"
  }}
>
  Active Players: {occupancy[court.id] || 0}
</div>            </h3>

            <button>
              View Court
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;