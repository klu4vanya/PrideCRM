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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
  gap: 15px;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 20px;
  max-width: 400px;
`;

const RetryButton = styled.button`
  background: #2196F3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 15px;

  &:hover {
    background: #1976D2;
  }
`;

const App: React.FC = () => {
  const { user, isTelegram, showAlert } = useTelegram();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        // Если не в Telegram - пропускаем аутентификацию (для разработки)
        if (!isTelegram) {
          console.log('🚫 Not in Telegram environment - development mode');
          setLoading(false);
          return;
        }

        // Проверяем, есть ли уже токен
        const existingToken = localStorage.getItem('auth_token');
        if (existingToken) {
          console.log('✅ Using existing token');
          setLoading(false);
          return;
        }

        if (!user) {
          throw new Error('No user data from Telegram');
        }

        console.log('🔐 Authenticating with Telegram...', user);
        
        // Аутентифицируемся через telegram_data (как в вашем API)
        const response = await authAPI.telegramAuth({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name || '',
          username: user.username || '',
          language_code: user.language_code || 'ru',
        });

        console.log('🔑 Auth response:', response.data);
        
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
          console.log('✅ Authentication successful');
        } else {
          throw new Error('No token in response');
        }

      } catch (error: any) {
        console.error('❌ Auth error:', error);
        
        // Более детальная обработка ошибок
        if (error.response) {
          // Ошибка от сервера
          const errorMessage = error.response.data?.detail || 
                              error.response.data?.error || 
                              'Ошибка сервера';
          setAuthError(`Ошибка сервера: ${errorMessage}`);
        } else if (error.request) {
          // Не удалось отправить запрос
          setAuthError('Не удалось подключиться к серверу. Проверьте подключение к интернету.');
        } else {
          // Другие ошибки
          setAuthError(error.message || 'Неизвестная ошибка авторизации');
        }
        
        showAlert('Ошибка авторизации. Перезапустите приложение.');
      } finally {
        setLoading(false);
      }
    };

    // Добавляем небольшую задержку для инициализации Telegram
    setTimeout(authenticate, 500);
  }, [user, isTelegram, showAlert]);

  const handleRetry = () => {
    localStorage.removeItem('auth_token');
    setLoading(true);
    setAuthError(null);
    window.location.reload();
  };

  const handleContinueWithoutAuth = () => {
    setLoading(false);
    setAuthError(null);
  };

  if (loading) {
    return (
      <Loader>
        <div>⏳ Загрузка Poker CRM...</div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          {isTelegram ? 'Выполняется авторизация...' : 'Инициализация...'}
        </div>
      </Loader>
    );
  }

  if (authError) {
    return (
      <Loader>
        <ErrorContainer>
          <h2>❌ Ошибка авторизации</h2>
          <p>{authError}</p>
          <RetryButton onClick={handleRetry}>
            Попробовать снова
          </RetryButton>
          {!isTelegram && (
            <>
              <div style={{ margin: '15px 0', color: '#666' }}>или</div>
              <RetryButton onClick={handleContinueWithoutAuth}>
                Продолжить без авторизации
              </RetryButton>
              <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
                💡 Для полного функционала запустите через Telegram бота
              </div>
            </>
          )}
        </ErrorContainer>
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