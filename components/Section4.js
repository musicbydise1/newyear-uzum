import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Section4.module.scss";
import { useLanguage } from "../contexts/LanguageContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useIsMobile } from '../hooks/useIsMobile';
import { useIsHeightBelow950 } from '../hooks/useIsHeightBelow950';
gsap.registerPlugin(ScrollTrigger);

export default function Section4({
  scrollTo,
  goToSectionRef,
  showArrow,
  headline,
}) {
  const sectionRef = useRef();
  const photo1Ref = useRef();
  const photo2Ref = useRef();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const isHeightBelow950 = useIsHeightBelow950();

  useEffect(() => {
    const sectionElement = sectionRef.current;
    const photo1Element = photo1Ref.current;
    const photo2Element = photo2Ref.current;

    // Анимация появления картинок со своих сторон при переходе с секции 3 на секцию 4
    if (photo1Element && photo2Element && sectionElement) {
      // Адаптивные значения для мобильных устройств
      const xOffset = isMobile ? -100 : -200;
      const rotationStart = isMobile ? -30 : -60;
      const startPoint = isMobile ? "top 90%" : "top 80%";
      const endPoint = isMobile ? "top 60%" : "top 50%";

      // Левая картинка появляется слева с вращением
      gsap.fromTo(
        photo1Element,
        {
          x: xOffset,
          rotation: rotationStart,
          opacity: 0,
        },
        {
          x: 0,
          rotation: isMobile ? 0 : 15,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            scroller: ".container",
            trigger: sectionElement,
            start: startPoint,
            end: endPoint,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );

      // Правая картинка появляется справа с вращением
      gsap.fromTo(
        photo2Element,
        {
          x: -xOffset,
          rotation: -rotationStart,
          opacity: 0,
        },
        {
          x: 0,
          rotation: isMobile ? 0 : -15,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            scroller: ".container",
            trigger: sectionElement,
            start: startPoint,
            end: endPoint,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );

      // Анимация вращения картинок на месте при переходе с секции 4 на секцию 5
      // Левая картинка крутится по часовой стрелке
      gsap.fromTo(
        photo2Element,
        {
          rotation: isMobile ? 0 : -15,
        },
        {
          rotation: -90,
          ease: "none",
          scrollTrigger: {
            scroller: ".container",
            trigger: sectionElement,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      // Правая картинка крутится против часовой стрелки
      gsap.fromTo(
        photo1Element,
        {
          rotation: isMobile ? 0 : 15,
        },
        {
          rotation: 90,
          ease: "none",
          scrollTrigger: {
            scroller: ".container",
            trigger: sectionElement,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.trigger === sectionElement) {
          trigger.kill();
        }
      });
    };
  }, [isMobile, isHeightBelow950]);

  return (
    <div className={styles.section} ref={sectionRef}>
      <div className={styles.imagesContainer}>
        <div ref={photo1Ref} className={styles.imageWrapper}>
          <Image 
            src="/images/photo1.webp" 
            alt="Photo 1" 
            width={isMobile ? 600 : (isHeightBelow950 ? 400 : 600)} 
            height={isMobile ? 600 : (isHeightBelow950 ? 400 : 600)}
            quality={80}
            loading="lazy"
          />
          <p className={styles.imageText}>{t("sections.section4Photo1")}</p>
        </div>
        <div ref={photo2Ref} className={styles.imageWrapper}>
          <Image 
            src="/images/photo2.webp" 
            alt="Photo 2" 
            width={isMobile ? 600 : (isHeightBelow950 ? 400 : 600)} 
            height={isMobile ? 565 : (isHeightBelow950 ? 370 : 565)}
            quality={80}
            loading="lazy"
          />
          <p className={styles.imageText}>{t("sections.section4Photo2")}</p>
        </div>
      </div>
    </div>
  );
}

