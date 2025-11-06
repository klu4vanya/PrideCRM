import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Интерцептор для добавления токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const authAPI = {
  telegramAuth: (telegramData: any) => {
    // Правильный формат - распаковываем данные
    const requestData = {
      telegram_data: {
        id: telegramData.id,
        first_name: telegramData.first_name,
        last_name: telegramData.last_name || '',
        username: telegramData.username || '',
        language_code: telegramData.language_code || 'ru'
      }
    };
    
    console.log('🔄 Sending auth request:', requestData);
    return api.post('/auth/telegram/', requestData);
  },
};

export const gamesAPI = {
  getGames: () => api.get('/games/'),
  getGame: (id: number) => api.get(`/games/${id}/`),
  registerForGame: (gameId: number) => 
    api.post('/participants/register/', { game_id: gameId }),
};

export const ratingAPI = {
  getRating: () => api.get('/rating/'),
};

export const profileAPI = {
  getProfile: () => api.get('/profile/'),
  updateProfile: (data: any) => api.patch('/profile/', data),
};

export const supportAPI = {
  createTicket: (data: { subject: string; message: string }) =>
    api.post('/support-tickets/', data),
  getTickets: () => api.get('/support-tickets/'),
};