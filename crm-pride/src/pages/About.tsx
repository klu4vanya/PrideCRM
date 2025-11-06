import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
  line-height: 1.6;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: #333;
  border-bottom: 2px solid #667eea;
  padding-bottom: 8px;
`;

const ContactInfo = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  margin-top: 15px;
`;

const About: React.FC = () => {
  return (
    <AboutContainer>
      <Section>
        <Title>🏢 О нашем покерном клубе</Title>
        <p>
          Добро пожаловать в лучший покерный клуб города! Мы создали уютную атмосферу 
          для любителей техасского холдема всех уровней подготовки.
        </p>
      </Section>

      <Section>
        <Title>🎯 Наши преимущества</Title>
        <ul>
          <li>✅ Профессиональные дилеры</li>
          <li>✅ Современное оборудование</li>
          <li>✅ Удобное расположение</li>
          <li>✅ Регулярные турниры</li>
          <li>✅ Честная игра</li>
          <li>✅ Приятная атмосфера</li>
        </ul>
      </Section>

      <Section>
        <Title>🕒 Режим работы</Title>
        <p><strong>Ежедневно:</strong> с 12:00 до 04:00</p>
        <p><strong>Турниры:</strong> по расписанию</p>
      </Section>

      <Section>
        <Title>📍 Контакты</Title>
        <ContactInfo>
          <p><strong>Адрес:</strong> г. Москва, ул. Покерная, д. 21</p>
          <p><strong>Телефон:</strong> +7 (495) 123-45-67</p>
          <p><strong>Email:</strong> info@poker-club.ru</p>
          <p><strong>Telegram:</strong> @pokerclub_support</p>
        </ContactInfo>
      </Section>

      <Section>
        <Title>🎪 Услуги</Title>
        <p>• Регулярные турниры с гарантированными призами</p>
        <p>• Кэш-игры разных лимитов</p>
        <p>• Обучение для начинающих</p>
        <p>• Организация приватных игр</p>
      </Section>
    </AboutContainer>
  );
};

export default About;