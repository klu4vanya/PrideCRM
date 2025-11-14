import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  background: var(--tg-theme-bg-color, #ffffff);
  padding: 16px;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 12px;
  margin-bottom: 20px;
`;

const NavButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const Content = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 20px;
  min-height: 400px;
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: '🎯 Расписание' },
    { path: '/rating', label: '🏆 Рейтинг' },
    { path: '/profile', label: '👤 Профиль' },
    { path: '/about', label: 'ℹ️ О клубе' },
    { path: '/support', label: '💬 Поддержка' },
  ];

  return (
    <Container>
      <Nav>
        {navItems.map((item) => (
          <NavButton
            key={item.path}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </NavButton>
        ))}
      </Nav>
      <Content>
        {children}
      </Content>
    </Container>
  );
};

export default Layout;