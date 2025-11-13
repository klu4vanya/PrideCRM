import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import { useTelegram } from "./hooks/useTelegram";
import { authAPI } from "./utils/api";
import Layout from "./components/Layout";
import Schedule from "./pages/Schedule";
import Rating from "./pages/Rating";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Support from "./pages/Support";

const Loader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
  gap: 15px;
`;

const App: React.FC = () => {
  const { initData } = useTelegram();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [token, setToken] = useState(); // для дебага

  useEffect(() => {
    const authenticateAndLoadProfile = async () => {
      try {
        if (initData) {
          console.log("🔄 Authenticating with initData...");

          const authResponse = await authAPI.telegramInitAuth(initData);
          console.log("✅ Auth response:", authResponse.data);

          if (authResponse.data.token) {
            localStorage.setItem("auth_token", authResponse.data.token);
            console.log("🔑 Token saved");
            setToken(authResponse.data);
          }
        } else {
          throw new Error("No token in response", token);
        }
      } catch (error: any) {
        console.error("❌ Authentication error:", error);
        setAuthError(error.response?.data?.error || error.message);
      } finally {
        setLoading(false);
      }
    };
    authenticateAndLoadProfile();
  }, [initData]);

  if (loading) {
    return (
      <Loader>
        <div>⏳ Загрузка Poker CRM...</div>
        <div style={{ fontSize: "14px", color: "#666" }}>
          {initData ? "авторизация успешна" : "auth failed"}
        </div>
      </Loader>
    );
  }

  if (authError) {
    return (
      <Loader>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h2 style={{ color: "#fff" }}>❌ Ошибка авторизации</h2>
          <p style={{ color: "#fff" }}>{authError}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#2196f3",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "15px",
            }}
          >
            Попробовать снова
          </button>
        </div>
      </Loader>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Schedule />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
