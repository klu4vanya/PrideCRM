import styled, { keyframes } from "styled-components";

interface OverlayProps {
  $visible: boolean;
}

interface TournamentCardProps {
  $index: number;
  $rotation: number;
  $offsetX: number;
  $offsetY: number;
  $isActive?: boolean;
}

export interface Tournament {
  id: number;
  image: string;
  title: string;
  description: string;
  date: string;
  time: string;
  buyin: string;
  players: string;
}

// Анимации
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const cardFlip = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(180deg); }
`;

const cardUnflip = keyframes`
  0% { transform: rotateY(180deg); }
  100% { transform: rotateY(0deg); }
`;

/* Контейнер колоды */
export const DeckContainer = styled.div`
  @media (min-width: 769px) {
    position: relative;
    height: 500px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    perspective: 1000px;
    margin: 3% 0 200px 0;
    overflow: visible;
  }

  @media (max-width: 768px) {
    position: relative;
    height: auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin: 0 auto;
    perspective: 1000px;
  }
`;

/* Overlay */
export const Overlay = styled.div<OverlayProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  z-index: 90;
  animation: ${fadeIn} 0.3s ease;
  display: ${(props) => (props.$visible ? "block" : "none")};
`;

/* Карточка турнира */
export const TournamentCard = styled.div<TournamentCardProps>`
  position: relative;
  width: 90%;
  max-width: 350px;
  height: 350px;
  background: #fff;
  border-radius: 10px;
  border: 3px solid #d4af37;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.4s ease, z-index 0.4s ease;

  @media (min-width: 769px) {
    position: absolute;
    width: 250px;
    height: 350px;

    transform: ${(props) =>
      props.$isActive
        ? "rotate(0deg) translate(0, -120px) scale(1.15)"
        : `rotate(${props.$rotation}deg) translate(${props.$offsetX}px, ${props.$offsetY}px)`};

    z-index: ${(props) => (props.$isActive ? 100 : props.$index)};
  }

  @media (max-width: 768px) {
    /* Исправление для мобильных: скрываем заднюю сторону по умолчанию */
    transform-style: preserve-3d;
  }

  /* Убираем анимации и используем чистый transform для лучшей производительности */
  transform: ${(props) => {
    if (props.$isActive && window.innerWidth <= 768) {
      return 'rotateY(0deg)';
    }
    return '';
  }};
  
  &.flipped {
    transform: rotateY(180deg);
  }

  /* Убираем анимации keyframes и используем transition */
  transition: transform 0.6s ease, z-index 0.4s ease;
`;

/* Передняя сторона */
export const CardFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  /* На мобильных всегда показываем фронтальную сторону, если карта не перевернута */
  @media (max-width: 768px) {
    visibility: visible;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      transparent 40%,
      rgba(0, 0, 0, 0.9) 100%
    );
    z-index: 1;
  }
`;

export const TournamentImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const TournamentTitle = styled.h3`
  position: absolute;
  bottom: 12px;
  left: 0;
  right: 0;
  text-align: center;
  color: #fff;
  font-family: "Playfair Display", serif;
  font-size: 1rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  padding: 0 10px;
  z-index: 2;
  margin: 0;
  line-height: 1.2;
`;

/* Задняя сторона */
export const CardBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%; /* совпадает с фронтом */
  backface-visibility: hidden;
  border-radius: 8px;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  transform: rotateY(180deg);
  padding: 20px;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 3px solid #d4af37;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
`;

export const BackTitle = styled.h3`
  font-family: "Playfair Display", serif;
  color: #d4af37;
  font-size: 1.2rem;
  margin-bottom: 15px;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
`;

export const BackDescription = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 0.9rem;
  line-height: 1.4;
  color: #f0f0f0;
  margin-bottom: 15px;
`;

export const TournamentInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 10px;
`;

export const InfoItem = styled.div`
  text-align: center;
  padding: 6px;
  background: rgba(212, 175, 55, 0.15);
  border-radius: 4px;
  border: 1px solid rgba(212, 175, 55, 0.3);

  strong {
    display: block;
    color: #d4af37;
    font-size: 0.8rem;
    margin-bottom: 3px;
    font-weight: 600;
  }

  span {
    font-size: 0.85rem;
    color: #fff;
    font-weight: 500;
  }
`;

/* Подсказка */
export const HintText = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  text-align: center;
  color: #d4af37;
  font-family: "Roboto", sans-serif;
  font-size: 0.9rem;
  opacity: 0.7;
  z-index: 1;
`;
