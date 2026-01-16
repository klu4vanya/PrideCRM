import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../utils/api";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    padding: 10px;
    border-bottom: 1px solid #444;
  }

  th { 
    background: #333; 
    color: white; 
  }

  @media (max-width: 600px) {
    th, td {
      padding: 6px;
      font-size: 12px;
    }
  }
`;

const ModalBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  color: black;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  display: grid;
  gap: 10px;

  label {
    font-weight: bold;
    margin-top: 10px;
  }

  input, select {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const Btn = styled.button`
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  background: linear-gradient(145deg, #4a4a4a, #2b2b2b);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
  margin-left: 5px;
  font-size: 12px;

  &:hover {
    background: linear-gradient(145deg, #5a5a5a, #1f1f1f);
  }

  &:active {
    transform: scale(0.97);
  }
`;

const BanBtn = styled(Btn)`
  background: linear-gradient(145deg, #d32f2f, #b71c1c);
  
  &:hover {
    background: linear-gradient(145deg, #f44336, #c62828);
  }
`;

const UnbanBtn = styled(Btn)`
  background: linear-gradient(145deg, #4caf50, #388e3c);
  
  &:hover {
    background: linear-gradient(145deg, #66bb6a, #4caf50);
  }
`;

const PointsBtn = styled(Btn)`
  background: linear-gradient(145deg, #ff9800, #f57c00);
  
  &:hover {
    background: linear-gradient(145deg, #ffa726, #ff9800);
  }
`;

export default function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [pointsModal, setPointsModal] = useState<any | null>(null);
  const [pointsValue, setPointsValue] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/");
      setUsers(res.data);
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (u: any) => setEditUser({ ...u });
  const closeEdit = () => setEditUser(null);

  const openPointsModal = (u: any) => {
    setPointsModal(u);
    setPointsValue("");
  };

  const closePointsModal = () => {
    setPointsModal(null);
    setPointsValue("");
  };

  const saveUser = async () => {
    try {
      await api.patch(`/users/${editUser.user_id}/`, editUser);
      await load();
      closeEdit();
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Не удалось сохранить изменения");
    }
  };

  const addPoints = async () => {
    if (!pointsValue || isNaN(Number(pointsValue))) {
      alert("Введите корректное число очков");
      return;
    }

    try {
      await api.post(`/users/${pointsModal.user_id}/add_points/`, {
        points: Number(pointsValue),
      });
      await load();
      closePointsModal();
      alert(`Успешно добавлено ${pointsValue} очков пользователю ${pointsModal.username}`);
    } catch (error) {
      console.error("Ошибка добавления очков:", error);
      alert("Не удалось добавить очки");
    }
  };

  const ban = async (u: any) => {
    if (!window.confirm(`Забанить пользователя ${u.username}?`)) return;

    try {
      await api.post(`/users/${u.user_id}/ban/`);
      await load();
    } catch (error) {
      console.error("Ошибка бана:", error);
      alert("Не удалось забанить пользователя");
    }
  };

  const unban = async (u: any) => {
    if (!window.confirm(`Разбанить пользователя ${u.username}?`)) return;

    try {
      await api.post(`/users/${u.user_id}/unban/`);
      await load();
    } catch (error) {
      console.error("Ошибка разбана:", error);
      alert("Не удалось разбанить пользователя");
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Пользователи ({users.length})</h2>

      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Имя</th>
            <th>Очки</th>
            <th>Админ</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.user_id}>
              <td>{u.user_id}</td>
              <td>@{u.username}</td>
              <td>{u.first_name} {u.last_name}</td>
              <td><b>{u.points}</b></td>
              <td>{u.is_admin ? "✅" : "❌"}</td>
              <td>
                {u.is_banned ? (
                  <span style={{ color: "red", fontWeight: "bold" }}>🚫 BANNED</span>
                ) : (
                  <span style={{ color: "green" }}>✓ OK</span>
                )}
              </td>
              <td>
                <Btn onClick={() => openEdit(u)}>Изменить</Btn>
                <PointsBtn onClick={() => openPointsModal(u)}>+ Очки</PointsBtn>
                {!u.is_banned ? (
                  <BanBtn onClick={() => ban(u)}>Бан</BanBtn>
                ) : (
                  <UnbanBtn onClick={() => unban(u)}>Разбан</UnbanBtn>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Модалка редактирования пользователя */}
      {editUser && (
        <ModalBg onClick={closeEdit}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <h3>Редактирование пользователя</h3>

            <label>Username</label>
            <input
              value={editUser.username || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, username: e.target.value })
              }
            />

            <label>Email</label>
            <input
              value={editUser.email || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
            />

            <label>Имя</label>
            <input
              value={editUser.first_name || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, first_name: e.target.value })
              }
            />

            <label>Фамилия</label>
            <input
              value={editUser.last_name || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, last_name: e.target.value })
              }
            />

            <label>Телефон</label>
            <input
              value={editUser.phone_number || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, phone_number: e.target.value })
              }
            />

            <label>Права администратора</label>
            <select
              value={editUser.is_admin ? "1" : "0"}
              onChange={(e) =>
                setEditUser({ ...editUser, is_admin: e.target.value === "1" })
              }
            >
              <option value="0">Нет</option>
              <option value="1">Да</option>
            </select>

            <br />
            <Btn onClick={saveUser}>Сохранить</Btn>
            <Btn onClick={closeEdit}>Отмена</Btn>
          </Modal>
        </ModalBg>
      )}

      {/* Модалка добавления очков */}
      {pointsModal && (
        <ModalBg onClick={closePointsModal}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <h3>Добавить очки</h3>
            <p>
              Пользователь: <b>{pointsModal.first_name}</b> (@{pointsModal.username})
            </p>
            <p>
              Текущие очки: <b>{pointsModal.points}</b>
            </p>

            <label>Количество очков для добавления:</label>
            <input
              type="number"
              placeholder="Введите количество очков"
              value={pointsValue}
              onChange={(e) => setPointsValue(e.target.value)}
              autoFocus
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addPoints();
                }
              }}
            />

            <br />
            <PointsBtn onClick={addPoints}>Добавить очки</PointsBtn>
            <Btn onClick={closePointsModal}>Отмена</Btn>
          </Modal>
        </ModalBg>
      )}
    </div>
  );
}