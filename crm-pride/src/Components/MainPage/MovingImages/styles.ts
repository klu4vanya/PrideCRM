import styled from 'styled-components';

interface GalleryStyleProps {
  isMobile: boolean;
}

export const GalleryWrapper = styled.section<GalleryStyleProps>`
  position: relative;
  width: 100%;
  height: ${props => props.isMobile ? '300px' : '500px'};
  overflow: hidden;
  /* margin: 100px 0; */
  background-color: #000;
`;

export const GalleryContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const GalleryTrack = styled.div`
  display: flex;
  height: 100%;
  will-change: transform;
  transition: transform 0.1s ease-out;
  gap: 20px;
`;

export const GalleryImage = styled.img<GalleryStyleProps>`
  height: 100%;
  width: auto;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 12px;
  border: 6px solid #d4af37;
  
  ${props => props.isMobile && `
    width: 250px;
    height: 250px;
  `}
`;