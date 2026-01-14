import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { authAPI, ratingAPI } from "../utils/api";
import { useTelegram } from "../hooks/useTelegram";
import { ScheduleContainer, Title } from "./Schedule";
import { ReactComponent as TrophyIcon } from "../assets/trophy.svg";

const TopPlayersContainer = styled.div`
  width: auto;
  height: 200px;
  display: flex;
  align-items: end;
  justify-content: space-evenly;
  padding: 10px;
`;
const TopPlayerInfoContainer = styled.div`
  width: 35%;
  height: 100px;
  border: 3px solid #FFF0B1;
  background-color: rgb(19, 19, 21);
  border-radius: 10px 10px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  h3,
  h4,
  h5 {
    margin: 0;
  }
`;
const PlayerInfoContainer = styled.div`
  width: 50%;
  height: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

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
  background: rgb(18, 19, 20);
  border: 2px solid rgb(29, 29, 32);
  border-radius: 10px;
  font-weight: ${(props) => (props.top3 ? "bold" : "normal")};
`;

const Rank = styled.span`
  font-size: 1.2em;
  min-width: 30px;
  color: #fff;
`;

const UserInfo = styled.div`
  flex: 1;
  margin-left: 12px;
`;

const Points = styled.span`
  font-weight: bold;
  color: rgb(254, 181, 0);
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

            await loadRating();
          }
        } else {
          throw new Error("No token in response");
        }
      } catch (error: any) {
        console.error("❌ Authentication error:", error);
        setAuthError(error.response?.data?.error || error.message);
        console.log(authError);
      } finally {
        setLoading(false);
      }
    };
    authenticateAndLoadProfile();
  }, [initData, authError]);

  const loadRating = async () => {
    try {
      const response = await ratingAPI.getRating();
      setRating(response.data);
    } catch (error) {
      console.error("Error loading rating:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <div>Загрузка рейтинга...</div>;

  return (
    <>
      <ScheduleContainer>
        <Title>
          <TrophyIcon stroke="#fff" />
          <span>Рейтинг игроков</span>
        </Title>
      </ScheduleContainer>
      <TopPlayersContainer>
        <TopPlayerInfoContainer>
          <PlayerInfoContainer>
            <h3 style={{ color: "#fff" }}>2nd</h3>
            <h4 style={{ color: "#fff" }}>
              {rating
                .filter((item) => item.rank === 2)
                .map((item) => item.user.first_name)}
            </h4>
            <h5 style={{ color: "#fff" }}>
              {rating
                .filter((item) => item.rank === 2)
                .map((item) => item.points)}
            </h5>
          </PlayerInfoContainer>
        </TopPlayerInfoContainer>
        <TopPlayerInfoContainer
          style={{
            backgroundColor: "#E0A65D",
            height: "150px",
          }}
        >
          <PlayerInfoContainer>
            <h3 style={{ color: "#fff" }}>1st</h3>
            <h4 style={{ color: "#fff" }}>
              {rating
                .filter((item) => item.rank === 1)
                .map((item) => item.user.first_name)}
            </h4>
            <h5 style={{ color: "#fff" }}>
              {rating
                .filter((item) => item.rank === 1)
                .map((item) => item.points)}
            </h5>
          </PlayerInfoContainer>
        </TopPlayerInfoContainer>
        <TopPlayerInfoContainer
          style={{
            height: "130px",
          }}
        >
          <PlayerInfoContainer>
            <h3 style={{ color: "#fff" }}>3rd</h3>
            <h4 style={{ color: "#fff" }}>
              {rating
                .filter((item) => item.rank === 3)
                .map((item) => item.user.first_name)}
            </h4>
            <h5 style={{ color: "#fff" }}>
              {rating
                .filter((item) => item.rank === 3)
                .map((item) => item.points)}
            </h5>
          </PlayerInfoContainer>
        </TopPlayerInfoContainer>
      </TopPlayersContainer>
      <RatingTable>
        {rating.map((item) => (
          <RatingItem key={item.user.user_id} top3={item.rank <= 3}>
            <Rank>
              {item.rank === 1
                ? "🥇"
                : item.rank === 2
                ? "🥈"
                : item.rank === 3
                ? "🥉"
                : item.rank}
            </Rank>
            <UserInfo>
              <div style={{ color: "#fff" }}>
                {item.user.first_name} {item.user.last_name}
              </div>
              <div style={{ fontSize: "0.8em", color: "#666" }}>
                Игр: {item.user.total_games_played}
              </div>
            </UserInfo>
            <Points>{item.points} очков</Points>
          </RatingItem>
        ))}
      </RatingTable>
    </>
  );
};

export default Rating;
