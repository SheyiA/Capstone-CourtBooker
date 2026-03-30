/*
Name: Sheyi Adepoju
Description: ultimate and basically the homepage of the application where the user will see a map with their current location and other courts and see other court details
*/

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CourtMap from "./CourtMap";
function Dashboard() {
  // set coourt states
  const [courts, setCourts] = useState([]);
  const [occupancy, setOccupancy] = useState({});
  const [selectedRegion, setSelectedRegion] = useState("ALL");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  console.log("API BASE =", API_BASE);

// load courts called before created still works 
  useEffect(() => {
    loadCourts();
  }, []);

// refresh courts every 5 seconds called before but still works 
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAllOccupancy();
    }, 5000);

    return () => clearInterval(interval);
  }, [courts]);


// filter courts 
  const filteredCourts =
    selectedRegion === "ALL"
      ? courts
      : courts.filter(
        (court) => court.region?.toUpperCase() === selectedRegion
      );


// loud courts from the courts route 
  const loadCourts = async () => {
    const res = await fetch(`${API_BASE}/courts`);
    const data = await res.json();
    setCourts(data);

    data.forEach(court => fetchStatus(court.id));
  };
// create link to court 
  const fetchStatus = async (courtId) => {
    const res = await fetch(`${API_BASE}/court/${courtId}/status`);
    const data = await res.json();
// set court details to the active players 
    setOccupancy(prev => ({
      ...prev,
      [courtId]: Number(data.active_players)
    }));
  };

  const refreshAllOccupancy = () => {
    courts.forEach(court => {
      fetchStatus(court.id);
    });
  };


  const getCourtStatus = (active, total) => {
    const percent = active / total;
// math to handle court availabilities to be consistent 
    if (percent < 0.4) return "low";       // green
    if (percent < 0.8) return "medium";    // orange
    return "high";                         // red
  };


  const getStatusColor = (active, total) => {
    const status = getCourtStatus(active, total);
// set court details based on activity levels
    if (status === "low") return "#52c41a";
    if (status === "medium") return "#faad14";
    return "#ff4d4f";
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
        <br />
        <Link
          to="/admin/analytics"
          style={{
            padding: "12px 20px",
            background: "#722ed1",
            color: "white",
            textDecoration: "none",
            borderRadius: 8,
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}
        >
          View Analytics
        </Link>
        <br />
        <br />
        <br />
        <Link
          to="/admin/qr"
          style={{
            padding: "12px 20px",
            background: "#722ed1",
            color: "white",
            textDecoration: "none",
            borderRadius: 8,
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}
        >
          QR Codes
        </Link>

        <br /><br /><br />
        <CourtMap />

        <br /><br />

        <div style={{ marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["ALL", "NW", "NE", "SW", "SE"].map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              style={{
                padding: "10px 16px",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                background: selectedRegion === region ? "#c8102e" : "#e5e7eb",
                color: selectedRegion === region ? "white" : "#111827",
                fontWeight: "bold"
              }}
            >
              {region}
            </button>
          ))}
        </div>



        <br />
        <br />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20
        }}>
          {filteredCourts.map(court => (
            <div key={court.id} style={{
              background: "transparent",
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
                background: getStatusColor(
                  occupancy[court.id] || 0,
                  court.num_of_courts
                ),
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