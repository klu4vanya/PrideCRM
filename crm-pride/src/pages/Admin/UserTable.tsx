import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../utils/api";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 10px;
    border-bottom: 1px solid #444;
  }

  th { background: #333; color: white; }
`;

const ModalBg = styled.div`
  position: fixed;
  top: 0; left: 0;
  right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  background: white;
  color: black;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
`;

export default function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await api.get("/users/");
    setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (u: any) => setEditUser({ ...u });
  const closeEdit = () => setEditUser(null);

  const saveUser = async () => {
    await api.patch(`/users/${editUser.user_id}/`, editUser);
    await load();
    closeEdit();
  };

  const ban = async (u: any) => {
    await api.post(`/users/${u.user_id}/ban/`);
    load();
  };

  const unban = async (u: any) => {
    await api.post(`/users/${u.user_id}/unban/`);
    load();
  };

  const addPoints = async (u: any) => {
    // eslint-disable-next-line no-restricted-globals
    const pts = prompt("Сколько очков добавить?");
    if (!pts) return;
    await api.post(`/users/${u.user_id}/add_points/`, { points: pts });
    load();
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Пользователи</h2>

      <Table>
        <thead>
        <tr>
          <th>ID</th>
          <th>Имя</th>
          <th>Очки</th>
          <th>Админ</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
        </thead>

        <tbody>
        {users.map(u => (
          <tr key={u.user_id}>
            <td>{u.user_id}</td>
            <td>{u.username}</td>
            <td>{u.points}</td>
            <td>{u.is_admin ? "Да" : "Нет"}</td>
            <td>{u.is_banned ? "BANNED" : "OK"}</td>
            <td>
              <button onClick={() => openEdit(u)}>Редактировать</button>
              <button onClick={() => addPoints(u)}>+Очки</button>
              {!u.is_banned && <button onClick={() => ban(u)}>Бан</button>}
              {u.is_banned && <button onClick={() => unban(u)}>Разбан</button>}
            </td>
          </tr>
        ))}
        </tbody>
      </Table>

      {editUser && (
        <ModalBg>
          <Modal>
            <h3>Редактирование</h3>

            <label>Username</label>
            <input
              value={editUser.username}
              onChange={e => setEditUser({ ...editUser, username: e.target.value })}
            />

            <label>Email</label>
            <input
              value={editUser.email || ""}
              onChange={e => setEditUser({ ...editUser, email: e.target.value })}
            />

            <label>Имя</label>
            <input
              value={editUser.first_name || ""}
              onChange={e => setEditUser({ ...editUser, first_name: e.target.value })}
            />

            <label>Фамилия</label>
            <input
              value={editUser.last_name || ""}
              onChange={e => setEditUser({ ...editUser, last_name: e.target.value })}
            />

            <label>Телефон</label>
            <input
              value={editUser.phone_number || ""}
              onChange={e => setEditUser({ ...editUser, phone_number: e.target.value })}
            />

            <label>Админ?</label>
            <select
              value={editUser.is_admin ? "1" : "0"}
              onChange={e => setEditUser({ ...editUser, is_admin: e.target.value === "1" })}
            >
              <option value="0">Нет</option>
              <option value="1">Да</option>
            </select>

            <br/><br/>
            <button onClick={saveUser}>Сохранить</button>
            <button onClick={closeEdit}>Отмена</button>
          </Modal>
        </ModalBg>
      )}
    </div>
  );
}
