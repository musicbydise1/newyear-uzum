import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Section5.module.scss";
import { useLanguage } from "../contexts/LanguageContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useIsMobile } from '../hooks/useIsMobile';
gsap.registerPlugin(ScrollTrigger);

export default function Section5({
  scrollTo,
  goToSectionRef,
  showArrow,
  headline,
}) {
  const sectionRef = useRef();
  const photo3Ref = useRef();
  const photo4Ref = useRef();
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  useEffect(() => {
    const sectionElement = sectionRef.current;
    const photo3Element = photo3Ref.current;
    const photo4Element = photo4Ref.current;

    // Анимация появления картинок со своих сторон при переходе с секции 4 на секцию 5
    if (photo3Element && photo4Element && sectionElement) {
      // Адаптивные значения для мобильных устройств
      const xOffset = isMobile ? -100 : -200;
      const rotationStart = isMobile ? -30 : -60;
      const startPoint = isMobile ? "top 90%" : "top 80%";
      const endPoint = isMobile ? "top 60%" : "top 50%";

      // Левая картинка появляется слева с вращением
      gsap.fromTo(
        photo3Element,
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
        photo4Element,
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

      // Анимация вращения картинок на месте при переходе с секции 5 на секцию 6
      // Левая картинка крутится по часовой стрелке
      gsap.fromTo(
        photo4Element,
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
        photo3Element,
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
  }, [isMobile]);

  return (
    <div className={styles.section} ref={sectionRef}>
      <div className={styles.imagesContainer}>
        <div ref={photo3Ref} className={styles.imageWrapper}>
          <Image 
            src="/images/photo3.webp" 
            alt="Photo 3" 
            width={600} 
            height={600}
            quality={80}
            loading="lazy"
          />
          <p className={styles.imageText}>{t("sections.section5Photo1")}</p>
        </div>
        <div ref={photo4Ref} className={styles.imageWrapper}>
          <Image 
            src="/images/photo4.webp" 
            alt="Photo 4" 
            width={600} 
            height={565}
            quality={80}
            loading="lazy"
          />
          <p className={styles.imageText}>{t("sections.section5Photo2")}</p>
        </div>
      </div>
    </div>
  );
}

