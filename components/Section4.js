import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Section4.module.scss";
import { useLanguage } from "../contexts/LanguageContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
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

  useEffect(() => {
    const sectionElement = sectionRef.current;
    const photo1Element = photo1Ref.current;
    const photo2Element = photo2Ref.current;

    // Анимация появления картинок со своих сторон при переходе с секции 3 на секцию 4
    if (photo1Element && photo2Element && sectionElement) {
      // Левая картинка появляется слева с вращением
      gsap.fromTo(
        photo1Element,
        {
          x: -200,
          rotation: -60,
          opacity: 0,
        },
        {
          x: 0,
          rotation: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            scroller: ".container",
            trigger: sectionElement,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );

      // Правая картинка появляется справа с вращением
      gsap.fromTo(
        photo2Element,
        {
          x: 200,
          rotation: 60,
          opacity: 0,
        },
        {
          x: 0,
          rotation: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            scroller: ".container",
            trigger: sectionElement,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );

      // Анимация вращения картинок на месте при переходе с секции 4 на секцию 5
      // Левая картинка крутится по часовой стрелке
      gsap.fromTo(
        photo2Element,
        {
          rotation: 0,
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
          rotation: 0,
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
  }, []);

  return (
    <div className={styles.section} ref={sectionRef}>
      <div className={styles.imagesContainer}>
        <div ref={photo1Ref} className={styles.imageWrapper}>
          <Image 
            src="/images/photo1.png" 
            alt="Photo 1" 
            width={600} 
            height={600}
            priority
          />
          <p className={styles.imageText}>{t("sections.section4Photo1")}</p>
        </div>
        <div ref={photo2Ref} className={styles.imageWrapper}>
          <Image 
            src="/images/photo2.png" 
            alt="Photo 2" 
            width={600} 
            height={600}
            priority
          />
          <p className={styles.imageText}>{t("sections.section4Photo2")}</p>
        </div>
      </div>
    </div>
  );
}

