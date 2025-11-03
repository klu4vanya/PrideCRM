import { Button } from "@mui/material";
import styled from "styled-components";

export const MenuContainer = styled.div`
    position: fixed;
    width: 306px;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const LogoContainer = styled.div`
    width: 256px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: end;
`

export const LogoWrapper = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 50%;
`

export const MenuWrapper = styled.div`
    width: 250px;
    height: 344px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 140px;
`

export const MenuItem = styled(Button)`
&& {
    width: 250px;
    height: 46px;
    border-radius: 8px;
    background-color: #fff;
    color: #9197B3;
    text-transform: initial;
}
     &:active , &:hover{
        background-color: #5932EA;
        color: #fff;
     }
`

export const MenuLogoContainer = styled.div`
    width: 37px;
    height: 37px;
    object-fit: contain;
`