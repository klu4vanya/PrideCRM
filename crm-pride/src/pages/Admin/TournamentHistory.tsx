import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../utils/api";

const Container = styled.div`
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .h3, b{
    color: #000
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;

  th,
  td {
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
    text-align: left;
    color: #000
  }

  th {
    background: #f5f5f5;
    font-weight: bold;
  }

  @media (max-width: 600px) {
    th,
    td {
      padding: 6px;
      font-size: 12px;
    }
  }
`;

const Btn = styled.button`
  padding: 8px 16px;
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
`;

const Summary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const SummaryCard = styled.div`
  background: linear-gradient(145deg, #f5f5f5, #e0e0e0);
  padding: 15px;
  border-radius: 8px;
  
  h4 {
    margin: 0 0 8px 0;
    color: #666;
    font-size: 14px;
  }
  
  p {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
`;

interface Tournament {
  id: number;
  date: string;
  time: string;
  tournament_name: string;
  location: string;
  buyin: number;
  reentry_buyin: number;
  total_revenue: number;
  participants_count: number;
  completed_at: string;
  participants?: Participant[];
}

interface Participant {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  entries: number;
  rebuys: number;
  addons: number;
  total_spent: number;
  position?: number;
  prize: number;
}

export default function TournamentHistory() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const loadTournaments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tournament-history/");
      setTournaments(res.data);
    } catch (error) {
      console.error("Ошибка загрузки истории:", error);
    }
    setLoading(false);
  };

  const loadParticipants = async (tournamentId: number) => {
    try {
      const res = await api.get(`/tournament-history/${tournamentId}/participants/`);
      setTournaments((prev) =>
        prev.map((t) =>
          t.id === tournamentId ? { ...t, participants: res.data } : t
        )
      );
    } catch (error) {
      console.error("Ошибка загрузки участников:", error);
    }
  };

  useEffect(() => {
    loadTournaments();
  }, []);

  const toggleExpand = async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      const tournament = tournaments.find((t) => t.id === id);
      if (tournament && !tournament.participants) {
        await loadParticipants(id);
      }
    }
  };

  if (loading) return <Container>Загрузка...</Container>;

  return (
    <Container>
      <h2>История турниров</h2>

      {tournaments.length === 0 && (
        <p>Нет завершенных турниров</p>
      )}

      {tournaments.map((tournament) => (
        <Card key={tournament.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <h3>{tournament.tournament_name}</h3>
              <p>
                <b>Дата:</b> {tournament.date} {tournament.time}
              </p>
              <p>
                <b>Локация:</b> {tournament.location}
              </p>
            </div>
            <Btn onClick={() => toggleExpand(tournament.id)}>
              {expandedId === tournament.id ? "Скрыть" : "Подробнее"}
            </Btn>
          </div>

          <Summary>
            <SummaryCard>
              <h4>Участников</h4>
              <p>{tournament.participants_count}</p>
            </SummaryCard>
            <SummaryCard>
              <h4>Общая выручка</h4>
              <p>{tournament.total_revenue} ₽</p>
            </SummaryCard>
          </Summary>

          {expandedId === tournament.id && tournament.participants && (
            <>
              <h4>Участники:</h4>
              <Table>
                <thead>
                  <tr>
                    <th>Игрок</th>
                    <th>Входы</th>
                    <th>Ребаи</th>
                    <th>Аддоны</th>
                    <th>Всего потрачено</th>
                  </tr>
                </thead>
                <tbody>
                  {tournament.participants.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <b>{p.first_name}</b> (@{p.username})
                      </td>
                      <td>{p.entries}</td>
                      <td>{p.rebuys}</td>
                      <td>{p.addons}</td>
                      <td><b>{p.total_spent} ₽</b></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Card>
      ))}
    </Container>
  );
}