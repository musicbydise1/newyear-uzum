import { useState, useEffect } from 'react';

/**
 * Хук для определения, является ли устройство мобильным
 * @param {number} breakpoint - Breakpoint для определения мобильного устройства (по умолчанию 768px)
 * @returns {boolean} true, если устройство мобильное, иначе false
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Проверка на сервере (SSR)
    if (typeof window === 'undefined') {
      return;
    }

    // Функция для проверки размера экрана
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Проверка при монтировании
    checkIsMobile();

    // Добавление слушателя события resize
    window.addEventListener('resize', checkIsMobile);

    // Очистка слушателя при размонтировании
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [breakpoint]);

  return isMobile;
}

