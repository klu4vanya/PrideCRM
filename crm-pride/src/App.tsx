import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { useTelegram } from './hooks/useTelegram';
import { authAPI } from './utils/api';
import Layout from './components/Layout';
import Schedule from './pages/Schedule';
import Rating from './pages/Rating';
import Profile from './pages/Profile';
import About from './pages/About';
import Support from './pages/Support';

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
`;

const App: React.FC = () => {
  const { user, isTelegram } = useTelegram();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      if (!isTelegram || !user) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.telegramAuth({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
        });
        
        localStorage.setItem('auth_token', response.data.token);
        setLoading(false);
      } catch (error: any) {
        console.error('Auth error:', error);
        setAuthError(error.response?.data?.error || 'Authentication failed');
        setLoading(false);
      }
    };

    authenticate();
  }, [user, isTelegram]);

  if (loading) {
    return <Loader>⏳ Загрузка приложения...</Loader>;
  }

  if (authError) {
    return (
      <Loader>
        ❌ Ошибка авторизации: {authError}
        <br />
        <button onClick={() => window.location.reload()}>
          Попробовать снова
        </button>
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