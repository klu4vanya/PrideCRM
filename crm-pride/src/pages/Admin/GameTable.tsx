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

export default function GamesTable() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<any | null>(null);
  const [createMode, setCreateMode] = useState(false);

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
  const close = () => { setEdit(null); setCreateMode(false); };

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

  const remove = async (g: any) => {
    if (!confirm("Удалить игру?")) return;
    await api.delete(`/games/${g.game_id}/`);
    load();
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Игры</h2>

      <button onClick={() => { setEdit({}); setCreateMode(true); }}>
        Создать игру
      </button>

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
        {games.map(g => (
          <tr key={g.game_id}>
            <td>{g.game_id}</td>
            <td>{g.date}</td>
            <td>{g.location}</td>
            <td>{g.buyin}</td>
            <td>{g.participants_count}</td>
            <td>
              <button onClick={() => openEdit(g)}>Изменить</button>
              <button onClick={() => remove(g)}>Удалить</button>
            </td>
          </tr>
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
              onChange={e => setEdit({ ...edit, date: e.target.value })}
            />

            <label>Время</label>
            <input
              type="time"
              value={edit.time || ""}
              onChange={e => setEdit({ ...edit, time: e.target.value })}
            />

            <label>Описание</label>
            <input
              value={edit.description || ""}
              onChange={e => setEdit({ ...edit, description: e.target.value })}
            />

            <label>Buy-in</label>
            <input
              type="number"
              value={edit.buyin || ""}
              onChange={e => setEdit({ ...edit, buyin: e.target.value })}
            />

            <label>Re-entry Buy-in</label>
            <input
              type="number"
              value={edit.reentry_buyin || ""}
              onChange={e => setEdit({ ...edit, reentry_buyin: e.target.value })}
            />

            <label>Локация</label>
            <input
              value={edit.location || ""}
              onChange={e => setEdit({ ...edit, location: e.target.value })}
            />

            <br /><br />
            {createMode ? (
              <button onClick={createGame}>Создать</button>
            ) : (
              <button onClick={save}>Сохранить</button>
            )}

            <button onClick={close}>Отмена</button>
          </Modal>
        </ModalBg>
      )}
    </div>
  );
}
