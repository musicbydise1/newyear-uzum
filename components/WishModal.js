import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./WishModal.module.scss";
import { gsap } from "gsap";
import { getRandomWish } from "../constants/wishes";
import Logo from "./Logo";

export default function WishModal({ isOpen, onClose, locale, shareButton, downloadButton }) {
  const overlayRef = useRef();
  const boxRef = useRef();
  const modalRef = useRef();
  const [showBox, setShowBox] = useState(false);
  const [showOpenBox, setShowOpenBox] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [wishText, setWishText] = useState("");

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

  const handleDownload = () => {
    // Здесь можно добавить логику скачивания
    // Например, создание изображения или PDF
    alert("Функция скачивания будет реализована");
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
          <div ref={modalRef} className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={onClose}>
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
            <div className={styles.contentWrapper}>
              <div className={styles.bellTopLeft}>
                <Image
                  src="/images/bell.webp"
                  alt="Bell"
                  width={150}
                  height={150}
                />
              </div>
              <div className={styles.logoWrapper}>
                <Logo />
              </div>
              <p className={styles.modalText}>{wishText}</p>
              <div className={styles.gingerbreadBottomRight}>
                <Image
                  src="/images/gingerbread.webp"
                  alt="Gingerbread"
                  width={150}
                  height={150}
                />
              </div>
            </div>
            <div className={styles.modalButtons}>
              <button className={styles.shareButton} onClick={handleShare}>
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
                {shareButton}
              </button>
              <button className={styles.downloadButton} onClick={handleDownload}>
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
                {downloadButton}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

