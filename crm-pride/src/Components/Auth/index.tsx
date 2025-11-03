import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #0b0c10;
  color: #fff;
  font-family: "Poppins", sans-serif;
`;

const Card = styled.div`
  background: #1f2833;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
  text-align: center;
  width: 90%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #66fcf1;
`;

const Button = styled.a`
  background: #45a29e;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  text-decoration: none;
  transition: 0.2s;

  &:hover {
    background: #66fcf1;
    color: #0b0c10;
  }
`;

const Message = styled.p`
  margin-top: 20px;
  color: #c5c6c7;
  font-size: 14px;
`;

const AuthPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const BOT_USERNAME = "pride_auth_bot"; // ← замени на имя твоего бота

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");

    if (t) {
      localStorage.setItem("auth_token", t);
      setToken(t);
      window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
    } else {
      const saved = localStorage.getItem("auth_token");
      if (saved) setToken(saved);
    }
  }, []);

  // 🔍 Проверка роли при наличии токена
  useEffect(() => {
    if (!token) {
      return;
    }
    setLoading(true);
  
    fetch("http://127.0.0.1:8000/api/me/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data?.role === "admin") navigate("/admin");
        else navigate("/myprofile");
      })
      .catch((err) => {
        localStorage.removeItem("auth_token");
        setToken(null);
      })
      .finally(() => {

        setLoading(false);
      });
  }, [token, navigate]);
  

  return (
    <Container>
      <Card>
        <Title>Poker CRM — Авторизация</Title>

        {!token ? (
          <>
            <Button
              href={`https://t.me/${BOT_USERNAME}?start=auth`}
              // target="_blank"
              rel="noopener noreferrer"
            >
              Войти через Telegram
            </Button>
            <Message>
              После авторизации в Telegram вы вернётесь на сайт автоматически.
            </Message>
          </>
        ) : (
          <>
            <h2>✅ Авторизация...</h2>
            {loading ? (
              <Message>Проверяем ваш профиль ⏳</Message>
            ) : (
              <Message>Добро пожаловать!</Message>
            )}
          </>
        )}
      </Card>
    </Container>
  );
};

export default AuthPage;
