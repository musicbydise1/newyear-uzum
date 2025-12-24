import { useState, useEffect } from 'react';

/**
 * Хук для определения, является ли высота экрана меньше указанного breakpoint
 * @param {number} breakpoint - Breakpoint для определения низкого экрана (по умолчанию 650px)
 * @returns {boolean} true, если высота экрана меньше breakpoint, иначе false
 */
export function useIsShortScreen(breakpoint = 650) {
  const [isShortScreen, setIsShortScreen] = useState(false);

  useEffect(() => {
    // Проверка на сервере (SSR)
    if (typeof window === 'undefined') {
      return;
    }

    // Функция для проверки высоты экрана
    const checkIsShortScreen = () => {
      setIsShortScreen(window.innerHeight < breakpoint);
    };

    // Проверка при монтировании
    checkIsShortScreen();

    // Добавление слушателя события resize
    window.addEventListener('resize', checkIsShortScreen);

    // Очистка слушателя при размонтировании
    return () => {
      window.removeEventListener('resize', checkIsShortScreen);
    };
  }, [breakpoint]);

  return isShortScreen;
}

