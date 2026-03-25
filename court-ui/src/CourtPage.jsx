import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CourtPage() {

  const { id } = useParams();
  const [players, setPlayers] = useState(0);
  const [isCheckedIn, setIsCheckedIn] = useState(false); //track if checked in state
  const [court, setCourt] = useState(null)
  const [remainingTime, setRemainingTime] = useState(null);
const [startTime, setStartTime] = useState(null);
const navigate = useNavigate();

  const fetchStatus = async () => {
    const res = await fetch(`http://localhost:3000/court/${id}/status`);
    const data = await res.json();
    setPlayers(data.active_players);
  };


  const fetchCourtInfo = async () => {
  const res = await fetch("http://localhost:3000/courts");
  const data = await res.json();

  const found = data.find(c => String(c.id) === String(id));

  setCourt(found);
};

  // check in route for court page
const checkIn = async () => {

  if (isCheckedIn) return;

  const res = await fetch("http://localhost:3000/checkin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ court_id: id })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);   // ⭐ shows backend message
    return;
  }

  localStorage.setItem("activeCourt", id);
const now = Date.now();
localStorage.setItem("checkinTime", now);

setStartTime(now);
setIsCheckedIn(true);
};
// check out route for court page
const checkOut = async () => {

  if (!isCheckedIn) return;

  await fetch("http://localhost:3000/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ court_id: id })
  });

  localStorage.removeItem("activeCourt");

  setIsCheckedIn(false);

  fetchStatus();
};



useEffect(() => {
  const storedCourt = localStorage.getItem("activeCourt");
  const storedTime = localStorage.getItem("checkinTime");

  if (storedCourt && storedTime && storedCourt === id) {
    setIsCheckedIn(true);
    setStartTime(parseInt(storedTime));
  }
}, [id]);


useEffect(() => {
  if (!isCheckedIn || !startTime) return;

  const interval = setInterval(() => {

    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = 1800 - elapsed;

    if (remaining <= 0) {
      setIsCheckedIn(false);
      localStorage.removeItem("activeCourt");
      localStorage.removeItem("checkinTime");
      clearInterval(interval);
      setRemainingTime(0);
      return;
    }

    setRemainingTime(remaining);

  }, 1000);

  return () => clearInterval(interval);

}, [isCheckedIn, startTime]);



useEffect(() => {

  fetchStatus();
  fetchCourtInfo();   
// store use signed in 
  const storedCourt = localStorage.getItem("activeCourt");

  if (storedCourt == id) {
    setIsCheckedIn(true);
  }

}, []);






return (
  <div style={{
    padding: 40,
    fontFamily: "Arial",
    background: "#f4f6f8",
    minHeight: "100vh"
  }}>
    <div style={{
      maxWidth: 600,
      margin: "0 auto",
      background: "white",
      padding: 30,
      borderRadius: 10,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ marginBottom: 10 }}>Court {id}</h1>

      <h2 style={{ marginBottom: 20 }}>
        Active Players: {players}
      </h2>

      <p>
        Total Courts: {court?.num_of_courts}
      </p>

{isCheckedIn && (
  <div style={{
    marginTop: 15,
    padding: 12,
    background: "#e6f7ff",
    border: "1px solid #91d5ff",
    borderRadius: 6,
    color: "#0050b3",
    fontWeight: "bold"
  }}>
    You are currently checked into this court.
  </div>
)}

{isCheckedIn && remainingTime !== null && (
  <div style={{
    marginTop: 10,
    fontWeight: "bold",
    color: "#d48806"
  }}>
    Session expires in: {Math.floor(remainingTime / 60)}m {remainingTime % 60}s
  </div>
)}

      <div>
<div style={{ marginTop: 20 }}>

  {isCheckedIn ? (
    <button
      onClick={checkOut}
      style={{
        padding: "12px 20px",
        background: "#ff4d4f",
        color: "white",
        border: "none",
        borderRadius: 6,
        cursor: "pointer"
      }}
    >
      Check Out
    </button>
  ) : (
    <button
      onClick={checkIn}
      style={{
        padding: "12px 20px",
        background: "#52c41a",
        color: "white",
        border: "none",
        borderRadius: 6,
        cursor: "pointer"
      }}
    >
      Check In
    </button>
  )}
<br />
  
  <button
    onClick={() => navigate("/")}
    style={{
      marginTop: 15,
      padding: "10px 18px",
      background: "#1677ff",
      color: "white",
      border: "none",
      borderRadius: 6,
      cursor: "pointer"
    }}
  >
    ← Back to Map
  </button> 

</div>
      </div>
    </div>
  </div>
);
}

export default CourtPage;