import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Section5.module.scss";
import { useLanguage } from "../contexts/LanguageContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function Section5({
  scrollTo,
  goToSectionRef,
  showArrow,
  headline,
  previousSectionRef,
}) {
  const sectionRef = useRef();
  const photo3Ref = useRef();
  const photo4Ref = useRef();
  const { t } = useLanguage();

  useEffect(() => {
    const sectionElement = sectionRef.current;
    const previousSectionElement = previousSectionRef?.current;
    const photo3Element = photo3Ref.current;
    const photo4Element = photo4Ref.current;

    // Анимация вращения картинок на месте при переходе с секции 4 на секцию 5
    if (photo3Element && photo4Element && previousSectionElement && sectionElement) {
      // Левая картинка крутится по часовой стрелке
      gsap.fromTo(
        photo3Element,
        {
          rotation: 0,
        },
        {
          rotation: 90,
          ease: "none",
          scrollTrigger: {
            scroller: ".container",
            trigger: previousSectionElement,
            start: "bottom top",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      // Правая картинка крутится против часовой стрелки
      gsap.fromTo(
        photo4Element,
        {
          rotation: 0,
        },
        {
          rotation: -90,
          ease: "none",
          scrollTrigger: {
            scroller: ".container",
            trigger: previousSectionElement,
            start: "bottom top",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.trigger === previousSectionElement) {
          trigger.kill();
        }
      });
    };
  }, [previousSectionRef]);

  return (
    <div className={styles.section} ref={sectionRef}>
      <div className={styles.imagesContainer}>
        <div ref={photo3Ref} className={styles.imageWrapper}>
          <Image 
            src="/images/photo3.png" 
            alt="Photo 3" 
            width={600} 
            height={600}
            priority
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
          <p className={styles.imageText}>{t("sections.section5Photo1")}</p>
        </div>
        <div ref={photo4Ref} className={styles.imageWrapper}>
          <Image 
            src="/images/photo4.png" 
            alt="Photo 4" 
            width={600} 
            height={600}
            priority
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
          <p className={styles.imageText}>{t("sections.section5Photo2")}</p>
        </div>
      </div>
    </div>
  );
}

