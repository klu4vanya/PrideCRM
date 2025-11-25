import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../utils/api"; // GET /support-tickets/

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: white;
  th, td { padding: 10px; border-bottom: 1px solid #444; }
  th { background: #222; }
`;

const TicketsTable: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    try {
      const res = await api.get("/support-tickets/");
      setTickets(res.data);
    } catch (e) {
      console.error("ticket load error:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/support-tickets/${id}/`, { status });
      loadTickets();
    } catch (e) {
      console.error("Ticket update:", e);
    }
  };

  if (loading) return <div>Загрузка тикетов…</div>;

  return (
    <Table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Юзер</th>
          <th>Тема</th>
          <th>Статус</th>
          <th>Изменить</th>
        </tr>
      </thead>

      <tbody>
        {tickets.map((t) => (
          <tr key={t.id}>
            <td>{t.id}</td>
            <td>{t.user}</td>
            <td>{t.subject}</td>
            <td>{t.status}</td>
            <td>
              <select
                defaultValue={t.status}
                onChange={(e) => updateStatus(t.id, e.target.value)}
              >
                <option value="open">Открыт</option>
                <option value="in_progress">В работе</option>
                <option value="closed">Закрыт</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TicketsTable;
