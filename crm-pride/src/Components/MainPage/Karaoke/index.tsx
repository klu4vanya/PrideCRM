import { useEffect, useRef, useState } from "react";
import { AccentText, KaraokeSection, KaraokeText } from "../styles";

export const Karaoke: React.FC = () => {
  const [backgroundPosition, setBackgroundPosition] = useState("0% center");
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const handleScroll = () => {
              if (targetRef.current) {
                const rect = targetRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const elementHeight = rect.height;
                const progress =
                  (windowHeight - rect.top) / (windowHeight + elementHeight);
                const newPosition = `${-progress * 100}% center`;
                setBackgroundPosition(newPosition);
              }
            };

            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <KaraokeSection id="text-gradient" ref={targetRef}>
      <KaraokeText backgroundPosition={backgroundPosition}>
        Добро пожаловать в <AccentText>PRIDE POKER CLUB!</AccentText> Наш
        покерный клуб — это уникальное пространство для любителей покера, где
        игра идет не на деньги, а на дружеском энтузиазме и интеллектуальном
        соперничестве. Мы открываем двери каждому, кто хочет погрузиться в мир
        покера, независимо от уровня подготовки.<br /> Наш покерный клуб — это
        идеальное место для поклонников покера, которые хотят играть и учиться в
        спокойной обстановке без финансового давления. Мы верим, что покер — это
        не только игра на деньги, но и способ укрепления дружбы, развития
        мышления и получения удовольствия от процесса.
      </KaraokeText>
    </KaraokeSection>
  );
};
