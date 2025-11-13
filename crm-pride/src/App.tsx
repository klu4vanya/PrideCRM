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
  const { initData, isTelegram, showAlert } = useTelegram();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      console.log("🔍 initData:", initData);

      // Если уже есть токен — просто продолжаем
      const existingToken = localStorage.getItem("auth_token");
      if (existingToken) {
        setLoading(false);
        return;
      }

      // Если в Telegram и есть initData — авторизуемся
      if (isTelegram && initData) {
        try {
          const response = await authAPI.telegramInitAuth(initData);
          const token = response.data.token;

          localStorage.setItem("auth_token", token);
          console.log("✅ Telegram auth successful");
        } catch (err: any) {
          console.error("❌ Telegram auth error:", err);
          setAuthError(err);
          showAlert("Ошибка авторизации");
        }
      }

      setLoading(false);
    };

    if (!loading) return;
    setTimeout(initializeApp, 1000);
  }, [isTelegram, initData, showAlert, loading]);

  if (loading) {
    return (
      <Loader>
        <div>⏳ Загрузка Poker CRM...</div>
        <div style={{ fontSize: "14px", color: "#666" }}>
          {isTelegram ? "Инициализация Telegram..." : "Загрузка..."}
        </div>
      </Loader>
    );
  }

  if (authError) {
    return (
      <Loader>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h2>❌ Ошибка авторизации</h2>
          <p>{authError}</p>
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
