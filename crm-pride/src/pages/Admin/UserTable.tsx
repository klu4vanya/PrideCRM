import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../utils/api"; // GET /users/

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: white;

  th, td {
    padding: 10px;
    border-bottom: 1px solid #444;
    color: #222;
  }
  th {
    background: #222;
  }
`;

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/");
      setUsers(res.data);
    } catch (e) {
      console.error("Failed to load users:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const deleteUser = async (id: string) => {
    if (!window.confirm("Удалить пользователя?")) return;

    try {
      await api.delete(`/users/${id}/`);
      loadUsers();
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  if (loading) return <div>Загрузка пользователей…</div>;

  return (
    <Table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Имя</th>
          <th>Очки</th>
          <th>Игры</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.user_id}>
            <td>{u.user_id}</td>
            <td>{u.username}</td>
            <td>{u.points}</td>
            <td>{u.total_games_played}</td>
            <td>
              <button onClick={() => deleteUser(u.user_id)}>Удалить</button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UsersTable;
