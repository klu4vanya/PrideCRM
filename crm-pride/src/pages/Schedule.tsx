import React, { useEffect, useState } from "react";
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
  background-color: rgb(234, 50, 0);
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
  background: rgb(19, 19, 21);
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
    color: rgb(249, 79, 0);
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
  /* width: 50px; */
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`

const RegisterButton = styled.button<{ registered: boolean }>`
  background: ${(props) => (props.registered ? "#4CAF50" : "rgb(249, 79, 0)")};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;

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
  const [authError, setAuthError] = useState<string | null>(null);

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

            await loadGames();
          }
        } else {
          throw new Error("No token in response");
        }
      } catch (error: any) {
        console.error("❌ Authentication error:", error);
        setAuthError(error.response?.data?.error || error.message);
        console.log(authError);
        loadGames(); //
      } finally {
        setLoading(false);
      }
    };
    authenticateAndLoadProfile();
  }, [initData, authError]);

  const loadGames = async () => {
    try {
      const response = await gamesAPI.getGames();
      setGames(response.data);
    } catch (error) {
      console.error("Error loading games:", error);
      setGames([Game_test]); //
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (gameId: number) => {
    try {
      await gamesAPI.registerForGame(gameId);
      alert("Успешно зарегистрировались на игру!");
      loadGames(); // Перезагружаем список
    } catch (error: any) {
      alert(error.response?.data?.error || "Ошибка регистрации");
    }
  };

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
        {games.map((game) => (
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
                <GameInfo>
                  Всего очков
                </GameInfo>
                <GameHeader>
                  320
                </GameHeader>
              </PrizeFoundContainer>
              <RegisterButton
                registered={false}
                onClick={() => handleRegister(game.game_id)}
              >
                Зарегистрироваться
              </RegisterButton>
            </PrizeAndButtonContainer>
          </GameCard>
        ))}
      </GamesList>
    </>
  );
};

export default Schedule;
