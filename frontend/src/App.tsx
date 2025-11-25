import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NetworkMapPage from "./pages/NetworkMap";
import SensorDataPage from "./pages/SensorDataPage";
import PredictionsPage from "./pages/PredictionsPage";
import HistoryPage from "./pages/HistoryPage";
import SystemStatusPage from "./pages/SystemStatusPage";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-amber-50/40">
    <div className="text-center">
      <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-amber-600 border-r-transparent"></div>
      <p className="text-lg font-semibold text-gray-700">Yükleniyor...</p>
    </div>
  </div>
);

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={<Navigate to="/network" replace />}
        />
        <Route
          path="/network"
          element={
            <ProtectedRoute>
              <NetworkMapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sensors"
          element={
            <ProtectedRoute>
              <SensorDataPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/status"
          element={
            <ProtectedRoute>
              <SystemStatusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/predictions"
          element={
            <ProtectedRoute>
              <PredictionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;