import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./WishModal.module.scss";
import { gsap } from "gsap";
import { getRandomWish } from "../constants/wishes";
import Logo from "./Logo";
import { useIsMobile } from '../hooks/useIsMobile';
import html2canvas from 'html2canvas';

export default function WishModal({ isOpen, onClose, locale, shareButton, downloadButton }) {
  const overlayRef = useRef();
  const boxRef = useRef();
  const modalRef = useRef();
  const contentWrapperRef = useRef();
  const modalButtonsRef = useRef();
  const closeButtonRef = useRef();
  const [showBox, setShowBox] = useState(false);
  const [showOpenBox, setShowOpenBox] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [wishText, setWishText] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isOpen) {
      // Выбираем случайное пожелание
      const randomWish = getRandomWish(locale);
      setWishText(randomWish);
      
      // Сброс состояний
      setShowBox(false);
      setShowOpenBox(false);
      setShowModal(false);

      // Появление темного фона
      gsap.set(overlayRef.current, { opacity: 0, display: "flex" });
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      // Появление коробки
      setTimeout(() => {
        setShowBox(true);
        gsap.set(boxRef.current, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
        gsap.fromTo(
          boxRef.current,
          {
            scale: 0,
            rotation: 0,
            opacity: 0,
            xPercent: -50,
            yPercent: -50,
          },
          {
            scale: 1,
            opacity: 1,
            xPercent: -50,
            yPercent: -50,
            duration: 0.5,
            ease: "back.out(1.7)",
          }
        );

        // Анимация вращения коробки (как будто открывается)
        gsap.to(boxRef.current, {
          rotation: 360,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            // Замена на открытую коробку
            setShowBox(false);
            setShowOpenBox(true);
            gsap.set(boxRef.current, { rotation: 0, xPercent: -50, yPercent: -50 });
            gsap.fromTo(
              boxRef.current,
              {
                scale: 0.8,
                opacity: 0,
                xPercent: -50,
                yPercent: -50,
              },
              {
                scale: 1,
                opacity: 1,
                xPercent: -50,
                yPercent: -50,
                duration: 0.4,
                ease: "back.out(1.7)",
              }
            );

            // Появление модалки через 1.5 секунды (масштабирование из центра)
            setTimeout(() => {
              // Сначала показываем модалку
              setShowModal(true);
              
              // Ждем следующий кадр, чтобы элемент был в DOM
              requestAnimationFrame(() => {
                // Устанавливаем начальную позицию модалки (очень маленький размер в центре)
                // Используем clearProps для очистки CSS transform, чтобы GSAP мог управлять
                gsap.set(modalRef.current, {
                  clearProps: "transform",
                  opacity: 0,
                  scale: 0.1,
                  xPercent: -50,
                  yPercent: -50,
                });
                
                // Анимация появления с масштабированием из центра
                gsap.to(modalRef.current, {
                  opacity: 1,
                  scale: 1,
                  xPercent: -50,
                  yPercent: -50,
                  duration: 0.8,
                  ease: "back.out(2)",
                });
                
                // Одновременно поднимаем и скрываем коробку
                gsap.to(boxRef.current, {
                  yPercent: -50,
                  y: -100,
                  opacity: 0,
                  scale: 0.6,
                  duration: 0.8,
                  ease: "power2.in",
                });
              });
            }, 1500);
          },
        });
      }, 300);
    } else {
      // Закрытие модалки
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.set(overlayRef.current, { display: "none" });
          setShowBox(false);
          setShowOpenBox(false);
          setShowModal(false);
        },
      });
    }
  }, [isOpen, locale]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        text: wishText,
      }).catch(console.error);
    } else {
      // Fallback - копирование в буфер обмена
      navigator.clipboard.writeText(wishText).then(() => {
        alert("Текст скопирован в буфер обмена!");
      });
    }
  };

  const handleDownload = async () => {
    if (!contentWrapperRef.current) return;

    try {
      // Скрываем кнопки и кнопку закрытия перед созданием скриншота
      const originalButtonsDisplay = modalButtonsRef.current?.style.display;
      const originalCloseDisplay = closeButtonRef.current?.style.display;
      
      if (modalButtonsRef.current) {
        modalButtonsRef.current.style.display = 'none';
      }
      if (closeButtonRef.current) {
        closeButtonRef.current.style.display = 'none';
      }

      // Небольшая задержка для применения стилей
      await new Promise(resolve => setTimeout(resolve, 100));

      // Получаем размеры элемента
      const elementWidth = contentWrapperRef.current.offsetWidth;
      const elementHeight = contentWrapperRef.current.offsetHeight;
      
      // Размеры финального canvas
      const canvasWidth = isMobile ? 350 : elementWidth;
      const canvasHeight = isMobile ? 350 : elementHeight;
      const scale = 3; // Увеличиваем качество изображения
      
      // Конвертируем contentWrapper в canvas
      const sourceCanvas = await html2canvas(contentWrapperRef.current, {
        backgroundColor: null,
        scale: scale,
        useCORS: true,
        logging: false,
        width: elementWidth,
        height: elementHeight,
      });

      // Создаем новый canvas с нужными размерами
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth * scale;
      canvas.height = canvasHeight * scale;
      const ctx = canvas.getContext('2d');

      // Вычисляем смещение для центрирования
      const sourceWidth = sourceCanvas.width;
      const sourceHeight = sourceCanvas.height;
      const x = (canvas.width - sourceWidth) / 2;
      const y = (canvas.height - sourceHeight) / 2;

      // Рисуем исходный canvas по центру нового canvas
      ctx.drawImage(sourceCanvas, x, y);

      // Восстанавливаем отображение кнопок
      if (modalButtonsRef.current) {
        modalButtonsRef.current.style.display = originalButtonsDisplay || '';
      }
      if (closeButtonRef.current) {
        closeButtonRef.current.style.display = originalCloseDisplay || '';
      }

      // Конвертируем canvas в blob
      canvas.toBlob((blob) => {
        if (!blob) return;

        // Создаем ссылку для скачивания
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `wish-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Освобождаем память
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error('Ошибка при создании изображения:', error);
      alert('Не удалось скачать изображение. Попробуйте еще раз.');
    }
  };

  return (
    <div ref={overlayRef} className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        {/* Коробка */}
        <div ref={boxRef} className={styles.boxContainer}>
          {showBox && (
            <Image
              src="/images/box.webp"
              alt="Box"
              width={300}
              height={300}
            />
          )}
          {showOpenBox && (
            <Image
              src="/images/open-box.webp"
              alt="Open Box"
              width={300}
              height={300}
            />
          )}
        </div>

        {/* Модалка с пожеланием */}
        {showModal && (
          <div className={styles.modalWrapper}>
            <button ref={closeButtonRef} className={styles.closeButton} onClick={onClose}>
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_247_1011)">
                    <path
                      d="M44.5324 5.46878C46.3089 7.24541 46.3089 10.1252 44.5324 11.9018L31.2044 25.2298L44.3018 38.3272C46.0782 40.1038 46.0776 42.9842 44.3011 44.7609C42.5245 46.5375 39.6441 46.538 37.8674 44.7615L24.7701 31.6642L11.9033 44.5309C10.1267 46.3075 7.24632 46.3081 5.46963 44.5316C3.69295 42.7549 3.69295 39.8739 5.46963 38.0972L18.3363 25.2305L5.2383 12.1324C3.46162 10.3558 3.46162 7.47472 5.2383 5.69804C7.01499 3.92147 9.89605 3.9214 11.6727 5.69804L24.7707 18.7961L38.0987 5.46809C39.8754 3.69161 42.7558 3.69217 44.5324 5.46878Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_247_1011">
                      <rect width="50" height="50" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            <div ref={modalRef} className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div ref={contentWrapperRef} className={styles.contentWrapper}>
                <div className={styles.decorativeSvg}>
                  <svg width="393" height="393" viewBox="0 0 393 393" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M400.289 479.888L417.465 462.712L441.757 462.712C453.64 462.712 463.359 452.993 463.359 441.11L463.359 416.818L480.535 399.642C488.936 391.241 488.936 377.493 480.535 369.092L463.359 351.916L463.359 327.624C463.359 315.741 453.64 306.022 441.757 306.022L417.465 306.022L400.289 288.846C391.888 280.445 378.14 280.445 369.739 288.846L352.563 306.022L328.271 306.022C316.388 306.022 306.669 315.741 306.669 327.624L306.669 351.916L289.493 369.092C281.092 377.493 281.092 391.241 289.493 399.642L306.669 416.818L306.669 441.11C306.669 452.993 316.388 462.712 328.271 462.712L352.563 462.712L369.739 479.888C378.14 488.289 391.888 488.289 400.289 479.888Z" stroke="#6F00FD" strokeWidth="2" strokeMiterlimit="10"/>
                    <path d="M188.75 457.721L250.381 396.091C256.862 389.609 256.863 379.1 250.381 372.618L188.751 310.988C182.269 304.506 171.759 304.506 165.277 310.988L103.647 372.618C97.1654 379.1 97.1654 389.609 103.647 396.091L165.277 457.721C171.759 464.203 182.269 464.203 188.75 457.721Z" stroke="#6F00FD" strokeWidth="2" strokeMiterlimit="10"/>
                    <path d="M167.126 457.796L228.756 396.166C235.238 389.684 235.238 379.175 228.756 372.693L167.126 311.063C160.644 304.581 150.134 304.581 143.652 311.063L82.0224 372.693C75.5405 379.175 75.5405 389.684 82.0224 396.166L143.653 457.796C150.134 464.278 160.644 464.278 167.126 457.796Z" stroke="#6F00FD" strokeWidth="2" strokeMiterlimit="10"/>
                    <path d="M311.665 188.108L373.295 249.738C379.777 256.22 390.286 256.22 396.768 249.738L458.398 188.108C464.88 181.626 464.88 171.117 458.398 164.635L396.768 103.005C390.286 96.5228 379.777 96.5228 373.295 103.005L311.665 164.635C305.183 171.117 305.183 181.626 311.665 188.108Z" stroke="#6F00FD" strokeWidth="2" strokeMiterlimit="10"/>
                    <path d="M311.571 166.486L373.201 228.116C379.683 234.598 390.192 234.598 396.674 228.116L458.304 166.486C464.786 160.004 464.786 149.495 458.304 143.013L396.674 81.3827C390.192 74.9008 379.683 74.9008 373.201 81.3827L311.571 143.013C305.089 149.495 305.089 160.004 311.571 166.486Z" stroke="#6F00FD" strokeWidth="2" strokeMiterlimit="10"/>
                    <path d="M194.361 297.463L281.519 297.463C290.686 297.463 298.117 290.032 298.117 280.865L298.117 193.707C298.117 184.54 290.686 177.109 281.519 177.109L194.361 177.109C185.194 177.109 177.763 184.54 177.763 193.707L177.763 280.865C177.763 290.032 185.194 297.463 194.361 297.463Z" stroke="#6F00FD" strokeWidth="2" strokeMiterlimit="10"/>
                    <path d="M179.017 282.234L266.175 282.234C275.342 282.234 282.773 274.803 282.773 265.636L282.773 178.478C282.773 169.312 275.342 161.88 266.175 161.88L179.017 161.88C169.85 161.88 162.419 169.312 162.419 178.478L162.419 265.636C162.419 274.803 169.85 282.234 179.017 282.234Z" stroke="#6F00FD" strokeWidth="2" strokeMiterlimit="10"/>
                    <path d="M88.336 183.172C58.4404 168.321 22.1585 180.526 7.31781 210.432C-7.52286 240.338 4.67107 276.61 34.5774 291.45C50.9611 299.583 69.2628 299.594 84.8964 293.025L123.161 277.274C128.475 274.284 131.422 268.348 130.597 262.305L120.01 222.251C119.989 222.187 119.978 222.122 119.957 222.058L119.925 221.94C115.639 205.664 104.613 191.241 88.3468 183.172L88.336 183.172Z" stroke="#6F00FD" strokeWidth="2" strokeMiterlimit="10"/>
                    <path d="M183.827 89.4024C168.976 59.5068 181.181 23.2249 211.087 8.38421C240.983 -6.46717 277.265 5.73754 292.105 35.6439C300.238 52.0276 300.249 70.3293 293.68 85.9629L277.929 124.227C274.939 129.542 269.003 132.489 262.96 131.664L222.906 121.077C222.842 121.055 222.777 121.045 222.713 121.023L222.595 120.991C206.319 116.705 191.896 105.679 183.827 89.4132L183.827 89.4024Z" stroke="#6F00FD" strokeWidth="2" strokeMiterlimit="10"/>
                    <path d="M42.8482 279.525C19.6925 268.006 10.2524 239.9 21.7713 216.744C33.2902 193.588 61.3964 184.148 84.5521 195.667C97.239 201.978 105.811 213.272 109.069 226.002L117.244 257.001C117.887 261.684 115.594 266.281 111.48 268.595L81.7876 280.789C81.7876 280.789 81.6912 280.832 81.6483 280.854L81.5519 280.886C69.4972 285.858 55.428 285.793 42.8375 279.525L42.8482 279.525Z" stroke="#6F00FD" strokeWidth="2" strokeMiterlimit="10"/>
                    <path d="M195.84 84.0011C184.343 60.8346 193.794 32.7284 216.96 21.2309C240.127 9.73344 268.233 19.1843 279.73 42.3508C286.031 55.0484 286.042 69.2247 280.952 81.333L268.747 110.982C266.433 115.097 261.836 117.379 257.153 116.736L226.122 108.528C226.122 108.528 226.025 108.507 225.972 108.486L225.875 108.464C213.263 105.142 202.098 96.6023 195.84 84.0011Z" stroke="#6F00FD" strokeWidth="2" strokeMiterlimit="10"/>
                  </svg>
                </div>
                <div className={styles.bellTopLeft}>
                  <Image
                    src="/images/bell.webp"
                    alt="Bell"
                    width={isMobile ? 80 : 180}
                    height={isMobile ? 100 : 210}
                    unoptimized
                    priority
                  />
                </div>
                <div className={styles.logoWrapper}>
                  <Logo />
                </div>
                <p className={styles.modalText}>
                  {wishText && wishText.split(/(2026)/i).map((part, partIndex) => 
                    part.toLowerCase() === '2026' ? (
                      <span key={partIndex} className={styles.year2026}>{part}</span>
                    ) : (
                      <React.Fragment key={partIndex}>{part}</React.Fragment>
                    )
                  )}
                </p>
                <div className={styles.gingerbreadBottomRight}>
                  <Image
                    src="/images/gingerbread.webp"
                    alt="Gingerbread"
                    width={isMobile ? 200 : 400}
                    height={isMobile ? 160 : 350}
                    unoptimized
                    priority
                  />
                </div>
              </div>
              <div ref={modalButtonsRef} className={styles.modalButtons}>
                <button className={styles.shareButton} onClick={handleShare}>
                  {!isMobile && shareButton}
                  <svg
                    width="18"
                    height="16"
                    viewBox="0 0 21 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.7914 10.0203C19.0355 9.81105 19.1575 9.70643 19.2023 9.58193C19.2415 9.47265 19.2415 9.35313 19.2023 9.24385C19.1575 9.11935 19.0355 9.01473 18.7914 8.80548L10.3206 1.54486C9.9004 1.18466 9.69029 1.00457 9.5124 1.00015C9.3578 0.996319 9.21012 1.06424 9.11242 1.18412C9 1.32205 9 1.59879 9 2.15226V6.44752C6.86532 6.82098 4.91159 7.90265 3.45971 9.52676C1.87682 11.2974 1.00123 13.5888 1 15.9639V16.5759C2.04934 15.3118 3.35951 14.2894 4.84076 13.5788C6.1467 12.9523 7.55842 12.5812 9 12.4834V16.6735C9 17.227 9 17.5037 9.11242 17.6417C9.21012 17.7615 9.3578 17.8295 9.5124 17.8256C9.69029 17.8212 9.9004 17.6411 10.3206 17.2809L18.7914 10.0203Z"
                      stroke="#6229F4"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  
                </button>
                <button className={styles.downloadButton} onClick={handleDownload}>
                  {!isMobile && downloadButton}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 13V14.2C19 15.8802 19 16.7202 18.673 17.362C18.3854 17.9265 17.9265 18.3854 17.362 18.673C16.7202 19 15.8802 19 14.2 19H5.8C4.11984 19 3.27976 19 2.63803 18.673C2.07354 18.3854 1.6146 17.9265 1.32698 17.362C1 16.7202 1 15.8802 1 14.2V13M15 8L10 13M10 13L5 8M10 13V1"
                      stroke="#6229F4"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

