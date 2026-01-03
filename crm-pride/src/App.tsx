import React, { useEffect, useState } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import styled from "styled-components";
import { useTelegram } from "./hooks/useTelegram";
import { authAPI } from "./utils/api";

import Layout from "./components/Layout";
import Schedule from "./pages/Schedule";
import Rating from "./pages/Rating";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Support from "./pages/Support";
import AdminPage from "./pages/Admin";

const Loader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
  gap: 15px;
  color: white;
  background: black;
`;

const App: React.FC = () => {
  const { initData, isTelegram, isReady } = useTelegram();

  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // 🔐 АВТОРИЗАЦИЯ ЧЕРЕЗ initData (Mini App)
  // ======================================================
  useEffect(() => {
    const runAuth = async () => {
      try {
        // 1. Если Telegram ещё НЕ готов — ждать
        if (isTelegram && !isReady) {
          return;
        }

        // 3. Если токен уже есть
        const existing = localStorage.getItem("auth_token");
        if (existing) {
          setLoading(false);
          return;
        }

        // 4. Авторизация через initData
        if (isTelegram) {
          if (!initData)
            throw new Error(
              "initData is empty — Telegram did not provide auth payload"
            );

          const response = await authAPI.telegramInitAuth(initData);

          if (!response.data?.token) {
            throw new Error("No token in API response");
          }

          setTimeout(() => {
            try {
              localStorage.setItem("auth_token", response.data.token);
            } catch (e) {
              console.warn("localStorage error:", e);
            }
          }, 300);
          setLoading(false);
          return;
        }

        // 5. Если не Telegram — просто загрузить сайт
        setLoading(false);
      } catch (err: any) {
        setAuthError(
          err.response?.data?.error || err.message || "Unknown error"
        );
        setLoading(false);
      }
    };

    runAuth();
  }, [initData, isReady, isTelegram]);

  // ======================================================
  // LOADING
  // ======================================================
  if (loading) {
    return (
      <Loader>
        <div>⏳ Загрузка...</div>
        <div style={{ fontSize: 14, opacity: 0.7 }}>
          {isTelegram ? "Ожидание Telegram WebApp…" : "Ожидание…"}
        </div>
      </Loader>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================
  if (authError) {
    return (
      <Loader>
        <h2>❌ Ошибка авторизации</h2>
        <p>{authError}</p>

        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 12,
            padding: "10px 18px",
            borderRadius: 8,
            background: "#2196F3",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Перезапустить
        </button>
      </Loader>
    );
  }

  // ======================================================
  // APP CONTENT
  // ======================================================
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route index element={<Schedule />} />
          <Route path="/" element={<Schedule />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
