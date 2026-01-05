import React, { useState } from "react";
import styled from "styled-components";
import { api } from "../../utils/api";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  background: #fff;
  color: #000;
  padding: 20px;
  border-radius: 12px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
`;

interface Props {
  user: any;
  onClose: () => void;
  onSave: () => void;
}

const UserEditModal: React.FC<Props> = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    username: user.username,
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
  });

  const update = async () => {
    try {
      await api.patch(`/users/${user.user_id}/`, form);
      onSave();
    } catch (e) {
      console.error("Update error:", e);
    }
  };

  return (
    <Overlay>
      <Modal>
        <h3>Редактировать пользователя</h3>

        <label>Имя</label>
        <input
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <label>Фамилия</label>
        <input
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        />

        <label>Имя</label>
        <input
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        />

        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <br /><br />

        <button onClick={update}>Сохранить</button>
        <button onClick={onClose} style={{ marginLeft: 10 }}>
          Закрыть
        </button>
      </Modal>
    </Overlay>
  );
};

export default UserEditModal;
