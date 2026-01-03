/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../utils/api";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
    padding: 10px;
    border-bottom: 1px solid #444;
  }

  th {
    background: #333;
    color: white;
  }

  @media (max-width: 600px) {
    th,
    td {
      padding: 6px;
      font-size: 13px;
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

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const Btn = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: linear-gradient(145deg, #4a4a4a, #2b2b2b);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: linear-gradient(145deg, #5a5a5a, #1f1f1f);
  }

  &:active {
    transform: scale(0.97);
  }
`;

const DeleteBtn = styled(Btn)`
  background: linear-gradient(145deg, #d32f2f, #b71c1c);
  
  &:hover {
    background: linear-gradient(145deg, #f44336, #c62828);
  }
`;

const ActionButton = ({ label, onClick }: any) => (
  <Btn onClick={onClick} style={{ fontSize: 12 }}>
    {label}
  </Btn>
);

export default function GamesTable() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<any | null>(null);
  const [createMode, setCreateMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<any | null>(null);

  const [openGameId, setOpenGameId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/games/");
      setGames(res.data);
    } catch (error) {
      console.error('Ошибка загрузки игр:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (g: any) => setEdit({ ...g });
  const close = () => {
    setEdit(null);
    setCreateMode(false);
  };

  const save = async () => {
    try {
      await api.patch(`/games/${edit.game_id}/`, edit);
      await load();
      close();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Не удалось сохранить изменения');
    }
  };

  const createGame = async () => {
    try {
      await api.post(`/games/`, edit);
      await load();
      close();
    } catch (error) {
      console.error('Ошибка создания:', error);
      alert('Не удалось создать игру');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      console.log('Удаление игры:', deleteConfirm.game_id);
      await api.delete(`/games/${deleteConfirm.game_id}/`);
      console.log('Игра удалена успешно');
      await load();
      setDeleteConfirm(null);
    } catch (error: any) {
      console.error('Ошибка при удалении:', error);
      console.error('Детали ошибки:', error.response?.data);
      alert(`Не удалось удалить игру: ${error.response?.data?.detail || error.message}`);
    }
  };

  const addEntry = async (p: any) => {
    const value = window.prompt("Сколько входов добавить?");
    if (!value) return;
    try {
      await api.post(`/participants/${p.id}/add_entry/`, { value });
      await load();
    } catch (error) {
      console.error('Ошибка добавления входа:', error);
      alert('Не удалось добавить вход');
    }
  };

  const addRebuy = async (p: any) => {
    const value = window.prompt("Сколько ребаев добавить?");
    if (!value) return;
    try {
      await api.post(`/participants/${p.id}/add_rebuy/`, { value });
      await load();
    } catch (error) {
      console.error('Ошибка добавления ребая:', error);
      alert('Не удалось добавить ребай');
    }
  };

  const addAddon = async (p: any) => {
    const value = window.prompt("Сколько аддонов добавить?");
    if (!value) return;
    try {
      await api.post(`/participants/${p.id}/add_addon/`, { value });
      await load();
    } catch (error) {
      console.error('Ошибка добавления аддона:', error);
      alert('Не удалось добавить аддон');
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Игры</h2>

      <Btn onClick={() => { setEdit({}); setCreateMode(true); }}>
        Создать игру
      </Btn>

      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Дата</th>
            <th>Локация</th>
            <th>Buy-in</th>
            <th>Игроков</th>
            <th>Действия</th>
          </tr>
        </thead>

        <tbody>
          {games.map((g) => (
            <React.Fragment key={g.game_id}>
              <tr>
                <td>{g.game_id}</td>
                <td>{g.date}</td>
                <td>{g.location}</td>
                <td>{g.buyin}</td>
                <td>{g.participants_count}</td>
                <td>
                  <Btn onClick={() => setOpenGameId(openGameId === g.game_id ? null : g.game_id)}>
                    {openGameId === g.game_id ? "Скрыть" : "Участники"}
                  </Btn>
                  <Btn onClick={() => openEdit(g)} style={{ marginLeft: 8 }}>
                    Изменить
                  </Btn>
                  <DeleteBtn onClick={() => setDeleteConfirm(g)} style={{ marginLeft: 8 }}>
                    Удалить
                  </DeleteBtn>
                </td>
              </tr>

              {openGameId === g.game_id && (
                <tr>
                  <td colSpan={6} style={{ background: "#222", padding: 15 }}>
                    <h4 style={{ color: "white" }}>Участники</h4>

                    {(!g.participants_details || g.participants_details.length === 0) && (
                      <p style={{ color: "white" }}>Нет участников</p>
                    )}

                    {g.participants_details?.map((p: any) => (
                      <div
                        key={p.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px 0",
                          borderBottom: "1px solid #444",
                          color: "white",
                        }}
                      >
                        <div>
                          <b>{p.user.first_name}</b> ({p.user.username})
                        </div>

                        <div style={{ display: "flex", gap: "6px" }}>
                          <ActionButton label="Вход" onClick={() => addEntry(p)} />
                          <ActionButton label="Ребай" onClick={() => addRebuy(p)} />
                          <ActionButton label="Аддон" onClick={() => addAddon(p)} />
                        </div>
                      </div>
                    ))}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>

      {/* Модалка удаления */}
      {deleteConfirm && (
        <ModalBg onClick={() => setDeleteConfirm(null)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <h3>Подтверждение удаления</h3>
            <p>Вы уверены, что хотите удалить игру #{deleteConfirm.game_id}?</p>
            <p><b>Дата:</b> {deleteConfirm.date}</p>
            <p><b>Локация:</b> {deleteConfirm.location}</p>
            <br />
            <DeleteBtn onClick={confirmDelete}>Удалить</DeleteBtn>
            <Btn onClick={() => setDeleteConfirm(null)} style={{ marginLeft: 10 }}>
              Отмена
            </Btn>
          </Modal>
        </ModalBg>
      )}

      {/* Модалка редактирования/создания */}
      {(edit || createMode) && (
        <ModalBg onClick={close}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <h3>{createMode ? "Создание игры" : "Редактирование"}</h3>

            <label>Дата</label>
            <input
              type="date"
              value={edit.date || ""}
              onChange={(e) => setEdit({ ...edit, date: e.target.value })}
            />

            <label>Время</label>
            <input
              type="time"
              value={edit.time || ""}
              onChange={(e) => setEdit({ ...edit, time: e.target.value })}
            />

            <label>Описание</label>
            <input
              value={edit.description || ""}
              onChange={(e) => setEdit({ ...edit, description: e.target.value })}
            />

            <label>Buy-in</label>
            <input
              type="number"
              value={edit.buyin || ""}
              onChange={(e) => setEdit({ ...edit, buyin: e.target.value })}
            />

            <label>Re-entry Buy-in</label>
            <input
              type="number"
              value={edit.reentry_buyin || ""}
              onChange={(e) =>
                setEdit({ ...edit, reentry_buyin: e.target.value })
              }
            />

            <label>Локация</label>
            <input
              value={edit.location || ""}
              onChange={(e) => setEdit({ ...edit, location: e.target.value })}
            />

            <br />
            <br />
            {createMode ? (
              <Btn onClick={createGame}>Создать</Btn>
            ) : (
              <Btn onClick={save}>Сохранить</Btn>
            )}

            <Btn onClick={close} style={{ marginLeft: 10 }}>
              Отмена
            </Btn>
          </Modal>
        </ModalBg>
      )}
    </div>
  );
}