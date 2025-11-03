import { Dialog, IconButton, TextField, Button } from "@mui/material";
import styled from "styled-components";
import EditProfileModal from ".";

export const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  background: white;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  font-family: 'Roboto', sans-serif;
`;

export const CloseButton = styled(IconButton)`
  && {
    color: #666;
    padding: 8px;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
      color: #333;
    }
  }
`;

export const ModalContent = styled.div`
  padding: 20px 24px 24px 24px;
  background: white;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormRow = styled.div`
  margin-bottom: 16px;
`;

export const StyledTextField = styled(TextField)`
  && {
    .MuiOutlinedInput-root {
      border-radius: 8px;
      
      &:hover .MuiOutlinedInput-notchedOutline {
        border-color: #5932EA;
      }
      
      &.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: #5932EA;
        border-width: 2px;
      }
    }
    
    .MuiInputLabel-root {
      color: #666;
      
      &.Mui-focused {
        color: #5932EA;
      }
    }
    
    .MuiFormHelperText-root {
      margin-left: 0;
      margin-top: 4px;
    }
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
`;

export const CancelButton = styled(Button)`
  && {
    padding: 10px 24px;
    border-radius: 8px;
    border: 1px solid #dc3545;
    color: #dc3545;
    text-transform: none;
    font-weight: 500;
    font-size: 0.875rem;
    
    &:hover {
      background-color: rgba(220, 53, 69, 0.04);
      border-color: #dc3545;
    }
  }
`;

export const SaveButton = styled(Button)`
  && {
    padding: 10px 24px;
    border-radius: 8px;
    background-color: #5932EA;
    color: white;
    text-transform: none;
    font-weight: 500;
    font-size: 0.875rem;
    
    &:hover {
      background-color: #4a25d9;
    }
    
    &:disabled {
      background-color: #cccccc;
      color: #666666;
    }
  }
`;
