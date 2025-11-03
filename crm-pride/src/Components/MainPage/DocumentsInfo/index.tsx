import { ReactNode, useState } from "react";
import {
  Answer,
  CategoryButton,
  CategoryFilter,
  FAQ,
  FAQContainer,
  FAQItem,
  Question,
} from "../FAQ/styles";
import offerta from '../../../assets/Договор_оферта_Прайд_Покер_Клуб_1.pdf'
import dop_sogl from '../../../assets/Доп_соглашение_Покер_Клуб.pdf'
import rules from '../../../assets/Правила_мероприятия_Покер_Клуб.pdf'
import list_ozn from '../../../assets/Лист_ознакомления_Покер_Клуб.pdf'
const DocData: FAQ[] = [
  {
    id: 1,
    question:
      "Публичный договор (договор-оферта) на оказание услуг по проведению развлекательных мероприятий",
    answer: <>
     <div style={{ textAlign: 'center' }}>
        <iframe 
          src={offerta} 
          width="100%" 
          height="600px" 
          title="Договор оферта"
        />
        <br />
        <a 
          href={offerta} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
        </a>
      </div>
    </>,
  },
  {
    id: 2,
    question:
      "Дополнительное соглашение к публичному договору на оказание услуг по проведению развлекательных мероприятий",
    answer: <>
      <div style={{ textAlign: 'center' }}>
        <iframe 
          src={dop_sogl} 
          width="100%" 
          height="600px" 
          title="Договор оферта"
        />
        <br />
        <a 
          href={dop_sogl} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
        </a>
      </div>
    </>,
  },
  {
    id: 3,
    question:
      "Приложение №1 к Публичному Договору На оказание услуг по проведению развлекательных мероприятий",
    answer: <>
      <div style={{ textAlign: 'center' }}>
        <iframe 
          src={rules} 
          width="100%" 
          height="600px" 
          title="Договор оферта"
        />
        <br />
        <a 
          href={rules} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
        </a>
      </div>
    </>,
  },
  
  {
    id: 4,
    question: "Лист ознакомления",
    answer: <>
      <div style={{ textAlign: 'center' }}>
        <iframe 
          src={list_ozn} 
          width="100%" 
          height="600px" 
          title="Договор оферта"
        />
        <br />
        <a 
          href={list_ozn} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
        </a>
      </div>
    </>,
  },
];

const DocSection = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <FAQContainer>
      {DocData.map((item) => (
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

export default DocSection;
