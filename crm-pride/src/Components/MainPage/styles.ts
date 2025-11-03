import styled from "styled-components";
import cursor from '../../assets/cursor_pika.png'


export const MainContainer = styled.div`
  transition: background-color 0.3s ease;
  background-color: black;
  margin: 0;
  padding: 0;
  position: absolute;
  width: 100%;
  height: auto;
  z-index: -999;
`;
export const CursorContainer = styled.div<{ x: number; y: number }>`
  position: fixed;
  width: 16px;
  height: 16px;
  background-image: url(${cursor});
  background-size: cover;
  background-repeat: no-repeat;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(1);
  transition: all 0.1s ease-out;
  z-index: 100;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;

  img {
    display: none;
    width: 70%;
  }
`;

export const Header = styled.header`
  position: relative;
  height: 100vh;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: -10;
    background: linear-gradient(rgba(0, 0, 0, 0), black);
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  margin: 5% 5% 0 5%;
  justify-content: space-between;
`;

export const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

export const NavItem = styled.li`
  margin-top: 1rem;

  a {
    color: #fff;
    cursor: pointer;
    text-decoration: none;
  }
`;

export const Logo = styled.div`
  width: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 100%;
  }

  p {
    color: #fff;
  }
`;

export const BackgroundVideo = styled.video`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -100;
`;

export const PhotoWrapper = styled.div`
  display: flex;
  margin-top: 10%;
  justify-content: center;
  height: 100%;
`;
export const  AboutUsTitle = styled.div`
  font-family: "Oswald", sans-serif;;
  font-size: 3.5rem;
  font-weight: 700;
  color: #d4af37; /* золотой цвет для премиальности */
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 35%;

  &.first-column {
    margin: 0 5% 0 0;
  }

  &.second-column {
    margin: 5% 0 0 0;
  }
`;

export const PhotoContainer = styled.div`
  transition: transform 0.3s ease, filter 0.3s ease;
  filter: brightness(50%);
  max-width: 80%;
  margin-top: 7%;

  &:hover {
    transform: scale(1.03);
    filter: brightness(100%);
    overflow: hidden;
  }

  img {
    object-fit: cover;
    height: 100%;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    height: auto;
    object-fit: cover;
    border-radius: 5px;
  }

  p {
    color: #fff;
  }
`;

export const KaraokeSection = styled.div`
  height: auto;
  text-align: center;
  width: 85%;
  margin: 7% auto 7% auto;
`;

export const KaraokeText = styled.span<{ backgroundPosition: string }>`
  font-family: "Roboto", sans-serif;
  background: linear-gradient(to right, #3f3f3f 50%, #fff 50%) 0 0 / 300% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  box-decoration-break: slice;
  -webkit-box-decoration-break: slice;
  background-position: ${(props) => props.backgroundPosition};
  font-size: 2.1rem;
  font-weight: 300;
  line-height: 1.8;
  color: #e0e0e0;
  text-align: justify;
  margin-bottom: 1.5rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    text-align: left;
    padding: 0 15px;
  }
`;
export const AccentText = styled.span`
  font-weight: 500;
  color: #d4af37;
  font-style: italic;
`;

export const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  text-align: center;
`;

export const HorizontalLine = styled.hr`
  border: none;
  height: 1px;
  background-color: grey;
  margin-bottom: 10%;

  &.margin-top {
    margin-top: 10%;
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ImageWrapper = styled.div`
  max-width: 40%;
  margin-left: 5%;

  img {
    width: 100%;
  }
`;

export const TitleText = styled.p`
  font-size: 3rem;
  color: #fff;
  width: 40%;
  text-align: justify;
`;

export const RunningTextWrapper = styled.div`
  overflow: hidden;
  height: 100vh;
  margin: 10% auto 0 auto;
`;

export const RunningText = styled.div<{ transform: string }>`
  position: relative;
  left: 0;
  font-size: 9vw;
  color: #fff;
  width: 400%;
  white-space: nowrap;
  overflow: visible;
  transform: ${(props) => props.transform};
  transition: transform 0.1s;
`;

export const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(to bottom, #000, rgba(0, 0, 0, 0));
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, #fff);
    z-index: 0;
  }
`;

export const BackgroundVideoFooter = styled.video`
  width: 100%;
  height: auto;
  object-fit: cover;
`;

export const MovingImagesWrapper = styled.div<{ isMobile: boolean }>`
  height: ${(props) => (props.isMobile ? "80vh" : "100vh")};
  overflow: hidden;
  background-color: #fff;
`;

export const ContainerCarousel = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MovingImagesRow = styled.div<{ transform: string }>`
  display: flex;
  transform: ${(props) => props.transform};
`;

export const MovingImage = styled.img<{ isMobile: boolean }>`
  width: ${(props) => (props.isMobile ? "60%" : "45%")};
  height: ${(props) => (props.isMobile ? "60%" : "50%")};
  border: 30px solid #000;
  object-fit: contain;
`;

export const Footer = styled.footer`
  background-color: #000;
  padding: 5% 0 5% 0;
`;

export const TitleFooter = styled.div`
  width: 80%;
  margin: 0 auto;
  font-family: "Dosis", sans-serif;
  font-optical-sizing: auto;
  font-weight: 200;
  font-style: normal;
  font-size: 5rem;
  color: #fff;

  p {
    font-size: 1rem;
    margin-top: 5%;
    display: flex;
    flex-direction: column;
  }

  a {
    font-size: 2rem;
    color: #d4af37;
    text-decoration: underline;
  }
`;
