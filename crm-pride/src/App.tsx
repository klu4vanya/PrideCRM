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
  const { initData, isReady } = useTelegram(); // Добавлен isReady
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const authenticateAndLoadProfile = async () => {
      // Ждем пока Telegram инициализируется
      if (!isReady) {
        console.log("⏳ Waiting for Telegram initialization...");
        return;
      }

      try {
        if (!initData) {
          console.warn("⚠️ No initData available");
          // На мобильных initData может быть пустым, но приложение должно работать
          setLoading(false);
          return;
        }

        console.log("🔄 Authenticating with initData...");
        console.log("initData length:", initData.length);

        const authResponse = await authAPI.telegramInitAuth(initData);
        console.log("✅ Auth response received");

        if (authResponse.data && authResponse.data.token) {
          localStorage.setItem("auth_token", authResponse.data.token);
          console.log("🔑 Token saved successfully");
          setLoading(false);
        } else {
          throw new Error("No token in response from server");
        }

      } catch (error: any) {
        console.error("❌ Authentication error:", error);
        
        // Для network errors пробуем ретрай
        if (error.message.includes('Network') && retryCount < 3) {
          console.log(`🔄 Retrying authentication (${retryCount + 1}/3)`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 1000 * (retryCount + 1));
          return;
        }
        
        setAuthError(error.response?.data?.error || error.message || "Unknown error");
        setLoading(false);
      }
    };

    authenticateAndLoadProfile();
  }, [initData, isReady, retryCount]);

  // Если Telegram не готов, показываем загрузку
  if (!isReady) {
    return (
      <Loader>
        <div>⏳ Инициализация Telegram...</div>
        <div style={{ fontSize: "14px", color: "#666" }}>
          Подготовка приложения
        </div>
      </Loader>
    );
  }

  if (loading) {
    return (
      <Loader>
        <div>⏳ Загрузка Poker CRM...</div>
        <div style={{ fontSize: "14px", color: "#666" }}>
          {initData ? `Аутентификация... ${retryCount > 0 ? `(Попытка ${retryCount})` : ''}` : "Режим без аутентификации"}
        </div>
      </Loader>
    );
  }

  if (authError) {
    return (
      <Loader>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h2 style={{ color: "#fff" }}>❌ Ошибка</h2>
          <p style={{ color: "#fff" }}>{authError}</p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
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
              Обновить
            </button>
            <button
              onClick={() => {
                setAuthError(null);
                setLoading(true);
                setRetryCount(0);
              }}
              style={{
                background: "#666",
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