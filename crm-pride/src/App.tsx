import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { useTelegram } from './hooks/useTelegram';
import { authAPI, gamesAPI } from './utils/api';
import Layout from './components/Layout';
import Schedule from './pages/Schedule';
import Rating from './pages/Rating';
import Profile from './pages/Profile';
import About from './pages/About';
import Support from './pages/Support';

const DebugContainer = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 15px;
  margin: 10px;
  font-family: monospace;
  font-size: 14px;
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;
`;

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
  const { user, isTelegram, showAlert } = useTelegram();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const addDebug = (message: string) => {
    setDebugInfo(prev => prev + message + '\n');
  };

  useEffect(() => {
    const authenticate = async () => {
      addDebug('🔍 Начало аутентификации...');
      
      try {
        addDebug(`isTelegram: ${isTelegram}`);
        addDebug(`User: ${JSON.stringify(user, null, 2)}`);

        // Если не в Telegram - пропускаем аутентификацию
        if (!isTelegram) {
          addDebug('🚫 Не в Telegram окружении');
          setLoading(false);
          return;
        }

        // Проверяем данные пользователя
        if (!user || !user.id) {
          addDebug('❌ Нет данных пользователя от Telegram');
          setAuthError('Не удалось получить данные из Telegram');
          setLoading(false);
          return;
        }

        addDebug('✅ Данные пользователя получены');

        // Проверяем, есть ли уже токен
        const existingToken = localStorage.getItem('auth_token');
        addDebug(`Токен в localStorage: ${existingToken ? 'ЕСТЬ' : 'НЕТ'}`);

        if (existingToken) {
          // Проверяем валидность токена
          try {
            addDebug('🔍 Проверяем существующий токен...');
            await gamesAPI.getGames();
            addDebug('✅ Токен валиден');
            setLoading(false);
            return;
          } catch (error) {
            addDebug('❌ Токен невалиден, удаляем...');
            localStorage.removeItem('auth_token');
          }
        }

        // Аутентифицируемся
        addDebug('🔄 Отправляем запрос аутентификации...');
        
        const authPayload = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name || '',
          username: user.username || '',
          language_code: user.language_code || 'ru',
        };

        addDebug(`📤 Данные для отправки: ${JSON.stringify(authPayload, null, 2)}`);

        const response = await authAPI.telegramAuth(authPayload);
        
        addDebug(`✅ Ответ от сервера: ${response.status}`);
        addDebug(`📨 Данные ответа: ${JSON.stringify(response.data, null, 2)}`);

        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
          addDebug('🔑 Токен успешно сохранен!');
          showAlert('✅ Авторизация успешна!');
        } else {
          throw new Error('Нет токена в ответе');
        }

      } catch (error: any) {
        addDebug(`❌ Ошибка: ${error.message}`);
        
        if (error.response) {
          addDebug(`Ошибка сервера: ${error.response.status}`);
          addDebug(`Детали: ${JSON.stringify(error.response.data)}`);
          setAuthError(`Ошибка сервера: ${error.response.status}`);
        } else if (error.request) {
          addDebug('Нет ответа от сервера');
          setAuthError('Не удалось подключиться к серверу');
        } else {
          addDebug(`Другая ошибка: ${error.message}`);
          setAuthError(error.message);
        }
        
        showAlert('❌ Ошибка авторизации');
      } finally {
        setLoading(false);
      }
    };

    // Даем время на инициализацию Telegram
    setTimeout(authenticate, 1000);
  }, [user, isTelegram, showAlert]);

  const handleRetry = () => {
    localStorage.removeItem('auth_token');
    setLoading(true);
    setAuthError(null);
    setDebugInfo('');
    window.location.reload();
  };

  if (loading) {
    return (
      <Loader>
        <div>⏳ Загрузка Poker CRM...</div>
        <DebugContainer>
          {debugInfo || 'Инициализация...'}
        </DebugContainer>
      </Loader>
    );
  }

  if (authError) {
    return (
      <Loader>
        <div style={{ color: 'red', marginBottom: '15px' }}>❌ {authError}</div>
        <DebugContainer>
          {debugInfo}
        </DebugContainer>
        <button 
          onClick={handleRetry}
          style={{
            background: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '15px'
          }}
        >
          Попробовать снова
        </button>
      </Loader>
    );
  }

  return (
    <Router>
      <Layout>
        {/* Показываем debug info в разработке */}
        {process.env.NODE_ENV === 'development' && debugInfo && (
          <DebugContainer>
            <strong>Debug Info:</strong>
            <br />
            {debugInfo}
          </DebugContainer>
        )}
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