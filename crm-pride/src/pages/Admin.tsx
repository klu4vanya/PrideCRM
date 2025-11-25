import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { adminAPI } from "../utils/api"; // /admin/dashboard/
import UsersTable from "./Admin/UserTable";
import GamesTable from "./Admin/GameTable";

const Container = styled.div`
  padding: 20px;
  color: white;
`;

const Menu = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 10px 16px;
  border-radius: 8px;
  background: ${({ active }) => (active ? "#1976d2" : "#333")};
  color: white;
  border: none;
  cursor: pointer;
`;

const ErrorBox = styled.div`
  padding: 20px;
  border-radius: 10px;
  background: #ff4444;
  margin-top: 40px;
  text-align: center;
  color: white;
  font-size: 18px;
`;

const AdminPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState<"users" | "games">("users");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await adminAPI.dashboard(); // GET /admin/dashboard/
        console.log(response.data)
        setUser(response.data);
      } catch (e) {
        console.error("Admin dashboard error:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading)
    return <Container>Загрузка админ-панели…</Container>;

  // ❗ если юзер не админ
  if (!user?.admin_info?.is_admin) {
    console.log("пользователь", user)
    return (
      <ErrorBox>
        ❌ У вас нет прав администратора
      </ErrorBox>
    );
  }

  return (
    <Container>
      <h1>Админ-панель</h1>

      <Menu>
        <TabButton active={tab === "users"} onClick={() => setTab("users")}>
          Пользователи
        </TabButton>
        <TabButton active={tab === "games"} onClick={() => setTab("games")}>
          Игры
        </TabButton>
      </Menu>

      {tab === "users" && <UsersTable />}
      {tab === "games" && <GamesTable />}
    </Container>
  );
};

export default AdminPage;
