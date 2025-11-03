import { useEffect, useState } from "react";
import {
  Overlay,
  DeckContainer,
  TournamentCard,
  CardFront,
  CardBack,
  Tournament,
  TournamentImage,
  TournamentTitle,
  BackTitle,
  BackDescription,
  TournamentInfo,
  InfoItem,
} from "./styles";
import knokout from '../../../assets/knokout.jpg'
import discipline from '../../../assets/discipline.jpg'
import season from '../../../assets/season.jpg'
import mystery from '../../../assets/mystery.jpg'
import freezout from '../../../assets/freezout.jpg'
import big_stack from '../../../assets/big_stack.jpg'

const tournamentData: Tournament[] = [
    {
      id: 1,
      image: knokout,
      title: 'Knokout Tournament',
      description: 'Турнир особого формата, в котором за выбивание оппонента вы получаете награду в виде 5 баллов в таблицу рейтинга! Победитель турнира уезжает домой на такси бизнес класса',
      date: '15.09.2024',
      time: '19:00',
      buyin: '1000 ₽',
      players: '50'
    },
    {
      id: 2,
      image: discipline,
      title: 'Discipline Tournament',
      description: 'Покерный турнир с ЕДИНСТВЕННОЙ возможгностью входа! Участников ждет невероятная атмосфера и шанс показать свои навыки!',
      date: '22.09.2024',
      time: '20:00',
      buyin: '1000 ₽',
      players: '30'
    },
    {
      id: 3,
      image: mystery,
      title: 'Mystery Bounty Tournament',
      description: 'Турнир развлекательного формата, в котором участники получают случайные призы за выбивание соперников ',
      date: '29.09.2024',
      time: '18:00',
      buyin: '1000 ₽',
      players: '40'
    },
    {
      id: 4,
      image: freezout,
      title: 'Freezout Tournament',
      description: 'Эксклюзивный турнир для опытных игроков.',
      date: '06.10.2024',
      time: '21:00',
      buyin: '2000 ₽',
      players: '20'
    },
    {
      id: 5,
      image: season,
      title: 'Season Tournament',
      description: 'Классический турнир с минимальной гарантией 300 баллов в таблицу рейтинга! Победитель получает бесплатный вход на любой турнир!',
      date: 'Каждый вторник',
      time: '19:30',
      buyin: '1000 ₽',
      players: '35'
    },
    {
      id: 6,
      image: big_stack,
      title: 'Big Stack Tournament',
      description: 'Турнир выходного дня с увеличенными начальными стеками и уровнями блаиндов!',
      date: '13.10.2024',
      time: '22:00',
      buyin: '1000 ₽',
      players: '25'
    }
  ];
  

  const ArcTournamentsDeck = () => {
    const [activeCard, setActiveCard] = useState<number | null>(null);
    const [flippedCard, setFlippedCard] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);
  
    // Определяем мобильное устройство
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }, []);
  
    const handleCardClick = (id: number) => {
      if (isMobile) {
        // На мобильных просто переворачиваем карту
        if (flippedCard === id) {
          setFlippedCard(null);
        } else {
          setFlippedCard(id);
          setActiveCard(id);
        }
      } else {
        // На десктопе старая логика
        if (activeCard === id) {
          if (flippedCard === id) {
            setFlippedCard(null);
            setTimeout(() => setActiveCard(null), 300);
          } else {
            setFlippedCard(id);
          }
        } else {
          setActiveCard(id);
          setFlippedCard(null);
        }
      }
    };
  
  
    // Параметры дуги
    const totalCards = tournamentData.length;
    const arcAngle = 90; // Угол дуги в градусах (меньше = более плотная дуга)
    const radius = 500; // Радиус дуги
    const startAngle = -arcAngle / 2; // Начальный угол (центрируем дугу)
  
    return (
      <>
        {/* <Overlay $visible={flippedCard !== null} onClick={() => setFlippedCard(null)} /> */}
        
        <DeckContainer>
          {tournamentData.map((tournament, index) => {
            // Распределение по дуге
            const angle = startAngle + (index / (totalCards - 1)) * arcAngle;
            const rotation = angle; // Поворот карты
            const isActive = activeCard === tournament.id;
            // Смещение по дуге (полярные координаты в декартовы)
            const offsetX = radius * Math.sin(angle * Math.PI / 180);
            const offsetY = -radius * (1 - Math.cos(angle * Math.PI / 180)); // Отрицательное для подъема вверх
            
            return (
              <TournamentCard
                key={tournament.id}
                $index={totalCards - index}
                $rotation={rotation}
                $offsetX={offsetX}
                $offsetY={offsetY}
                $isActive={activeCard === tournament.id}
                className={flippedCard === tournament.id ? 'flipped' : ''}
                onClick={() => handleCardClick(tournament.id)}
              >
                <CardFront>
                  <TournamentImage src={tournament.image} alt={tournament.title} />
                  <TournamentTitle>{tournament.title}</TournamentTitle>
                </CardFront>
                
                <CardBack>
                  <BackTitle>{tournament.title}</BackTitle>
                  <BackDescription>{tournament.description}</BackDescription>
                  
                  <TournamentInfo>
                    <InfoItem>
                      <strong>Дата</strong>
                      <span>{tournament.date}</span>
                    </InfoItem>
                    <InfoItem>
                      <strong>Время</strong>
                      <span>{tournament.time}</span>
                    </InfoItem>
                    <InfoItem>
                      <strong>Бай-ин</strong>
                      <span>{tournament.buyin}</span>
                    </InfoItem>
                    <InfoItem>
                      <strong>Игроки</strong>
                      <span>{tournament.players}</span>
                    </InfoItem>
                  </TournamentInfo>
                </CardBack>
              </TournamentCard>
            );
          })}
        </DeckContainer>
      </>
    );
  };
  
  export default ArcTournamentsDeck;