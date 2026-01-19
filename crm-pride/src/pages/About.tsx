import React from "react";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: "Arial", sans-serif;
  color: #333;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: #d85509;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
`;


const StatsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
  text-align: center;
`;

const StatCard = styled.div`
  padding: 20px;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const AboutSection = styled.section`
  background: #e1e1e1;
  padding: 50px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
`;

const AboutContent = styled.div`
  line-height: 1.8;
  font-size: 1.1rem;
  color: #555;
  text-align: justify;

  p {
    margin-bottom: 20px;
  }
`;

// Main Component
const PridePokerClub: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>Pride Poker Club</Title>
      </Header>

      <StatsSection>
        <StatCard>
          <StatNumber>900+</StatNumber>
          <StatLabel>Участников</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>5</StatNumber>
          <StatLabel>Турниров в неделю</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>FREEROLL</StatNumber>
          <StatLabel>Турниры каждую неделю</StatLabel>
        </StatCard>
      </StatsSection>

      <AboutSection>
        <SectionTitle>О клубе</SectionTitle>
        <AboutContent>
          <p>
            Добро пожаловать в PRIDE POKER CLUB! Наш покерный клуб — это
            уникальное пространство для любителей покера, где игра идет не на
            деньги, а на дружеском энтузиазме и интеллектуальном соперничестве.
            Мы открываем двери каждому, кто хочет погрузиться в мир покера,
            независимо от уровня подготовки.
            <br />
            <h3>1. Атмосфера</h3>
            Клуб предлагает уютную и непринужденную атмосферу, где каждый игрок
            сможет расслабиться и насладиться игрой. Яркое освещение, удобные
            столы и стулья создают идеальные условия для долгих вечеров за
            покерными столами. Мы заботимся о комфорте наших гостей, предлагая
            бесплатные закуски и напитки.
            <br />
            <h3>2. Организация игр</h3>
            В нашем клубе проводятся регулярные турниры и игровые вечера, на
            которых игроки могут показать свои навыки и побороться за призы. Мы
            организуем различные форматы турниров — от классического МТТ, до
            многим известных вариантов, таких как нокаут и мистери баунти!
            Участники могут приходить как с друзьями, так и в одиночку, находя
            новых знакомых и единомышленников.
            <br />
            <h3>3. Обучение и развитие</h3>
            Для новичков мы предлагаем мастер-классы и обучающие сессии, где
            опытные игроки делятся своими знаниями и стратегиями. Мы стремимся
            создать сообщество, где каждый может расти и развиваться, улучшая
            свои навыки в покере.
            <br />
            <h3>4. Коммуникация и сообщество</h3>
            Клуб — это не только место для игры, но и место для общения. Мы
            создаем условия для дружеского общения между игроками через
            тематические мероприятия и социальные сети. Участники могут делиться
            опытом, обсуждать стратегии и просто проводить время вместе. Наш
            покерный клуб — это идеальное место для поклонников покера, которые
            хотят играть и учиться в спокойной обстановке без финансового
            давления. Мы верим, что покер — это не только игра на деньги, но и
            способ укрепления дружбы, развития мышления и получения удовольствия
            от процесса.
          </p>
          <p>
            <h3>А это законно?</h3>
            Сама игра в покер не запрещена, так же, как и не запрещена игра в
            мафию, нарды или шахматы! Законом РФ запрещена организация и
            проведение азартных игр. Согласно данным статьям, азартная игра —
            это основанное на риске соглашение о выигрыше денежных средств. Eсли
            игра ведётся на деньги или любые другие материальные ценности или
            права, то такая игра является азартной. В нашем клубе игра
            проводится без использования каких-либо денежных средств и не
            предусматривает никакого денежного или любого другого материального
            выигрыша. Таким образом игра не является азартной, а значит
            абсолютно легальна!
          </p>
        </AboutContent>
      </AboutSection>
    </Container>
  );
};

export default PridePokerClub;
