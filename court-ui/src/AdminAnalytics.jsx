import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UsageChart from "./UsageChart";

function AdminAnalytics() {

  const [analytics, setAnalytics] = useState(null);

  const loadAnalytics = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.log("Analytics fetch error", err);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (!analytics) {
    return <div style={{ padding: 40 }}>Loading analytics...</div>;
  }

  return (
    <div style={{
      padding: 40,
      fontFamily: "Arial",
      background: "#f4f6f8",
      minHeight: "100vh"
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <h1 style={{ marginBottom: 25 }}>
          City Court Usage Analytics Dashboard
        </h1>

        {/* ⭐ top metrics cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginBottom: 40
        }}>

          <div style={cardStyle}>
            <h3>Current Active Players</h3>
            <p style={bigNumber}>{analytics.total_active_players}</p>
          </div>

          <div style={cardStyle}>
            <h3>Sessions Today</h3>
            <p style={bigNumber}>{analytics.sessions_today}</p>
          </div>

          <div style={cardStyle}>
            <h3>Busiest Court Today</h3>
            <p style={bigNumber}>
              {analytics.busiest_court
                ? analytics.busiest_court.name
                : "No data"}
            </p>
          </div>

        </div>

        {/* ⭐ ranking table */}
        <div style={{
          background: "white",
          padding: 25,
          borderRadius: 10,
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
        }}>
          <h2 style={{ marginBottom: 15 }}>
            Court Usage Ranking (All Time)
          </h2>

          <table style={{
            width: "100%",
            borderCollapse: "collapse"
          }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "2px solid #eee" }}>
                <th style={thStyle}>Court</th>
                <th style={thStyle}>Total Sessions</th>
              </tr>
            </thead>
            <tbody>
              {analytics.court_usage.map((court, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={tdStyle}>{court.name}</td>
                  <td style={tdStyle}>{court.session_count}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>

<div style={{ marginTop: 30 }}>
  <UsageChart />
</div>

<br /><br /><br />
 <Link
    to="../"
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
    Back to Dashboard
  </Link>

    </div>
  );
}

/* ⭐ styling helpers */

const cardStyle = {
  background: "white",
  padding: 20,
  borderRadius: 10,
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
};

const bigNumber = {
  fontSize: 32,
  fontWeight: "bold",
  marginTop: 10,
  color: "#1890ff"
};

const thStyle = {
  padding: 10
};

const tdStyle = {
  padding: 10
};

export default AdminAnalytics;