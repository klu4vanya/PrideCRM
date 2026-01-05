import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { authAPI, profileAPI } from "../utils/api";
import { useTelegram } from "../hooks/useTelegram";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { Title } from "./Schedule";
import test_photo from "../assets/logo_pride.jpeg";

const ProfileContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #000;
`;
const Subtitle = styled.strong`
  color: #fff;
`
const ProfileAnswers = styled.p`
  color: #fff;
`
const ProfileSection = styled.div`
  background: #000;
  padding: 20px;
  margin-top: -15%;
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
  background: #e75c1c;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin: 5% 0 5% 0;

  &:hover {
    background: #9d3b0a;
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
const PhotoUser = styled.div`
  position: relative;
  left: 15%;
  bottom: 0;
  transform: translate(0, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #000;
  overflow: hidden;
  img{
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
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
    points: 0,
  });

  const { initData } = useTelegram();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  useEffect(() => {
    const authenticateAndLoadProfile = async () => {
      try {
        if (initData) {
          const authResponse = await authAPI.telegramInitAuth(initData);
          <div>{initData}</div>;
          if (authResponse.data.token) {
            localStorage.setItem("auth_token", authResponse.data.token);
            await loadProfile();
          }
        } else {
          throw new Error("No token in response");
        }
      } catch (error: any) {
        setAuthError(error.response?.data?.error || error.message);
        loadProfile();
      } finally {
        setLoading(false);
      }
    };
    authenticateAndLoadProfile();
  }, [initData, authError]);

  const loadProfile = async () => {
    try {
      const response = await profileAPI.getProfile();
      setProfile(response.data);
      setFormData({
        nick_name: response.data.user.nick_name || "",
        first_name: response.data.user.first_name || "",
        last_name: response.data.user.last_name || "",
        phone_number: response.data.user.phone_number || "",
        email: response.data.user.email || "",
        date_of_birth: response.data.user.date_of_birth || "",
        points: response.data.user.points || "",
      });
      console.log("form data:", formData);
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
      console.log("ошибка", error)
    }
  };
  if (!profile) return <div>{profile}</div>;

  if (loading) return <div>Загрузка...</div>;

  return (
    <ProfileContainer>
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1636583133884-fbefc7ac3fb3"
        alt="Cover"
        overlayColor="linear-gradient(180deg, rgba(185, 82, 8, 0.8), rgb(244, 101, 11, 0.4))"
        overlayOpacity={7}
      ></ImageWithFallback>
      <PhotoUser>
        <img src={test_photo}/>
      </PhotoUser>
      <ProfileSection>
        <Title style={{ color: "#fff"}}>Мой профиль</Title>
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

      <ProfileSection style={{margin: 0}}>
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
            <ProfileAnswers >
              <Subtitle>Никнейм:</Subtitle> {profile.user.nick_name || "Не указан"}
            </ProfileAnswers>
            <ProfileAnswers>
              <Subtitle>Имя:</Subtitle> {profile.user.first_name || "Не указано"}
            </ProfileAnswers>
            <ProfileAnswers>
              <Subtitle>Фамилия:</Subtitle> {profile.user.last_name || "Не указана"}
            </ProfileAnswers>
            <ProfileAnswers>
              <Subtitle>Телефон:</Subtitle>{" "}
              {profile.user.phone_number || "Не указан"}
            </ProfileAnswers>
            <ProfileAnswers>
              <Subtitle>Email:</Subtitle> {profile.user.email || "Не указан"}
            </ProfileAnswers>
            <ProfileAnswers>
              <Subtitle>Дата рождения:</Subtitle>{" "}
              {profile.user.date_of_birth || "Не указана"}
            </ProfileAnswers>
            <Button onClick={() => setEditing(true)}>Редактировать</Button>
          </div>
        )}
      </ProfileSection>
    </ProfileContainer>
  );
};

export default Profile;
