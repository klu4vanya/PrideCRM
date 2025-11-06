import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ratingAPI } from '../utils/api';
import { useTelegram } from '../hooks/useTelegram';

const RatingTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RatingItem = styled.div<{ top3: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: ${props => props.top3 ? '#fff3cd' : 'white'};
  border: ${props => props.top3 ? '2px solid #ffc107' : '1px solid #e0e0e0'};
  border-radius: 10px;
  font-weight: ${props => props.top3 ? 'bold' : 'normal'};
`;

const Rank = styled.span`
  font-size: 1.2em;
  min-width: 30px;
`;

const UserInfo = styled.div`
  flex: 1;
  margin-left: 12px;
`;

const Points = styled.span`
  font-weight: bold;
  color: #2196F3;
`;

interface RatingUser {
  rank: number;
  user: {
    user_id: string;
    username: string;
    first_name: string;
    last_name: string;
    points: number;
    total_games_played: number;
  };
  points: number;
  games_played: number;
}

const Rating: React.FC = () => {
  const [rating, setRating] = useState<RatingUser[]>([]);
  const [loading, setLoading] = useState(true);
   const { isTelegram, showAlert } = useTelegram();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (isTelegram && !token) {
      setIsAuthenticated(false);
      showAlert('Требуется авторизация. Перезапустите приложение.');
    }
    loadRating();
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

  const loadRating = async () => {
    try {
      const response = await ratingAPI.getRating();
      setRating(response.data);
    } catch (error) {
      console.error('Error loading rating:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Загрузка рейтинга...</div>;

  return (
    <div>
      <h2>🏆 Рейтинг игроков</h2>
      <RatingTable>
        {rating.map((item) => (
          <RatingItem key={item.user.user_id} top3={item.rank <= 3}>
            <Rank>
              {item.rank === 1 ? '🥇' : 
               item.rank === 2 ? '🥈' : 
               item.rank === 3 ? '🥉' : item.rank}
            </Rank>
            <UserInfo>
              <div>{item.user.first_name} {item.user.last_name}</div>
              <div style={{ fontSize: '0.8em', color: '#666' }}>
                @{item.user.username} • Игр: {item.user.total_games_played}
              </div>
            </UserInfo>
            <Points>{item.points} очков</Points>
          </RatingItem>
        ))}
      </RatingTable>
    </div>
  );
};

export default Rating;