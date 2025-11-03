import { ReactNode, useState } from "react";
import {
  Answer,
  CategoryButton,
  CategoryFilter,
  FAQ,
  FAQContainer,
  FAQItem,
  Question,
} from "./styles";

// Данные FAQ
const faqData: FAQ[] = [
  {
    id: 1,
    category: "general",
    question: "Что такое PRIDE POKER CLUB?",
    answer:
      "PRIDE POKER CLUB — это премиальное пространство для любителей покера, где игра ведется в дружеской атмосфере без денежных ставок. Мы сосредоточены на развитии навыков, стратегии и комьюнити.",
  },
  {
    id: 2,
    category: "general",
    question: "Нужно ли платить за участие в турнирах?",
    answer:
      "Да, участие в турнирах требует оплаты организационного взноса, также мы проводим иногда freeroll-турниры.",
  },
  {
    id: 3,
    category: "tournaments",
    question: "Как записаться на турнир?",
    answer: (
      <>
        Записаться на турнир Вы можете через наш{" "}
        <a
          style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
            fontStyle: "italic",
          }}
          href="https://t.me/pride_Poker_bot"
        >
          телеграм-бот
        </a>{" "}
        или через администратора.
      </>
    ),
  },
  {
    id: 4,
    category: "tournaments",
    question: "Какие форматы турниров вы проводите?",
    answer:
      "Мы проводим mtt-турниры разных форматов: нокаут-турниры, классический Holdem, Mystery Bounty, турниры с увеличенными стеками, а также freezout турнир без возможности повторно зайти.",
  },
  {
    id: 5,
    category: "rules",
    question: "Какие правила поведения в клубе?",
    answer: (
      <>
        В нашем клубе действуют строгие поведения за столами, больше о правилах
        в нашем{" "}
        <a
          style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
            fontStyle: "italic",
          }}
          href="https://t.me/Pride_Poker_Club/165"
        >
          тг-канале
        </a>
      </>
    ),
  },
  {
    id: 6,
    category: "rules",
    question: "Есть ли дресс-код?",
    answer:
      "Мы рекомендуем smart casual. В особых турнирах может действовать формальный дресс-код.",
  },
  {
    id: 7,
    category: "membership",
    question: "Как стать членом клуба?",
    answer: (
      <>
        Для членства необходимо подписаться на наш клуб в{" "}
        <a
          style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
            fontStyle: "italic",
          }}
          href="https://t.me/Pride_Poker_Club"
        >
          телеграме
        </a>{" "}
        и подписать нормативные документы.
      </>
    ),
  },
];

const FAQSection = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "Все вопросы" },
    { id: "general", name: "Общее" },
    { id: "tournaments", name: "Турниры" },
    { id: "rules", name: "Правила" },
    { id: "membership", name: "Членство" },
  ];

  const filteredFAQ =
    activeCategory === "all"
      ? faqData
      : faqData.filter((item) => item.category === activeCategory);

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <FAQContainer>
      <CategoryFilter>
        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            $active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </CategoryButton>
        ))}
      </CategoryFilter>

      {filteredFAQ.map((item) => (
        <FAQItem key={item.id} $isOpen={openItem === item.id}>
          <Question
            $isOpen={openItem === item.id}
            onClick={() => toggleItem(item.id)}
          >
            {item.question}
          </Question>
          <Answer $isOpen={openItem === item.id}>{item.answer}</Answer>
        </FAQItem>
      ))}
    </FAQContainer>
  );
};

export default FAQSection;
