import React, { useRef, useState } from "react";
import Image from "next/image";
import styles from "./Section6.module.scss";
import { useLanguage } from "../contexts/LanguageContext";
import Logo from "./Logo";
import SegmentedControl from "./SegmentedControl";
import WishModal from "./WishModal";

export default function Section6({
  scrollTo,
  goToSectionRef,
  showArrow,
  headline,
}) {
  const headlineRef = useRef();
  const sectionRef = useRef();
  const { t, locale, changeLanguage } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const languageData = [
    { value: 'ru', label: 'RU' },
    { value: 'uz', label: 'UZ' },
  ];

  return (
    <div className={styles.section} ref={sectionRef}>
      <div className={styles.logoWrapper}>
        <Logo />
      </div>
      <div className={styles.bellTopLeft}>
        <Image 
          src="/images/bell.png" 
          alt="Bell" 
          width={200} 
          height={200}
          priority
        />
      </div>
      <div className={styles.topRightContainer}>
        <div className={styles.segmentedControlWrapper}>
          <SegmentedControl
            data={languageData}
            value={locale}
            onChange={changeLanguage}
          />
        </div>
        <div className={styles.bellTopRight}>
          <Image 
            src="/images/bell.png" 
            alt="Bell" 
            width={250} 
            height={250}
            priority
          />
        </div>
      </div>
      <div className={styles.copy}>
        <h2 ref={headlineRef}>
          {headline && headline.split(/<br\s*\/?>/i).map((line, index, array) => (
            <React.Fragment key={index}>
              {line.split(/(2026)/i).map((part, partIndex) => 
                part.toLowerCase() === '2026' ? (
                  <span key={partIndex} className={styles.year2026}>{part}</span>
                ) : (
                  <React.Fragment key={partIndex}>{part}</React.Fragment>
                )
              )}
              {index < array.length - 1 && <br />}
            </React.Fragment>
          ))}
        </h2>
      </div>
      <button 
        className={styles.actionButton}
        onClick={() => setIsModalOpen(true)}
      >
        {t("sections.section6Button")}
      </button>
      <WishModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        locale={locale}
        shareButton={t("sections.shareButton")}
        downloadButton={t("sections.downloadButton")}
      />
      <div className={styles.gingerbreadBottomLeft}>
        <Image 
          src="/images/gingerbread.png" 
          alt="Gingerbread" 
          width={250} 
          height={250}
          priority
        />
      </div>
      <div className={styles.treeBottomRight}>
        <Image 
          src="/images/tree.png" 
          alt="Tree" 
          width={250} 
          height={250}
          priority
        />
      </div>
    </div>
  );
}

