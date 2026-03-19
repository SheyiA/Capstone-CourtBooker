import { useEffect, useState } from "react";

function App() {

  const [players, setPlayers] = useState(0);

  const courtId = 1;

  const fetchStatus = async () => {
    const res = await fetch(`http://localhost:3000/court/${courtId}/status`);
    const data = await res.json();
    setPlayers(data.active_players);
  };

  const checkIn = async () => {
    await fetch("http://localhost:3000/checkin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ court_id: courtId })
    });

    fetchStatus();
  };

  const checkOut = async () => {
    await fetch("http://localhost:3000/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ court_id: courtId })
    });

    fetchStatus();
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>City Court Monitor</h1>
      <h2>Court {courtId}</h2>

      <h3>Active Players: {players}</h3>

      <button onClick={checkIn} style={{ marginRight: 10 }}>
        Check In
      </button>

      <button onClick={checkOut}>
        Check Out
      </button>
    </div>
  );
}

export default App;