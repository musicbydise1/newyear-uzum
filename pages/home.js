import { useRef, useEffect } from "react";
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
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const isShortScreen = useIsShortScreen();
  const section1Ref = useRef();
  const section2Ref = useRef();
  const section3Ref = useRef();
  const section4Ref = useRef();
  const section5Ref = useRef();
  const section6Ref = useRef();
  const glowWrapperRef = useRef();
  const scrollIndicatorRef = useRef();
  
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

  useEffect(() => {
    const glowElement = glowWrapperRef.current;
    if (!glowElement) return;
    
    // Устанавливаем xPercent через GSAP для избежания конфликтов с CSS transform
    // Это гарантирует, что GSAP будет управлять всем transform, включая translateX
    gsap.set(glowElement, {
      xPercent: -50,
      force3D: true,
    });
    
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
          force3D: true,
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
      y: isMobile && isShortScreen ? "60vh" : isMobile ? "55vh" : "80vh",
      ease: "none",
      force3D: true,
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
      y: isMobile && isShortScreen ? "120vh" : isMobile ? "115vh" : "160vh",
      ease: "none",
      force3D: true,
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
      y: isMobile && isShortScreen ? "60vh" : isMobile ? "55vh" : "80vh",
      ease: "none",
      force3D: true,
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
      y: isMobile && isShortScreen ? "120vh" : isMobile ? "115vh" : "160vh",
      ease: "none",
      force3D: true,
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
  }, [isMobile, isShortScreen]);
  
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
