import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import CourtPage from "./CourtPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/court/:id" element={<CourtPage />} />
    </Routes>
  );
}

export default App;