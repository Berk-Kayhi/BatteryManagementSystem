import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import DashboardPage from "./pages/Dashboard";
import TimestampPage from "./pages/Timestamp";
import GraphicsPage from "./pages/Graphics";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/predictions" element={<DashboardPage />} />
        <Route path="/timestamp" element={<TimestampPage />} />
        <Route path="/graph" element={<GraphicsPage />} />
      </Routes>
    </Router>
  );
}

export default App;