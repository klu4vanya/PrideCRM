import { useEffect, useState } from "react";
import { CursorContainer } from "../MainPage/styles";

export const CustomCursor: React.FC = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
  
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        setPosition({ x: e.clientX, y: e.clientY });
      };
      const photos = document.querySelectorAll('.photo');
      const handleMouseEnter = () => setIsHovering(true);
      const handleMouseLeave = () => setIsHovering(false);
  
      photos.forEach(photo => {
        photo.addEventListener('mouseenter', handleMouseEnter);
        photo.addEventListener('mouseleave', handleMouseLeave);
      });
  
      document.addEventListener('mousemove', handleMouseMove);
  
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        photos.forEach(photo => {
          photo.removeEventListener('mouseenter', handleMouseEnter);
          photo.removeEventListener('mouseleave', handleMouseLeave);
        });
      };
    }, []);
  
    return (
      <CursorContainer 
        x={position.x} 
        y={position.y} 
        style={{ transform: `translate(-50%, -50%) scale(${isHovering ? 4 : 1})` }}
      >
        <img 
          src="assets/arrow.png" 
          style={{ display: isHovering ? 'block' : 'none' }} 
          alt="Cursor arrow" 
        />
      </CursorContainer>
    );
  };