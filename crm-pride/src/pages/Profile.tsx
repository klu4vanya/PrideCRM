import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { authAPI, profileAPI } from "../utils/api";
import { useTelegram } from "../hooks/useTelegram";

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProfileSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;

const Button = styled.button`
  background: #2196f3;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #1976d2;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 15px;
`;

const StatCard = styled.div`
  background: #f5f5f5;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
`;

interface UserProfile {
  user: {
    user_id: string;
    username: string;
    nick_name: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    date_of_birth: string;
    points: number;
    total_games_played: number;
  };
  upcoming_games: any[];
}
const userprofile: UserProfile = {
  user: {
    user_id: '23412',
    username: 'string',
    nick_name: "string",
    first_name: "string",
    last_name: "string",
    phone_number: "string",
    email: "string",
    date_of_birth: "string",
    points: 4,
    total_games_played: 3,
  },
  upcoming_games: [3]
}
const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nick_name: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    date_of_birth: "",
    points: ''
  });
  const { initData } = useTelegram();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const authenticateAndLoadProfile = async () => {
      try {
        if (initData) {
          const authResponse = await authAPI.telegramInitAuth(initData);
          <div>{initData}</div>
          if (authResponse.data.token) {
            localStorage.setItem("auth_token", authResponse.data.token);
            await loadProfile();
          }
        } else {
          throw new Error("No token in response");
        }
      } catch (error: any) {
        setAuthError(error.response?.data?.error || error.message);
      } finally {
        setLoading(false);
      }
    };
    authenticateAndLoadProfile();
  }, [initData, authError]);


  const loadProfile = async () => {
    try {
      
      const response = await profileAPI.getProfile();
      console.log(response.data);
      setProfile(response.data);
      setProfile(userprofile);
      console.log("Данные по пользователю", profile)
      setFormData({
        nick_name: response.data.user.nick_name || "",
        first_name: response.data.user.first_name || "",
        last_name: response.data.user.last_name || "",
        phone_number: response.data.user.phone_number || "",
        email: response.data.user.email || "",
        date_of_birth: response.data.user.date_of_birth || "",
        points: response.data.user.points || ""
      });
      console.log("form data:", formData)
    } catch (error: any) {
      <div>{error}</div>
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await profileAPI.updateProfile(formData);
      await loadProfile();
      setEditing(false);
      alert("Профиль успешно обновлен!");
    } catch (error) {
      alert("Ошибка при обновлении профиля");
    }
  };

  if (!profile) return <div>{profile}</div>;
  if (loading) return <div>Загрузка...</div>;

  return (
    <ProfileContainer>
      <ProfileSection>
        <h2>👤 Мой профиль</h2>
        <StatsGrid>
          <StatCard>
            <div
              style={{
                fontSize: "1.5em",
                fontWeight: "bold",
                color: "#2196F3",
              }}
            >
              {profile.user.points}
            </div>
            <div>Очков</div>
          </StatCard>
          <StatCard>
            <div
              style={{
                fontSize: "1.5em",
                fontWeight: "bold",
                color: "#4CAF50",
              }}
            >
              {profile.user.total_games_played}
            </div>
            <div>Сыграно игр</div>
          </StatCard>
        </StatsGrid>
      </ProfileSection>

      <ProfileSection>
        <h3>📝 Информация о себе</h3>
        {editing ? (
          <Form onSubmit={handleSubmit}>
            <Input
              placeholder="Никнейм"
              value={formData.nick_name}
              onChange={(e) =>
                setFormData({ ...formData, nick_name: e.target.value })
              }
            />
            <Input
              placeholder="Имя"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
            />
            <Input
              placeholder="Фамилия"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
            />
            <Input
              placeholder="Телефон"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Input
              type="date"
              placeholder="Дата рождения"
              value={formData.date_of_birth}
              onChange={(e) =>
                setFormData({ ...formData, date_of_birth: e.target.value })
              }
            />
            <Button type="submit">Сохранить</Button>
            <Button type="button" onClick={() => setEditing(false)}>
              Отмена
            </Button>
          </Form>
        ) : (
          <div>
            <p>
              <strong>Никнейм:</strong> {profile.user.nick_name || "Не указан"}
            </p>
            <p>
              <strong>Имя:</strong> {profile.user.first_name || "Не указано"}
            </p>
            <p>
              <strong>Фамилия:</strong> {profile.user.last_name || "Не указана"}
            </p>
            <p>
              <strong>Телефон:</strong>{" "}
              {profile.user.phone_number || "Не указан"}
            </p>
            <p>
              <strong>Email:</strong> {profile.user.email || "Не указан"}
            </p>
            <p>
              <strong>Дата рождения:</strong>{" "}
              {profile.user.date_of_birth || "Не указана"}
            </p>
            <Button onClick={() => setEditing(true)}>Редактировать</Button>
          </div>
        )}
      </ProfileSection>
    </ProfileContainer>
  );
};

export default Profile;
