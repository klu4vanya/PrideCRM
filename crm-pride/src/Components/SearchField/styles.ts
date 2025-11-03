import { Box, TextField } from "@mui/material";
import styled from "styled-components";

export const StyledBox = styled(Box)`
    width: 216px;
    height: 38px;
`
export const StyledTextField = styled(TextField)`
     width: 216px;
     height: 38px;

     & .MuiInputBase-input {
    height: 38px;
    padding: 0;
    box-sizing: border-box;
  }

  & .MuiOutlinedInput-root {
    padding-left: 12px;
    padding-right: 4px;
  }

`;