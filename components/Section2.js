import React, { useRef } from "react";
import styles from "./Section2.module.scss";

export default function Section2({
  scrollTo,
  goToSectionRef,
  showArrow,
  headline,
}) {
  const headlineRef = useRef();
  const sectionRef = useRef();
  return (
    <div className={styles.section} ref={sectionRef}>
      <div className={styles.copy}>
        <h2 ref={headlineRef}>
          {(headline || "Section 2 - Explore").split(/<br\s*\/?>/i).map((line, index, array) => (
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

