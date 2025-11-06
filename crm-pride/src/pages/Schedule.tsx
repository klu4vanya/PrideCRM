import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { gamesAPI } from '../utils/api';
import { useTelegram } from '../hooks/useTelegram';

const GamesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const GameCard = styled.div`
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  padding: 16px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const GameHeader = styled.h3`
  margin: 0 0 8px 0;
  color: #333;
`;

const GameInfo = styled.p`
  margin: 4px 0;
  color: #666;
`;

const RegisterButton = styled.button<{ registered: boolean }>`
  background: ${props => props.registered ? '#4CAF50' : '#2196F3'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    opacity: 0.9;
  }
`;

interface Game {
  game_id: number;
  date: string;
  time: string;
  description: string;
  buyin: string;
  reentry_buyin: string;
  location: string;
  participants_count: number;
}

const Schedule: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
   const { isTelegram, showAlert } = useTelegram();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (isTelegram && !token) {
      setIsAuthenticated(false);
      showAlert('Требуется авторизация. Перезапустите приложение.');
    }
     loadGames();
  }, [isTelegram, showAlert]);

  if (!isAuthenticated && isTelegram) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>❌ Требуется авторизация</h3>
        <p>Перезапустите приложение через Telegram бота</p>
      </div>
    );
  }

  // useEffect(() => {
   
  // }, []);

  const loadGames = async () => {
    try {
      const response = await gamesAPI.getGames();
      setGames(response.data);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (gameId: number) => {
    try {
      await gamesAPI.registerForGame(gameId);
      alert('Успешно зарегистрировались на игру!');
      loadGames(); // Перезагружаем список
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка регистрации');
    }
  };

  if (loading) return <div>Загрузка расписания...</div>;

  return (
    <div>
      <h2>📅 Расписание игр</h2>
      <GamesList>
        {games.map((game) => (
          <GameCard key={game.game_id}>
            <GameHeader>{game.description}</GameHeader>
            <GameInfo>📅 Дата: {game.date}</GameInfo>
            <GameInfo>⏰ Время: {game.time}</GameInfo>
            <GameInfo>💰 Взнос: {game.buyin} ₽</GameInfo>
            <GameInfo>📍 Место: {game.location}</GameInfo>
            <GameInfo>👥 Участников: {game.participants_count}</GameInfo>
            <RegisterButton
              registered={false}
              onClick={() => handleRegister(game.game_id)}
            >
              Зарегистрироваться
            </RegisterButton>
          </GameCard>
        ))}
      </GamesList>
    </div>
  );
};

export default Schedule;