import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { authAPI, gamesAPI } from "../utils/api";
import { useTelegram } from "../hooks/useTelegram";
import { ReactComponent as CalendarIcon } from "../assets/calendar.svg";
import { ReactComponent as Clock } from "../assets/clock.svg";
import { ReactComponent as HandsCoin } from "../assets/hand-coins.svg";
import { ReactComponent as User } from "../assets/user.svg";


export const ScheduleContainer = styled.div`
  padding: 20px;
  height: 16%;
  background-color: #E0A65D;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 3%;
  width: 80%;
  height: 50px;

  span {
    color: #fff;
    font-size: 20px;
  }
`;

const GamesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
`;

const GameDataContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  gap: 16px;
  padding: 16px;
`;

const GameCard = styled.div`
  padding: 16px;
  border-radius: 10px;
  background: #282c34;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const GameHeader = styled.h3`
  margin: 0 0 8px 0;
  color: #fff;
`;

const GameInfo = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: inherit;
  margin: 4px 0;
  color: #9f9fa9;
  svg {
    color: #E0A65D;
  }
`;

const PrizeAndButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  background-color: rgb(14, 14, 14);
  padding: 10px 0 10px 0;
  border-radius: 10px;
`;

const PrizeFoundContainer = styled.div`
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const RegisterButton = styled.button`
  background: #E0A65D;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
  participants_details?: Array<{
    user: {
      user_id: string;
      username: string;
      first_name?: string;
      last_name?: string;
    };
  }>;
}

interface UserData {
  user_id: string;
  username: string;
  first_name?: string;
  last_name?: string;
}

const Game_test: Game = {
  game_id: 1,
  date: "19.11.2025",
  time: "19:00",
  description: "Discipline tournament",
  buyin: "1000",
  reentry_buyin: "1000",
  location: "msk",
  participants_count: 1,
};

const Schedule: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const { initData } = useTelegram();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [registeringGameId, setRegisteringGameId] = useState<number | null>(null);
  const [unregisteringGameId, setUnregisteringGameId] = useState<number | null>(null);

  // Получаем данные текущего пользователя
  const getCurrentUser = useCallback((): UserData | null => {
    if (currentUser) return currentUser;
    
    try {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
    
    return null;
  }, [currentUser]);

  // Проверяем, зарегистрирован ли пользователь на игру
  const isUserRegistered = useCallback((game: Game): boolean => {
    const user = getCurrentUser();
    if (!user || !game.participants_details) return false;
    
    return game.participants_details.some(
      participant => participant.user.user_id === user.user_id
    );
  }, [getCurrentUser]);

  const loadGames = useCallback(async () => {
    try {
      const response = await gamesAPI.getGames();
      setGames(response.data);
    } catch (error) {
      console.error("Error loading games:", error);
      setGames([Game_test]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const authenticateAndLoadProfile = async () => {
      try {
        if (initData) {
          console.log("🔄 Authenticating with initData...");

          const authResponse = await authAPI.telegramInitAuth(initData);
          console.log("✅ Auth response:", authResponse.data);

          if (authResponse.data.token) {
            localStorage.setItem("auth_token", authResponse.data.token);
            console.log("🔑 Token saved");

            // Сохраняем данные пользователя
            if (authResponse.data.user) {
              const userData: UserData = {
                user_id: authResponse.data.user.telegram_id || 
                         authResponse.data.user.id || 
                         authResponse.data.user.user_id,
                username: authResponse.data.user.username || `user_${authResponse.data.user.id}`,
                first_name: authResponse.data.user.first_name,
                last_name: authResponse.data.user.last_name
              };
              setCurrentUser(userData);
              localStorage.setItem('user_data', JSON.stringify(userData));
            }

            await loadGames();
          }
        } else {
          throw new Error("No initData available");
        }
      } catch (error: any) {
        console.error("❌ Authentication error:", error);
        await loadGames();
      } finally {
        setLoading(false);
      }
    };
    authenticateAndLoadProfile();
  }, [initData, loadGames]);

  const handleRegistration = useCallback((gameId: number, isCurrentlyRegistered: boolean) => async () => {
    if (isCurrentlyRegistered) {
      if (!window.confirm("Вы уверены, что хотите отменить регистрацию?")) return;

      try {
        setUnregisteringGameId(gameId);
        await gamesAPI.discardRegisterForGame(gameId);
        alert("Успешно отменили запись на игру!");
        await loadGames();
      } catch (error: any) {
        alert(error.response?.data?.error || "Ошибка отмены регистрации");
      } finally {
        setUnregisteringGameId(null);
      }
    } else {
      try {
        setRegisteringGameId(gameId);
        await gamesAPI.registerForGame(gameId);
        alert("Успешно зарегистрировались на игру!");
        await loadGames();
      } catch (error: any) {
        alert(error.response?.data?.error || "Ошибка регистрации");
      } finally {
        setRegisteringGameId(null);
      }
    }
  }, [loadGames]);

  if (loading) return <div>Загрузка расписания...</div>;

  return (
    <>
      <ScheduleContainer>
        <Title>
          <CalendarIcon stroke="#fff" />
          <span>Расписание игр на неделю</span>
        </Title>
      </ScheduleContainer>
      <GamesList>
        {games.map((game) => {
          const userRegistered = isUserRegistered(game);
          const isGameLoading = registeringGameId === game.game_id || unregisteringGameId === game.game_id;
          
          return (
            <GameCard key={game.game_id}>
              <GameHeader>{game.description}</GameHeader>
              <GameDataContainer>
                <GameInfo>
                  <CalendarIcon />
                  {game.date}
                </GameInfo>
                <GameInfo>
                  <Clock />
                  {game.time}
                </GameInfo>
                <GameInfo>
                  <HandsCoin />
                  {game.buyin}
                </GameInfo>
                <GameInfo>
                  <User />
                  {game.participants_count}
                </GameInfo>
              </GameDataContainer>
              <PrizeAndButtonContainer>
                <PrizeFoundContainer>
                  <GameInfo>Всего очков</GameInfo>
                  <GameHeader>320</GameHeader>
                </PrizeFoundContainer>
                <RegisterButton
                  onClick={handleRegistration(game.game_id, userRegistered)}
                  disabled={isGameLoading || !currentUser}
                  style={{
                    background: userRegistered ?  "#d03f05" : "#E0A65D",
                    opacity: !currentUser ? 0.5 : 1
                  }}
                >
                  {isGameLoading
                    ? "Загрузка..."
                    : !currentUser
                    ? "Войдите в аккаунт"
                    : userRegistered
                    ? "Отмена регистрации"
                    : "Зарегистрироваться"}
                </RegisterButton>
              </PrizeAndButtonContainer>
            </GameCard>
          );
        })}
      </GamesList>
    </>
  );
};

export default Schedule;