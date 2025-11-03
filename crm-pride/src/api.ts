import axios from 'axios';

export const API_BASE_URL = 'http://127.0.0.1:8000/api/';
// export const API_BASE_URL = 'http://77.95.201.169:8000/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Добавляем интерсептор для авторизации
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Типы для пользователя
export interface User {
  user_id: number;
  nickname: string;
  tg_nick: string;
  photo: string;
  email: string;
  date_of_birth: string;
  phone_number: string;
  status: boolean;
  is_admin: boolean;
  is_banned: boolean;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface UpdateUserData {
  nickname?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  date_of_birth?: string;
  phone?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  nickname: string;
  username: string;
  email: string;
  date_of_birth: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// export const authAPI = {
//   register: (userData: RegisterData) => api.post<AuthResponse>('register/', userData),
//   login: (credentials: LoginCredentials) => api.post<AuthResponse>('login/', credentials),
//   getMe: () => api.get<User>('me/'),
// };

export const tournamentAPI = {
  getTournaments: () => api.get('tournaments/'),
  getTournament: (id: number) => api.get(`tournaments/${id}/`),
  createTournament: (tournamentData: any) => api.post('tournaments/', tournamentData),
  updateTournament: (id: number, tournamentData: any) => api.put(`tournaments/${id}/`, tournamentData),
  deleteTournament: (id: number) => api.delete(`tournaments/${id}/`),
  registerForTournament: (tournamentId: number, userId: number) => 
    api.post(`tournaments/${tournamentId}/register/`, { user_id: userId }),
  getTournamentParticipants: (tournamentId: number) => 
    api.get(`tournaments/${tournamentId}/participants/`),
  getUpcomingTournaments: () => api.get('tournaments/upcoming/'),
  getCompletedTournaments: () => api.get('tournaments/completed/'),
};

export const rankAPI = {
  getRankings: () => api.get('rank/'),
};

export const userAPI = {
  // Получение пользователей
  getUsers: () => api.get<User[]>('users/'),
  getUser: (id: number) => api.get<User>(`users/${id}/`),
  
  // Обновление пользователей
  updateUser: (id: number, userData: UpdateUserData) => 
    api.put<User>(`users/${id}/`, userData),
  
  updateUserPartial: (id: number, userData: Partial<UpdateUserData>) => 
    api.patch<User>(`users/${id}/`, userData),
  
  // Обновление текущего пользователя
  updateCurrentUser: (userData: UpdateUserData) => 
    api.put<User>('users/me/update/', userData),
  
  updateCurrentUserPartial: (userData: Partial<UpdateUserData>) => 
    api.patch<User>('users/me/update/', userData),
  
  // Обновление аватара
  updateAvatar: (photoId: string) => 
    api.patch<User>('me/avatar/', { photo_id: photoId }),
  
  // Получение лидеров
  getLeaders: () => api.get<User[]>('users/leaders/'),
  
  // Удаление пользователя (только для админов)
  deleteUser: (id: number) => api.delete(`users/${id}/`),
};

// Дополнительные API методы
export const participantAPI = {
  getParticipants: () => api.get('participants/'),
  createParticipant: (data: any) => api.post('participants/', data),
};

// Интерсептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response?.status === 401) {
    //   // Перенаправление на страницу логина или обновление токена
    //   localStorage.removeItem('token');
    //   window.location.href = '/login';
    // }
    return Promise.reject(error);
  }
);
export const authAPI = {
  register: (userData: any) => api.post<AuthResponse>('register/', userData),
  login: (credentials: LoginCredentials) => api.post<AuthResponse>('login/', credentials),
  getMe: () => api.get<User>('me/'),
  
  // Telegram auth methods
  telegramAuthRequest: (data: { redirect_url?: string }) => 
    api.post<{ auth_url: string; auth_hash: string }>('telegram-auth/request_login/', data),
  
  telegramAuthVerify: (data: { telegram_data: any; auth_hash: string }) => 
    api.post<AuthResponse>('telegram-auth/verify_login/', data),
};

export default api;