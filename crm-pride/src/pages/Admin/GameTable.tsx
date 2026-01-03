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
  const [deleteGame, setDeleteGame] = useState<any | null>(null);

  const [openGameId, setOpenGameId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await api.get("/games/");
    setGames(res.data);
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
    await api.patch(`/games/${edit.game_id}/`, edit);
    await load();
    close();
  };

  const createGame = async () => {
    await api.post(`/games/`, edit);
    await load();
    close();
  };

  const remove = async () => {
    if (!confirm("Удалить игру?")) return;
    
    try {
      await api.delete(`/games/${deleteGame.game_id}/`);
      await load();
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      alert('Не удалось удалить игру');
    }
  };

  const addEntry = async (p: any) => {
    const value = prompt("Сколько входов добавить?");
    if (!value) return;
    await api.post(`/participants/${p.id}/add_entry/`, { value });
    load();
  };

  const addRebuy = async (p: any) => {
    const value = prompt("Сколько ребаев добавить?");
    if (!value) return;
    await api.post(`/participants/${p.id}/add_rebuy/`, { value });
    load();
  };

  const addAddon = async (p: any) => {
    const value = prompt("Сколько аддонов добавить?");
    if (!value) return;
    await api.post(`/participants/${p.id}/add_addon/`, { value });
    load();
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
            <>
              <tr key={g.game_id}>
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
                  <Btn onClick={() => remove()} style={{ marginLeft: 8 }}>
                    Удалить
                  </Btn>
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
            </>
          ))}
        </tbody>
      </Table>

      {(edit || createMode) && (
        <ModalBg>
          <Modal>
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
