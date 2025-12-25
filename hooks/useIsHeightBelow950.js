import { useState, useEffect } from 'react';

/**
 * Хук для определения, является ли высота экрана меньше 950px
 * @returns {boolean} true, если высота экрана меньше 950px, иначе false
 */
export function useIsHeightBelow950() {
  const [isHeightBelow950, setIsHeightBelow950] = useState(false);

  useEffect(() => {
    // Проверка на сервере (SSR)
    if (typeof window === 'undefined') {
      return;
    }

    // Функция для проверки высоты экрана
    const checkHeight = () => {
      setIsHeightBelow950(window.innerHeight < 950);
    };

    // Проверка при монтировании
    checkHeight();

    // Добавление слушателя события resize
    window.addEventListener('resize', checkHeight);

    // Очистка слушателя при размонтировании
    return () => {
      window.removeEventListener('resize', checkHeight);
    };
  }, []);

  return isHeightBelow950;
}

