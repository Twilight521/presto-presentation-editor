import "./App.css";
import { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar/Navbar";
import LandingPage from "./pages/LandingPage/LandingPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import EditPage from "./pages/EditPage/EditPage";
import PreviewPage from "./pages/PreviewPage/PreviewPage";

function App() {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });
  const navigate = useNavigate();
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/presentation/preview/");

  function handleLogin(token: string) {
    localStorage.setItem("token", token);
    setToken(token);
    navigate("/dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  }

  return (
    <div className="appContainer">
      {!hideNavbar && <Navbar token={token} onLogout={handleLogout} />}
      <div className={`page ${hideNavbar ? "pageNoNavbar" : ""}`}>
        <Routes>
          <Route
            path="/"
            element={<LandingPage token={token} onLogout={handleLogout} />}
          />
          <Route
            path="/login"
            element={<LoginPage successCallback={handleLogin} />}
          />
          <Route
            path="/register"
            element={<RegisterPage successCallback={handleLogin} />}
          />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/presentation/edit/:presentationId/:slideNumber"
            element={<EditPage />}
          />
          <Route
            path="/presentation/preview/:presentationId/:slideNumber"
            element={<PreviewPage />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
