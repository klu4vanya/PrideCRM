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

  @media (max-width: 600px) {
    th, td {
      padding: 6px;
      font-size: 14px;
    }
  }
`;

const ModalBg = styled.div`
  position: fixed;
  top: 0; left: 0;
  right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

const Modal = styled.div`
  background: white;
  color: black;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  max-width: 420px;

  @media (max-width: 600px) {
    padding: 16px;
    max-width: 340px;
  }
`;

export default function GamesTable() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<any | null>(null);
  const [createMode, setCreateMode] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);

  const tg = (window as any).Telegram?.WebApp;

  // --- TELEGRAM PROMPT ---
  const telegramPrompt = (title: string): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!tg || !tg.showPopup) {
        const value = window.prompt(title);
        resolve(value);
        return;
      }

      tg.showPopup(
        {
          title,
          message: "",
          buttons: [
            { id: "ok", type: "input", placeholder: "Введите значение" },
            { id: "cancel", type: "default", text: "Отмена" },
          ]
        },
        (buttonId: string, inputValue: string) => {
          if (buttonId === "ok") resolve(inputValue);
          else resolve(null);
        }
      );
    });
  };

  const load = async () => {
    setLoading(true);
    const res = await api.get("/games/");
    setGames(res.data);
    setLoading(false);
  };

  const loadParticipants = async (gameId: number) => {
    const res = await api.get(`/games/${gameId}/participants/`);
    setParticipants(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = async (g: any) => {
    setEdit({ ...g });
    await loadParticipants(g.game_id);
  };

  const close = () => {
    setEdit(null);
    setCreateMode(false);
    setParticipants([]);
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

  const remove = async (g: any) => {
      // eslint-disable-next-line no-restricted-globals
    if (!confirm("Удалить игру?")) return;
    await api.delete(`/games/${g.game_id}/`);
    load();
  };

  // --- ADD ENTRY / REBUY / ADDON ---
  const addEntry = async (p: any) => {
    const value = await telegramPrompt("Сколько входов добавить?");
    if (!value) return;

    await api.post(`/participants/${p.id}/add_entry/`, { value });
    await loadParticipants(edit.game_id);
  };

  const addRebuy = async (p: any) => {
    const value = await telegramPrompt("Сколько ребаев добавить?");
    if (!value) return;

    await api.post(`/participants/${p.id}/add_rebuy/`, { value });
    await loadParticipants(edit.game_id);
  };

  const addAddon = async (p: any) => {
    const value = await telegramPrompt("Сколько аддонов добавить?");
    if (!value) return;

    await api.post(`/participants/${p.id}/add_addon/`, { value });
    await loadParticipants(edit.game_id);
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

            {/* PARTICIPANTS BLOCK */}
            {!createMode && (
              <>
                <h3 style={{ marginTop: 20 }}>Участники</h3>

                {participants.map(p => (
                  <div
                    key={p.id}
                    style={{
                      marginBottom: 10,
                      padding: 10,
                      borderRadius: 8,
                      background: "#f3f3f3"
                    }}
                  >
                    <b>{p.user.first_name} {p.user.username}</b>
                    <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
                      <button onClick={() => addEntry(p)}>Вход</button>
                      <button onClick={() => addRebuy(p)}>Ребай</button>
                      <button onClick={() => addAddon(p)}>Аддон</button>
                    </div>
                  </div>
                ))}
              </>
            )}

            <br />

            {createMode ? (
              <button onClick={createGame}>Создать</button>
            ) : (
              <button onClick={save}>Сохранить</button>
            )}

            <button onClick={close} style={{ marginLeft: 10 }}>
              Отмена
            </button>
          </Modal>
        </ModalBg>
      )}
    </div>
  );
}
