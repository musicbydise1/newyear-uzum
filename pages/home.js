import { useRef, useEffect, useCallback } from "react";
import Head from "next/head";
import Section1 from "../components/Section1";
import Section2 from "../components/Section2";
import Section3 from "../components/Section3";
import Section4 from "../components/Section4";
import Section5 from "../components/Section5";
import Section6 from "../components/Section6";
import GlowCircle from "../components/GlowCircle";
import ScrollIndicator from "../components/ScrollIndicator";
import styles from "../styles/Home.module.scss";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useLanguage } from "../contexts/LanguageContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { useIsShortScreen } from "../hooks/useIsShortScreen";
import { useIsHeightBelow950 } from "../hooks/useIsHeightBelow950";
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const isShortScreen = useIsShortScreen();
  const isHeightBelow950 = useIsHeightBelow950();
  const section1Ref = useRef();
  const section2Ref = useRef();
  const section3Ref = useRef();
  const section4Ref = useRef();
  const section5Ref = useRef();
  const section6Ref = useRef();
  const glowWrapperRef = useRef();
  const scrollIndicatorRef = useRef();
  const snowflakesContainerRef = useRef();
  const snowflakesRef = useRef([]);
  
  function scrollTo(section) {
    section.current.scrollIntoView({ behavior: "smooth" });
  }

  function scrollToNext() {
    // Определяем текущую секцию и скроллим к следующей
    const sections = [section1Ref, section2Ref, section3Ref, section4Ref, section5Ref, section6Ref];
    const container = document.querySelector('.container');
    if (!container) return;
    
    const scrollTop = container.scrollTop;
    const viewportHeight = window.innerHeight;
    let currentIndex = Math.round(scrollTop / viewportHeight);
    
    // Ограничиваем индекс
    currentIndex = Math.max(0, Math.min(currentIndex, sections.length - 1));
    
    // Скроллим к следующей секции, кроме секции 6
    if (currentIndex < sections.length - 2) {
      scrollTo(sections[currentIndex + 1]);
    } else if (currentIndex === sections.length - 2) {
      // Если на секции 5, скроллим к секции 1 (циклично)
      scrollTo(sections[0]);
    }
  }

  // Функция для создания и анимации снежинок
  const createSnowflakes = useCallback(() => {
    if (!snowflakesContainerRef.current) return;
    
    const container = snowflakesContainerRef.current;
    const snowflakeCount = isMobile ? 30 : 50;
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    // Очищаем предыдущие снежинки
    snowflakesRef.current.forEach(snowflake => {
      if (snowflake.element) {
        snowflake.animation?.kill();
        if (snowflake.element.parentNode) {
          snowflake.element.parentNode.removeChild(snowflake.element);
        }
      }
    });
    snowflakesRef.current = [];
    
    // Создаем новые снежинки
    for (let i = 0; i < snowflakeCount; i++) {
      const snowflake = document.createElement('div');
      snowflake.className = styles.snowflake;
      
      // Случайные параметры
      const size = Math.random() * 8 + 6; // 6-14px (было 2-6px)
      const startX = Math.random() * containerWidth;
      const startY = -20 - Math.random() * 100; // Начинаем выше экрана
      const duration = Math.random() * 3 + 4; // 4-7 секунд
      const rotation = Math.random() * 360;
      const opacity = Math.random() * 0.3 + 0.7; // 0.7-1 (было 0.5-1)
      
      snowflake.style.width = `${size}px`;
      snowflake.style.height = `${size}px`;
      snowflake.style.left = `${startX}px`;
      snowflake.style.top = `${startY}px`;
      snowflake.style.opacity = opacity;
      
      // SVG снежинка с более толстыми линиями
      const strokeWidth = size > 10 ? 2.5 : 2; // Более толстые линии для больших снежинок
      snowflake.innerHTML = `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2V4M12 20V22M4 12H2M22 12H20M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93M16.24 7.76L18.36 5.64M5.64 18.36L7.76 16.24M18.36 18.36L16.24 16.24M7.76 7.76L5.64 5.64" stroke="white" stroke-width="${strokeWidth}" stroke-linecap="round"/>
        </svg>
      `;
      
      container.appendChild(snowflake);
      
      // Анимация падения
      const animation = gsap.to(snowflake, {
        y: containerHeight + 100,
        x: startX + (Math.random() - 0.5) * 100, // Небольшое горизонтальное смещение
        rotation: rotation + 360 * (Math.random() > 0.5 ? 1 : -1),
        duration: duration,
        ease: "none",
        repeat: -1,
        delay: Math.random() * 2, // Разная задержка для каждой снежинки
      });
      
      snowflakesRef.current.push({ element: snowflake, animation });
    }
  }, [isMobile]);

  useEffect(() => {
    const glowElement = glowWrapperRef.current;
    if (!glowElement) return;
    
    // Анимация появления GlowCircle сверху к своей позиции, затем изменение opacity
    gsap.timeline()
      .fromTo(
        glowElement,
        {
          y: "-100vh",
          opacity: 0,
        },
        {
          y: 0,
          opacity: 0.65,
          duration: 1.2,
          ease: "power2.out",
        }
      )
      .to(
        glowElement,
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        "+=0.1" // Задержка 1 секунда после предыдущей анимации
      );

    // Анимация изменения позиции при переходе от секции 1 к секции 2
    gsap.timeline({
      scrollTrigger: {
        scroller: ".container",
        trigger: section1Ref.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    }).to(glowElement, {
      y: isMobile && isShortScreen ? "60vh" : isMobile ? "55vh" : isHeightBelow950 ? "100vh" : "80vh",
      ease: "none",
    });

    // Анимация изменения позиции при переходе от секции 2 к секции 3
    gsap.timeline({
      scrollTrigger: {
        scroller: ".container",
        trigger: section2Ref.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    }).to(glowElement, {
      y: isMobile && isShortScreen ? "120vh" : isMobile ? "115vh" : isHeightBelow950 ? "210vh" : "160vh",
      ease: "none",
    });

    // Анимация изменения позиции при переходе от секции 3 к секции 4 (движение вверх)
    gsap.timeline({
      scrollTrigger: {
        scroller: ".container",
        trigger: section3Ref.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    }).to(glowElement, {
      y: isMobile && isShortScreen ? "60vh" : isMobile ? "55vh" : isHeightBelow950 ? "100vh" : "80vh",
      ease: "none",
    });
    gsap.timeline({
      scrollTrigger: {
        scroller: ".container",
        trigger: section5Ref.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    }).to(glowElement, {
      y: isMobile && isShortScreen ? "120vh" : isMobile ? "115vh" : isHeightBelow950 ? "210vh" : "160vh",
      ease: "none",
    });

    // Скрытие ScrollIndicator на секции 6
    const scrollIndicator = scrollIndicatorRef.current;
    if (scrollIndicator) {
      // Плавное скрытие при входе в секцию 6
      gsap.to(scrollIndicator, {
        opacity: 0,
        pointerEvents: 'none',
        scrollTrigger: {
          scroller: ".container",
          trigger: section6Ref.current,
          start: "top bottom",
          end: "top top",
          scrub: true,
          toggleActions: "play none none reverse",
        },
      });

      // Плавное появление при выходе из секции 6
      gsap.to(scrollIndicator, {
        opacity: 1,
        pointerEvents: 'auto',
        scrollTrigger: {
          scroller: ".container",
          trigger: section6Ref.current,
          start: "bottom bottom",
          end: "bottom top",
          scrub: true,
          toggleActions: "play none none reverse",
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMobile, isShortScreen, isHeightBelow950]);

  // Эффект для создания снежинок
  useEffect(() => {
    createSnowflakes();

    // Обработчик изменения размера окна
    const handleResize = () => {
      createSnowflakes();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // Очищаем снежинки при размонтировании
      snowflakesRef.current.forEach(snowflake => {
        snowflake.animation?.kill();
        if (snowflake.element && snowflake.element.parentNode) {
          snowflake.element.parentNode.removeChild(snowflake.element);
        }
      });
      snowflakesRef.current = [];
    };
  }, [createSnowflakes]);
  
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Контейнер для снежинок */}
      <div ref={snowflakesContainerRef} className={styles.snowflakesContainer}></div>
      <div className={`container ${styles.container}`}>
        <div ref={glowWrapperRef} className={styles.glowWrapper}>
          <GlowCircle />
        </div>
        <div ref={section1Ref}>
          <Section1
            goToSectionRef={section2Ref}
            scrollTo={scrollTo}
            showArrow={true}
            headline={t("sections.section1")}
          />
        </div>
        <div ref={section2Ref}>
          <Section2
            goToSectionRef={section3Ref}
            scrollTo={scrollTo}
            showArrow={true}
            headline={t("sections.section2")}
          />
        </div>
        <div ref={section3Ref}>
          <Section3
            goToSectionRef={section4Ref}
            scrollTo={scrollTo}
            showArrow={true}
            headline={t("sections.section3")}
          />
        </div>
        <div ref={section4Ref}>
          <Section4
            goToSectionRef={section5Ref}
            scrollTo={scrollTo}
            showArrow={true}
            headline={t("sections.section4")}
          />
        </div>
        <div ref={section5Ref}>
          <Section5
            goToSectionRef={section6Ref}
            scrollTo={scrollTo}
            showArrow={true}
            headline={t("sections.section5")}
          />
        </div>
        <div ref={section6Ref}>
          <Section6
            goToSectionRef={section1Ref}
            scrollTo={scrollTo}
            showArrow={false}
            headline={t("sections.section6")}
          />
        </div>
        <ScrollIndicator ref={scrollIndicatorRef} onClick={scrollToNext} />
      </div>
    </div>
  );
}
