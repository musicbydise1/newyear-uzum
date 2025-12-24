import React, { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Section1.module.scss";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useIsMobile } from '../hooks/useIsMobile';
gsap.registerPlugin(ScrollTrigger);

export default function Section1({
  scrollTo,
  goToSectionRef,
  showArrow,
  headline,
}) {
  const headlineRef = useRef();
  const sectionRef = useRef();
  const bellRef = useRef();
  const gingerbreadRef = useRef();
  const isMobile = useIsMobile();

  useEffect(() => {
    const sectionElement = sectionRef.current;
    const bellElement = bellRef.current;
    const gingerbreadElement = gingerbreadRef.current;
    const headlineElement = headlineRef.current;

    // Анимация изменения opacity текста при скролле
    if (headlineElement && sectionElement) {
      // Анимация исчезновения текста при уходе с секции
      gsap.fromTo(
        headlineElement,
        {
          opacity: 1,
        },
        {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            scroller: ".container",
            trigger: sectionElement,
            start: "top top",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );
    }

    // Анимация вращения картинок при уходе с секции
    if (bellElement && gingerbreadElement && sectionElement) {
      // Анимация для bell (вращение по часовой стрелке)
      gsap.to(bellElement, {
        rotation: 120,
        ease: "none",
        scrollTrigger: {
          scroller: ".container",
          trigger: sectionElement,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Анимация для gingerbread (вращение против часовой стрелки)
      gsap.to(gingerbreadElement, {
        rotation: -120,
        ease: "none",
        scrollTrigger: {
          scroller: ".container",
          trigger: sectionElement,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
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
      <div ref={bellRef} className={styles.bellImage}>
        <Image 
          src="/images/bell.webp" 
          alt="Bell" 
          width={isMobile ? 409 : 600} 
          height={isMobile ? 409 : 600} 
        />
      </div>
      <div className={styles.copy}>
        <h2 ref={headlineRef}>
          {headline && headline.split(/<br\s*\/?>/i).map((line, index, array) => (
            <React.Fragment key={index}>
              {line}
              {index < array.length - 1 && <br />}
            </React.Fragment>
          ))}
        </h2>
      </div>
      <div ref={gingerbreadRef} className={styles.gingerbreadImage}>
        <Image 
          src="/images/gingerbread.png" 
          alt="Gingerbread" 
          width={isMobile ? 447 : 730} 
          height={isMobile ? 447 : 730}
        />
      </div>
    </div>
  );
}

