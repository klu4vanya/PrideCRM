import React, { useState } from "react";
import {
  LogoContainer,
  LogoWrapper,
  MenuContainer,
  MenuItem,
  MenuLogoContainer,
  MenuWrapper,
} from "./styles";
import arrow from "../../assets/arrow_menu.svg";
import logo from "../../assets/logo_pride.jpeg";

const MenuItems = ["Расписание игр", "Мой профиль", "Игроки", "Рейтинг"];
const Hrefs = ['/schedule', '/myprofile', '/admin', '/ranked']

export default function Menu() {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleMenu = () => {
    if (isAnimating) return; 
    setIsAnimating(true);
    setOpenMenu(!openMenu);
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  // TODO: сделать кнопку "выйти из аккаунта и написать администратору"

  return (
    <>
      <MenuLogoContainer 
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          cursor: 'pointer',
          transition: 'transform 0.3s ease',
          transform: openMenu ? 'rotate(180deg)' : 'rotate(0deg)'
        }}
        onClick={handleMenu}
      >
        <img
          src={arrow}
          alt={openMenu ? "Закрыть меню" : "Открыть меню"}
        />
      </MenuLogoContainer>

      <MenuContainer
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '250px',
          height: '100vh',
          backgroundColor: '#ffffff',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
          transform: openMenu ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          zIndex: 999,
          paddingTop: '60px'
        }}
        onTransitionEnd={handleAnimationEnd}
      >
        <MenuWrapper>
          {MenuItems.map((item, index) => (
            <MenuItem 
              key={index}
              style={{
                padding: '15px 20px',
                transition: 'background-color 0.2s ease',
              }}
              href={Hrefs[index]}
            >
              {item}
            </MenuItem>
          ))}
        </MenuWrapper>
      </MenuContainer>
    </>
  );
}