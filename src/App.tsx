import { Suspense, useState } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import LoginPage from "./components/auth/LoginPage";
import AdminSettings from "./components/admin/AdminSettings";
import routes from "tempo-routes";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState<
    "Technician" | "Administrator" | "BackOffice"
  >("Technician");

  const handleLogin = (username: string, role: string) => {
    setIsAuthenticated(true);
    setUserName(username);
    setUserRole(role as "Technician" | "Administrator" | "BackOffice");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName("");
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Home initialUserRole={userRole} userName={userName} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin/settings"
            element={
              isAuthenticated && userRole === "Administrator" ? (
                <AdminSettings />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
