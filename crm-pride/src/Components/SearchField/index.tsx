import React, { useState } from 'react';
import { 
  TextField, 
  InputAdornment, 
  IconButton,
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { StyledBox, StyledTextField } from './styles';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps){
  const [term, setTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <StyledBox>
      <StyledTextField
        fullWidth
        variant="outlined"
        placeholder="Поиск по нику..."
        value={term}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </StyledBox>
  );
};