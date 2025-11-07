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
  const { user, isTelegram, webApp, showAlert } = useTelegram();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🔍 App initialization started');
      console.log('🔍 isTelegram:', isTelegram);
      console.log('🔍 WebApp:', webApp);
      console.log('🔍 User:', user);
      console.log('🔍 URL search:', window.location.search);

      try {
        // 1. ВСЕГДА проверяем токен из URL (и в Mini App, и в браузере)
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get("token");
        
        console.log('🔑 Token from URL:', tokenFromUrl);

        if (tokenFromUrl) {
          localStorage.setItem("auth_token", tokenFromUrl);
          console.log("✅ Token from URL saved to localStorage");
          // Очищаем URL
          window.history.replaceState({}, "", window.location.pathname);
          setLoading(false);
          return;
        }

        // 2. Проверяем существующий токен
        const existingToken = localStorage.getItem("auth_token");
        if (existingToken) {
          console.log("✅ Using existing token from localStorage");
          setLoading(false);
          return;
        }

        // 3. Если в Telegram Mini App, но нет токена - аутентифицируемся
        if (isTelegram && user) {
          console.log("🔐 Starting Telegram authentication...", user);

          const response = await authAPI.telegramAuth({
            id: user.id,
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            username: user.username || "",
            language_code: user.language_code || "ru",
          });

          console.log("🔑 Auth response:", response.data);

          if (response.data.token) {
            localStorage.setItem("auth_token", response.data.token);
            console.log("✅ Telegram authentication successful");
            showAlert("✅ Авторизация успешна!");
          } else {
            throw new Error("No token in response");
          }
        } else if (isTelegram && !user) {
          console.log("⏳ Waiting for Telegram user data...");
          // Пробуем еще раз через секунду
          setTimeout(() => setLoading(false), 1000);
          return;
        } else {
          console.log("🚫 Not in Telegram - showing public version");
        }

      } catch (error: any) {
        console.error("❌ Auth error:", error);
        
        let errorMessage = "Неизвестная ошибка авторизации";
        
        if (error.response) {
          errorMessage = error.response.data?.detail || error.response.data?.error || "Ошибка сервера";
        } else if (error.request) {
          errorMessage = "Не удалось подключиться к серверу";
        } else {
          errorMessage = error.message;
        }
        
        setAuthError(errorMessage);
        
        if (isTelegram) {
          showAlert(`❌ Ошибка авторизации: ${errorMessage}`);
        }
      } finally {
        setLoading(false);
      }
    };

    // Даем время на инициализацию
    setTimeout(initializeApp, 1000);
  }, [user, isTelegram, webApp, showAlert]);

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
              marginTop: "15px"
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