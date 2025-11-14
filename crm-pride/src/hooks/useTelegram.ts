import { useEffect, useState, useCallback } from "react";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export const useTelegram = () => {
  const [initData, setInitData] = useState<string>('');
  
  const applyTelegramTheme = useCallback((tg: any) => {
    if (tg?.themeParams) {
      const root = document.documentElement;

      if (tg.themeParams.bg_color) {
        root.style.setProperty("--tg-theme-bg-color", tg.themeParams.bg_color);
      }
      if (tg.themeParams.text_color) {
        root.style.setProperty(
          "--tg-theme-text-color",
          tg.themeParams.text_color
        );
      }
      if (tg.themeParams.button_color) {
        root.style.setProperty(
          "--tg-theme-button-color",
          tg.themeParams.button_color
        );
      }
      if (tg.themeParams.button_text_color) {
        root.style.setProperty(
          "--tg-theme-button-text-color",
          tg.themeParams.button_text_color
        );
      }
    }
  }, []);

  useEffect(() => {
    // Вызываем signIn при монтировании компонента,
    // передавая initData из Telegram WebApp API
    setInitData(window.Telegram.WebApp.initData);
  }, []);

  return {
    initData,
  };
};