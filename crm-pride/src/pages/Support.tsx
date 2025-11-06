import React, { useState } from 'react';
import styled from 'styled-components';
import { supportAPI } from '../utils/api';

const SupportContainer = styled.div`
  max-width: 600px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
`;

const Button = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? '#ccc' : '#2196F3'};
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background: ${props => props.disabled ? '#ccc' : '#1976D2'};
  }
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #c3e6cb;
`;

const ContactMethods = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 25px;
`;

const ContactCard = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  border: 1px solid #e9ecef;
`;

const Support: React.FC = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await supportAPI.createTicket(formData);
      setSubmitted(true);
      setFormData({ subject: '', message: '' });
    } catch (error) {
      alert('Ошибка при отправке сообщения. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <SupportContainer>
        <SuccessMessage>
          <h3>✅ Сообщение отправлено!</h3>
          <p>Мы получили ваше обращение и ответим в ближайшее время.</p>
          <button onClick={() => setSubmitted(false)}>
            Отправить новое сообщение
          </button>
        </SuccessMessage>
      </SupportContainer>
    );
  }

  return (
    <SupportContainer>
      <h2>💬 Служба поддержки</h2>
      <p>
        Если у вас возникли вопросы, проблемы с приложением или нужна помощь 
        администратора - напишите нам, и мы обязательно поможем!
      </p>

      <Form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="subject">Тема обращения:</label>
          <Input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Например: Проблема с регистрацией на игру"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="message">Подробное описание:</label>
          <TextArea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Опишите вашу проблему или вопрос максимально подробно..."
            required
            maxLength={1000}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Отправка...' : 'Отправить сообщение'}
        </Button>
      </Form>

      <ContactMethods>
        <ContactCard>
          <h3>📞 Телефон</h3>
          <p>+7 (495) 123-45-67</p>
          <small>Ежедневно 12:00-04:00</small>
        </ContactCard>

        <ContactCard>
          <h3>✉️ Telegram</h3>
          <p>@pokerclub_support</p>
          <small>Быстрый ответ</small>
        </ContactCard>

        <ContactCard>
          <h3>📧 Email</h3>
          <p>support@poker-club.ru</p>
          <small>Для официальных обращений</small>
        </ContactCard>

        <ContactCard>
          <h3>📍 Адрес</h3>
          <p>ул. Покерная, д. 21</p>
          <small>Приходите в гости!</small>
        </ContactCard>
      </ContactMethods>

      <div style={{ marginTop: '25px', padding: '15px', background: '#fff3cd', borderRadius: '8px' }}>
        <h4>🚨 Срочные вопросы</h4>
        <p>
          Если вам нужна срочная помощь во время игры или у вас технические проблемы 
          с приложением - звоните по телефону или пишите в Telegram для быстрого ответа.
        </p>
      </div>
    </SupportContainer>
  );
};

export default Support;