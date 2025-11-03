import { useEffect, useState, useRef, useCallback } from "react";
import { 
  GalleryContainer, 
  GalleryTrack, 
  GalleryImage, 
  GalleryWrapper 
} from "./styles";

import image1 from '../../../assets/MovingImages/image1.jpg'
import image2 from '../../../assets/MovingImages/image2.jpg'
import image3 from '../../../assets/MovingImages/image3.jpg'
import image4 from '../../../assets/MovingImages/image4.jpg'
import image5 from '../../../assets/MovingImages/image5.jpg'
import image6 from '../../../assets/MovingImages/image6.jpg'

interface MovingImagesProps {
  images?: string[];
  scrollSpeed?: number;
  direction?: 'left' | 'right';
}

export const MovingImages: React.FC<MovingImagesProps> = ({ 
  images = [
    image1, image2, image3, image4
  ],
  scrollSpeed = 2,
  direction = 'left'
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 575);
  const [scrollPosition, setScrollPosition] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!galleryRef.current) return;

    const rect = galleryRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Позиция галереи относительно viewport
    const galleryTop = rect.top;
    const galleryBottom = rect.bottom;
    
    // Если галерея в поле зрения
    if (galleryBottom > 0 && galleryTop < viewportHeight) {
      // Прогресс скролла через галерею (0 до 1)
      const scrollProgress = 1 - (galleryBottom / (viewportHeight + rect.height));
      setScrollPosition(scrollProgress);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 769);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Вычисляем смещение для бесконечной прокрутки
  const getTransform = () => {
    const totalScroll = scrollPosition * scrollSpeed * 100;
    return direction === 'left' 
      ? `translateX(-${totalScroll}%)`
      : `translateX(${totalScroll}%)`;
  };

  // Дублируем изображения для бесшовной бесконечной прокрутки
  const duplicatedImages = [...images, ...images];

  return (
    <GalleryWrapper 
      ref={galleryRef}
      isMobile={isMobile}
    >
      <GalleryContainer>
        <GalleryTrack 
          ref={trackRef}
          style={{ transform: getTransform() }}
        >
          {duplicatedImages.map((image, index) => (
            <GalleryImage
              key={index}
              src={image}
              alt={`Gallery image ${index + 1}`}
              isMobile={isMobile}
            />
          ))}
        </GalleryTrack>
      </GalleryContainer>
    </GalleryWrapper>
  );
};