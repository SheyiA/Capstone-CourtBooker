import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import CourtPage from "./CourtPage";
import AdminQR from "./AdminQR";
import AdminAnalytics from "./AdminAnalytics";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/court/:id" element={<CourtPage />} />
      <Route path="/admin/qr" element={<AdminQR />} />
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
    </Routes>
  );
}

export default App;