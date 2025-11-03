import { Button } from "@mui/material";
import styled from "styled-components";

export const StyledButton = styled(Button)({
    minWidth: '40px',
    width: '40px',
    height: '40px',
    padding: 0,
    backgroundColor: '#5932EA',
    '&.MuiButton-root': {
    minWidth: '40px !important',
    padding: '0 !important',
    backgroundColor: '#5932EA',
  },
  
  '& .MuiTouchRipple-root': {
    width: '40px !important',
    height: '40px !important',
  },
  });