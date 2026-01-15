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
  overflow-y: auto;
`;

const Modal = styled.div`
  display: grid;
  gap: 5px;
  background: white;
  color: black;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;

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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CompleteBtn = styled(Btn)`
  background: linear-gradient(145deg, #4caf50, #388e3c);
  
  &:hover {
    background: linear-gradient(145deg, #66bb6a, #4caf50);
  }
`;

const DeleteBtn = styled(Btn)`
  background: linear-gradient(145deg, #d32f2f, #b71c1c);
  
  &:hover {
    background: linear-gradient(145deg, #f44336, #c62828);
  }
`;

const ManageBtn = styled(Btn)`
  background: linear-gradient(145deg, #2196F3, #1976D2);
  
  &:hover {
    background: linear-gradient(145deg, #42A5F5, #2196F3);
  }
`;

const ParticipantCard = styled.div`
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  border: 2px solid transparent;
  transition: border-color 0.3s;

  &.saving {
    border-color: #2196F3;
  }

  &.saved {
    border-color: #4caf50;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const CounterBtn = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(145deg, #2196F3, #1976D2);
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: linear-gradient(145deg, #42A5F5, #2196F3);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const CountDisplay = styled.div`
  min-width: 40px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: bold;
  min-width: 60px;
`;

const Summary = styled.div`
  background: #e3f2fd;
  padding: 10px;
  border-radius: 6px;
  margin-top: 10px;
  font-size: 14px;
`;

const SaveIndicator = styled.span<{ visible: boolean }>`
  font-size: 12px;
  color: #4caf50;
  margin-left: 10px;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s;
`;

interface ParticipantData {
  id: number;
  user: {
    user_id: string;
    first_name: string;
    username: string;
  };
  entries: number;
  rebuys: number;
  addons: number;
}

export default function GamesTable() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<any | null>(null);
  const [createMode, setCreateMode] = useState(false);
  const [manageMode, setManageMode] = useState<any | null>(null);
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  const [openGameId, setOpenGameId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/games/");
      setGames(res.data);
    } catch (error) {
      console.error("Ошибка загрузки игр:", error);
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
    setManageMode(null);
    setParticipants([]);
    setSavingIds(new Set());
    setSavedIds(new Set());
  };

  const save = async () => {
    try {
      await api.patch(`/games/${edit.game_id}/`, edit);
      await load();
      close();
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Не удалось сохранить изменения");
    }
  };

  const createGame = async () => {
    try {
      await api.post(`/games/`, edit);
      await load();
      close();
    } catch (error) {
      console.error("Ошибка создания:", error);
      alert("Не удалось создать игру");
    }
  };

  const remove = async (g: any) => {
    if (!window.confirm("Удалить игру?")) return;

    try {
      await api.delete(`/games/${g.game_id}/`);
      await load();
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      alert("Не удалось удалить игру");
    }
  };

  const openManageModal = async (game: any) => {
    try {
      const res = await api.get(`/games/${game.game_id}/participants_admin/`);
      setParticipants(res.data);
      console.log("данные пользователей",res.data)
      setManageMode(game);
    } catch (error) {
      console.error("Ошибка загрузки участников:", error);
      alert("Не удалось загрузить участников");
    }
  };

  // Автосохранение при изменении данных участника
  const updateParticipant = async (
    participantId: number,
    field: string,
    value: number
  ) => {
    // Обновляем локальное состояние
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participantId ? { ...p, [field]: value } : p
      )
    );

    // Показываем индикатор сохранения
    setSavingIds((prev) => new Set(prev).add(participantId));
    setSavedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(participantId);
      return newSet;
    });

    try {
      // Отправляем данные на сервер
      await api.patch(`/participants/${participantId}/`, {
        [field]: value,
      });

      // Показываем индикатор успешного сохранения
      setSavingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(participantId);
        return newSet;
      });

      setSavedIds((prev) => new Set(prev).add(participantId));

      // Убираем индикатор через 2 секунды
      setTimeout(() => {
        setSavedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(participantId);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Не удалось сохранить изменения");
      setSavingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(participantId);
        return newSet;
      });
    }
  };

  const incrementValue = (participantId: number, field: string, currentValue: number) => {
    updateParticipant(participantId, field, currentValue + 1);
  };

  const decrementValue = (participantId: number, field: string, currentValue: number) => {
    if (currentValue > 0) {
      updateParticipant(participantId, field, currentValue - 1);
    }
  };

  const calculateTotal = (p: ParticipantData) => {
    if (!manageMode) return 0;
    const buyin = Number(manageMode.buyin) || 0;
    const reentryBuyin = Number(manageMode.reentry_buyin) || buyin;

    return p.entries * buyin + p.rebuys * reentryBuyin + p.addons * reentryBuyin;
  };

  const calculateGameTotal = () => {
    return participants.reduce((sum, p) => sum + calculateTotal(p), 0);
  };

  const completeGame = async () => {
    if (!manageMode) return;

    if (
      !window.confirm(
        "Завершить турнир? После этого он будет перенесен в историю и станет недоступен для изменений."
      )
    )
      return;

    try {
      // Формируем данные участников для истории
      const participantsData = participants.map((p) => ({
        user_id: p.user.user_id,
        entries: p.entries,
        rebuys: p.rebuys,
        addons: p.addons,
      }));

      // Завершаем игру и создаем запись в истории
      await api.post(`/games/${manageMode.game_id}/complete/`, {
        participants: participantsData,
      });

      alert("Турнир успешно завершен и добавлен в историю!");
      await load();
      close();
    } catch (error) {
      console.error("Ошибка завершения турнира:", error);
      alert("Не удалось завершить турнир");
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Игры</h2>

      <Btn
        onClick={() => {
          setEdit({});
          setCreateMode(true);
        }}
      >
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
                  <Btn
                    onClick={() =>
                      setOpenGameId(openGameId === g.game_id ? null : g.game_id)
                    }
                    style={{ fontSize: 11 }}
                  >
                    {openGameId === g.game_id ? "Скрыть" : "Участники"}
                  </Btn>
                  <Btn
                    onClick={() => openEdit(g)}
                    style={{ marginLeft: 8, fontSize: 11 }}
                  >
                    Изменить
                  </Btn>
                  <ManageBtn
                    onClick={() => openManageModal(g)}
                    style={{ marginLeft: 8, fontSize: 11 }}
                  >
                    Управление
                  </ManageBtn>
                  <DeleteBtn
                    onClick={() => remove(g)}
                    style={{ marginLeft: 8, fontSize: 11 }}
                  >
                    Удалить
                  </DeleteBtn>
                </td>
              </tr>

              {openGameId === g.game_id && (
                <tr>
                  <td colSpan={6} style={{ background: "#222", padding: 15 }}>
                    <h4 style={{ color: "white" }}>Участники</h4>

                    {(!g.participants_details ||
                      g.participants_details.length === 0) && (
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
                          <b>{p.user.first_name}</b> (@{p.user.username})
                        </div>
                        <div>
                          Входы: {p.entries} | Ребаи: {p.rebuys} | Аддоны:{" "}
                          {p.addons}
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

      {/* Модалка управления игрой */}
      {manageMode && (
        <ModalBg onClick={close}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <h3>Управление турниром</h3>
            <p>
              <b>Дата:</b> {manageMode.date} <b>Время:</b> {manageMode.time}
            </p>
            <p>
              <b>Локация:</b> {manageMode.location}
            </p>
            <p>
              <b>Buy-in:</b> {manageMode.buyin} | <b>Re-entry:</b>{" "}
              {manageMode.reentry_buyin || manageMode.buyin}
            </p>

            <hr />

            <h4>Участники:</h4>
            <p style={{ fontSize: 12, color: "#666" }}>
              Изменения сохраняются автоматически
            </p>

            {participants.map((p) => (
              <ParticipantCard
                key={p.id}
                className={
                  savingIds.has(p.id)
                    ? "saving"
                    : savedIds.has(p.id)
                    ? "saved"
                    : ""
                }
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <b>
                      {p.user.first_name} (@{p.user.username})
                    </b>
                  </div>
                  <SaveIndicator visible={savingIds.has(p.id)}>
                    Сохранение...
                  </SaveIndicator>
                  <SaveIndicator visible={savedIds.has(p.id)}>
                    ✓ Сохранено
                  </SaveIndicator>
                </div>

                <InputGroup>
                  <Label>Входы:</Label>
                  <CounterBtn
                    onClick={() => decrementValue(p.id, "entries", p.entries)}
                    disabled={p.entries === 0}
                  >
                    -
                  </CounterBtn>
                  <CountDisplay>{p.entries}</CountDisplay>
                  <CounterBtn
                    onClick={() => incrementValue(p.id, "entries", p.entries)}
                  >
                    +
                  </CounterBtn>
                </InputGroup>

                <InputGroup>
                  <Label>Ребаи:</Label>
                  <CounterBtn
                    onClick={() => decrementValue(p.id, "rebuys", p.rebuys)}
                    disabled={p.rebuys === 0}
                  >
                    -
                  </CounterBtn>
                  <CountDisplay>{p.rebuys}</CountDisplay>
                  <CounterBtn
                    onClick={() => incrementValue(p.id, "rebuys", p.rebuys)}
                  >
                    +
                  </CounterBtn>
                </InputGroup>

                <InputGroup>
                  <Label>Аддоны:</Label>
                  <CounterBtn
                    onClick={() => decrementValue(p.id, "addons", p.addons)}
                    disabled={p.addons === 0}
                  >
                    -
                  </CounterBtn>
                  <CountDisplay>{p.addons}</CountDisplay>
                  <CounterBtn
                    onClick={() => incrementValue(p.id, "addons", p.addons)}
                  >
                    +
                  </CounterBtn>
                </InputGroup>

                <Summary>
                  <b>Итого:</b> {calculateTotal(p)} руб.
                </Summary>
              </ParticipantCard>
            ))}

            <Summary style={{ background: "#c8e6c9", fontWeight: "bold" }}>
              <h4 style={{ margin: "5px 0" }}>
                Общая выручка: {calculateGameTotal()} руб.
              </h4>
            </Summary>

            <br />

            <CompleteBtn onClick={completeGame}>
              Завершить турнир
            </CompleteBtn>

            <Btn onClick={close}>Закрыть</Btn>
          </Modal>
        </ModalBg>
      )}

      {/* Модалка создания/редактирования */}
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
            {createMode ? (
              <Btn onClick={createGame}>Создать</Btn>
            ) : (
              <Btn onClick={save}>Сохранить</Btn>
            )}

            <Btn onClick={close}>Отмена</Btn>
          </Modal>
        </ModalBg>
      )}
    </div>
  );
}