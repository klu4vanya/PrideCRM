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
  const [isReady, setIsReady] = useState(false);
  
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
    const initTelegram = () => {
      const tg = window.Telegram?.WebApp;
      
      if (tg) {
        console.log("📱 Telegram WebApp detected, initializing...");
        
        // Обязательные методы для мобильных устройств
        tg.ready();
        tg.expand(); // Раскрываем на весь экран
        
        // Применяем тему
        applyTelegramTheme(tg);
        
        // Устанавливаем initData
        const initData = tg.initData || '';
        setInitData(initData);
        console.log("✅ Telegram WebApp initialized, initData:", initData ? "present" : "empty");
        
        setIsReady(true);
        
        
      } else {
        console.warn("⚠️ Telegram WebApp not found, running in standalone mode");
        setIsReady(true);
      }
    };

    // Ждем загрузки Telegram WebApp скрипта
    if (window.Telegram) {
      initTelegram();
    } else {
      // Если скрипт еще не загружен, ждем
      const checkTelegram = setInterval(() => {
        if (window.Telegram) {
          clearInterval(checkTelegram);
          initTelegram();
        }
      }, 100);
      
      // Таймаут на 3 секунды
      setTimeout(() => {
        clearInterval(checkTelegram);
        if (!window.Telegram) {
          console.warn("⏰ Telegram WebApp loading timeout");
          setIsReady(true);
        }
      }, 3000);
    }
  }, [applyTelegramTheme]);

  return {
    initData,
    applyTelegramTheme,
    isReady,
    webApp: window.Telegram?.WebApp
  };
};