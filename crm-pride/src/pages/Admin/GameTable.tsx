import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../utils/api"; // GET /games/

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: white;
  th, td { padding: 10px; border-bottom: 1px solid #444; }
  th { background: #222; }
`;

const GamesTable: React.FC = () => {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGames = async () => {
    try {
      const res = await api.get("/games/");
      setGames(res.data);
    } catch (e) {
      console.error("Games error:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGames();
  }, []);

  const deleteGame = async (id: number) => {
    if (!window.confirm("Удалить игру?")) return;
    try {
      await api.delete(`/games/${id}/`);
      loadGames();
    } catch (e) {
      console.error("Delete game error:", e);
    }
  };

  if (loading) return <div>Загрузка игр…</div>;

  return (
    <Table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Дата</th>
          <th>Время</th>
          <th>Опис.</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {games.map((g) => (
          <tr key={g.game_id}>
            <td>{g.game_id}</td>
            <td>{g.date}</td>
            <td>{g.time}</td>
            <td>{g.description}</td>
            <td>
              <button onClick={() => deleteGame(g.game_id)}>Удалить</button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default GamesTable;
