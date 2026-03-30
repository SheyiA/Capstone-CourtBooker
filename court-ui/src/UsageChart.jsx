/*
Name: Sheyi Adepoju
Description: This usage chart is used to populate the analytics chart with information called upon from created and retrieable statistics. 
*/
// imports for chart this chart is not really ready and lacks functionality due amount of people that wil be using the application. 
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function UsageChart() {
// set states
  const [data, setData] = useState([]);
const API_BASE = import.meta.env.VITE_API_BASE_URL; // set api url 
  useEffect(() => {
    loadUsage();

    const interval = setInterval(loadUsage, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadUsage = async () => {
    const res = await fetch(`${API_BASE}/analytics/usage`);
    const usage = await res.json();
    setData(usage);
  };

  return (
    <div style={{
      width: "100%",
      height: 350,
      background: "white",
      borderRadius: 10,
      padding: 20,
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
    }}>
      <h2 style={{ marginBottom: 20 }}>
        Live Court Usage Trend
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="players"
            stroke="#007ac2"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default UsageChart;