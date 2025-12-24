import React, { useEffect, useRef } from "react";
import styles from "./Section3.module.scss";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function Section3({
  scrollTo,
  goToSectionRef,
  showArrow,
  headline,
}) {
  const headlineRef = useRef();
  const sectionRef = useRef();

  useEffect(() => {
    const sectionElement = sectionRef.current;
    const headlineElement = headlineRef.current;

    // Анимация уменьшения текста при скролле к секции 4
    if (headlineElement && sectionElement) {
      gsap.to(headlineElement, {
        scale: 0.5,
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
  }, []);

  return (
    <div className={styles.section} ref={sectionRef}>
      <div className={styles.copy}>
        <h2 ref={headlineRef}>
          {(headline || "Section 3 - Discover").split(/<br\s*\/?>/i).map((line, index, array) => (
            <React.Fragment key={index}>
              {line}
              {index < array.length - 1 && <br />}
            </React.Fragment>
          ))}
        </h2>
      </div>
    </div>
  );
}

