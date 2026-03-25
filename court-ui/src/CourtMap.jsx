import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

function CourtMap() {
  const [courts, setCourts] = useState([]);
  const [userPos, setUserPos] = useState(null);


  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setUserPos([
        pos.coords.latitude,
        pos.coords.longitude
      ]);
    },
    () => {
      console.log("Location permission denied");
    }
  );
}, []);

  useEffect(() => {
    fetchCourts();
      const interval = setInterval(fetchCourts, 5000);
  return () => clearInterval(interval);
  }, []);

const fetchCourts = async () => {
  const res = await fetch(`${API_BASE}/courts`);
  const data = await res.json();

  const courtsWithStatus = await Promise.all(
    data.map(async (court) => {
      const statusRes = await fetch(
        `${API_BASE}/court/${court.id}/status`
      );
      const statusData = await statusRes.json();

      return {
        ...court,
        active_players: statusData.active_players,
      };
    })
  );

  setCourts(courtsWithStatus);
};


const getCourtStatus = (active, total) => {
  const percent = active / total;

  if (percent < 0.4) return "low";
  if (percent < 0.8) return "medium";
  return "high";
};


const getColor = (active, total) => {
  const status = getCourtStatus(active, total);

  if (status === "low") return "green";
  if (status === "medium") return "orange";
  return "red";
};

const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });


  const navigate = useNavigate();

return (
  <div style={{ height: "500px", width: "100%" }}>
    <MapContainer
      center={[51.0447, -114.0719]}
      zoom={11}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="Courts"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* USER LOCATION PIN */}
      {userPos && (
        <Marker position={userPos} icon={createIcon("blue")}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {/* COURT PINS */}
      {courts.map((court) => {
        const color = getColor(
          court.active_players,
          court.num_of_courts
        );

        return (
          <Marker
            key={court.id}
            position={[court.latitude, court.longitude]}
            icon={createIcon(color)}
          >
            <Popup>
              <strong>{court.name}</strong>
              <br />
              Players: {court.active_players}
              <br />
              <button
                onClick={() => navigate(`/court/${court.id}`)}
                style={{
                  marginTop: 8,
                  padding: "6px 10px",
                  background: "#1677ff",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer"
                }}
              >
                Go to Court
              </button>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  </div>
);
}

export default CourtMap;