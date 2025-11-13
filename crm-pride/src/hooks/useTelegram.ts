import { useEffect, useState, useCallback } from 'react';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [webApp, setWebApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initData, setInitData] = useState<string | null>(null);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    
    if (tg) {
      tg.ready();
      tg.expand();

      setWebApp(tg);
      setUser(tg.initDataUnsafe.user || null);
      setInitData(tg.initData || null); 
      applyTelegramTheme(tg);
    }

    setIsLoading(false);
  }, []);

  const applyTelegramTheme = useCallback((tg: any) => {
    if (tg.themeParams) {
      const root = document.documentElement;
      
      if (tg.themeParams.bg_color) {
        root.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
      }
      if (tg.themeParams.text_color) {
        root.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
      }
      if (tg.themeParams.button_color) {
        root.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
      }
      if (tg.themeParams.button_text_color) {
        root.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color);
      }
    }
  }, []);

  const closeApp = useCallback(() => {
    webApp?.close();
  }, [webApp]);

  const showAlert = useCallback((message: string) => {
    if (webApp?.showAlert) {
      webApp.showAlert(message);
    } else {
      // Fallback для браузера
      alert(message);
    }
  }, [webApp]);

  return {
    // Состояние
    user,
    webApp,
    initData,
    isLoading,
    
    // Флаги
    isTelegram: !!webApp,
    isAuthenticated: !!user,
    
    // Методы
    closeApp,
    showAlert,
  };
};