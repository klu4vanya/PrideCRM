import { ReactNode } from "react";
import styled, { keyframes } from "styled-components";

// Типы
export interface FAQItemProps {
    $isOpen: boolean;
  }
  
 export interface FAQ {
    id: number;
    question: string;
    answer: string | ReactNode;
    category?: string;
  }
  
  // Анимации
  const slideDown = keyframes`
    from {
      opacity: 0;
      max-height: 0;
    }
    to {
      opacity: 1;
      max-height: 500px;
    }
  `;
  
  const slideUp = keyframes`
    from {
      opacity: 1;
      max-height: 500px;
    }
    to {
      opacity: 0;
      max-height: 0;
    }
  `;
  
  // Контейнер FAQ
  export const FAQContainer = styled.div`
    max-width: 1000px;
    margin: 80px auto;
    padding: 0 20px;
  `;
  
  
  // Карточка вопроса
  export const FAQItem = styled.div<FAQItemProps>`
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border: 2px solid ${(props) => (props.$isOpen ? "#d4af37" : "#333")};
    border-radius: 15px;
    margin-bottom: 15px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  
    &:hover {
      border-color: #d4af37;
      transform: translateY(-2px);
    }
  `;
  
  // Вопрос
  export const Question = styled.button<FAQItemProps>`
    width: 100%;
    padding: 25px 30px;
    background: none;
    border: none;
    color: ${(props) => (props.$isOpen ? "#d4af37" : "#fff")};
    font-family: "Playfair Display", serif;
    font-size: 1.3rem;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
  
    &::after {
      content: "${(props) => (props.$isOpen ? "−" : "+")}";
      font-size: 1.5rem;
      color: #d4af37;
      font-weight: 300;
    }
  
    &:hover {
      color: #d4af37;
    }
  `;
  
  // Ответ
  export const Answer = styled.div<FAQItemProps>`
    padding: ${(props) => (props.$isOpen ? "0 30px 25px 30px" : "0 30px")};
    color: #e0e0e0;
    font-family: "Roboto", sans-serif;
    font-size: 1rem;
    line-height: 1.6;
    animation: ${(props) => (props.$isOpen ? slideDown : slideUp)} 0.3s ease
      forwards;
    max-height: ${(props) => (props.$isOpen ? "500px" : "0")};
    overflow: hidden;
  `;
  
  // Категории
  export const CategoryFilter = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  `;
  
  export const CategoryButton = styled.button<{ $active: boolean }>`
    padding: 12px 24px;
    background: ${(props) => (props.$active ? "#d4af37" : "transparent")};
    border: 2px solid #d4af37;
    color: ${(props) => (props.$active ? "#000" : "#d4af37")};
    border-radius: 25px;
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  
    &:hover {
      background: #d4af37;
      color: #000;
      transform: translateY(-2px);
    }
  `;