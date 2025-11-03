import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { StyledDialog, ModalHeader, ModalTitle, CloseButton, ModalContent, FormRow, StyledTextField, ActionButtons, CancelButton, SaveButton } from './styles';
import { userAPI, User, UpdateUserData } from '../../../../api';

// Определяем типы
interface UserData {
  user_id?: number;
  nickname?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  date_of_birth?: string;
  phone?: string;
  phone_number?: string;
}

interface FormData {
  nickname: string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  phone: string;
}

interface Errors {
  nickname?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  date_of_birth?: string;
  phone?: string;
}

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  userData?: UserData;
  onSave?: (data: FormData) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ open, onClose, userData, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    nickname: '',
    first_name: '',
    last_name: '',
    email: '',
    date_of_birth: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  // Заполняем форму данными пользователя при открытии модального окна
  useEffect(() => {
    if (userData && open) {
      // Разбиваем полное имя на first_name и last_name если нужно
      const fullName = userData.first_name && userData.last_name 
        ? `${userData.first_name} ${userData.last_name}`
        : '';
      
      setFormData({
        nickname: userData.nickname || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        date_of_birth: userData.date_of_birth || '',
        phone: userData.phone || userData.phone_number || ''
      });
    }
  }, [userData, open]);

  const handleChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.nickname.trim()) {
      newErrors.nickname = 'Никнейм обязателен';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Имя обязательно';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Фамилия обязательна';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен';
    } else if (!/^[\+]?[0-9\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Неверный формат телефона';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (userData?.user_id) {
        // Подготавливаем данные для отправки
        const updateData: UpdateUserData = {
          nickname: formData.nickname,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          date_of_birth: formData.date_of_birth,
          phone: formData.phone
        };

        // Отправляем данные на сервер
        const response = await userAPI.updateUserPartial(userData.user_id, updateData);
        
        // Показываем уведомление об успехе
        setSnackbar({
          open: true,
          message: 'Данные успешно сохранены!',
          severity: 'success'
        });

        // Если передана callback-функция, вызываем её
        if (onSave) {
          onSave(formData);
        }

        console.log('Данные успешно отправлены на сервер:', response.data);
        
      } else {
        setSnackbar({
          open: true,
          message: 'Ошибка: ID пользователя не найден',
          severity: 'error'
        });
      }
    } catch (error: any) {
      console.error('Ошибка при сохранении:', error);
      
      // Обрабатываем ошибки от сервера
      let errorMessage = 'Ошибка при сохранении данных';
      
      if (error.response?.data) {
        const serverErrors = error.response.data;
        
        // Обработка ошибок валидации Django
        if (typeof serverErrors === 'object') {
          const errorMessages = Object.entries(serverErrors)
            .map(([field, errors]) => {
              const fieldName = getFieldDisplayName(field);
              return `${fieldName}: ${Array.isArray(errors) ? errors.join(', ') : errors}`;
            })
            .join('; ');
          
          errorMessage = errorMessages || 'Ошибка валидации данных';
        } else {
          errorMessage = serverErrors;
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setLoading(false);
    onClose();
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Вспомогательная функция для отображения имен полей
  const getFieldDisplayName = (field: string): string => {
    const fieldNames: { [key: string]: string } = {
      nickname: 'Никнейм',
      first_name: 'Имя',
      last_name: 'Фамилия',
      email: 'Email',
      date_of_birth: 'Дата рождения',
      phone: 'Телефон'
    };
    
    return fieldNames[field] || field;
  };

  return (
    <>
      <StyledDialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <ModalHeader>
          <ModalTitle>Редактирование профиля</ModalTitle>
          <CloseButton onClick={handleClose} disabled={loading}>
            {/* <CloseIcon /> */}
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <form onSubmit={handleSubmit}>
            <FormRow>
              <StyledTextField
                label="Никнейм"
                value={formData.nickname}
                onChange={handleChange('nickname')}
                error={!!errors.nickname}
                helperText={errors.nickname}
                disabled={loading}
                fullWidth
              />
            </FormRow>

            <FormRow>
              <StyledTextField
                label="Имя"
                value={formData.first_name}
                onChange={handleChange('first_name')}
                error={!!errors.first_name}
                helperText={errors.first_name}
                disabled={loading}
                fullWidth
              />
            </FormRow>

            <FormRow>
              <StyledTextField
                label="Фамилия"
                value={formData.last_name}
                onChange={handleChange('last_name')}
                error={!!errors.last_name}
                helperText={errors.last_name}
                disabled={loading}
                fullWidth
              />
            </FormRow>

            <FormRow>
              <StyledTextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                disabled={loading}
                fullWidth
              />
            </FormRow>

            <FormRow>
              <StyledTextField
                label="Дата рождения"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange('date_of_birth')}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={loading}
                fullWidth
              />
            </FormRow>

            <FormRow>
              <StyledTextField
                label="Номер телефона"
                value={formData.phone}
                onChange={handleChange('phone')}
                error={!!errors.phone}
                helperText={errors.phone}
                disabled={loading}
                fullWidth
              />
            </FormRow>

            <ActionButtons>
              <CancelButton 
                type="button" 
                onClick={handleClose}
                variant="outlined"
                disabled={loading}
              >
                Отмена
              </CancelButton>
              <SaveButton 
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? 'Сохранение...' : 'Сохранить'}
              </SaveButton>
            </ActionButtons>
          </form>
        </ModalContent>
      </StyledDialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
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

export default EditProfileModal;