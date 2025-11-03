import { Karaoke } from "./Karaoke";
import { MovingImages } from "./MovingImages";
import { RunningTextComponent } from "./RunningText";
import {
  AboutUsTitle,
  BackgroundVideo,
  BackgroundVideoFooter,
  Column,
  Container,
  Footer,
  Header,
  HeaderWrapper,
  HorizontalLine,
  ImageWrapper,
  Logo,
  MainContainer,
  NavItem,
  NavList,
  PhotoContainer,
  PhotoWrapper,
  TitleFooter,
  TitleText,
  TitleWrapper,
  VideoWrapper,
} from "./styles";
import PrideVideo from "../../assets/pride_video.mp4";
import logo from "../../assets/logo png.png";

import { CustomCursor } from "../CustomCursor";
import TournamentDeckComponent from "./Tournaments";
import FAQSection from "./FAQ";
import DocSection from "./DocumentsInfo";
export const MainPage: React.FC = () => {

  return (
    <MainContainer>
      {/* <GlobalStyle /> */}
      {/* <CustomCursor /> */}

      <Header>
        <BackgroundVideo autoPlay muted loop playsInline id="background-video">
          <source src={PrideVideo} type="video/mp4" />
        </BackgroundVideo>
        <HeaderWrapper>
          <Logo>
            <img src={logo} alt="Logo" />
          </Logo>
          <NavList>
            <NavItem>{/* <a href="#photo-gallery">фото</a> */}</NavItem>
          </NavList>
        </HeaderWrapper>
      </Header>

      <AboutUsTitle>О нас</AboutUsTitle>

      <Karaoke />
      <AboutUsTitle>Наши турниры</AboutUsTitle>

      <TournamentDeckComponent />

      <AboutUsTitle>Часто задаваемые вопросы</AboutUsTitle>

      <FAQSection />

      <AboutUsTitle>Правовая информация</AboutUsTitle>

      <DocSection />

      <MovingImages />

      <Footer>
        <TitleFooter id="contacts">
          Будьте с нами на связи
          <p>
            <a href="https://t.me/Pride_Poker_Club">Наш телеграм канал</a>
          </p>
          <div style={{ position: "relative" }}>
            <a
              href="https://yandex.ru/maps/org/pride_sportivny_poker/18488261237/?utm_medium=mapframe&utm_source=maps"
              style={{
                color: "#eee",
                fontSize: "12px",
                position: "absolute",
                top: "0px",
              }}
            >
              Pride/Спортивный покер
            </a>
            <a
              href="https://yandex.ru/maps/213/moscow/category/board_games/184107267/?utm_medium=mapframe&utm_source=maps"
              style={{
                color: "#eee",
                fontSize: "12px",
                position: "absolute",
                top: "14px",
              }}
            >
              Настольные и интеллектуальные игры в Москве
            </a>
            <iframe
              src="https://yandex.ru/map-widget/v1/org/pride_sportivny_poker/18488261237/?ll=37.684110%2C55.771803&z=16.92"
              width="100%"
              height="500"
              allowFullScreen
              style={{
                position: "relative",
                borderRadius: "12px",
                border: "6px solid #d4af37",
              }}
            ></iframe>
          </div>
        </TitleFooter>
      </Footer>
    </MainContainer>
  );
};
