import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Avatar,
  Divider,
  Stack,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Close,
  Send,
  Person,
} from "@mui/icons-material";
import { User } from "@/types";
import { StyledButton } from "./styles";
import edit_button from "../../../assets/edit-icon.svg";
import EditProfileModal from "./EditProfileModal";
import { userAPI } from "../../../api";

// Стили для модального окна
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  outline: "none",
};

// Тип для данных точек
interface PointsData {
  entry: number;
  rebuy: number;
  addon: number;
  sum: number;
  timestamp: number;
}

// Компонент модального окна
export const UserModal: React.FC<{
  user: User;
  open: boolean;
  onClose: () => void;
}> = ({ user, open, onClose }) => {
  const [entry, setEntry] = useState<number>(0);
  const [rebuy, setRebuy] = useState<number>(0);
  const [addon, setAddon] = useState<number>(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const sum = entry * 1000 + rebuy * 1000 + addon * 2000;

  // Ключ для localStorage
  const storageKey = `user_${user.user_id}_points`;

  // Загружаем сохраненные данные при открытии модалки
  useEffect(() => {
    if (open && user.user_id) {
      loadFromLocalStorage();
    }
  }, [open, user.user_id]);

  // Автосохранение при изменении данных
  useEffect(() => {
    if (hasUnsavedChanges) {
      saveToLocalStorage();
    }
  }, [entry, rebuy, addon, hasUnsavedChanges]);

  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data: PointsData = JSON.parse(saved);
        setEntry(data.entry || 0);
        setRebuy(data.rebuy || 0);
        setAddon(data.addon || 0);
        setHasUnsavedChanges(false);
        console.log('Данные загружены из localStorage:', data);
      }
    } catch (error) {
      console.error('Ошибка загрузки из localStorage:', error);
    }
  };

  const saveToLocalStorage = () => {
    try {
      const pointsData: PointsData = {
        entry,
        rebuy,
        addon,
        sum,
        timestamp: Date.now()
      };

      localStorage.setItem(storageKey, JSON.stringify(pointsData));
      setHasUnsavedChanges(false);
      
      console.log('Данные сохранены в localStorage:', pointsData);
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при сохранении данных',
        severity: 'error'
      });
    }
  };

  const clearLocalStorage = () => {
    try {
      localStorage.removeItem(storageKey);
      console.log('Данные очищены из localStorage');
    } catch (error) {
      console.error('Ошибка очистки localStorage:', error);
    }
  };

  const handleIncrement = (type: 'entry' | 'rebuy' | 'addon') => {
    setHasUnsavedChanges(true);
    switch (type) {
      case 'entry':
        setEntry(prev => prev + 1);
        break;
      case 'rebuy':
        setRebuy(prev => prev + 1);
        break;
      case 'addon':
        setAddon(prev => prev + 1);
        break;
    }
  };

  const handleDecrement = (type: 'entry' | 'rebuy' | 'addon') => {
    setHasUnsavedChanges(true);
    switch (type) {
      case 'entry':
        setEntry(prev => Math.max(0, prev - 1));
        break;
      case 'rebuy':
        setRebuy(prev => Math.max(0, prev - 1));
        break;
      case 'addon':
        setAddon(prev => Math.max(0, prev - 1));
        break;
    }
  };

  const handleReset = () => {
    setEntry(0);
    setRebuy(0);
    setAddon(0);
    setHasUnsavedChanges(true);
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      saveToLocalStorage();
      setSnackbar({
        open: true,
        message: 'Данные автоматически сохранены',
        severity: 'success'
      });
    }
    onClose();
  };

  const handleSave = (updatedData: any) => {
    try {
      // Ваша существующая логика сохранения профиля
      console.log('Профиль обновлен:', updatedData);
      setSnackbar({
        open: true,
        message: 'Профиль успешно обновлен!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при сохранении данных',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>

          <Stack spacing={3}>
            {/* Заголовок и аватар */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <Avatar src={user.photo} sx={{ width: 80, height: 80, mb: 2 }}>
                  {!user.photo && <Person fontSize="large" />}
                </Avatar>
                <StyledButton
                  sx={{
                    backgroundImage: `url(${edit_button}) !important`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                    width: "40px",
                    height: "40px",
                    minWidth: "40px",
                    backgroundColor: '#5932EA',
                    '&:hover': {
                      backgroundColor: '#4a25d9',
                    }
                  }}
                  onClick={() => setIsEditModalOpen(true)}
                />
              </Box>
              <Typography variant="h5" component="h2">
                {user.first_name}, {user.last_name}
              </Typography>
              <Typography color="text.secondary">@{user.username}</Typography>
              {hasUnsavedChanges && (
                <Typography color="warning.main" variant="caption">
                  Есть несохраненные изменения
                </Typography>
              )}
            </Box>

            <Divider />

            {/* Основная информация */}
            <Stack spacing={2}>
              {/* Entry */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography>Вход</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <StyledButton
                    variant="contained"
                    onClick={() => handleDecrement('entry')}
                    disabled={entry === 0}
                  >
                    -
                  </StyledButton>
                  <Typography sx={{ minWidth: '30px', textAlign: 'center' }}>{entry}</Typography>
                  <StyledButton
                    variant="contained"
                    onClick={() => handleIncrement('entry')}
                  >
                    +
                  </StyledButton>
                </Box>
              </Box>

              {/* Rebuy */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography>Ребай</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <StyledButton
                    variant="contained"
                    onClick={() => handleDecrement('rebuy')}
                    disabled={rebuy === 0}
                  >
                    -
                  </StyledButton>
                  <Typography sx={{ minWidth: '30px', textAlign: 'center' }}>{rebuy}</Typography>
                  <StyledButton
                    variant="contained"
                    onClick={() => handleIncrement('rebuy')}
                  >
                    +
                  </StyledButton>
                </Box>
              </Box>

              {/* Addon */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography>Аддон</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <StyledButton
                    variant="contained"
                    onClick={() => handleDecrement('addon')}
                    disabled={addon === 0}
                  >
                    -
                  </StyledButton>
                  <Typography sx={{ minWidth: '30px', textAlign: 'center' }}>{addon}</Typography>
                  <StyledButton
                    variant="contained"
                    onClick={() => handleIncrement('addon')}
                  >
                    +
                  </StyledButton>
                </Box>
              </Box>

              {/* Итог */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="h6">Итоговая стоимость:</Typography>
                <Typography variant="h6">{sum}₽</Typography>
              </Box>

              {/* Кнопка сброса */}
              <StyledButton
                variant="outlined"
                onClick={handleReset}
                fullWidth
                disabled={entry === 0 && rebuy === 0 && addon === 0}
              >
                Сбросить все
              </StyledButton>
            </Stack>

            <Divider />

            {/* Кнопка Telegram */}
            <StyledButton
              variant="contained"
              startIcon={<Send />}
              onClick={() => window.open(`https://t.me/${user.username}`, "_blank")}
              fullWidth
            >
              Написать в Telegram
            </StyledButton>
          </Stack>
        </Box>
      </Modal>

      {/* Модальное окно редактирования профиля */}
      <EditProfileModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={user}
        onSave={handleSave}
      />

      {/* Уведомления */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};