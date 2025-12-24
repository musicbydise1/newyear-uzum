import { useEffect, useRef, forwardRef } from "react";
import styles from "./ScrollIndicator.module.scss";
import { gsap } from "gsap";

const ScrollIndicator = forwardRef(({ onClick }, ref) => {
  const containerRef = ref;
  const mouseRef = useRef();
  const arrowsRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    const mouse = mouseRef.current;
    const arrows = arrowsRef.current;

    if (!container || !mouse || !arrows) return;

    // Легкая анимация пульсации для мыши
    const mouseAnimation = gsap.to(mouse, {
      y: 5,
      duration: 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Легкая анимация для стрелок (движение вниз)
    const arrowsAnimation = gsap.to(arrows, {
      y: 5,
      duration: 1.8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      mouseAnimation.kill();
      arrowsAnimation.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.scrollIndicator} onClick={onClick}>
      <div className={styles.text}>SCROLL</div>
      <div ref={mouseRef} className={styles.mouse}>
        <svg
          width="24"
          height="40"
          viewBox="0 0 24 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="2"
            y="2"
            width="20"
            height="36"
            rx="10"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <line
            x1="12"
            y1="8"
            x2="12"
            y2="16"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div ref={arrowsRef} className={styles.arrows}>
        <svg
          width="16"
          height="20"
          viewBox="0 0 16 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 4L8 10L14 4"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L8 18L14 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
});

ScrollIndicator.displayName = 'ScrollIndicator';

export default ScrollIndicator;

