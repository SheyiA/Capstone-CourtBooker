import { useEffect, useState } from "react";
import { QRCode } from "react-qr-code";

function AdminQR() {

const [courts, setCourts] = useState([]);
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const FRONTEND_URL = "https://capstone-courtbooker-1.onrender.com";

const fetchCourts = async () => {
const res = await fetch(`${API_BASE}/courts`);
const data = await res.json();
setCourts(data);
};


useEffect(() => {
  fetchCourts();
}, []);


return (
<div style={{
padding: 40,
fontFamily: "Arial",
background: "#f4f6f8",
minHeight: "100vh"
}}> <h1>QR Code Generator — City Courts</h1>

{courts.length === 0 && <p>Loading courts...</p>}

  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
    marginTop: 30
  }}>
    {courts.length > 0 && courts.map(court => (
      <div key={court.id} style={{
        background: "white",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        textAlign: "center"
      }}>
        <h2>{court.name}</h2>
        {/* <p>{court.location}</p> */}

<div style={{ background: "white", padding: 12 }}>
  <QRCode
value={`${FRONTEND_URL}/court/${court.id}`}
    style={{ height: 160, width: 160 }}
  />

  <p style={{ fontSize: 10, marginTop: 5 }}>
  {`${FRONTEND_URL}/court/${court.id}`}
</p>
</div>

        <p style={{ marginTop: 10, fontSize: 12 }}>
          Scan to Check-In
        </p>
      </div>
    ))}
  </div>
</div>


);
}

export default AdminQR;
